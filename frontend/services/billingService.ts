import { apiClient } from '@/lib/api';

export interface BillingItem {
  id: string;
  serviceName: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface BillingRecord {
  id: string;
  billNumber: string;
  patientId: number;
  patientName: string;
  patientUhid: string;
  appointmentId?: string | null;
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
  status: 'Paid' | 'Pending' | 'Partial';
  paymentMode: string;
  transactionId?: string | null;
  createdAt: string;
  items: BillingItem[];
}

export interface BillingListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  doctorId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PagedBillingResult {
  items: BillingRecord[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

const toNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeBillingRecord = (raw: Record<string, unknown>): BillingRecord => {
  const paidAmount = toNumber(raw.paidAmount ?? raw.PaidAmount, 0);
  const netAmount = toNumber(raw.netAmount ?? raw.NetAmount, 0);

  let status = String(raw.status ?? raw.Status ?? '').trim();
  if (!status) {
    status = paidAmount <= 0 ? 'Pending' : paidAmount >= netAmount ? 'Paid' : 'Partial';
  }

  const rawItems = raw.items ?? raw.Items ?? [];
  const items: BillingItem[] = Array.isArray(rawItems)
    ? rawItems.map((item) => {
        const row = (item ?? {}) as Record<string, unknown>;
        return {
          id: String(row.id ?? row.Id ?? ''),
          serviceName: String(row.serviceName ?? row.ServiceName ?? ''),
          qty: toNumber(row.qty ?? row.Qty, 0),
          rate: toNumber(row.rate ?? row.Rate, 0),
          amount: toNumber(row.amount ?? row.Amount, 0),
        };
      })
    : [];

  return {
    id: String(raw.id ?? raw.Id ?? ''),
    billNumber: String(raw.billNumber ?? raw.BillNumber ?? ''),
    patientId: toNumber(raw.patientId ?? raw.PatientId, 0),
    patientName: String(raw.patientName ?? raw.PatientName ?? ''),
    patientUhid: String(raw.patientUhid ?? raw.PatientUhid ?? ''),
    appointmentId: (raw.appointmentId ?? raw.AppointmentId ?? null) as string | null,
    visitType: String(raw.visitType ?? raw.VisitType ?? ''),
    doctorId: String(raw.doctorId ?? raw.DoctorId ?? ''),
    doctorName: String(raw.doctorName ?? raw.DoctorName ?? ''),
    date: String(raw.date ?? raw.Date ?? ''),
    subtotal: toNumber(raw.subtotal ?? raw.Subtotal, 0),
    discount: toNumber(raw.discount ?? raw.Discount, 0),
    tax: toNumber(raw.tax ?? raw.Tax, 0),
    netAmount,
    paidAmount,
    balanceAmount: toNumber(raw.balanceAmount ?? raw.BalanceAmount, Math.max(0, netAmount - paidAmount)),
    status: status as BillingRecord['status'],
    paymentMode: String(raw.paymentMode ?? raw.PaymentMode ?? ''),
    transactionId: (raw.transactionId ?? raw.TransactionId ?? null) as string | null,
    createdAt: String(raw.createdAt ?? raw.CreatedAt ?? ''),
    items,
  };
};

const normalizePagedBilling = (payload: unknown, params: BillingListParams): PagedBillingResult => {
  if (Array.isArray(payload)) {
    const items = payload.map((item) => normalizeBillingRecord((item ?? {}) as Record<string, unknown>));
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const totalRecords = items.length;
    return {
      items,
      page,
      pageSize,
      totalRecords,
      totalPages: totalRecords === 0 ? 0 : Math.ceil(totalRecords / pageSize),
    };
  }

  const data = (payload ?? {}) as Record<string, unknown>;
  const rawItems = data.items ?? data.Items ?? [];
  const items = Array.isArray(rawItems)
    ? rawItems.map((item) => normalizeBillingRecord((item ?? {}) as Record<string, unknown>))
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

class BillingService {
  async getBillings(params: BillingListParams = {}): Promise<PagedBillingResult> {
    const response = await apiClient.get('/api/billing', { params });
    return normalizePagedBilling(response.data?.data, params);
  }

  async getAll(): Promise<BillingRecord[]> {
    const result = await this.getBillings({ page: 1, pageSize: 100 });
    return result.items;
  }

  async getById(id: string): Promise<BillingRecord> {
    const response = await apiClient.get(`/api/billing/${id}`);
    return normalizeBillingRecord((response.data?.data ?? {}) as Record<string, unknown>);
  }

  async getByBillNumber(billNumber: string): Promise<BillingRecord> {
    const response = await apiClient.get(`/api/billing/by-number/${billNumber}`);
    return normalizeBillingRecord((response.data?.data ?? {}) as Record<string, unknown>);
  }

  async create(data: Record<string, unknown>): Promise<BillingRecord> {
    const response = await apiClient.post('/api/billing', data);
    return normalizeBillingRecord((response.data?.data ?? {}) as Record<string, unknown>);
  }

  async update(id: string, data: Record<string, unknown>): Promise<BillingRecord> {
    const response = await apiClient.put(`/api/billing/${id}`, data);
    return normalizeBillingRecord((response.data?.data ?? {}) as Record<string, unknown>);
  }

  async cancel(id: string): Promise<void> {
    await apiClient.delete(`/api/billing/${id}/cancel`);
  }
}

export default new BillingService();
