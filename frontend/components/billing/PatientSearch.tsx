'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import GlobalSearch from '@/components/ui/GlobalSearch';
import patientService, { PatientSummary } from '@/services/patientService';
import { BillingPatientSummary } from './types';

interface PatientSearchProps {
  value: BillingPatientSummary | null;
  onSelect: (patient: BillingPatientSummary | null) => void;
  disabled?: boolean;
}

const toBillingPatient = (patient: PatientSummary): BillingPatientSummary => ({
  id: patient.id,
  uhid: patient.uhid,
  patientName: patient.patientName,
  dob: patient.dob,
  age: patient.age,
  gender: patient.gender,
  mobile: patient.mobile,
});

export function PatientSearch({ value, onSelect, disabled = false }: PatientSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BillingPatientSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const runSearch = async () => {
      if (disabled) {
        setResults([]);
        setError('');
        return;
      }

      if (!query.trim()) {
        setResults([]);
        setError('');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const items = await patientService.searchPatients(query, 8);
        if (!active) return;
        setResults(items.map(toBillingPatient));
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to search patients');
      } finally {
        if (active) setLoading(false);
      }
    };

    runSearch();
    return () => {
      active = false;
    };
  }, [disabled, query]);

  const helperText = useMemo(() => {
    if (disabled) return 'Patient is prefilled from appointment and cannot be changed.';
    if (loading) return 'Searching patients...';
    if (error) return error;
    if (query.trim() && !results.length) return 'No patients found';
    return 'Search by UHID, name, or mobile';
  }, [disabled, loading, error, query, results.length]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Patient Selection</h2>
          <p className="text-xs text-gray-500">Lookup and select existing patient quickly.</p>
        </div>
        {!disabled && (
          <Link
            href="/patients/register"
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
          >
            New Patient
          </Link>
        )}
      </div>

      <GlobalSearch
        value={query}
        onChange={(value) => {
          if (!disabled) {
            setQuery(value);
          }
        }}
        placeholder="Search by UHID / Name / Mobile"
      />

      <p className={`mt-2 text-xs ${error ? 'text-red-600' : 'text-gray-500'}`}>{helperText}</p>

      {!!results.length && (
        <div className="mt-3 max-h-48 overflow-auto rounded-lg border border-gray-200">
          {results.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => {
                if (disabled) return;
                onSelect(patient);
                setQuery(patient.patientName);
                setResults([]);
              }}
              className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{patient.patientName}</p>
                <p className="text-xs text-gray-500">UHID: {patient.uhid}</p>
              </div>
              <p className="text-xs text-gray-500">{patient.mobile}</p>
            </button>
          ))}
        </div>
      )}

      {value && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-900">{value.patientName}</p>
              <p className="text-xs text-emerald-800">UHID: {value.uhid}</p>
              <p className="text-xs text-emerald-800">
                {value.age} years / {value.gender}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (disabled) return;
                onSelect(null);
                setQuery('');
              }}
              disabled={disabled}
              className="rounded border border-emerald-300 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
