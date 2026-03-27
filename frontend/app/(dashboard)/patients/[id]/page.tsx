'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import patientService, { PatientResponse } from '@/services/patientService';

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params?.id);
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await patientService.getPatientById(patientId);
        setPatient(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load patient details';
        toast.error(message);
        router.push('/patients');
      } finally {
        setLoading(false);
      }
    };

    if (!Number.isFinite(patientId) || patientId <= 0) {
      toast.error('Invalid patient id');
      router.push('/patients');
      return;
    }

    load();
  }, [patientId, router]);

  const details = useMemo(() => {
    if (!patient) return [];
    return [
      { label: 'UHID', value: patient.uhid },
      { label: 'Name', value: patient.patientName },
      { label: 'Mobile', value: patient.mobile },
      { label: 'DOB', value: new Date(patient.dob).toLocaleDateString('en-IN') },
      { label: 'Gender', value: patient.gender },
      { label: 'Status', value: patient.status },
      { label: 'Email', value: patient.email || '-' },
      { label: 'Address', value: patient.address || '-' },
    ];
  }, [patient]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading patient details...
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
          <p className="mt-1 text-sm text-gray-500">View patient profile and basic contact information.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/appointments/book?patientId=${patient.id}`}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            Book Appointment
          </Link>
          <Link
            href={`/patients/${patient.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Edit Patient
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
