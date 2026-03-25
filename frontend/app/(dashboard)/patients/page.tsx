'use client';

import { usePatients } from '@/hooks/usePatients';
import PatientsTable from '@/components/tables/PatientsTable';

export default function Patients() {
  const { patients, loading, error } = usePatients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Patient
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error loading patients: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <PatientsTable patients={patients} />
        </div>
      )}
    </div>
  );
}
