'use client';

import Link from 'next/link';
import { usePatients } from '@/hooks/usePatients';
import PatientsTable from '@/components/tables/PatientsTable';

export default function Patients() {
  const { patients, loading, error } = usePatients();

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Patients</h1>
        <Link 
          href="/patients/register"
          className="px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Patient
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          Error loading patients: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <PatientsTable patients={patients} />
        </div>
      )}
    </div>
  );
}
