import axios, { AxiosInstance } from 'axios';
import { debugApiResponse, mapPatient, mapPatientSummary } from '@/lib/apiMappers';
import { handleApiError, handleApiResponse } from '@/lib/apiFeedback';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export interface AppointmentResponse {
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
}

export interface BillingResponse {
  id: string;
  billNumber: string;
  patientId: number;
  patientName: string;
  patientUhid: string;
  appointmentId: string | null;
  visitType: string;
  doctorId: string;
  doctorName: string;
  date: string;
  subtotal: number;
  discount: number;
  tax: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: string;
  paymentMode: string;
  transactionId: string | null;
  createdAt: string;
}

export interface PatientResponse {
  id: number;
  createdAt: string;
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
  previousAppointments?: AppointmentResponse[];
  currentAppointment?: AppointmentResponse | null;
  opdBillings?: BillingResponse[];
  ecgBillings?: BillingResponse[];
  xrayBillings?: BillingResponse[];
  labBillings?: BillingResponse[];
  ipBillings?: BillingResponse[];
}

export interface MedicalHistoryResponse {
  id: string;
  patientId: number;
  knownAllergies?: string;
  hasDrugAllergy: boolean;
  hasFoodAllergy: boolean;
  allergySeverity?: string;
  chronicConditions?: string;
  isDiabetic: boolean;
  isHypertensive: boolean;
  hasHeartDisease: boolean;
  hasAsthma: boolean;
  hasKidneyDisease: boolean;
  hasThyroidDisease: boolean;
  familyHistoryOfDiabetes?: string;
  familyHistoryOfHeartDisease?: string;
  familyHistoryOfCancer?: string;
  otherFamilyHistory?: string;
  previousSurgeries?: string;
  vaccinations?: string;
  isSmoker: boolean;
  usesAlcohol: boolean;
  exerciseFrequency?: string;
  pastMedications?: string;
  currentMedications?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VitalSignsResponse {
  id: string;
  patientId: number;
  temperature?: number;
  systolicBP?: number;
  diastolicBP?: number;
  pulseRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
  recordedByUserId?: string;
  recordedByUserName?: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationMedicalResponse {
  id: string;
  patientId: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  reason?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  prescribedByDoctorId?: string;
  prescribedByDoctorName?: string;
  prescriptionDate?: string;
  sideEffects?: string;
  contraindications?: string;
  instructions?: string;
  isMandatory?: boolean;
  refillCount?: number;
  refillsRemaining?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LabReportMedicalResponse {
  id: string;
  patientId: number;
  reportNumber: string;
  testName: string;
  testCategory: string;
  testDate: string;
  resultDate?: string;
  status: string;
  testResult?: string;
  isAbnormal: boolean;
  abnormalityReason?: string;
  normalRange?: string;
  reportFilePath?: string;
  orderedByDoctorId?: string;
  orderedByDoctorName?: string;
  referenceLab?: string;
  cost?: number;
  notes?: string;
  recommendations?: string;
  isPatientCritical: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressNoteMedicalResponse {
  id: string;
  patientId: number;
  title: string;
  noteType: string;
  noteContent: string;
  diagnosis?: string;
  treatmentPlan?: string;
  observations?: string;
  recommendations?: string;
  isCritical: boolean;
  enteredByUserId?: string;
  enteredByUserName?: string;
  enteredByUserRole?: string;
  notedAt: string;
  signature?: string;
  attachedFilePath?: string;
  isConfidential: boolean;
  acknowledgedByDoctorId?: string;
  acknowledgedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionDetailsResponse {
  id: string;
  patientId: number;
  admissionNumber: string;
  department: string;
  assignedDoctorId: string;
  assignedDoctorName: string;
  admissionDate: string;
  admissionType: string;
  reasonForAdmission: string;
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  roomNumber?: string;
  bedNumber?: string;
  roomType?: string;
  roomCharges?: number;
  dischargeDate?: string;
  dischargeStatus?: string;
  dischargeNotes?: string;
  followUpInstructions?: string;
  referredFrom?: string;
  referredTo?: string;
  specialRequirements?: string;
  requiresICU: boolean;
  isEmergency: boolean;
  createdAt: string;
  updatedAt: string;
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
  getPatientDetailsById(id: number): Promise<PatientResponse>;
  getMedicalHistory(id: number): Promise<MedicalHistoryResponse | null>;
  getVitalSigns(id: number, limit?: number): Promise<VitalSignsResponse[]>;
  getMedications(id: number, isActive?: boolean): Promise<MedicationMedicalResponse[]>;
  getLabReports(id: number, status?: string): Promise<LabReportMedicalResponse[]>;
  getProgressNotes(id: number, limit?: number): Promise<ProgressNoteMedicalResponse[]>;
  getCurrentAdmission(id: number): Promise<AdmissionDetailsResponse | null>;
  getAdmissionHistory(id: number): Promise<AdmissionDetailsResponse[]>;
  updatePatient(id: number, data: CreatePatientPayload): Promise<PatientResponse>;
  searchPatients(query: string, limit?: number): Promise<PatientSummary[]>;
}

const mapBilling = (apiData: unknown): BillingResponse => {
  const source = (apiData ?? {}) as Record<string, unknown>;
  return {
    id: String(source.id ?? source.Id ?? ''),
    billNumber: String(source.billNumber ?? source.BillNumber ?? ''),
    patientId: Number(source.patientId ?? source.PatientId ?? 0),
    patientName: String(source.patientName ?? source.PatientName ?? ''),
    patientUhid: String(source.patientUhid ?? source.PatientUhid ?? ''),
    appointmentId: source.appointmentId ? String(source.appointmentId) : null,
    visitType: String(source.visitType ?? source.VisitType ?? ''),
    doctorId: String(source.doctorId ?? source.DoctorId ?? ''),
    doctorName: String(source.doctorName ?? source.DoctorName ?? ''),
    date: String(source.date ?? source.Date ?? ''),
    subtotal: Number(source.subtotal ?? source.Subtotal ?? 0),
    discount: Number(source.discount ?? source.Discount ?? 0),
    tax: Number(source.tax ?? source.Tax ?? 0),
    netAmount: Number(source.netAmount ?? source.NetAmount ?? 0),
    paidAmount: Number(source.paidAmount ?? source.PaidAmount ?? 0),
    balanceAmount: Number(source.balanceAmount ?? source.BalanceAmount ?? 0),
    status: String(source.status ?? source.Status ?? ''),
    paymentMode: String(source.paymentMode ?? source.PaymentMode ?? ''),
    transactionId: source.transactionId ? String(source.transactionId) : null,
    createdAt: String(source.createdAt ?? source.CreatedAt ?? ''),
  };
};

const mapPatientDetails = (apiData: unknown): PatientResponse => {
  const source = (apiData ?? {}) as Record<string, unknown>;
  const base = mapPatient(apiData) as PatientResponse;

  const previousAppointments = Array.isArray(source.previousAppointments)
    ? source.previousAppointments.map((item) => mapAppointment(item) as AppointmentResponse)
    : Array.isArray(source.PreviousAppointments)
      ? (source.PreviousAppointments as unknown[]).map((item) => mapAppointment(item) as AppointmentResponse)
      : [];

  const currentAppointmentRaw = source.currentAppointment ?? source.CurrentAppointment;
  const currentAppointment = currentAppointmentRaw
    ? (mapAppointment(currentAppointmentRaw) as AppointmentResponse)
    : null;

  const mapBillingList = (camelKey: string, pascalKey: string): BillingResponse[] => {
    const value = source[camelKey] ?? source[pascalKey];
    return Array.isArray(value) ? value.map((item) => mapBilling(item)) : [];
  };

  return {
    ...base,
    previousAppointments,
    currentAppointment,
    opdBillings: mapBillingList('opdBillings', 'OpdBillings'),
    ecgBillings: mapBillingList('ecgBillings', 'EcgBillings'),
    xrayBillings: mapBillingList('xrayBillings', 'XrayBillings'),
    labBillings: mapBillingList('labBillings', 'LabBillings'),
    ipBillings: mapBillingList('ipBillings', 'IpBillings'),
  };
};

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
      items: payload.map((item) => mapPatient(item) as PatientResponse),
      page,
      pageSize,
      totalRecords,
      totalPages: totalRecords === 0 ? 0 : Math.ceil(totalRecords / pageSize),
    };
  }

  const data = (payload ?? {}) as Record<string, unknown>;
  const rawItems = data.items ?? data.Items ?? [];
  const items = Array.isArray(rawItems)
    ? rawItems.map((item) => mapPatient(item) as PatientResponse)
    : [];
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
      debugApiResponse('patients.create', response.data);
      handleApiResponse(response, {
        successToastId: 'patient:create:success',
        errorToastId: 'patient:create:error',
        includeUhidOnSuccess: true,
      });
      return mapPatient(response.data?.data) as PatientResponse;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to create patient',
        toastId: 'patient:create:error',
      });
      throw new Error(message);
    }
  },

  async getPatients(params: PatientListParams = {}): Promise<PagedPatientResult> {
    try {
      const response = await apiClient.get<ApiResponse<PagedPatientResult>>('/api/patients', {
        params,
      });
      debugApiResponse('patients.list', response.data);
      return normalizePagedPatients(response.data?.data, params);
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch patients',
        toastId: 'patient:list:error',
      });
      throw new Error(message);
    }
  },

  async getPatientById(id: number): Promise<PatientResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PatientResponse>>(`/api/patients/${id}`);
      debugApiResponse('patients.detail', response.data);
      return mapPatient(response.data?.data) as PatientResponse;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch patient',
        toastId: 'patient:detail:error',
      });
      throw new Error(message);
    }
  },

  async getPatientDetailsById(id: number): Promise<PatientResponse> {
    try {
      const response = await apiClient.get<ApiResponse<PatientResponse>>(`/api/patients/${id}/details`);
      debugApiResponse('patients.details', response.data);
      return mapPatientDetails(response.data?.data);
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch patient details',
        toastId: 'patient:details:error',
      });
      throw new Error(message);
    }
  },

  async getMedicalHistory(id: number): Promise<MedicalHistoryResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<MedicalHistoryResponse | null>>(`/api/patients/${id}/medical-history`);
      debugApiResponse('patients.medicalHistory', response.data);
      return response.data?.data ?? null;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch medical history',
        toastId: 'patient:medical-history:error',
      });
      throw new Error(message);
    }
  },

  async getVitalSigns(id: number, limit = 50): Promise<VitalSignsResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<VitalSignsResponse[]>>(`/api/patients/${id}/vitals`, {
        params: { limit },
      });
      debugApiResponse('patients.vitals', response.data);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch vital signs',
        toastId: 'patient:vitals:error',
      });
      throw new Error(message);
    }
  },

  async getMedications(id: number, isActive?: boolean): Promise<MedicationMedicalResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<MedicationMedicalResponse[]>>(`/api/patients/${id}/medications`, {
        params: isActive === undefined ? undefined : { isActive },
      });
      debugApiResponse('patients.medications', response.data);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch medications',
        toastId: 'patient:medications:error',
      });
      throw new Error(message);
    }
  },

  async getLabReports(id: number, status?: string): Promise<LabReportMedicalResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<LabReportMedicalResponse[]>>(`/api/patients/${id}/lab-reports`, {
        params: status ? { status } : undefined,
      });
      debugApiResponse('patients.labReports', response.data);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch lab reports',
        toastId: 'patient:lab-reports:error',
      });
      throw new Error(message);
    }
  },

  async getProgressNotes(id: number, limit = 100): Promise<ProgressNoteMedicalResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<ProgressNoteMedicalResponse[]>>(`/api/patients/${id}/progress-notes`, {
        params: { limit },
      });
      debugApiResponse('patients.progressNotes', response.data);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch progress notes',
        toastId: 'patient:progress-notes:error',
      });
      throw new Error(message);
    }
  },

  async getCurrentAdmission(id: number): Promise<AdmissionDetailsResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<AdmissionDetailsResponse | null>>(`/api/patients/${id}/admissions/current`);
      debugApiResponse('patients.currentAdmission', response.data);
      return response.data?.data ?? null;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch current admission',
        toastId: 'patient:current-admission:error',
      });
      throw new Error(message);
    }
  },

  async getAdmissionHistory(id: number): Promise<AdmissionDetailsResponse[]> {
    try {
      const response = await apiClient.get<ApiResponse<AdmissionDetailsResponse[]>>(`/api/patients/${id}/admissions/history`);
      debugApiResponse('patients.admissionHistory', response.data);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to fetch admission history',
        toastId: 'patient:admission-history:error',
      });
      throw new Error(message);
    }
  },

  async updatePatient(id: number, data: CreatePatientPayload): Promise<PatientResponse> {
    try {
      const response = await apiClient.put<ApiResponse<PatientResponse>>(`/api/patients/${id}`, data);
      debugApiResponse('patients.update', response.data);
      handleApiResponse(response, {
        successToastId: 'patient:update:success',
        errorToastId: 'patient:update:error',
      });
      return mapPatient(response.data?.data) as PatientResponse;
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to update patient',
        toastId: 'patient:update:error',
      });
      throw new Error(message);
    }
  },

  async searchPatients(query: string, limit = 10): Promise<PatientSummary[]> {
    try {
      const response = await apiClient.get<ApiResponse<PatientSummary[]>>('/api/patients/search', {
        params: { q: query, limit },
      });
      debugApiResponse('patients.search', response.data);
      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      return list.map((item) => mapPatientSummary(item) as PatientSummary);
    } catch (error) {
      const message = handleApiError(error, {
        fallbackMessage: 'Failed to search patients',
        toastId: 'patient:search:error',
      });
      throw new Error(message);
    }
  },
};

export default patientService;
