'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import patientService, { PatientResponse } from '@/services/patientService';

interface PatientsTableProps {
  patients: PatientResponse[];
  onRefresh?: () => void;
}

export default function PatientsTable({ patients = [], onRefresh }: PatientsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setShowConfirm(id);
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      setDeletingId(id);
      await patientService.deletePatient(id);
      toast.success('Patient deleted successfully');
      setShowConfirm(null);
      onRefresh?.();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete patient';
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(null);
  };

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No patients found. <Link href="/patients/register" className="text-blue-600 hover:underline">Add one</Link>
      </div>
    );
  }

  return (
    <>
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {patients.map((patient) => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                {patient.uhid}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {patient.patientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {patient.mobile}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {new Date(patient.dob).toLocaleDateString('en-IN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 capitalize">
                  {patient.gender}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  patient.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2 flex">
                <Link
                  href={`/patients/${patient.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(patient.id)}
                  className="text-red-600 hover:text-red-800 hover:underline font-medium"
                  disabled={deletingId === patient.id}
                >
                  {deletingId === patient.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Patient?
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              This action cannot be undone. Are you sure you want to delete this patient?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete(showConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
