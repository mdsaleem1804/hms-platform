'use client';

import React, { useState, useCallback } from 'react';
import AppointmentDetailsSection from './appointment-sections/AppointmentDetailsSection';
import { Reminder } from './appointment-sections/RemindersSection';
import { PatientSummary } from '@/services/patientService';

export interface AppointmentFormData {
  // Details
  patient_record_id: number;
  patient_name: string;
  patient_id: string;
  department: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  visit_type: string;
  // Status & Priority
  notes: string;
  priority: string;
  status: string;
  token_number: string;
  // Reminders
  reminders: Reminder[];
}

export interface AppointmentFormProps {
  initialData?: Partial<AppointmentFormData>;
  mode: 'create' | 'edit';
  onSubmit: (data: AppointmentFormData) => Promise<void> | void;
  isLoading?: boolean;
  errors?: Record<string, string>;
  onCancel?: () => void;
}

const defaultFormData: AppointmentFormData = {
  patient_record_id: 0,
  patient_name: '',
  patient_id: '',
  department: '',
  doctor_id: '',
  appointment_date: new Date().toISOString().split('T')[0],
  // Hidden in UI, still required by backend contract.
  start_time: '09:00',
  end_time: '09:30',
  visit_type: 'consultation',
  notes: '',
  priority: 'normal',
  status: 'confirmed',
  token_number: '',
  reminders: [],
};

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  mode,
  onSubmit,
  isLoading = false,
  errors: externalErrors = {},
  onCancel,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    ...defaultFormData,
    ...initialData,
    reminders: initialData?.reminders ?? [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Merge external + local errors
  const allErrors = { ...externalErrors, ...errors };

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handlePatientSelect = useCallback((patient: PatientSummary) => {
    setFormData(prev => ({
      ...prev,
      patient_record_id: patient.id,
      patient_name: patient.patientName,
      patient_id: patient.uhid,
    }));
    setErrors(prev => ({ ...prev, patient_name: '', patient_record_id: '' }));
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.patient_record_id) newErrors.patient_name = 'Select a patient from the search results';
    if (!formData.doctor_id) newErrors.doctor_id = 'Doctor is required';
    if (!formData.appointment_date) newErrors.appointment_date = 'Appointment date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <div className="w-full">
      <div className="mb-4 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit Appointment' : 'Book Appointment'}
        </h1>
        <p className="text-gray-600 mt-1">
          {mode === 'edit'
            ? 'Update appointment details'
            : 'Schedule a new appointment with a medical professional'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pb-10">
        <AppointmentDetailsSection
          formData={formData}
          errors={allErrors}
          onInputChange={handleInputChange}
          onPatientSelect={handlePatientSelect}
        />

        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading
              ? (mode === 'edit' ? 'Updating…' : 'Booking…')
              : (mode === 'edit' ? 'Update Appointment' : 'Book Appointment')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
