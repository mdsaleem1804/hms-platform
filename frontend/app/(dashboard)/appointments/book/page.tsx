'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AppointmentForm, { AppointmentFormData } from '@/components/forms/AppointmentForm';
import appointmentService from '@/services/appointmentService';

export default function AppointmentBookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      const appointment = await appointmentService.create({
        patientId: data.patient_record_id,
        doctorId: data.doctor_id,
        departmentId: data.department,
        appointmentDate: data.appointment_date,
        startTime: data.start_time,
        endTime: data.end_time,
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
    <AppointmentForm
      mode="create"
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      onCancel={() => router.push('/appointments')}
    />
  );
}

