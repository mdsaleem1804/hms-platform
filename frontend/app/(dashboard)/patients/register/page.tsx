'use client';

import PatientForm, { PatientFormData } from '@/components/forms/PatientForm';
import { useRouter } from 'next/navigation';
import patientService from '@/services/patientService';

export default function PatientRegistrationPage() {
  const router = useRouter();

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await patientService.createPatient(data);
      setTimeout(() => router.push('/patients'), 1500);
    } catch {
      // Toast is handled centrally by patientService.
    }
  };

  return (
    <PatientForm mode="create" onSubmit={handleSubmit} onCancel={() => router.push('/patients')} />
  );
}
