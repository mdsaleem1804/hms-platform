'use client';

import Link from 'next/link';
import { CalendarPlus, Eye, Pencil } from 'lucide-react';
import { PatientResponse } from '@/services/patientService';

interface PatientsTableProps {
  patients: PatientResponse[];
}

export default function PatientsTable({ patients = [] }: PatientsTableProps) {
  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-14 text-gray-500">
        <p className="text-base font-medium">No patients found.</p>
        <p className="mt-1 text-sm">
          Try changing filters or{' '}
          <Link href="/patients/register" className="text-blue-600 hover:underline">add a new patient</Link>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="max-h-[68vh] overflow-auto">
        <table className="w-full min-w-[980px] border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              UHID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Mobile
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              DOB
            </th>
            <th className="w-24 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Gender
            </th>
            <th className="w-24 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => {
            return (
            <tr
              key={patient.id}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-blue-50 transition-colors`}
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-blue-700">
                <Link href={`/patients/${patient.id}`} className="hover:underline">
                  {patient.uhid}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                {patient.patientName}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {patient.mobile}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                {new Date(patient.dob).toLocaleDateString('en-IN')}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700">
                  {patient.gender}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  patient.status.toUpperCase() === 'ACTIVE'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {patient.status.toUpperCase() === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 transition hover:bg-gray-100"
                    title="View patient"
                    aria-label="View patient"
                  >
                    <Eye size={15} />
                  </Link>
                <Link
                  href={`/patients/${patient.id}/edit`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-blue-200 text-blue-700 transition hover:bg-blue-50"
                  title="Edit patient"
                  aria-label="Edit patient"
                >
                  <Pencil size={15} />
                </Link>
                <Link
                  href={`/appointments/book?patientId=${patient.id}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50"
                  title="Book appointment"
                  aria-label="Book appointment"
                >
                  <CalendarPlus size={15} />
                </Link>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
}
