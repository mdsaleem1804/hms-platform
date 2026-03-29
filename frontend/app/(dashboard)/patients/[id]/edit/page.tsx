'use client';

import { useParams } from 'next/navigation';
import PatientFormPage from '@/components/patients/PatientFormPage';

export default function PatientEditPage() {
  const params = useParams();
  return <PatientFormPage mode="edit" patientId={Number(params?.id)} />;
}
