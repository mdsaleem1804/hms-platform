'use client';

import Link from 'next/link';
import { Appointment } from '@/services/appointmentService';

interface AppointmentsTableProps {
  appointments: Appointment[];
}

export default function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'low':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Appointment #
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Patient
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Department / Doctor
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {appointments.map((appointment) => (
          <tr key={appointment.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
              {appointment.appointmentNo}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              <div className="font-medium text-gray-900">{appointment.patientName}</div>
              <div className="text-xs text-gray-500 mt-1">{appointment.patientUhid}</div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
              <div className="font-medium text-gray-900">{appointment.departmentName}</div>
              <div className="text-xs text-gray-500 mt-1">
                {appointment.doctorName}
                {appointment.doctorSpecialization ? ` · ${appointment.doctorSpecialization}` : ''}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {new Date(appointment.appointmentDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col gap-2 items-start">
                <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                <span className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                  {appointment.priority}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <Link
                href={`/appointments/${appointment.displayId}/edit`}
                className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
