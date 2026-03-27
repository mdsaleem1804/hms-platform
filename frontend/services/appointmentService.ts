import { apiClient } from '@/lib/api';

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

class AppointmentService {
  async getAll(): Promise<Appointment[]> {
    const response = await apiClient.get<any>('/api/appointments');
    return response.data.data || [];
  }

  async getById(id: string): Promise<Appointment> {
    const response = await apiClient.get<any>(`/api/appointments/${id}`);
    return response.data.data;
  }

  async getByDisplayId(displayId: number): Promise<Appointment> {
    const response = await apiClient.get<any>(`/api/appointments/by-number/${displayId}`);
    return response.data.data;
  }

  async create(request: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post<any>('/api/appointments', request);
    return response.data.data;
  }

  async update(id: string, request: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.put<any>(`/api/appointments/${id}`, request);
    return response.data.data;
  }
}

export default new AppointmentService();