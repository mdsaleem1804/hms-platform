import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const patientService = {
  getAll: () => apiClient.get('/api/patients'),
  getById: (id: string) => apiClient.get(`/api/patients/${id}`),
  create: (data: unknown) => apiClient.post('/api/patients', data),
  update: (id: string, data: unknown) => apiClient.put(`/api/patients/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/patients/${id}`),
};

export const appointmentService = {
  getAll: () => apiClient.get('/api/appointments'),
  getById: (id: string) => apiClient.get(`/api/appointments/${id}`),
  create: (data: unknown) => apiClient.post('/api/appointments', data),
  update: (id: string, data: unknown) => apiClient.put(`/api/appointments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/appointments/${id}`),
};

export default apiClient;
