'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppointments } from '@/hooks/useAppointments';
import AppointmentsTable from '@/components/tables/AppointmentsTable';
import GlobalSearch from '@/components/ui/GlobalSearch';
import doctorService, { DoctorSummary } from '@/services/doctorService';

export default function Appointments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);

  useEffect(() => {
    let active = true;

    const loadFilters = async () => {
      try {
        const allDoctors = await doctorService.getAll();

        if (!active) return;
        setDoctors(allDoctors);
      } catch {
        if (!active) return;
        setDoctors([]);
      }
    };

    loadFilters();

    return () => {
      active = false;
    };
  }, []);

  const query = useMemo(
    () => ({
      q: searchQuery || undefined,
      status: status || undefined,
      doctorId: doctorId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [searchQuery, status, doctorId, fromDate, toDate]
  );

  const { appointments, loading, error } = useAppointments(query);
  const safeAppointments = appointments ?? [];

  const hasFilters = Boolean(searchQuery || status || doctorId || fromDate || toDate);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatus('');
    setDoctorId('');
    setFromDate('');
    setToDate('');
  };

  const handleExportExcel = () => {
    if (!safeAppointments.length) {
      toast.error('No appointment records available to export');
      return;
    }

    const headers = [
      'Appointment #',
      'Date',
      'Patient Name',
      'UHID',
      'Department',
      'Doctor',
      'Status',
      'Priority',
      'Visit Type',
    ];

    const rows = safeAppointments.map((appointment) => [
      appointment.appointmentNo,
      new Date(appointment.appointmentDate).toLocaleDateString('en-IN'),
      appointment.patientName,
      appointment.patientUhid,
      appointment.departmentName,
      appointment.doctorName,
      appointment.status,
      appointment.priority,
      appointment.visitType,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Excel export generated successfully');
  };

  const handlePrint = () => {
    if (!safeAppointments.length) {
      toast.error('No appointment records available to print');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1280,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print.');
      return;
    }

    const rows = safeAppointments
      .map(
        (appointment) => `
          <tr>
            <td>${appointment.appointmentNo}</td>
            <td>${new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}</td>
            <td>${appointment.patientName}</td>
            <td>${appointment.patientUhid}</td>
            <td>${appointment.departmentName}</td>
            <td>${appointment.doctorName}</td>
            <td>${appointment.status}</td>
            <td>${appointment.priority}</td>
            <td>${appointment.visitType}</td>
          </tr>`
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Appointments Report</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
            h1 { margin: 0 0 6px; font-size: 22px; }
            p { margin: 0 0 18px; color: #4b5563; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; font-weight: 600; }
            tr:nth-child(even) td { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>Appointments Report</h1>
          <p>Generated on ${new Date().toLocaleString('en-IN')} | Rows ${safeAppointments.length}</p>
          <table>
            <thead>
              <tr>
                <th>Appointment #</th>
                <th>Date</th>
                <th>Patient Name</th>
                <th>UHID</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Visit Type</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={!hasFilters}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Filters
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportOpen((prev) => !prev)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Export
              </button>
              {exportOpen && (
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      handleExportExcel();
                      setExportOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Export Excel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handlePrint();
                      setExportOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Print
                  </button>
                </div>
              )}
            </div>
            <Link
              href="/appointments/book"
              className="px-4 py-2 bg-blue-600 text-white text-base rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Search
              </label>
              <GlobalSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Appointment no, UHID, patient"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasFilters && (
            <p className="mt-3 text-xs text-gray-500">Filters are active. Results are fetched server-side.</p>
          )}
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
