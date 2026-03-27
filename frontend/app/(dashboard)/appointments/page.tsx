'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAppointments } from '@/hooks/useAppointments';
import AppointmentsTable from '@/components/tables/AppointmentsTable';
import GlobalSearch from '@/components/ui/GlobalSearch';

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const query = useMemo(
    () => ({
      q: searchQuery || undefined,
    }),
    [searchQuery]
  );

  const { appointments, loading, error } = useAppointments(query);
  const safeAppointments = appointments ?? [];

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <Link
            href="/appointments/book"
            className="px-4 py-2 bg-blue-600 text-white text-base rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Appointment
          </Link>
        </div>

        <div className="max-w-md">
          <GlobalSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search UHID, name, or mobile"
          />
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm mb-4">
          Error loading appointments: {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <AppointmentsTable appointments={safeAppointments} />
        </div>
      )}
    </>
  );
}
