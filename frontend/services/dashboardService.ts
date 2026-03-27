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
  visitType: string;
  rate: number;
}

class DashboardService {
  async getMetrics(days = 7): Promise<DashboardMetrics> {
    const response = await apiClient.get('/api/dashboard/metrics', {
      params: { days },
    });

    return response.data?.data as DashboardMetrics;
  }

  async getRevenueRates(): Promise<RevenueRate[]> {
    const response = await apiClient.get('/api/dashboard/revenue-rates');
    return (response.data?.data ?? []) as RevenueRate[];
  }

  async updateRevenueRates(rates: RevenueRate[]): Promise<RevenueRate[]> {
    const response = await apiClient.put('/api/dashboard/revenue-rates', {
      rates,
    });
    return (response.data?.data ?? []) as RevenueRate[];
  }
}

export default new DashboardService();
