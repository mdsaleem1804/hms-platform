'use client';

import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import patientService from '@/services/patientService';
import PatientInfoSection from './patient-sections/PatientInfoSection';
import EmergencyContactSection from './patient-sections/EmergencyContactSection';
import AttenderSection from './patient-sections/AttenderSection';import ModeOfArrivalSection from './patient-sections/ModeOfArrivalSection';
interface FormData {
  patient_name: string;
  uhid: string;
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
  emergency_contact: {
    name: string;
    relationship: string;
    contact_number: string;
  };
  attender: {
    name: string;
    phone: string;
    address: string;
    id_proof_type: string;
    id_proof_number: string;
  };
  referral: {
    doctor_referral_checked: boolean;
    doctor_referral_name: string;
    doctor_referral_department: string;
    doctor_referral_hospital: string;
    patient_relative_checked: boolean;
    patient_relative_same_dept: boolean;
    patient_relative_others: string;
    online_search_engine_google: boolean;
    online_search_engine_website: boolean;
    online_search_engine_others: string;
    online_social_facebook: boolean;
    online_social_instagram: boolean;
    online_social_whatsapp: boolean;
    online_social_others: string;
    offline_transport_buses: boolean;
    offline_transport_others: string;
    offline_public_theatres: boolean;
    offline_public_banners: boolean;
    offline_public_barricades: boolean;
    offline_public_roadside: boolean;
    offline_public_others: string;
    offline_signages_name_boards: boolean;
    offline_signages_pamphlets: boolean;
    offline_signages_others: string;
    offline_mass_tv: boolean;
    offline_mass_fm: boolean;
    offline_mass_newspapers: boolean;
    offline_mass_others: string;
    offline_gatherings_health_camps: boolean;
    offline_gatherings_awareness: boolean;
    offline_gatherings_others: string;
  };
}

interface Errors {
  [key: string]: string;
}

const PatientRegistrationForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    patient_name: '',
    uhid: '',
    dob: '',
    age: '',
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    } else {
      const existingMobiles = ['9876543210', '8765432109'];
      if (existingMobiles.includes(formData.mobile.replace(/\D/g, ''))) {
        newErrors.mobile = 'This mobile number is already registered';
      }
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

    if (formData.attender.id_proof_type && !formData.attender.id_proof_number.trim()) {
      newErrors['attender.id_proof_number'] = 'ID proof number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await patientService.createPatient(formData);
      const uhid = response?.uhid || '';
      setFormData(prev => ({ ...prev, uhid }));
      toast.success(`Patient registered successfully! UHID: ${uhid}`);

      setTimeout(() => {
        router.push('/patients');
      }, 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create patient';
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

  const relationshipOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'other', label: 'Other' },
  ];

  const idProofOptions = [
    { value: 'aadhaar', label: 'Aadhaar' },
    { value: 'pan', label: 'PAN' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-gray-600 mt-2">Complete patient information for hospital records</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          {/* SECTION 1: PATIENT INFORMATION */}
          <PatientInfoSection
            formData={{
              patient_name: formData.patient_name,
              dob: formData.dob,
              age: formData.age,
              gender: formData.gender,
              blood_group: formData.blood_group,
              mobile: formData.mobile,
              email: formData.email,
              address: formData.address,
              postal_code: formData.postal_code,
              photo: formData.photo,
              status: formData.status,
              id_proof_type: formData.id_proof_type,
              id_proof_number: formData.id_proof_number,
            }}
            errors={errors}
            onInputChange={handleInputChange}
            onPhotoUpload={handlePhotoUpload}
            onStatusChange={() => setFormData(prev => ({
              ...prev,
              status: prev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
            }))}
            fileInputRef={fileInputRef}
          />

          {/* SECTION 2: EMERGENCY CONTACT */}
          <EmergencyContactSection
            emergencyContact={formData.emergency_contact}
            onNestedChange={(field, value) => handleNestedChange('emergency_contact', field, value)}
          />

          {/* SECTION 3: ATTENDER DETAILS */}
          <AttenderSection
            attender={formData.attender}
            errors={errors}
            onNestedChange={(field, value) => handleNestedChange('attender', field, value)}
          />

          {/* SECTION 4: MODE OF ARRIVAL */}
          <ModeOfArrivalSection
            referral={formData.referral}
            onCheckboxChange={(field, value) => handleNestedChange('referral', field, value)}
            onInputChange={(field, value) => handleNestedChange('referral', field, value)}
          />

          {/* FORM ACTIONS */}
          <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/patients')}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isLoading ? 'Saving...' : 'Save Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;
