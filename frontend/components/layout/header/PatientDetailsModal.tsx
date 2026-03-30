'use client';

import React from 'react';
import { X, FileText, Phone } from 'lucide-react';

export interface PatientForModal {
  id: number;
  uhid: string;
  patientName: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup: string;
  mobile: string;
}

interface PatientDetailsModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  patient: PatientForModal | null;
  onClose: () => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  isOpen,
  isLoading = false,
  patient,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
            <p className="text-sm text-gray-500 mt-1">UHID: {patient?.uhid}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animated-spinner">
              <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          </div>
        ) : patient ? (
          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient Name
                </label>
                <p className="text-gray-900 font-medium mt-1">{patient.patientName}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  UHID
                </label>
                <p className="text-gray-900 font-medium mt-1">{patient.uhid}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Age
                </label>
                <p className="text-gray-900 font-medium mt-1">{patient.age} years</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </label>
                <p className="text-gray-900 font-medium mt-1">
                  {patient.dob
                    ? new Date(patient.dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Gender
                </label>
                <p className="text-gray-900 font-medium mt-1">{patient.gender || 'N/A'}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Blood Group
                </label>
                <div className="mt-1">
                  <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {patient.bloodGroup || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                Contact Information
              </h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={16} className="text-gray-400" />
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{patient.mobile || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex gap-3">
              <a
                href={`/dashboard/patients/${patient.id}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                View Full Profile
              </a>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No patient data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsModal;
