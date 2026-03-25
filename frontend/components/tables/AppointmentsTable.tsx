'use client';

interface Appointment {
  id: string;
  appointmentNo: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
}

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

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Appointment #
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Time
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Doctor ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {appointments.map((appointment) => (
          <tr key={appointment.id} className="hover:bg-gray-50 cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
              {appointment.appointmentNo}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {new Date(appointment.appointmentDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {appointment.startTime} - {appointment.endTime}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {appointment.doctorId}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
