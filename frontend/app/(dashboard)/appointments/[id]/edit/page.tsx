'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import AppointmentForm, { AppointmentFormData } from '@/components/forms/AppointmentForm';
import appointmentService, { AppointmentReminder } from '@/services/appointmentService';

const formatDate = (value: string) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value.includes('T') ? value.split('T')[0] : value;
  }
  return parsed.toISOString().split('T')[0];
};

const formatTime = (value: string) => {
  if (!value) return '';
  return value.length >= 5 ? value.slice(0, 5) : value;
};

const mapRemindersToForm = (reminders: AppointmentReminder[]) => {
  return reminders.map((reminder, index) => ({
    id: reminder.id || `rem-${index}`,
    channel: reminder.channel,
    timing: reminder.timing,
  }));
};

export default function AppointmentEditPage() {
  const router = useRouter();
  const params = useParams();
  const displayIdParam = params?.id as string;
  const appointmentDisplayId = Number(displayIdParam);

  const [initialData, setInitialData] = useState<Partial<AppointmentFormData> | null>(null);
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAppointment = async () => {
      if (!Number.isFinite(appointmentDisplayId) || appointmentDisplayId <= 0) {
        toast.error('Invalid appointment number');
        router.push('/appointments');
        return;
      }

      try {
        setIsLoading(true);
        const appointment = await appointmentService.getByDisplayId(appointmentDisplayId);
        setAppointmentId(appointment.id);

        setInitialData({
          patient_record_id: appointment.patientId,
          patient_name: appointment.patientName,
          patient_id: appointment.patientUhid,
          department: String(appointment.departmentId || ''),
          doctor_id: String(appointment.doctorId || ''),
          appointment_date: formatDate(appointment.appointmentDate),
          start_time: formatTime(appointment.startTime),
            end_time: formatTime(appointment.endTime),
          visit_type: appointment.visitType,
          notes: appointment.notes,
          priority: appointment.priority,
          status: appointment.status,
          token_number: appointment.tokenNumber ? String(appointment.tokenNumber) : '',
          reminders: mapRemindersToForm(appointment.reminders || []),
        });
      } catch (error: any) {
        const message = error.response?.data?.message || error.message || 'Failed to load appointment details';
        toast.error(message);
        router.push('/appointments');
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointment();
  }, [appointmentDisplayId, router]);

  const handleSubmit = async (data: AppointmentFormData) => {
    try {
      if (!appointmentId) {
        toast.error('Appointment record not loaded');
        return;
      }

      setIsSubmitting(true);
      await appointmentService.update(appointmentId, {
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

      toast.success('Appointment updated successfully');
      router.push('/appointments');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update appointment';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !initialData) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500">
        Loading appointment details...
      </div>
    );
  }

  return (
    <AppointmentForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
      onCancel={() => router.push('/appointments')}
    />
  );
}