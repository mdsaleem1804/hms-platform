'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface AppointmentData {
  patient_name: string;
  patient_id: string;
  appointment_date: string;
  appointment_time: string;
  doctor_id: string;
  department: string;
  visit_type: string;
  token_number: string;
  status: string;
  notes: string;
  photo: string | null;
}

interface Errors {
  [key: string]: string;
}

const AppointmentBookingForm = () => {
  const [formData, setFormData] = useState<AppointmentData>({
    patient_name: '',
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    doctor_id: '',
    department: '',
    visit_type: 'Consultation',
    token_number: '',
    status: 'Scheduled',
    notes: '',
    photo: null,
  });

  const [errors, setErrors] = useState<Errors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle photo upload
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Validation
  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }
    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Date is required';
    }
    if (!formData.appointment_time) {
      newErrors.appointment_time = 'Time is required';
    }
    if (!formData.doctor_id) {
      newErrors.doctor_id = 'Doctor is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Appointment Data:', formData);
      alert('Appointment booked successfully! Check console for details.');
    }
  };

  // Check if save button should be disabled
  const isFormComplete = 
    formData.patient_name.trim() && 
    formData.appointment_date && 
    formData.appointment_time && 
    formData.doctor_id;

  // Dropdown options
  const departmentOptions = [
    { value: 'general', label: 'General Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'dermatology', label: 'Dermatology' },
  ];

  const doctorOptions = [
    { value: 'dr_001', label: 'Dr. Rajesh Kumar' },
    { value: 'dr_002', label: 'Dr. Priya Singh' },
    { value: 'dr_003', label: 'Dr. Amit Patel' },
    { value: 'dr_004', label: 'Dr. Sarah Ahmed' },
  ];

  const visitTypeOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'check_up', label: 'Check-up' },
    { value: 'procedure', label: 'Procedure' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Book Appointment
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Schedule an appointment with our medical professionals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-32">
          {/* SECTION 1: Appointment Details with Photo */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Appointment Details
            </h2>

            <div className="flex gap-6">
              {/* Photo Upload - Top Right */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                  {formData.photo ? (
                    <img
                      src={formData.photo}
                      alt="Patient"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* Main fields - 2 columns */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Patient Name"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleInputChange}
                    placeholder="Enter patient name"
                    required
                    error={errors.patient_name}
                  />

                  <Input
                    label="Patient ID"
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    placeholder="Auto-filled or search"
                  />

                  <Input
                    label="Appointment Date"
                    name="appointment_date"
                    type="date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    required
                    error={errors.appointment_date}
                  />

                  <Input
                    label="Appointment Time"
                    name="appointment_time"
                    type="time"
                    value={formData.appointment_time}
                    onChange={handleInputChange}
                    required
                    error={errors.appointment_time}
                  />

                  <Select
                    label="Department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    options={departmentOptions}
                    required
                    error={errors.department}
                  />

                  <Select
                    label="Doctor"
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleInputChange}
                    options={doctorOptions}
                    required
                    error={errors.doctor_id}
                  />

                  <Select
                    label="Visit Type"
                    name="visit_type"
                    value={formData.visit_type}
                    onChange={handleInputChange}
                    options={visitTypeOptions}
                  />

                  <Input
                    label="Token Number"
                    name="token_number"
                    value={formData.token_number}
                    onChange={handleInputChange}
                    placeholder="Auto-generated"
                  />
                </div>

                {/* Notes - Full width */}
                <Textarea
                  label="Appointment Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any special notes or requirements"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Status
            </h2>

            <Select
              label="Appointment Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={statusOptions}
            />
          </div>
        </form>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => window.location.href = '/appointments'}
          >
            Cancel
          </Button>
          <Button
            size="md"
            disabled={!isFormComplete}
            onClick={handleSubmit}
            className={!isFormComplete ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;
