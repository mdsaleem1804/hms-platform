import { apiClient } from '@/lib/api';

export interface DashboardSummary {
  todaysPatients: number;
  todaysAppointments: number;
  revenueToday: number;
}

export interface AppointmentStatusMetric {
  status: string;
  count: number;
}

export interface DailyTrendPoint {
  date: string;
  patients: number;
  appointments: number;
}

export interface DashboardMetrics {
  summary: DashboardSummary;
  appointmentStatusBreakdown: AppointmentStatusMetric[];
  dailyTrends: DailyTrendPoint[];
}

export interface RevenueRate {
  id: string;
  visitType: string;
  rate: number;
}

export interface RevenueRatePayload {
  visitType: string;
  rate: number;
}

export interface HospitalSettings {
  hospitalName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  email: string;
  website: string;
  gstNumber: string;
  registrationNumber: string;
  reportHeaderTagline: string;
  reportFooterNote: string;
}

class DashboardService {
  async getMetrics(days = 7): Promise<DashboardMetrics> {
    const response = await apiClient.get('/api/dashboard/metrics', {
      params: { days },
    });

    return response.data?.data as DashboardMetrics;
  }

  async getRevenueRates(): Promise<RevenueRate[]> {
    const response = await apiClient.get('/api/hospital-rate-settings');
    return (response.data?.data ?? []) as RevenueRate[];
  }

  async updateRevenueRates(rates: RevenueRate[]): Promise<RevenueRate[]> {
    const response = await apiClient.put('/api/hospital-rate-settings', {
      rates,
    });
    return (response.data?.data ?? []) as RevenueRate[];
  }

  async createRevenueRate(payload: RevenueRatePayload): Promise<RevenueRate> {
    const response = await apiClient.post('/api/hospital-rate-settings', payload);
    return (response.data?.data ?? {}) as RevenueRate;
  }

  async updateRevenueRate(id: string, payload: RevenueRatePayload): Promise<RevenueRate> {
    const response = await apiClient.put(`/api/hospital-rate-settings/${id}`, payload);
    return (response.data?.data ?? {}) as RevenueRate;
  }

  async deleteRevenueRate(id: string): Promise<void> {
    await apiClient.delete(`/api/hospital-rate-settings/${id}`);
  }

  async getHospitalSettings(): Promise<HospitalSettings> {
    const response = await apiClient.get('/api/dashboard/hospital-settings');
    return (response.data?.data ?? {}) as HospitalSettings;
  }

  async updateHospitalSettings(payload: HospitalSettings): Promise<HospitalSettings> {
    const response = await apiClient.put('/api/dashboard/hospital-settings', payload);
    return (response.data?.data ?? {}) as HospitalSettings;
  }
}

export default new DashboardService();
