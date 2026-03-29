'use client';

import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import billingService, { BillingRecord } from '@/services/billingService';
import dashboardService, { HospitalSettings } from '@/services/dashboardService';

export default function ViewBillPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const billId = params.id as string;
  const shouldPrint = searchParams.get('print') === 'true';

  const [bill, setBill] = useState<BillingRecord | null>(null);
  const [hospitalSettings, setHospitalSettings] = useState<HospitalSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBill = async () => {
      try {
        const [data, settings] = await Promise.all([
          billingService.getById(billId),
          dashboardService.getHospitalSettings(),
        ]);
        setBill(data);
        setHospitalSettings(settings);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load bill';
        toast.error(errorMessage);
        router.push('/billing/opd');
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [billId, router]);

  useEffect(() => {
    if (!bill || !shouldPrint) {
      return undefined;
    }

    // Delay print to ensure content is rendered
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => clearTimeout(timer);
  }, [bill, shouldPrint]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Bill not found</p>
          <Link href="/billing/opd" className="text-blue-600 hover:underline">
            Back to billing list
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN');
  const formatCurrency = (amount: number) => `₹ ${Number(amount).toFixed(2)}`;
  const hospitalName = hospitalSettings?.hospitalName?.trim() || 'HOSPITAL';
  const hospitalTagline = hospitalSettings?.reportHeaderTagline?.trim() || 'Healthcare Management System';
  const hospitalPhone = hospitalSettings?.phoneNumber?.trim();
  const gstNumber = hospitalSettings?.gstNumber?.trim();
  const footerNote =
    hospitalSettings?.reportFooterNote?.trim() ||
    'Thank you for choosing our hospital. Please retain this bill for your records.';

  const addressParts = [
    hospitalSettings?.addressLine1,
    hospitalSettings?.addressLine2,
    hospitalSettings?.city,
    hospitalSettings?.state,
    hospitalSettings?.postalCode,
    hospitalSettings?.country,
  ]
    .map((item) => item?.trim())
    .filter(Boolean);

  const addressLine = addressParts.length > 0 ? addressParts.join(', ') : 'Address not configured';

  return (
    <div className="min-h-screen bg-white print:bg-white print:p-0">
      {/* No-Print Header */}
      <div className="hidden space-y-4 border-b border-gray-200 pb-6 print:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Bill Details</h1>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              <Printer size={16} />
              Print Bill
            </button>
            <Link
              href="/billing/opd"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>
        </div>
      </div>

      {/* Printable Bill Template */}
      <div className="mx-auto max-w-3xl bg-white p-12 print:max-w-full print:p-8">
        {/* Header */}
        <div className="mb-8 border-b-2 border-gray-800 pb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{hospitalName}</h1>
          <p className="mt-1 text-sm text-gray-600">{hospitalTagline}</p>
          <p className="text-xs text-gray-500">
            Address: {addressLine}{hospitalPhone ? ` | Phone: ${hospitalPhone}` : ''}
          </p>
        </div>

        {/* Bill Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">OPD BILL</h2>
            <p className="text-sm text-gray-600">Out Patient Department Receipt</p>
          </div>
          <div className="text-right text-sm text-gray-700">
            <p>
              <span className="font-semibold">Bill No:</span> {bill.billNumber}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formatDate(bill.date)}
            </p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="mb-8 grid grid-cols-2 gap-6 border border-gray-300 p-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Patient Name</p>
            <p className="text-sm font-semibold text-gray-900">{bill.patientName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">UHID</p>
            <p className="text-sm font-semibold text-gray-900">{bill.patientUhid}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Department</p>
            <p className="text-sm text-gray-700">-</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Doctor</p>
            <p className="text-sm text-gray-700">{bill.doctorName}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Visit Type</p>
            <p className="text-sm capitalize text-gray-700">{bill.visitType}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Bill Date</p>
            <p className="text-sm text-gray-700">{formatDate(bill.date)}</p>
          </div>
        </div>

        {/* Services Table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700">S.No</th>
                <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700">Service / Item</th>
                <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700">Qty</th>
                <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-700">Rate</th>
                <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="border border-gray-300 px-4 py-2 text-xs text-gray-700">{idx + 1}</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs text-gray-700">{item.serviceName}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-xs text-gray-700">{item.qty}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-xs text-gray-700">{formatCurrency(item.rate)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-xs font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bill Summary */}
        <div className="mb-8 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between border-b border-gray-300 px-4 py-2 text-sm">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between border-b border-gray-300 px-4 py-2 text-sm">
                <span className="text-gray-700">Discount:</span>
                <span className="font-semibold text-red-600">-{formatCurrency(bill.discount)}</span>
              </div>
            )}
            {bill.tax > 0 && (
              <div className="flex justify-between border-b border-gray-300 px-4 py-2 text-sm">
                <span className="text-gray-700">Tax (GST):</span>
                <span className="font-semibold text-gray-900">+{formatCurrency(bill.tax)}</span>
              </div>
            )}
            <div className="flex justify-between bg-blue-50 px-4 py-3 text-sm font-bold">
              <span className="text-gray-900">Net Amount:</span>
              <span className="text-blue-700">{formatCurrency(bill.netAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-8 grid grid-cols-2 gap-6 border border-gray-300 p-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Payment Mode</p>
            <p className="text-sm capitalize font-semibold text-gray-900">{bill.paymentMode}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Amount Paid</p>
            <p className="text-sm font-semibold text-gray-900">{formatCurrency(bill.paidAmount)}</p>
          </div>
          {bill.transactionId && (
            <>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Transaction ID</p>
                <p className="text-sm text-gray-700">{bill.transactionId}</p>
              </div>
            </>
          )}
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Balance</p>
            <p
              className={`text-sm font-semibold ${bill.balanceAmount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}
            >
              {formatCurrency(bill.balanceAmount)}
            </p>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-8 border-t-2 border-gray-800 pt-6 text-center text-xs text-gray-600">
          <p>{footerNote}</p>
          {gstNumber ? <p className="mt-2">GST Registration No: {gstNumber}</p> : null}
        </div>

        {/* Print Footer */}
        <div className="text-center text-xs text-gray-500 print:text-gray-700">
          <p>Bill Generated: {new Date().toLocaleString('en-IN')}</p>
          <p className="mt-1">This is a computer generated document and requires no signature.</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
