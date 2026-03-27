'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import patientService from '@/services/patientService';
import PatientForm, { PatientFormData } from '@/components/forms/PatientForm';

export default function PatientEditPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;
  const [initialData, setInitialData] = useState<Partial<PatientFormData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatient = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const patient = await patientService.getPatientById(Number(patientId));
        const dob = new Date(patient.dob);
        const isoDate = dob.toISOString().split('T')[0];
        setInitialData({
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
          emergency_contact: patient.emergencyContact,
          attender: patient.attender,
          referral: patient.referral,
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load patient';
        toast.error(errorMsg);
        router.push('/patients');
      } finally {
        setLoading(false);
      }
    };
    loadPatient();
  }, [patientId, router]);

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await patientService.updatePatient(Number(patientId), data);
      toast.success('Patient updated successfully!');
      setTimeout(() => router.push('/patients'), 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update patient';
      toast.error(errorMsg);
    }
  };

  if (loading || !initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading patient details...</div>
      </div>
    );
  }

  return (
    <PatientForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/patients')}
    />
  );
}
