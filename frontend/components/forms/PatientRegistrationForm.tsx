'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import patientService from '@/services/patientService';

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
    // Referrals
    doctor_referral_checked: boolean;
    doctor_referral_name: string;
    doctor_referral_department: string;
    doctor_referral_hospital: string;
    patient_relative_checked: boolean;
    patient_relative_same_dept: boolean;
    patient_relative_others: string;
    // Online Advertisements
    online_search_engine_google: boolean;
    online_search_engine_website: boolean;
    online_search_engine_others: string;
    online_social_facebook: boolean;
    online_social_instagram: boolean;
    online_social_whatsapp: boolean;
    online_social_others: string;
    // Offline Advertisements
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
      // Referrals
      doctor_referral_checked: false,
      doctor_referral_name: '',
      doctor_referral_department: '',
      doctor_referral_hospital: '',
      patient_relative_checked: false,
      patient_relative_same_dept: false,
      patient_relative_others: '',
      // Online Advertisements
      online_search_engine_google: false,
      online_search_engine_website: false,
      online_search_engine_others: '',
      online_social_facebook: false,
      online_social_instagram: false,
      online_social_whatsapp: false,
      online_social_others: '',
      // Offline Advertisements
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  // Handle top-level input changes
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle nested object changes
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

    // Patient Name
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = 'Patient name is required';
    }

    // Date of Birth
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else {
      const today = new Date();
      const selectedDob = new Date(formData.dob);
      if (selectedDob > today) {
        newErrors.dob = 'Date of birth cannot be a future date';
      }
    }

    // Mobile Number
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
    } else {
      // Prevent duplicate mobile (frontend check with sample data)
      const existingMobiles = ['9876543210', '8765432109']; // Sample existing data
      if (existingMobiles.includes(formData.mobile.replace(/\D/g, ''))) {
        newErrors.mobile = 'This mobile number is already registered';
      }
    }

    // Email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Postal Code
    if (formData.postal_code && !/^\d+$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Postal code must be numeric';
    }

    // ID Proof
    if (formData.id_proof_type && !formData.id_proof_number.trim()) {
      newErrors.id_proof_number = 'ID proof number is required';
    }

    // Attender ID Proof
    if (
      formData.attender.id_proof_type &&
      !formData.attender.id_proof_number.trim()
    ) {
      newErrors['attender.id_proof_number'] = 'ID proof number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await patientService.createPatient(formData);
      
      // Update UHID in the form with the response value
      setFormData(prev => ({ ...prev, uhid: response.uhid }));
      
      // Show success message
      alert(`Patient registered successfully! UHID: ${response.uhid}`);
      
      // Redirect to patients list after 1 second
      setTimeout(() => {
        router.push('/patients');
      }, 1000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create patient. Please try again.';
      setErrorMessage(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if save button should be disabled (validate on fly)
  const validateBeforeSubmit = (): Errors => {
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
    if (formData.id_proof_type && !formData.id_proof_number.trim()) {
      newErrors.id_proof_number = 'ID proof number is required';
    }

    return newErrors;
  };

  const currentErrors = validateBeforeSubmit();
  const isFormComplete = Object.keys(currentErrors).length === 0 && formData.patient_name.trim() && formData.dob && formData.mobile.trim();

  // Dropdown options
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
    { value: 'driving_license', label: 'Driving License' },
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ];

  const idProofPatientOptions = [
    { value: 'aadhaar', label: 'Aadhaar' },
    { value: 'pan', label: 'PAN' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Patient Registration
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete patient information for hospital records
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pb-32">
          {/* SECTION 1: Patient Details with Photo */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Patient Details
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
                    <span className="text-3xl">📷</span>
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
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="UHID"
                  name="uhid"
                  value={formData.uhid}
                  readOnly
                  disabled
                  placeholder="Auto-generated"
                  className="bg-gray-100 cursor-not-allowed"
                />

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
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  error={errors.dob}
                />

                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  readOnly
                  disabled
                  placeholder="Auto-calculated"
                  className="bg-gray-100 cursor-not-allowed"
                />

                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  options={genderOptions}
                />

                <Select
                  label="Blood Group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  options={bloodGroupOptions}
                />

                <Input
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  required
                  error={errors.mobile}
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  error={errors.email}
                />

                <Input
                  label="Postal Code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                  error={errors.postal_code}
                />

                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                />

                <Select
                  label="ID Proof Type"
                  name="id_proof_type"
                  value={formData.id_proof_type}
                  onChange={handleInputChange}
                  options={idProofPatientOptions}
                />

                {formData.id_proof_type && (
                  <Input
                    label="ID Proof Number"
                    name="id_proof_number"
                    value={formData.id_proof_number}
                    onChange={handleInputChange}
                    placeholder="Enter ID number"
                    required
                    error={errors.id_proof_number}
                  />
                )}
              </div>
            </div>

            {/* Address - Full width */}
            <div className="mt-4">
              <Textarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* SECTION 2: Emergency Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Emergency Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Name"
                value={formData.emergency_contact.name}
                onChange={(e) =>
                  handleNestedChange('emergency_contact', 'name', e.target.value)
                }
                placeholder="Enter name"
              />

              <Select
                label="Relationship"
                value={formData.emergency_contact.relationship}
                onChange={(e) =>
                  handleNestedChange(
                    'emergency_contact',
                    'relationship',
                    e.target.value
                  )
                }
                options={relationshipOptions}
              />

              <Input
                label="Contact Number"
                value={formData.emergency_contact.contact_number}
                onChange={(e) =>
                  handleNestedChange(
                    'emergency_contact',
                    'contact_number',
                    e.target.value
                  )
                }
                placeholder="10-digit number"
              />
            </div>
          </div>

          {/* SECTION 3: Attender Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
              Attender Details (Optional)
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Name"
                  value={formData.attender.name}
                  onChange={(e) =>
                    handleNestedChange('attender', 'name', e.target.value)
                  }
                  placeholder="Enter name"
                />

                <Input
                  label="Phone Number"
                  value={formData.attender.phone}
                  onChange={(e) =>
                    handleNestedChange('attender', 'phone', e.target.value)
                  }
                  placeholder="10-digit number"
                />

                <Select
                  label="ID Proof Type"
                  value={formData.attender.id_proof_type}
                  onChange={(e) =>
                    handleNestedChange('attender', 'id_proof_type', e.target.value)
                  }
                  options={idProofOptions}
                />
              </div>

              {formData.attender.id_proof_type && (
                <Input
                  label="ID Proof Number"
                  value={formData.attender.id_proof_number}
                  onChange={(e) =>
                    handleNestedChange(
                      'attender',
                      'id_proof_number',
                      e.target.value
                    )
                  }
                  required
                  error={errors['attender.id_proof_number']}
                  placeholder="Enter ID number"
                />
              )}

              <Textarea
                label="Address"
                value={formData.attender.address}
                onChange={(e) =>
                  handleNestedChange('attender', 'address', e.target.value)
                }
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* SECTION 4: Mode of Arrival - Checkbox Style */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-3 border-b border-gray-200">
              Patient Mode of Arrival
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Tick the appropriate check boxes and write the details wherever indicated
            </p>

            {/* Referrals Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-blue-600 mb-4">Referrals:</h3>
                
                {/* Doctor's Referral */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <label className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.referral.doctor_referral_checked}
                      onChange={(e) =>
                        handleNestedChange('referral', 'doctor_referral_checked', e.target.checked)
                      }
                      className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
                    />
                    <span className="font-semibold text-gray-900">Doctor's Referral:</span>
                  </label>
                  {formData.referral.doctor_referral_checked && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-7">
                      <Input
                        label="Name"
                        value={formData.referral.doctor_referral_name}
                        onChange={(e) =>
                          handleNestedChange('referral', 'doctor_referral_name', e.target.value)
                        }
                        placeholder="Enter doctor name"
                      />
                      <Input
                        label="Department"
                        value={formData.referral.doctor_referral_department}
                        onChange={(e) =>
                          handleNestedChange('referral', 'doctor_referral_department', e.target.value)
                        }
                        placeholder="Enter department"
                      />
                      <Input
                        label="Hospital"
                        value={formData.referral.doctor_referral_hospital}
                        onChange={(e) =>
                          handleNestedChange('referral', 'doctor_referral_hospital', e.target.value)
                        }
                        placeholder="Enter hospital name"
                      />
                    </div>
                  )}
                </div>

                {/* Patient/Relatives Referral */}
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <label className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.referral.patient_relative_checked}
                      onChange={(e) =>
                        handleNestedChange('referral', 'patient_relative_checked', e.target.checked)
                      }
                      className="w-4 h-4 text-green-600 rounded cursor-pointer"
                    />
                    <span className="font-semibold text-gray-900">Patient/Relatives Referral:</span>
                  </label>
                  {formData.referral.patient_relative_checked && (
                    <div className="flex gap-6 ml-7">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.referral.patient_relative_same_dept}
                          onChange={(e) =>
                            handleNestedChange('referral', 'patient_relative_same_dept', e.target.checked)
                          }
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-gray-700">Same Department</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded cursor-pointer"
                            onChange={(e) => {
                              if (!e.target.checked) {
                                handleNestedChange('referral', 'patient_relative_others', '')
                              }
                            }}
                          />
                          <span className="text-gray-700">Others:</span>
                        </label>
                        <input
                          type="text"
                          value={formData.referral.patient_relative_others}
                          onChange={(e) =>
                            handleNestedChange('referral', 'patient_relative_others', e.target.value)
                          }
                          placeholder="Specify"
                          className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Online Advertisements */}
              <div>
                <h3 className="text-base font-semibold text-purple-600 mb-4">Online Advertisements:</h3>
                
                {/* Search Engine */}
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Search Engine:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.online_search_engine_google}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_search_engine_google', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Google</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.online_search_engine_website}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_search_engine_website', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Hospital Website</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.online_search_engine_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_search_engine_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Social Media:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.online_social_facebook}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_social_facebook', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Facebook</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.online_social_instagram}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_social_instagram', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Instagram</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.online_social_whatsapp}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_social_whatsapp', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">WhatsApp</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.online_social_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'online_social_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Advertisements */}
              <div>
                <h3 className="text-base font-semibold text-orange-600 mb-4">Offline Advertisements:</h3>

                {/* Transport Ads */}
                <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Transport Ads:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_transport_buses}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_transport_buses', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Buses</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.offline_transport_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_transport_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Public Places Ads */}
                <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Public places Ads:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_public_theatres}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_public_theatres', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Theatres</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_public_banners}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_public_banners', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Banners</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_public_barricades}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_public_barricades', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Barricades</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_public_roadside}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_public_roadside', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Roadside displays</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.offline_public_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_public_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Signages */}
                <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Signages:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_signages_name_boards}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_signages_name_boards', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Outside Name Boards</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_signages_pamphlets}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_signages_pamphlets', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Pamphlets</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.offline_signages_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_signages_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Mass Media */}
                <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Mass Media:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_mass_tv}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_mass_tv', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">TV News</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_mass_fm}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_mass_fm', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">FM Ad</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_mass_newspapers}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_mass_newspapers', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Newspapers</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.offline_mass_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_mass_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>

                {/* Gatherings */}
                <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                  <p className="font-semibold text-gray-900 mb-2">Gatherings:</p>
                  <div className="flex flex-wrap gap-6 ml-7">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_gatherings_health_camps}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_gatherings_health_camps', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Health Camps</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.referral.offline_gatherings_awareness}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_gatherings_awareness', e.target.checked)
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <span className="text-gray-700">Awareness Programs</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" />
                        <span className="text-gray-700">Others:</span>
                      </label>
                      <input
                        type="text"
                        value={formData.referral.offline_gatherings_others}
                        onChange={(e) =>
                          handleNestedChange('referral', 'offline_gatherings_others', e.target.value)
                        }
                        placeholder="Specify"
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-end gap-3">
          {errorMessage && (
            <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push('/patients')}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="md"
            disabled={!isFormComplete || isLoading}
            onClick={handleSubmit}
            className={(!isFormComplete || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
            title={!isFormComplete ? 'Please fix validation errors before submitting' : isLoading ? 'Saving patient information...' : 'Save patient information'}
          >
            {isLoading ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistrationForm;

