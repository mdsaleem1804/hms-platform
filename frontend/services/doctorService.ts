import { apiClient } from '@/lib/api';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  mobile: string;
  departmentId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorSummary {
  id: string;
  name: string;
  specialization: string;
  departmentId: string;
}

export interface CreateDoctorRequest {
  name: string;
  specialization: string;
  mobile: string;
  departmentId: string;
}

class DoctorService {
  async getAll(): Promise<DoctorSummary[]> {
    try {
      const response = await apiClient.get<any>('/api/doctors');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Doctor> {
    try {
      const response = await apiClient.get<any>(`/api/doctors/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch doctor ${id}:`, error);
      throw error;
    }
  }

  async getByDepartmentId(departmentId: string): Promise<DoctorSummary[]> {
    try {
      const response = await apiClient.get<any>(`/api/doctors/by-department/${departmentId}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch doctors for department ${departmentId}:`, error);
      throw error;
    }
  }

  async create(request: CreateDoctorRequest): Promise<Doctor> {
    try {
      const response = await apiClient.post<any>('/api/doctors', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create doctor:', error);
      throw error;
    }
  }

  async update(id: string, request: CreateDoctorRequest): Promise<void> {
    try {
      await apiClient.put(`/api/doctors/${id}`, request);
    } catch (error) {
      console.error(`Failed to update doctor ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/doctors/${id}`);
    } catch (error) {
      console.error(`Failed to delete doctor ${id}:`, error);
      throw error;
    }
  }

  async searchDoctors(query: string, limit: number = 5): Promise<DoctorSummary[]> {
    try {
      if (!query.trim()) {
        return [];
      }
      const response = await apiClient.get<any>('/api/doctors/search', {
        params: {
          query: query.trim(),
          limit
        }
      });
      return (response.data.data || []).slice(0, limit);
    } catch (error) {
      console.error('Failed to search doctors:', error);
      return [];
    }
  }
}

export default new DoctorService();
