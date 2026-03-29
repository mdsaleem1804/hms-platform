'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Printer, Save } from 'lucide-react';
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
import billingService from '@/services/billingService';
import departmentService, { DepartmentSummary } from '@/services/departmentService';
import doctorService, { DoctorSummary } from '@/services/doctorService';
import dashboardService from '@/services/dashboardService';
import patientService from '@/services/patientService';
import { EDIT_WINDOW_MESSAGE, isCreatedToday } from '@/lib/editWindow';

const TODAY = new Date().toISOString().slice(0, 10);

const toBillingPatientSummary = (patient: Awaited<ReturnType<typeof patientService.getPatientById>>): BillingPatientSummary => ({
  id: patient.id,
  uhid: patient.uhid,
  patientName: patient.patientName,
  dob: patient.dob,
  age: patient.age,
  gender: patient.gender,
  mobile: patient.mobile,
});

const normalizeVisitType = (value: string | null): VisitType => {
  const normalized = (value ?? '').trim().toLowerCase();
  if (normalized.includes('follow')) return 'follow-up';
  if (normalized.includes('procedure')) return 'procedure';
  return 'consultation';
};

const normalizeDateInput = (value: string | null): string => {
  if (!value) return TODAY;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return TODAY;
  return parsed.toISOString().slice(0, 10);
};

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
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const isPrefillAppliedRef = useRef<string>('');
  const isEditAppliedRef = useRef<string>('');
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [isAppointmentLocked, setIsAppointmentLocked] = useState(false);
  const [patient, setPatient] = useState<BillingPatientSummary | null>(null);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
  const [isPatientAccordionOpen, setIsPatientAccordionOpen] = useState(true);
  const [isVisitAccordionOpen, setIsVisitAccordionOpen] = useState(true);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [allDepartments, allDoctors, allAppointments, revenueRates] = await Promise.all([
          departmentService.getAll(),
          doctorService.getAll(),
          appointmentService.getAll(),
          dashboardService.getRevenueRates(),
        ]);

        if (!active) return;

        setDepartments(allDepartments);
        setDoctors(allDoctors);
        setAppointments(allAppointments);

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
      if (!first.service.trim().toLowerCase().includes('consultation fee')) {
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

  useEffect(() => {
    const queryFromHook = searchParams.toString();
    const queryFromWindow = typeof window !== 'undefined'
      ? window.location.search.replace(/^\?/, '')
      : '';
    const rawQuery = queryFromHook || queryFromWindow;

    if (!rawQuery || isEditAppliedRef.current === rawQuery) {
      return;
    }

    const params = new URLSearchParams(rawQuery);
    const editId = params.get('editId');
    if (!editId) {
      return;
    }

    let active = true;
    const loadEditBilling = async () => {
      try {
        setLoading(true);
        const bill = await billingService.getById(editId);
        if (!active) return;

        if (!isCreatedToday(bill.createdAt)) {
          toast.error(EDIT_WINDOW_MESSAGE);
          router.push('/billing/opd');
          return;
        }

        const mappedVisitType = normalizeVisitType(bill.visitType);
        const mappedDate = normalizeDateInput(bill.date);
        const shouldLockFromAppointment = Boolean(bill.appointmentId);

        setEditingBillId(bill.id);
        setIsAppointmentLocked(shouldLockFromAppointment);
        setIsPatientAccordionOpen(!shouldLockFromAppointment);
        setIsVisitAccordionOpen(!shouldLockFromAppointment);

        setBilling((prev) => ({
          ...prev,
          patientId: bill.patientId,
          appointmentId: bill.appointmentId || '',
          visitType: mappedVisitType,
          doctorId: bill.doctorId,
          date: mappedDate,
          items: bill.items.length
            ? bill.items.map((item) => ({
                id: item.id || `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                service: item.serviceName,
                qty: Math.max(1, Number(item.qty) || 1),
                rate: Math.max(0, Number(item.rate) || 0),
                amount: Math.max(1, Number(item.qty) || 1) * Math.max(0, Number(item.rate) || 0),
              }))
            : [defaultServiceItem('Consultation Fee', 0)],
          discountType: bill.subtotal > 0 && bill.discount > 0 ? 'amount' : prev.discountType,
          discountValue: Math.max(0, Number(bill.discount) || 0),
          tax: Math.max(0, Number(bill.tax) || 0),
          paymentMode: (bill.paymentMode as PaymentMode) || 'cash',
          paidAmount: Math.max(0, Number(bill.paidAmount) || 0),
          transactionId: bill.transactionId || '',
        }));

        // Department comes from doctor master; set after doctors are loaded as a fallback in dedicated effect.
        try {
          const patientDetails = await patientService.getPatientById(bill.patientId);
          if (active) {
            setPatient(toBillingPatientSummary(patientDetails));
          }
        } catch {
          if (active) {
            setPatient({
              id: bill.patientId,
              uhid: bill.patientUhid,
              patientName: bill.patientName,
              dob: '',
              age: 0,
              gender: '',
              mobile: '',
            });
          }
        }

        isEditAppliedRef.current = rawQuery;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load bill for editing';
        toast.error(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadEditBilling();

    return () => {
      active = false;
    };
  }, [searchParamsKey]);

  useEffect(() => {
    // In edit mode, derive department from selected doctor when doctors list becomes available.
    if (!editingBillId || !billing.doctorId || billing.departmentId) {
      return;
    }

    const doctor = doctors.find((item) => item.id === billing.doctorId);
    if (doctor?.departmentId) {
      setBilling((prev) => ({ ...prev, departmentId: doctor.departmentId }));
    }
  }, [doctors, editingBillId, billing.doctorId, billing.departmentId]);

  useEffect(() => {
    const queryFromHook = searchParams.toString();
    const queryFromWindow = typeof window !== 'undefined'
      ? window.location.search.replace(/^\?/, '')
      : '';
    const rawQuery = queryFromHook || queryFromWindow;

    if (!rawQuery || isPrefillAppliedRef.current === rawQuery) {
      return;
    }

    const params = new URLSearchParams(rawQuery);
    const requestedAppointmentId = params.get('appointmentId');
    const requestedPatientId = Number(params.get('patientId'));
    const requestedDoctorId = params.get('doctorId');
    const requestedDepartmentId = params.get('departmentId');
    const requestedVisitType = params.get('visitType');
    const requestedDate = params.get('appointmentDate');
    const requestedEditId = params.get('editId');

    if (requestedEditId) {
      return;
    }

    const hasPrefillParams =
      !!requestedAppointmentId ||
      requestedPatientId > 0 ||
      !!requestedDoctorId ||
      !!requestedDepartmentId;

    if (!hasPrefillParams) {
      return;
    }

    setIsAppointmentLocked(!!requestedAppointmentId);
    let active = true;

    const applyPrefill = async () => {
      let appointment: Appointment | null = null;

      if (requestedAppointmentId) {
        try {
          appointment = await appointmentService.getById(requestedAppointmentId);
        } catch (error) {
          console.error('Failed to load appointment for OPD prefill', error);
        }
      }

      if (!active) return;

      const patientId =
        appointment?.patientId ?? (requestedPatientId > 0 ? requestedPatientId : null);

      const nextVisitType = normalizeVisitType(appointment?.visitType ?? requestedVisitType);
      const nextDoctorId = appointment?.doctorId ?? requestedDoctorId ?? '';
      const nextDepartmentId = appointment?.departmentId ?? requestedDepartmentId ?? '';
      const nextDate = normalizeDateInput(appointment?.appointmentDate ?? requestedDate);
      const nextAppointmentId = appointment?.id ?? requestedAppointmentId ?? '';

      setBilling((prev) => ({
        ...prev,
        patientId: patientId ?? prev.patientId,
        appointmentId: nextAppointmentId,
        visitType: nextVisitType,
        departmentId: nextDepartmentId,
        doctorId: nextDoctorId,
        date: nextDate,
      }));

      if (!patientId || !active) {
        if (active) {
          isPrefillAppliedRef.current = rawQuery;
        }
        return;
      }

      try {
        const patientDetails = await patientService.getPatientById(patientId);
        if (active) {
          setPatient(toBillingPatientSummary(patientDetails));
          isPrefillAppliedRef.current = rawQuery;
        }
      } catch (error) {
        console.error('Failed to load patient for OPD prefill', error);
        if (active && appointment) {
          setPatient({
            id: appointment.patientId,
            uhid: appointment.patientUhid,
            patientName: appointment.patientName,
            dob: '',
            age: 0,
            gender: '',
            mobile: '',
          });
        }

        if (active) {
          isPrefillAppliedRef.current = rawQuery;
        }
      }
    };

    applyPrefill();

    return () => {
      active = false;
    };
  }, [searchParamsKey]);

  const availableDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.departmentId === billing.departmentId),
    [doctors, billing.departmentId]
  );

  const selectedDepartmentName = useMemo(() => {
    return departments.find((department) => department.id === billing.departmentId)?.name || 'Not selected';
  }, [billing.departmentId, departments]);

  const selectedDoctorName = useMemo(() => {
    const doctor = doctors.find((item) => item.id === billing.doctorId);
    if (!doctor) return 'Not selected';
    return `${doctor.name}${doctor.specialization ? ` (${doctor.specialization})` : ''}`;
  }, [billing.doctorId, doctors]);

  const patientSummaryText = useMemo(() => {
    if (patient) {
      const suffix = patient.uhid ? ` (UHID: ${patient.uhid})` : '';
      return `${patient.patientName}${suffix}`;
    }

    if (billing.patientId) {
      return `Patient ID: ${billing.patientId}`;
    }

    return 'Patient details not loaded';
  }, [billing.patientId, patient]);

  useEffect(() => {
    setIsPatientAccordionOpen(!isAppointmentLocked);
    setIsVisitAccordionOpen(!isAppointmentLocked);
  }, [isAppointmentLocked]);

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
      if (editingBillId) {
        const updatedBill = await billingService.update(editingBillId, payload);
        toast.success(`Bill ${updatedBill.billNumber} updated successfully!`);

        if (printAfterSave) {
          router.replace(`/billing/opd/view/${updatedBill.id}?print=true`);
        } else {
          router.replace(`/billing/opd/view/${updatedBill.id}`);
        }
      } else {
        const createdBill = await billingService.create(payload);
        toast.success(`Bill ${createdBill.billNumber} created successfully!`);

        if (printAfterSave) {
          router.replace(`/billing/opd/view/${createdBill.id}?print=true`);
        } else {
          router.replace(`/billing/opd/view/${createdBill.id}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : editingBillId
          ? 'Failed to update bill'
          : 'Failed to create bill';
      toast.error(errorMessage);
      console.error('[OPD Billing] Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{editingBillId ? 'Edit OPD Bill' : 'Create OPD Bill'}</h1>
          <p className="text-sm text-gray-500">
            {editingBillId
              ? 'Update bill details and payment information.'
              : 'Fast billing workflow for reception and front desk.'}
          </p>
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
          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              onClick={() => setIsPatientAccordionOpen((prev) => !prev)}
              aria-expanded={isPatientAccordionOpen}
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Patient Selection</h2>
                {isAppointmentLocked && (
                  <p className="mt-1 text-xs text-gray-600">{patientSummaryText}</p>
                )}
              </div>
              {isPatientAccordionOpen ? (
                <ChevronDown size={18} className="text-gray-500" />
              ) : (
                <ChevronRight size={18} className="text-gray-500" />
              )}
            </button>

            {isPatientAccordionOpen && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                <PatientSearch
                  value={patient}
                  disabled={isAppointmentLocked}
                  onSelect={(selected) => {
                    setPatient(selected);
                    patchBilling('patientId', selected?.id ?? null);
                    patchBilling('appointmentId', '');
                  }}
                />
                {isAppointmentLocked && (
                  <p className="mt-2 text-xs text-gray-500">
                    Patient is locked from the selected appointment.
                  </p>
                )}
                {errors.patientId && <p className="mt-2 text-xs text-red-600">{errors.patientId}</p>}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              onClick={() => setIsVisitAccordionOpen((prev) => !prev)}
              aria-expanded={isVisitAccordionOpen}
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Visit Details</h2>
                {isAppointmentLocked && (
                  <p className="mt-1 text-xs text-gray-600">
                    {billing.visitType} • {selectedDepartmentName} • {selectedDoctorName} • {billing.date}
                  </p>
                )}
              </div>
              {isVisitAccordionOpen ? (
                <ChevronDown size={18} className="text-gray-500" />
              ) : (
                <ChevronRight size={18} className="text-gray-500" />
              )}
            </button>

            {isVisitAccordionOpen && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Visit Type</label>
                <select
                  value={billing.visitType}
                  onChange={(e) => patchBilling('visitType', e.target.value as VisitType)}
                  disabled={isAppointmentLocked}
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
                  disabled={isAppointmentLocked}
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
                  disabled={isAppointmentLocked}
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
                  disabled={isAppointmentLocked}
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
                  disabled={!patient?.id || isAppointmentLocked}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </div>
            )}
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

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSave(false)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              disabled={loading}
            >
              <Save size={15} />
              {editingBillId ? 'Update Bill' : 'Save Bill'}
            </button>
            <button
              type="button"
              onClick={() => onSave(true)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
              disabled={loading}
            >
              <Printer size={15} />
              {editingBillId ? 'Update & Print' : 'Save & Print'}
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
