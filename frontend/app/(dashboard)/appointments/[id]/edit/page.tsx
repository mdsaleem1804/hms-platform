'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppointmentForm, { AppointmentFormData } from '@/components/forms/AppointmentForm';
import appointmentService, { AppointmentReminder } from '@/services/appointmentService';
import { notify } from '@/lib/toast';
import { toAppointmentDateInputValue } from '@/lib/appointmentDate';
import { EDIT_WINDOW_MESSAGE, isCreatedToday } from '@/lib/editWindow';

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
        notify.warning('Invalid appointment number', {
          id: 'appointment:edit:invalid-number',
        });
        router.push('/appointments');
        return;
      }

      try {
        setIsLoading(true);
        const appointment = await appointmentService.getByDisplayId(appointmentDisplayId);

        if (!isCreatedToday(appointment.createdAt)) {
          notify.warning(EDIT_WINDOW_MESSAGE, {
            id: 'appointment:edit:outside-window',
          });
          router.push('/appointments');
          return;
        }

        setAppointmentId(appointment.id);

        setInitialData({
          patient_record_id: appointment.patientId,
          patient_name: appointment.patientName,
          patient_id: appointment.patientUhid,
          department: String(appointment.departmentId || ''),
          doctor_id: String(appointment.doctorId || ''),
          appointment_date: toAppointmentDateInputValue(appointment.appointmentDate),
          start_time: formatTime(appointment.startTime),
          end_time: formatTime(appointment.endTime),
          visit_type: appointment.visitType,
          notes: appointment.notes || '',
          priority: appointment.priority || 'normal',
          status: appointment.status || 'scheduled',
          token_number: appointment.tokenNumber ? String(appointment.tokenNumber) : '',
          reminders: mapRemindersToForm(appointment.reminders || []),
        });
      } catch (error: any) {
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
        notify.warning('Appointment record not loaded', {
          id: 'appointment:edit:not-loaded',
        });
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

      router.push('/appointments');
    } catch {
      // Toast is handled centrally by appointmentService.
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