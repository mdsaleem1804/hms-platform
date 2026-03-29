'use client';

import Link from 'next/link';
import { Eye, Pencil, Printer } from 'lucide-react';
import { BillingRecord } from '@/services/billingService';
import { isCreatedToday } from '@/lib/editWindow';

interface BillingsTableProps {
  billings: BillingRecord[];
  onEdit: (bill: BillingRecord) => void;
}

const statusClasses: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Partial: 'bg-blue-100 text-blue-700',
};

const formatAmount = (value: number) => Number(value).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function BillingsTable({ billings, onEdit }: BillingsTableProps) {
  if (!billings || billings.length === 0) {
    return (
      <div className="py-14 text-center text-gray-500">
        <p className="text-base font-medium">No bills found.</p>
        <p className="mt-1 text-sm">
          Try changing filters or{' '}
          <Link href="/billing/opd/create" className="text-blue-600 hover:underline">create a new bill</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[68vh] overflow-auto">
      <table className="w-full min-w-[1280px] border-separate border-spacing-0">
        <thead className="sticky top-0 z-10 bg-gray-100">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Bill Number</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Patient Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">UHID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Doctor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Visit Type</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Net Amount</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Paid Amount</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {billings.map((bill, index) => {
            const isEditable = isCreatedToday(bill.createdAt);

            return (
              <tr
                key={bill.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} transition-colors hover:bg-blue-50`}
              >
                <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-blue-700">
                  <Link href={`/billing/opd/view/${bill.id}`} className="hover:underline">
                    {bill.billNumber}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                  {new Date(bill.date).toLocaleDateString('en-IN')}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{bill.patientName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{bill.patientUhid}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{bill.doctorName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-700">{bill.visitType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">{formatAmount(bill.netAmount)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">{formatAmount(bill.paidAmount)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[bill.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {bill.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/billing/opd/view/${bill.id}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-700 transition hover:bg-gray-100"
                      title="View bill"
                      aria-label="View bill"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      href={`/billing/opd/view/${bill.id}?print=true`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50"
                      title="Print bill"
                      aria-label="Print bill"
                    >
                      <Printer size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onEdit(bill)}
                      disabled={!isEditable}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded border transition ${
                        isEditable
                          ? 'border-blue-200 text-blue-700 hover:bg-blue-50'
                          : 'cursor-not-allowed border-gray-200 text-gray-300'
                      }`}
                      title={isEditable ? 'Edit bill' : 'Only records created today can be edited'}
                      aria-label="Edit bill"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
