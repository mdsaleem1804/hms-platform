'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import patientService, { CreatePatientPayload, PatientResponse } from '@/services/patientService';

interface FormData extends CreatePatientPayload {
  age: string;
}

interface Errors {
  [key: string]: string;
}

const PatientEditForm = () => {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;

  const [formData, setFormData] = useState<FormData>({
    patient_name: '',
    age: '',
    dob: '',
    gender: '',
    blood_group: '',
    mobile: '',
    email: '',
    address: '',
    postal_code: '',
    photo: null,
    status: 'ACTIVE',
    id_proof_type: '',
    id_proof_number: '',
    emergency_contact: {
      name: '',
      relationship: '',
      contact_number: '',
    },
    attender: {
      name: '',
      phone: '',
      address: '',
      id_proof_type: '',
      id_proof_number: '',
    },
    referral: {
      doctor_referral_checked: false,
      doctor_referral_name: '',
      doctor_referral_department: '',
      doctor_referral_hospital: '',
      patient_relative_checked: false,
      patient_relative_same_dept: false,
      patient_relative_others: '',
      online_search_engine_google: false,
      online_search_engine_website: false,
      online_search_engine_others: '',
      online_social_facebook: false,
      online_social_instagram: false,
      online_social_whatsapp: false,
      online_social_others: '',
      offline_transport_buses: false,
      offline_transport_others: '',
      offline_public_theatres: false,
      offline_public_banners: false,
      offline_public_barricades: false,
      offline_public_roadside: false,
      offline_public_others: '',
      offline_signages_name_boards: false,
      offline_signages_pamphlets: false,
      offline_signages_others: '',
      offline_mass_tv: false,
      offline_mass_fm: false,
      offline_mass_newspapers: false,
      offline_mass_others: '',
      offline_gatherings_health_camps: false,
      offline_gatherings_awareness: false,
      offline_gatherings_others: '',
    },
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load patient data
  useEffect(() => {
    const loadPatient = async () => {
      if (!patientId) return;
      
      try {
        setIsLoadingPatient(true);
        const patient = await patientService.getPatientById(Number(patientId));
        const dob = new Date(patient.dob);
        const isoDate = dob.toISOString().split('T')[0];
        
        setFormData(prev => ({
          ...prev,
          patient_name: patient.patientName,
          age: patient.age?.toString() || '',
          dob: isoDate,
          gender: patient.gender,
          blood_group: patient.bloodGroup,
          mobile: patient.mobile,
          email: patient.email,
          address: patient.address,
          postal_code: patient.postalCode,
          photo: patient.photo || null,
          status: patient.status,
          id_proof_type: patient.idProofType,
          id_proof_number: patient.idProofNumber,
          emergency_contact: patient.emergencyContact || prev.emergency_contact,
          attender: patient.attender || prev.attender,
          referral: patient.referral || prev.referral,
        }));
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load patient';
        toast.error(errorMsg);
        router.push('/patients');
      } finally {
        setIsLoadingPatient(false);
      }
    };

    loadPatient();
  }, [patientId, router]);

  // Auto-calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleNestedChange = useCallback((
    section: keyof FormData,
    field: string,
    value: string | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...((prev[section] as unknown) as Record<string, string | boolean>),
        [field]: value,
      },
    }));

    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  }, [errors]);

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

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const selectedDob = new Date(formData.dob);
      if (selectedDob > today) {
        newErrors.dob = 'Date of birth cannot be a future date';
      }
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.postal_code && !/^\d+$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Postal code must be numeric';
    }

    if (formData.id_proof_type && !formData.id_proof_number.trim()) {
      newErrors.id_proof_number = 'ID proof number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !patientId) {
      return;
    }

    setIsLoading(true);

    try {
      const payload: CreatePatientPayload = {
        patient_name: formData.patient_name,
        dob: formData.dob,
        gender: formData.gender,
        blood_group: formData.blood_group,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        postal_code: formData.postal_code,
        photo: formData.photo,
        id_proof_type: formData.id_proof_type,
        id_proof_number: formData.id_proof_number,
        status: formData.status,
        emergency_contact: formData.emergency_contact,
        attender: formData.attender,
        referral: formData.referral,
      };

      await patientService.updatePatient(Number(patientId), payload);
      toast.success('Patient updated successfully!');
      
      setTimeout(() => {
        router.push('/patients');
      }, 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update patient';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  const idProofOptions = [
    { value: 'aadhaar', label: 'Aadhaar' },
    { value: 'pan', label: 'PAN' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
  ];

  const relationshipOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'other', label: 'Other' },
  ];

  if (isLoadingPatient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading patient details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Patient
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Update patient information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-32">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name *
                </label>
                <Input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  error={errors.patient_name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  error={errors.dob}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <Input
                  type="text"
                  value={formData.age}
                  disabled
                  placeholder="Auto-calculated"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={genderOptions}
                  error={errors.gender}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group *
                </label>
                <Select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  options={bloodGroupOptions}
                  error={errors.blood_group}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                  error={errors.status}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <Input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  error={errors.mobile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  error={errors.email}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  error={errors.address}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                  error={errors.postal_code}
                />
              </div>
            </div>
          </div>

          {/* ID Proof Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              ID Proof Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Proof Type
                </label>
                <Select
                  name="id_proof_type"
                  value={formData.id_proof_type}
                  onChange={handleInputChange}
                  options={idProofOptions}
                  error={errors.id_proof_type}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Proof Number
                </label>
                <Input
                  type="text"
                  name="id_proof_number"
                  value={formData.id_proof_number}
                  onChange={handleInputChange}
                  placeholder="Enter ID proof number"
                  error={errors.id_proof_number}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Emergency Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  value={formData.emergency_contact.name}
                  onChange={(e) => handleNestedChange('emergency_contact', 'name', e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <Select
                  value={formData.emergency_contact.relationship}
                  onChange={(e) => handleNestedChange('emergency_contact', 'relationship', e.target.value)}
                  options={relationshipOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <Input
                  type="tel"
                  value={formData.emergency_contact.contact_number}
                  onChange={(e) => handleNestedChange('emergency_contact', 'contact_number', e.target.value)}
                  placeholder="10-digit contact number"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pb-20">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Updating...' : 'Update Patient'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/patients')}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientEditForm;
