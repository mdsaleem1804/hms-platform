'use client';

import { useState, useEffect, useCallback } from 'react';
import appointmentService, {
  Appointment,
  AppointmentListParams,
} from '@/services/appointmentService';

export const useAppointments = (params: AppointmentListParams = {}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAll(params);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [
    params.q,
    params.status,
    params.doctorId,
    params.departmentId,
    params.fromDate,
    params.toDate,
  ]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetch: fetchAppointments };
};
