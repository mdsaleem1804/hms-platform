'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import AppointmentForm, { AppointmentFormData } from '@/components/forms/AppointmentForm';
import appointmentService from '@/services/appointmentService';
import patientService from '@/services/patientService';

export default function AppointmentBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrefillLoading, setIsPrefillLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<AppointmentFormData> | undefined>(undefined);

  useEffect(() => {
    const patientIdParam = searchParams.get('patientId');
    const patientId = Number(patientIdParam);

    if (!patientIdParam || !Number.isFinite(patientId) || patientId <= 0) {
      setInitialData(undefined);
      return;
    }

    const loadPatient = async () => {
      try {
        setIsPrefillLoading(true);
        const patient = await patientService.getPatientById(patientId);
        setInitialData({
          patient_record_id: patient.id,
          patient_name: patient.patientName,
          patient_id: patient.uhid,
        });
      } catch {
        toast.error('Unable to pre-fill patient details');
        setInitialData(undefined);
      } finally {
        setIsPrefillLoading(false);
      }
    };

    loadPatient();
  }, [searchParams]);

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      const appointment = await appointmentService.create({
        patientId: data.patient_record_id,
        doctorId: String(data.doctor_id),
        departmentId: String(data.department),
        appointmentDate: data.appointment_date,
        startTime: data.start_time || '09:00',
        endTime: data.end_time || '09:30',
        visitType: data.visit_type,
        status: data.status,
        priority: data.priority,
        notes: data.notes,
        reminders: data.reminders.map((reminder) => ({
          channel: reminder.channel,
          timing: reminder.timing,
        })),
      });

      toast.success(`Appointment ${appointment.appointmentNo} booked successfully`);
      router.push('/appointments');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to book appointment';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    isPrefillLoading ? (
      <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500">
        Loading patient details...
      </div>
    ) : (
      <AppointmentForm
        key={initialData?.patient_record_id ?? 'new'}
        mode="create"
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        onCancel={() => router.push('/appointments')}
      />
    )
  );
}

