'use client';

import { useAppointments } from '@/hooks/useAppointments';
import AppointmentsTable from '@/components/tables/AppointmentsTable';

export default function Appointments() {
  const { appointments, loading, error } = useAppointments();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Schedule Appointment
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Error loading appointments: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <AppointmentsTable appointments={appointments} />
        </div>
      )}
    </div>
  );
}
