// Unified PatientForm component for both registration and edit
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import PatientInfoSection from './patient-sections/PatientInfoSection';
import EmergencyContactSection from './patient-sections/EmergencyContactSection';
import AttenderSection from './patient-sections/AttenderSection';
import ModeOfArrivalSection from './patient-sections/ModeOfArrivalSection';
import Tabs from '../ui/Tabs';

export interface PatientFormData {
  patient_name: string;
  uhid?: string;
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

export interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  mode: 'create' | 'edit';
  onSubmit: (data: PatientFormData) => Promise<void> | void;
  isLoading?: boolean;
  errors?: Record<string, string>;
  onCancel?: () => void;
}

const defaultFormData: PatientFormData = {
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
  emergency_contact: { name: '', relationship: '', contact_number: '' },
  attender: { name: '', phone: '', address: '', id_proof_type: '', id_proof_number: '' },
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
    offline_signages_others: false,
    offline_mass_tv: false,
    offline_mass_fm: false,
    offline_mass_newspapers: false,
    offline_mass_others: '',
    offline_gatherings_health_camps: false,
    offline_gatherings_awareness: false,
    offline_gatherings_others: '',
  },
};

const PatientForm: React.FC<PatientFormProps> = ({
  initialData,
  mode,
  onSubmit,
  isLoading = false,
  errors: externalErrors = {},
  onCancel,
}) => {
  const [formData, setFormData] = useState<PatientFormData>({
    ...defaultFormData,
    ...initialData,
    emergency_contact: { ...defaultFormData.emergency_contact, ...initialData?.emergency_contact },
    attender: { ...defaultFormData.attender, ...initialData?.attender },
    referral: { ...defaultFormData.referral, ...initialData?.referral },
  });
  const [errors, setErrors] = useState<Record<string, string>>(externalErrors);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrors(externalErrors);
  }, [externalErrors]);

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
    section: keyof PatientFormData,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    await onSubmit(formData);
  };

  return (
    <div className="w-full">
      <div className="mb-4 mt-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit Patient' : 'Patient Registration'}
        </h1>
        <p className="text-gray-600 mt-1">
          {mode === 'edit' ? 'Update patient information' : 'Complete patient information for hospital records'}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="pb-10">
        <Tabs
          tabs={[
            {
              label: 'Patient Information',
              content: (
                <PatientInfoSection
                  formData={formData}
                  errors={errors}
                  onInputChange={handleInputChange}
                  onPhotoUpload={handlePhotoUpload}
                  onStatusChange={() => setFormData(prev => ({
                    ...prev,
                    status: prev.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                  }))}
                  fileInputRef={fileInputRef}
                />
              ),
            },
            {
              label: 'Emergency Contact',
              content: (
                <EmergencyContactSection
                  emergencyContact={formData.emergency_contact}
                  onNestedChange={(field, value) => handleNestedChange('emergency_contact', field, value)}
                />
              ),
            },
            {
              label: 'Attender Details',
              content: (
                <AttenderSection
                  attender={formData.attender}
                  errors={errors}
                  onNestedChange={(field, value) => handleNestedChange('attender', field, value)}
                />
              ),
            },
            {
              label: 'Mode of Arrival',
              content: (
                <ModeOfArrivalSection
                  referral={formData.referral}
                  onCheckboxChange={(field, value) => handleNestedChange('referral', field, value)}
                  onInputChange={(field, value) => handleNestedChange('referral', field, value)}
                />
              ),
            },
          ]}
          defaultActive={0}
        />
        {/* FORM ACTIONS */}
        <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? (mode === 'edit' ? 'Updating...' : 'Saving...') : (mode === 'edit' ? 'Update Patient' : 'Save Patient')}
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

export default PatientForm;
