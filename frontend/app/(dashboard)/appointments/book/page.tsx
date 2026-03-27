'use client';

import { useRouter } from 'next/navigation';
import AppointmentForm, { AppointmentFormData } from '@/components/forms/AppointmentForm';

export default function AppointmentBookingPage() {
  const router = useRouter();

  const handleSubmit = async (data: AppointmentFormData) => {
    // TODO: replace with real API call e.g. appointmentService.createAppointment(data)
    console.log('Appointment Data:', data);
    router.push('/appointments');
  };

  return (
    <AppointmentForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={() => router.push('/appointments')}
    />
  );
}

