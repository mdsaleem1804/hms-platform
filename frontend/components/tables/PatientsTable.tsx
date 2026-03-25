'use client';

interface Patient {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
}

interface PatientsTableProps {
  patients: Patient[];
}

export default function PatientsTable({ patients }: PatientsTableProps) {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            UHID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Mobile
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            DOB
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
            Gender
          </th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {patients.map((patient) => (
          <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
              {patient.uhid}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {patient.firstName} {patient.lastName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {patient.mobile}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {new Date(patient.dateOfBirth).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-800">
                {patient.gender}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
