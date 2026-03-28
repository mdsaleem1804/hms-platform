export type VisitType = 'consultation' | 'follow-up' | 'procedure';
export type DiscountType = 'amount' | 'percentage';
export type PaymentMode = 'cash' | 'upi' | 'card';

export interface BillingPatientSummary {
  id: number;
  uhid: string;
  patientName: string;
  dob: string;
  age: number;
  gender: string;
  mobile: string;
}

export interface BillingServiceItem {
  id: string;
  service: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface BillingDraft {
  patientId: number | null;
  visitType: VisitType;
  departmentId: string;
  doctorId: string;
  date: string;
  appointmentId: string;
  items: BillingServiceItem[];
  discountType: DiscountType;
  discountValue: number;
  tax: number;
  paymentMode: PaymentMode;
  paidAmount: number;
  transactionId: string;
  notes: string;
}
