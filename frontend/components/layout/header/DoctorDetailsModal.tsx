'use client';

import React from 'react';
import { X, Stethoscope, Phone, Mail, Calendar } from 'lucide-react';

export interface DoctorForModal {
  id: string;
  name: string;
  specialization: string;
  mobile: string;
  email?: string;
  departmentId: string;
}

interface DoctorDetailsModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  doctor: DoctorForModal | null;
  onClose: () => void;
}

const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({
  isOpen,
  isLoading = false,
  doctor,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Doctor Details</h2>
            <p className="text-sm text-gray-500 mt-1">Doctor ID: {doctor?.id}</p>
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
        ) : doctor ? (
          <div className="p-6 space-y-6">
            {/* Doctor Information */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Stethoscope size={32} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {doctor.specialization}
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
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{doctor.mobile || 'N/A'}</p>
                  </div>
                </div>

                {doctor.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={18} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium mt-1 break-all">{doctor.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Department Information */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Department</h3>
              <p className="text-gray-900 font-medium">Department ID: {doctor.departmentId}</p>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex gap-3">
              <a
                href={`/dashboard/schedules?doctorId=${doctor.id}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Calendar size={16} />
                View Schedule
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
            <p className="text-gray-500">No doctor data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetailsModal;
