'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { PatientSearch } from '@/components/billing/PatientSearch';
import { ServiceTable } from '@/components/billing/ServiceTable';
import { BillSummary } from '@/components/billing/BillSummary';
import { PaymentSection } from '@/components/billing/PaymentSection';
import {
  BillingDraft,
  BillingPatientSummary,
  BillingServiceItem,
  DiscountType,
  PaymentMode,
  VisitType,
} from '@/components/billing/types';
import appointmentService, { Appointment } from '@/services/appointmentService';
import billingService, { BillingRecord } from '@/services/billingService';
import departmentService, { DepartmentSummary } from '@/services/departmentService';
import doctorService, { DoctorSummary } from '@/services/doctorService';
import dashboardService from '@/services/dashboardService';

const TODAY = new Date().toISOString().slice(0, 10);

const VISIT_TYPE_OPTIONS: Array<{ value: VisitType; label: string }> = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'procedure', label: 'Procedure' },
];

const defaultServiceItem = (service = 'Consultation Fee', rate = 0): BillingServiceItem => ({
  id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  service,
  qty: 1,
  rate,
  amount: rate,
});

const calculateSubtotal = (items: BillingServiceItem[]) =>
  items.reduce((sum, item) => sum + item.amount, 0);

const calculateDiscount = (subtotal: number, discountType: DiscountType, discountValue: number) => {
  const value = Math.max(0, discountValue || 0);
  if (discountType === 'percentage') {
    return Math.min(subtotal, (subtotal * Math.min(100, value)) / 100);
  }

  return Math.min(subtotal, value);
};

