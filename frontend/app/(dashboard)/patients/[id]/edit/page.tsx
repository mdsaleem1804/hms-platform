'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
          emergency_contact: {
            name: patient.emergencyContact?.name || '',
            relationship: patient.emergencyContact?.relationship || '',
            contact_number: patient.emergencyContact?.contactNumber || '',
          },
          attender: {
            name: patient.attender?.name || '',
            phone: patient.attender?.phone || '',
            address: patient.attender?.address || '',
            id_proof_type: patient.attender?.idProofType || '',
            id_proof_number: patient.attender?.idProofNumber || '',
          },
          referral: {
            doctor_referral_checked: patient.referral?.doctorReferralChecked || false,
            doctor_referral_name: patient.referral?.doctorReferralName || '',
            doctor_referral_department: patient.referral?.doctorReferralDepartment || '',
            doctor_referral_hospital: patient.referral?.doctorReferralHospital || '',
            patient_relative_checked: patient.referral?.patientRelativeChecked || false,
            patient_relative_same_dept: patient.referral?.patientRelativeSameDept || false,
            patient_relative_others: patient.referral?.patientRelativeOthers || '',
            online_search_engine_google: patient.referral?.onlineSearchEngineGoogle || false,
            online_search_engine_website: patient.referral?.onlineSearchEngineWebsite || false,
            online_search_engine_others: patient.referral?.onlineSearchEngineOthers || '',
            online_social_facebook: patient.referral?.onlineSocialFacebook || false,
            online_social_instagram: patient.referral?.onlineSocialInstagram || false,
            online_social_whatsapp: patient.referral?.onlineSocialWhatsapp || false,
            online_social_others: patient.referral?.onlineSocialOthers || '',
            offline_transport_buses: patient.referral?.offlineTransportBuses || false,
            offline_transport_others: patient.referral?.offlineTransportOthers || '',
            offline_public_theatres: patient.referral?.offlinePublicTheatres || false,
            offline_public_banners: patient.referral?.offlinePublicBanners || false,
            offline_public_barricades: patient.referral?.offlinePublicBarricades || false,
            offline_public_roadside: patient.referral?.offlinePublicRoadside || false,
            offline_public_others: patient.referral?.offlinePublicOthers || '',
            offline_signages_name_boards: patient.referral?.offlineSignagesNameBoards || false,
            offline_signages_pamphlets: patient.referral?.offlineSignagesPamphlets || false,
            offline_signages_others: patient.referral?.offlineSignagesOthers || '',
            offline_mass_tv: patient.referral?.offlineMassTv || false,
            offline_mass_fm: patient.referral?.offlineMassFm || false,
            offline_mass_newspapers: patient.referral?.offlineMassNewspapers || false,
            offline_mass_others: patient.referral?.offlineMassOthers || '',
            offline_gatherings_health_camps: patient.referral?.offlineGatheringsHealthCamps || false,
            offline_gatherings_awareness: patient.referral?.offlineGatheringsAwareness || false,
            offline_gatherings_others: patient.referral?.offlineGatheringsOthers || '',
          },
        });
      } catch (error) {
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
      setTimeout(() => router.push('/patients'), 1500);
    } catch {
      // Toast is handled centrally by patientService.
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
