'use client';

import React, { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import patientService, { PatientSummary } from '@/services/patientService';

interface AppointmentDetailsSectionProps {
  formData: {
    patient_name: string;
    patient_id: string;
    department: string;
    doctor_id: string;
    appointment_date: string;
    visit_type: string;
    notes: string;
    priority: string;
    status: string;
    token_number: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPatientSelect: (patient: PatientSummary) => void;
}

const departmentOptions = [
  { value: '', label: 'Select Department' },
  { value: 'general_medicine', label: 'General Medicine' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'gynecology', label: 'Gynecology & Obstetrics' },
  { value: 'ent', label: 'ENT' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'radiology', label: 'Radiology' },
];

const doctorOptions = [
  { value: '', label: 'Select Doctor' },
  { value: 'dr_001', label: 'Dr. Rajesh Kumar — General Medicine' },
  { value: 'dr_002', label: 'Dr. Priya Singh — Cardiology' },
  { value: 'dr_003', label: 'Dr. Amit Patel — Orthopedics' },
  { value: 'dr_004', label: 'Dr. Sarah Ahmed — Pediatrics' },
  { value: 'dr_005', label: 'Dr. Vikram Nair — Neurology' },
  { value: 'dr_006', label: 'Dr. Meena Sharma — Dermatology' },
];

const priorityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'low', label: 'Low' },
];

const priorityColors: Record<string, string> = {
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
  low: 'bg-gray-100 text-gray-600',
};

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

const visitTypeOptions = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'check_up', label: 'Check-up / Routine' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'emergency', label: 'Emergency' },
];

const AppointmentDetailsSection = memo(({
  formData,
  errors,
  onInputChange,
  onPatientSelect,
}: AppointmentDetailsSectionProps) => {
  const [query, setQuery] = useState(formData.patient_name);
  const [results, setResults] = useState<PatientSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync query if patient_name is cleared externally
  useEffect(() => {
    if (!formData.patient_name) setQuery('');
  }, [formData.patient_name]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await patientService.searchPatients(val.trim(), 10);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  }, []);

  const handleSelect = useCallback((patient: PatientSummary) => {
    setQuery(patient.patientName);
    setResults([]);
    setShowDropdown(false);
    onPatientSelect(patient);
  }, [onPatientSelect]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    onPatientSelect({ id: 0, uhid: '', patientName: '', dob: '', age: 0, gender: '', bloodGroup: '', mobile: '' });
  }, [onPatientSelect]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Appointment Details
      </h2>

      <div className="grid grid-cols-12 gap-x-6 gap-y-5">

        {/* Patient Search */}
        <div className="col-span-12 sm:col-span-6" ref={wrapperRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment For (Patient) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="relative">
              {/* Search icon */}
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
                placeholder="Search by name, UHID or mobile…"
                autoComplete="off"
                className={`w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.patient_name ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && (query.trim().length >= 2) && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {isSearching ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                    <svg className="w-4 h-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Searching…
                  </div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">No patients found for &quot;{query}&quot;</div>
                ) : (
                  <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {results.map(p => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(p)}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{p.patientName}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {p.uhid} · {p.mobile}
                                {p.gender ? ` · ${p.gender}` : ''}
                                {p.age ? ` · ${p.age} yrs` : ''}
                              </p>
                            </div>
                            {p.bloodGroup && (
                              <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100">
                                {p.bloodGroup}
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {errors.patient_name && (
            <p className="mt-1 text-xs text-red-500">{errors.patient_name}</p>
          )}
        </div>

        {/* Patient UHID — auto-filled on select */}
        <div className="col-span-12 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID (UHID)
          </label>
          <input
            type="text"
            name="patient_id"
            value={formData.patient_id}
            readOnly
            placeholder="Auto-filled on selection"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Visit Type */}
        <div className="col-span-12 sm:col-span-3">
          <Select
            label="Visit Type"
            name="visit_type"
            value={formData.visit_type}
            onChange={onInputChange}
            options={visitTypeOptions}
          />
        </div>

        {/* Department */}
        <div className="col-span-12 sm:col-span-6">
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={onInputChange}
            options={departmentOptions}
            required
            error={errors.department}
          />
        </div>

        {/* Doctor */}
        <div className="col-span-12 sm:col-span-6">
          <Select
            label="Doctor"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={onInputChange}
            options={doctorOptions}
            required
            error={errors.doctor_id}
          />
        </div>

        {/* Appointment Date */}
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Appointment Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={onInputChange}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.appointment_date ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.appointment_date && (
            <p className="mt-1 text-xs text-red-500">{errors.appointment_date}</p>
          )}
        </div>

        {/* Divider */}
        <div className="col-span-12">
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-5">Status &amp; Priority</p>
          </div>
        </div>

        {/* Priority */}
        <div className="col-span-12 sm:col-span-7">
          <label className="block text-sm font-medium text-gray-700 mb-3">Priority</label>
          <div className="flex flex-wrap gap-3">
            {priorityOptions.map(option => (
              <label
                key={option.value}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                  formData.priority === option.value
                    ? `${priorityColors[option.value]} border-transparent ring-2 ring-offset-1 ring-current`
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="priority"
                  value={option.value}
                  checked={formData.priority === option.value}
                  onChange={onInputChange}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-12 sm:col-span-3">
          <Select
            label="Appointment Status"
            name="status"
            value={formData.status}
            onChange={onInputChange}
            options={statusOptions}
          />
        </div>

        {/* Token Number */}
        <div className="col-span-12 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token
            <span className="ml-1 text-xs text-gray-400 font-normal">(Auto)</span>
          </label>
          <input
            type="text"
            name="token_number"
            value={formData.token_number}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Notes */}
        <div className="col-span-12">
          <Textarea
            label="Notes / Special Instructions"
            name="notes"
            value={formData.notes}
            onChange={onInputChange}
            placeholder="Enter any special notes, requirements, or instructions…"
            rows={4}
          />
        </div>

      </div>
    </div>
  );
});

AppointmentDetailsSection.displayName = 'AppointmentDetailsSection';
export default AppointmentDetailsSection;