export default function CreateOpdBillingPage() {
  const router = useRouter();
  const [patient, setPatient] = useState<BillingPatientSummary | null>(null);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [recentBills, setRecentBills] = useState<BillingRecord[]>([]);
  const [ratesByVisitType, setRatesByVisitType] = useState<Record<string, number>>({});

  const [billing, setBilling] = useState<BillingDraft>({
    patientId: null,
    visitType: 'consultation',
    departmentId: '',
    doctorId: '',
    date: TODAY,
    appointmentId: '',
    items: [defaultServiceItem('Consultation Fee', 0)],
    discountType: 'amount',
    discountValue: 0,
    tax: 0,
    paymentMode: 'cash',
    paidAmount: 0,
    transactionId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [allDepartments, allDoctors, allAppointments, revenueRates, allBills] = await Promise.all([
          departmentService.getAll(),
          doctorService.getAll(),
          appointmentService.getAll(),
          dashboardService.getRevenueRates(),
          billingService.getAll(),
        ]);

        if (!active) return;

        setDepartments(allDepartments);
        setDoctors(allDoctors);
        setAppointments(allAppointments);
        setRecentBills(allBills.slice(0, 5));

        const map: Record<string, number> = {};
        for (const rate of revenueRates) {
          map[rate.visitType.toLowerCase()] = Number(rate.rate) || 0;
        }
        setRatesByVisitType(map);
      } catch (error) {
        console.error('Failed to load OPD billing reference data', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // Keep a default consultation-fee row aligned with selected visit type rate.
    const rate = ratesByVisitType[billing.visitType] ?? 0;
    setBilling((prev) => {
      if (!prev.items.length) {
        return { ...prev, items: [defaultServiceItem('Consultation Fee', rate)] };
      }

      const [first, ...rest] = prev.items;
      if (first.service.trim().toLowerCase() !== 'consultation fee') {
        return prev;
      }

      const updatedFirst: BillingServiceItem = {
        ...first,
        qty: first.qty || 1,
        rate,
        amount: (first.qty || 1) * rate,
      };

      return {
        ...prev,
        items: [updatedFirst, ...rest],
      };
    });
  }, [billing.visitType, ratesByVisitType]);

  const availableDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.departmentId === billing.departmentId),
    [doctors, billing.departmentId]
  );

  const patientAppointments = useMemo(() => {
    if (!patient?.id) return [];
    return appointments.filter((appointment) => appointment.patientId === patient.id);
  }, [appointments, patient?.id]);

  const subtotal = useMemo(() => calculateSubtotal(billing.items), [billing.items]);
  const discount = useMemo(
    () => calculateDiscount(subtotal, billing.discountType, billing.discountValue),
    [subtotal, billing.discountType, billing.discountValue]
  );
  const tax = Math.max(0, Number(billing.tax) || 0);
  const netAmount = Math.max(0, subtotal - discount + tax);
  const paidAmount = Math.max(0, Number(billing.paidAmount) || 0);
  const balanceAmount = Math.max(0, netAmount - paidAmount);

  const patchBilling = <K extends keyof BillingDraft>(key: K, value: BillingDraft[K]) => {
    setBilling((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key as string]: '' }));
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!patient?.id) nextErrors.patientId = 'Patient is required';
    if (!billing.departmentId) nextErrors.departmentId = 'Department is required';
    if (!billing.doctorId) nextErrors.doctorId = 'Doctor is required';
    if (!billing.date) nextErrors.date = 'Date is required';

    const validItems = billing.items.filter((item) => item.service.trim().length > 0 && item.qty > 0 && item.rate >= 0);
    if (!validItems.length) nextErrors.items = 'At least one valid billing item is required';

    if (netAmount <= 0) nextErrors.netAmount = 'Net amount must be greater than 0';
    if ((billing.paymentMode === 'upi' || billing.paymentMode === 'card') && !billing.transactionId.trim()) {
      nextErrors.transactionId = 'Transaction ID is required for UPI/Card';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => {
    // Filter out items with empty service names
    const validItems = billing.items.filter((item) => item.service.trim());
    
    // Recalculate subtotal from valid items only
    const validSubtotal = validItems.reduce((sum, item) => sum + item.amount, 0);
    const validDiscount = calculateDiscount(validSubtotal, billing.discountType, billing.discountValue);
    const validNet = validSubtotal - validDiscount + billing.tax;

    return {
      patientId: patient?.id ?? null,
      appointmentId: billing.appointmentId || null,
      visitType: billing.visitType,
      doctorId: billing.doctorId,
      date: billing.date,
      items: validItems.map((item) => ({
        serviceName: item.service.trim(),
        qty: item.qty,
        rate: item.rate,
      })),
      discountType: billing.discountType,
      discountValue: billing.discountValue,
      tax: billing.tax,
      netAmount: validNet,
      paymentMode: billing.paymentMode,
      paidAmount,
      transactionId: billing.transactionId || null,
    };
  };

  const onSave = async (printAfterSave: boolean) => {
    if (!validate()) return;

    const payload = buildPayload();
    
    try {
      setLoading(true);
      const createdBill = await billingService.create(payload);
      
      toast.success(`Bill ${createdBill.billNumber} created successfully!`);
      
      if (printAfterSave) {
        // Redirect to print view
        router.push(`/billing/opd/view/${createdBill.id}?print=true`);
      } else {
        // Redirect to bill view or back to list
        router.push(`/billing/opd/view/${createdBill.id}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create bill';
      toast.error(errorMessage);
      console.error('[OPD Billing] Create error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create OPD Bill</h1>
          <p className="text-sm text-gray-500">Fast billing workflow for reception and front desk.</p>
        </div>
        <Link
          href="/billing/opd"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <PatientSearch
            value={patient}
            onSelect={(selected) => {
              setPatient(selected);
              patchBilling('patientId', selected?.id ?? null);
              patchBilling('appointmentId', '');
            }}
          />
          {errors.patientId && <p className="-mt-4 text-xs text-red-600">{errors.patientId}</p>}

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-900">Visit Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Visit Type</label>
                <select
                  value={billing.visitType}
                  onChange={(e) => patchBilling('visitType', e.target.value as VisitType)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {VISIT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Department</label>
                <select
                  value={billing.departmentId}
                  onChange={(e) => {
                    patchBilling('departmentId', e.target.value);
                    patchBilling('doctorId', '');
                  }}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.departmentId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>{department.name}</option>
                  ))}
                </select>
                {errors.departmentId && <p className="mt-1 text-xs text-red-600">{errors.departmentId}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Doctor</label>
                <select
                  value={billing.doctorId}
                  onChange={(e) => patchBilling('doctorId', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.doctorId ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select doctor</option>
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
                {errors.doctorId && <p className="mt-1 text-xs text-red-600">{errors.doctorId}</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Date</label>
                <input
                  type="date"
                  value={billing.date}
                  onChange={(e) => patchBilling('date', e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Linked Appointment (Optional)
                </label>
                <select
                  value={billing.appointmentId}
                  onChange={(e) => patchBilling('appointmentId', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!patient?.id}
                >
                  <option value="">No linked appointment</option>
                  {patientAppointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      #{appointment.displayId} | {appointment.appointmentDate} | {appointment.doctorName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <ServiceTable items={billing.items} onChange={(items) => patchBilling('items', items)} />
          {errors.items && <p className="-mt-4 text-xs text-red-600">{errors.items}</p>}
        </div>

        <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <BillSummary
            subtotal={subtotal}
            discountType={billing.discountType}
            discountValue={billing.discountValue}
            tax={tax}
            netAmount={netAmount}
            onDiscountTypeChange={(value) => patchBilling('discountType', value)}
            onDiscountValueChange={(value) => patchBilling('discountValue', Math.max(0, value))}
            onTaxChange={(value) => patchBilling('tax', Math.max(0, value))}
          />

          <PaymentSection
            paymentMode={billing.paymentMode}
            paidAmount={paidAmount}
            transactionId={billing.transactionId}
            balanceAmount={balanceAmount}
            onPaymentModeChange={(value) => patchBilling('paymentMode', value as PaymentMode)}
            onPaidAmountChange={(value) => patchBilling('paidAmount', Math.max(0, value))}
            onTransactionIdChange={(value) => patchBilling('transactionId', value)}
          />
          {errors.transactionId && <p className="text-xs text-red-600">{errors.transactionId}</p>}
          {errors.netAmount && <p className="text-xs text-red-600">{errors.netAmount}</p>}

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</label>
            <textarea
              value={billing.notes}
              onChange={(e) => patchBilling('notes', e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional billing notes"
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recent Bills</h3>
            <div className="mt-3 space-y-2">
              {recentBills.length === 0 ? (
                <p className="text-xs text-gray-500">No recent bills available.</p>
              ) : (
                recentBills.map((bill) => (
                  <div key={bill.id} className="rounded border border-gray-200 px-2 py-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{bill.billNumber}</span>
                      <span className="text-blue-700">{Number(bill.netAmount).toFixed(2)}</span>
                    </div>
                    <p className="text-gray-600">{bill.patientName} • {bill.paymentMode.toUpperCase()}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSave(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              disabled={loading}
            >
              <Save size={15} />
              Save Bill
            </button>
            <button
              type="button"
              onClick={() => onSave(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              disabled={loading}
            >
              <Printer size={15} />
              Save & Print
            </button>
            <Link
              href="/billing/opd"
              className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
