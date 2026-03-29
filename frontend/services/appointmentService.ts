import { apiClient } from '@/lib/api';
import { debugApiResponse, mapAppointment } from '@/lib/apiMappers';
import { handleApiError, handleApiResponse } from '@/lib/apiFeedback';

export interface AppointmentReminder {
  id: string;
  channel: string;
  timing: string;
}

export interface CreateAppointmentReminderRequest {
  channel: string;
  timing: string;
}

export interface Appointment {
  id: string;
  displayId: number;
  appointmentNo: string;
  patientId: number;
  patientUhid: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  departmentId: string;
  departmentName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  tokenNumber: number;
  status: string;
  visitType: string;
  priority: string;
  notes: string;
  opdPaymentStatus: string;
  createdAt: string;
  reminders: AppointmentReminder[];
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: string;
  departmentId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  visitType: string;
  status: string;
  priority: string;
  notes: string;
  reminders: CreateAppointmentReminderRequest[];
}

export interface AppointmentListParams {
  q?: string;
  status?: string;
  doctorId?: string;
  departmentId?: string;
  fromDate?: string;
  toDate?: string;
}

class AppointmentService {
  async getAll(params: AppointmentListParams = {}): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<any>('/api/appointments', {
        params: {
          q: params.q || undefined,
          status: params.status || undefined,
          doctorId: params.doctorId || undefined,
          departmentId: params.departmentId || undefined,
          fromDate: params.fromDate || undefined,
          toDate: params.toDate || undefined,
        },
      });
      debugApiResponse('appointments.list', response.data);
      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      return items.map((item: unknown) => mapAppointment(item) as Appointment);
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch appointments',
        toastId: 'appointment:list:error',
      });
      throw new Error(message);
    }
  }

  async getById(id: string): Promise<Appointment> {
    try {
      const response = await apiClient.get<any>(`/api/appointments/${id}`);
      debugApiResponse('appointments.detail', response.data);
      return mapAppointment(response.data?.data) as Appointment;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch appointment details',
        toastId: 'appointment:detail:error',
      });
      throw new Error(message);
    }
  }

  async getByDisplayId(displayId: number): Promise<Appointment> {
    try {
      const response = await apiClient.get<any>(`/api/appointments/by-number/${displayId}`);
      debugApiResponse('appointments.detailByNumber', response.data);
      return mapAppointment(response.data?.data) as Appointment;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch appointment details',
        toastId: 'appointment:detail:error',
      });
      throw new Error(message);
    }
  }

  async create(request: CreateAppointmentRequest): Promise<Appointment> {
    try {
      const response = await apiClient.post<any>('/api/appointments', request);
      debugApiResponse('appointments.create', response.data);
      handleApiResponse(response, {
        successToastId: 'appointment:create:success',
        errorToastId: 'appointment:create:error',
      });
      return mapAppointment(response.data?.data) as Appointment;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to create appointment',
        toastId: 'appointment:create:error',
      });
      throw new Error(message);
    }
  }

  async update(id: string, request: CreateAppointmentRequest): Promise<Appointment> {
    try {
      const response = await apiClient.put<any>(`/api/appointments/${id}`, request);
      debugApiResponse('appointments.update', response.data);
      handleApiResponse(response, {
        successToastId: 'appointment:update:success',
        errorToastId: 'appointment:update:error',
      });
      return mapAppointment(response.data?.data) as Appointment;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to update appointment',
        toastId: 'appointment:update:error',
      });
      throw new Error(message);
    }
  }
}

export default new AppointmentService();