import { apiClient } from '@/lib/api';

export interface Department {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentSummary {
  id: string;
  name: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
}

class DepartmentService {
  async getAll(): Promise<DepartmentSummary[]> {
    try {
      const response = await apiClient.get<any>('/api/departments');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Department> {
    try {
      const response = await apiClient.get<any>(`/api/departments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch department ${id}:`, error);
      throw error;
    }
  }

  async create(request: CreateDepartmentRequest): Promise<Department> {
    try {
      const response = await apiClient.post<any>('/api/departments', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create department:', error);
      throw error;
    }
  }

  async update(id: string, request: CreateDepartmentRequest): Promise<void> {
    try {
      await apiClient.put(`/api/departments/${id}`, request);
    } catch (error) {
      console.error(`Failed to update department ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/departments/${id}`);
    } catch (error) {
      console.error(`Failed to delete department ${id}:`, error);
      throw error;
    }
  }
}

export default new DepartmentService();
