import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface EmergencyContactData {
  name: string;
  relationship: string;
  contactNumber: string;
}

export interface AttenderData {
  name: string;
  phone: string;
  address: string;
  idProofType: string;
  idProofNumber: string;
}

export interface ReferralData {
  doctorReferralChecked: boolean;
  doctorReferralName: string;
  doctorReferralDepartment: string;
  doctorReferralHospital: string;
  patientRelativeChecked: boolean;
  patientRelativeSameDept: boolean;
  patientRelativeOthers: string;
  onlineSearchEngineGoogle: boolean;
  onlineSearchEngineWebsite: boolean;
  onlineSearchEngineOthers: string;
  onlineSocialFacebook: boolean;
  onlineSocialInstagram: boolean;
  onlineSocialWhatsapp: boolean;
  onlineSocialOthers: string;
  offlineTransportBuses: boolean;
  offlineTransportOthers: string;
  offlinePublicTheatres: boolean;
  offlinePublicBanners: boolean;
  offlinePublicBarricades: boolean;
  offlinePublicRoadside: boolean;
  offlinePublicOthers: string;
  offlineSignagesNameBoards: boolean;
  offlineSignagesPamphlets: boolean;
  offlineSignagesOthers: string;
  offlineMassTv: boolean;
  offlineMassFm: boolean;
  offlineMassNewspapers: boolean;
  offlineMassOthers: string;
  offlineGatheringsHealthCamps: boolean;
  offlineGatheringsAwareness: boolean;
  offlineGatheringsOthers: string;
}

export interface CreatePatientPayload {
  patient_name: string;
  dob: string;
  gender: string;
  blood_group: string;
  mobile: string;
  email: string;
  address: string;
  postal_code: string;
  photo?: string | null;
  id_proof_type: string;
  id_proof_number: string;
  status: string;
  emergency_contact: {
    name: string;
    relationship: string;
    contact_number: string;
  };
  attender: {
    name: string;
    phone: string;
    address: string;
    id_proof_type: string;
    id_proof_number: string;
  };
  referral: {
    [key: string]: boolean | string;
  };
}

export interface PatientResponse {
  id: number;
  uhid: string;
  patientName: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup: string;
  mobile: string;
  email: string;
  address: string;
  postalCode: string;
  photo: string | null;
  idProofType: string;
  idProofNumber: string;
  status: string;
  emergencyContact: EmergencyContactData;
  attender: AttenderData;
  referral: ReferralData;
}

export interface PatientSummary {
  id: number;
  uhid: string;
  patientName: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup: string;
  mobile: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PatientListParams {
  q?: string;
  gender?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedPatientResult {
  items: PatientResponse[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface PatientServiceType {
  createPatient(data: CreatePatientPayload): Promise<PatientResponse>;
  getPatients(params?: PatientListParams): Promise<PagedPatientResult>;
  getPatientById(id: number): Promise<PatientResponse>;
  updatePatient(id: number, data: CreatePatientPayload): Promise<PatientResponse>;
  searchPatients(query: string, limit?: number): Promise<PatientSummary[]>;
}

const toNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePagedPatients = (
  payload: unknown,
  params: PatientListParams
): PagedPatientResult => {
  // Backward-compatible shape: API may still return PatientResponse[] directly.
  if (Array.isArray(payload)) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalRecords = payload.length;
    return {
      items: payload as PatientResponse[],
      page,
      pageSize,
      totalRecords,
      totalPages: totalRecords === 0 ? 0 : Math.ceil(totalRecords / pageSize),
    };
  }

  const data = (payload ?? {}) as Record<string, unknown>;
  const items = (data.items ?? data.Items ?? []) as PatientResponse[];
  const page = toNumber(data.page ?? data.Page, params.page ?? 1);
  const pageSize = toNumber(data.pageSize ?? data.PageSize, params.pageSize ?? 10);
  const totalRecords = toNumber(data.totalRecords ?? data.TotalRecords, items.length);
  const totalPages = toNumber(
    data.totalPages ?? data.TotalPages,
    totalRecords === 0 ? 0 : Math.ceil(totalRecords / pageSize)
  );

  return {
    items,
    page,
    pageSize,
    totalRecords,
    totalPages,
  };
};

const patientService: PatientServiceType = {
  async createPatient(data: CreatePatientPayload): Promise<PatientResponse> {
    try {
      const response = await apiClient.post<ApiResponse<PatientResponse>>('/api/patients', data);
      return response.data.data;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to create patient'
      );
    }
  },

  async getPatients(params: PatientListParams = {}): Promise<PagedPatientResult> {
    try {
      const response = await apiClient.get<ApiResponse<PagedPatientResult>>('/api/patients', {
        params,
      });
      return normalizePagedPatients(response.data.data, params);
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to fetch patients'
      );
    }
  },

  async getPatientById(id: number): Promise<PatientResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PatientResponse>>(`/api/patients/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to fetch patient'
      );
    }
  },

  async updatePatient(id: number, data: CreatePatientPayload): Promise<PatientResponse> {
    try {
      const response = await apiClient.put<ApiResponse<PatientResponse>>(`/api/patients/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to update patient'
      );
    }
  },

  async searchPatients(query: string, limit = 10): Promise<PatientSummary[]> {
    try {
      const response = await apiClient.get<ApiResponse<PatientSummary[]>>('/api/patients/search', {
        params: { q: query, limit },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Failed to search patients'
      );
    }
  },
};

export default patientService;
