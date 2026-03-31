import { apiClient } from '@/lib/api';

export interface DoctorServiceRateDto {
  id: string;
  doctorId: string;
  serviceName: string;
  serviceDescription: string | null;
  rate: number;
  isActive: boolean;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo: string | null; // YYYY-MM-DD or null
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateDoctorServiceRateDto {
  doctorId: string;
  serviceName: string;
  serviceDescription?: string;
  rate: number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string | null; // YYYY-MM-DD or null
}

export interface DoctorServiceRateSummaryDto {
  id: string;
  doctorId: string;
  serviceName: string;
  rate: number;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export interface PaginatedDoctorServiceRates {
  items: DoctorServiceRateSummaryDto[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

const doctorServiceRateService = {
  /**
   * Get all doctor service rates with pagination
   */
  async getAllRates(page: number = 1, pageSize: number = 10): Promise<PaginatedDoctorServiceRates> {
    try {
      const response = await apiClient.get(`/api/DoctorServiceRates?page=${page}&pageSize=${pageSize}`);
      return response.data?.data || { items: [], page, pageSize, totalRecords: 0, totalPages: 0 };
    } catch (error) {
      console.error('Error fetching doctor service rates:', error);
      return { items: [], page, pageSize, totalRecords: 0, totalPages: 0 };
    }
  },

  /**
   * Get service rates for a specific doctor
   */
  async getRatesByDoctor(doctorId: string): Promise<DoctorServiceRateSummaryDto[]> {
    try {
      console.log('[DoctorServiceRateService] Fetching rates for doctor:', doctorId);
      const response = await apiClient.get(`/api/DoctorServiceRates/doctor/${doctorId}`);
      console.log('[DoctorServiceRateService] Response:', response.data);
      const data = response.data?.data || [];
      console.log('[DoctorServiceRateService] Extracted data:', data);
      return data;
    } catch (error) {
      console.error(`[DoctorServiceRateService] Error fetching service rates for doctor ${doctorId}:`, error);
      return [];
    }
  },

  /**
   * Get the active rate for a doctor and service on a specific date
   * If no date is provided, uses today's date
   */
  async getActiveRate(
    doctorId: string,
    serviceName: string,
    date?: string
  ): Promise<number | null> {
    try {
      const queryDate = date || new Date().toISOString().split('T')[0];
      const response = await apiClient.get(
        `/Billing/suggest-rate/${doctorId}/${encodeURIComponent(serviceName)}?date=${queryDate}`
      );
      return response.data?.data?.rate || null;
    } catch (error) {
      console.error(
        `Error fetching active rate for doctor ${doctorId}, service ${serviceName}:`,
        error
      );
      return null;
    }
  },

  /**
   * Get a specific doctor service rate by ID
   */
  async getRateById(id: string): Promise<DoctorServiceRateDto | null> {
    try {
      const response = await apiClient.get(`/api/DoctorServiceRates/${id}`);
      return response.data?.data || null;
    } catch (error) {
      console.error(`Error fetching service rate ${id}:`, error);
      return null;
    }
  },

  /**
   * Create a new doctor service rate
   */
  async createRate(data: CreateDoctorServiceRateDto): Promise<DoctorServiceRateDto | null> {
    try {
      const response = await apiClient.post('/api/DoctorServiceRates', data);
      return response.data?.data || null;
    } catch (error) {
      console.error('Error creating service rate:', error);
      throw error;
    }
  },

  /**
   * Update an existing doctor service rate
   */
  async updateRate(id: string, data: Partial<CreateDoctorServiceRateDto>): Promise<DoctorServiceRateDto | null> {
    try {
      const response = await apiClient.put(`/api/DoctorServiceRates/${id}`, data);
      return response.data?.data || null;
    } catch (error) {
      console.error(`Error updating service rate ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a doctor service rate (soft delete)
   */
  async deleteRate(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api/DoctorServiceRates/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting service rate ${id}:`, error);
      throw error;
    }
  },

  /**
   * Check if a rate exists for a doctor and service
   */
  async checkRateExists(doctorId: string, serviceName: string): Promise<boolean> {
    try {
      const response = await apiClient.head(
        `/api/DoctorServiceRates/${doctorId}/${encodeURIComponent(serviceName)}`
      );
      return response.status === 200;
    } catch (error) {
      // 404 is expected when rate doesn't exist
      if ((error as any)?.response?.status === 404) {
        return false;
      }
      console.error('Error checking rate existence:', error);
      return false;
    }
  },
};

export default doctorServiceRateService;
