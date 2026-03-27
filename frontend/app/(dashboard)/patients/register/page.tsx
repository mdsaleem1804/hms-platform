'use client';

import PatientForm, { PatientFormData } from '@/components/forms/PatientForm';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import patientService from '@/services/patientService';

export default function PatientRegistrationPage() {
  const router = useRouter();

  const handleSubmit = async (data: PatientFormData) => {
    try {
      const response = await patientService.createPatient(data);
      toast.success(`Patient registered successfully! UHID: ${response?.uhid || ''}`);
      setTimeout(() => router.push('/patients'), 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create patient';
      toast.error(errorMsg);
    }
  };

  return (
    <PatientForm mode="create" onSubmit={handleSubmit} onCancel={() => router.push('/patients')} />
  );
}
