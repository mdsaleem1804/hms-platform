'use client';

import React, { memo } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface PatientInfoSectionProps {
  formData: {
    patient_name: string;
    dob: string;
    age: string;
    gender: string;
    blood_group: string;
    mobile: string;
    email: string;
    address: string;
    postal_code: string;
    photo: string | null;
    status: string;
    id_proof_type: string;
    id_proof_number: string;
  };
  errors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const bloodGroupOptions = [
  { value: 'a+', label: 'A+' },
  { value: 'a-', label: 'A-' },
  { value: 'b+', label: 'B+' },
  { value: 'b-', label: 'B-' },
  { value: 'ab+', label: 'AB+' },
  { value: 'ab-', label: 'AB-' },
  { value: 'o+', label: 'O+' },
  { value: 'o-', label: 'O-' },
];

const idProofOptions = [
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
];

const PatientInfoSection = memo(({
  formData,
  errors,
  onInputChange,
  onPhotoUpload,
  onStatusChange,
  fileInputRef,
}: PatientInfoSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Patient Information
      </h2>

      <div className="grid grid-cols-12 gap-6">
        {/* Photo Upload */}
        <div className="col-span-12 sm:col-span-2">
          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
              {formData.photo ? (
                <img src={formData.photo} alt="Patient" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Upload Photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onPhotoUpload} className="hidden" />
          </div>
        </div>

        {/* Patient Name - Wide */}
        <div className="col-span-12 sm:col-span-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name *
          </label>
          <Input
            type="text"
            name="patient_name"
            value={formData.patient_name}
            onChange={onInputChange}
            placeholder="Enter full name"
            error={errors.patient_name}
            className="h-10"
          />
        </div>

        {/* Mobile Number - Compact */}
        <div className="col-span-12 sm:col-span-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number *
          </label>
          <Input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={onInputChange}
            placeholder="10-digit number"
            error={errors.mobile}
            className="h-10"
          />
        </div>

        {/* Date of Birth */}
        <div className="col-span-12 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={onInputChange}
            error={errors.dob}
            className="h-10"
          />
        </div>

        {/* Age - Small Readonly */}
        <div className="col-span-12 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <Input
            type="number"
            name="age"
            value={formData.age}
            disabled
            className="h-10 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Gender */}
        <div className="col-span-12 sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <Select
            name="gender"
            value={formData.gender}
            onChange={onInputChange}
            options={genderOptions}
          />
        </div>

        {/* Blood Group - Compact */}
        <div className="col-span-12 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blood Group
          </label>
          <Select
            name="blood_group"
            value={formData.blood_group}
            onChange={onInputChange}
            options={bloodGroupOptions}
          />
        </div>

        {/* Status - Toggle Switch */}
        <div className="col-span-12 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <button
            type="button"
            onClick={onStatusChange}
            className={`relative inline-flex h-10 w-full items-center rounded-lg border-2 px-4 font-medium transition-colors ${
              formData.status === 'ACTIVE'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-red-500 bg-red-50 text-red-700'
            }`}
            aria-pressed={formData.status === 'ACTIVE'}
          >
            {formData.status === 'ACTIVE' ? '✓ ACTIVE' : '✗ INACTIVE'}
          </button>
        </div>

        {/* Address - Full Width */}
        <div className="col-span-12">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={onInputChange}
            placeholder="Enter full address"
            rows={2}
            className="w-full"
          />
        </div>

        {/* Email & Postal Code */}
        <div className="col-span-12 sm:col-span-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="Enter email address"
            error={errors.email}
            className="h-10"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <Input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={onInputChange}
            placeholder="PIN code"
            error={errors.postal_code}
            className="h-10"
          />
        </div>

        {/* ID Proof */}
        <div className="col-span-12 sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Type</label>
          <Select
            name="id_proof_type"
            value={formData.id_proof_type}
            onChange={onInputChange}
            options={idProofOptions}
          />
        </div>

        {formData.id_proof_type && (
          <div className="col-span-12 sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Proof Number *
            </label>
            <Input
              type="text"
              name="id_proof_number"
              value={formData.id_proof_number}
              onChange={onInputChange}
              placeholder="Enter ID number"
              error={errors.id_proof_number}
              className="h-10"
            />
          </div>
        )}
      </div>
    </div>
  );
});

PatientInfoSection.displayName = 'PatientInfoSection';

export default PatientInfoSection;
