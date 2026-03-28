'use client';

import { DiscountType } from './types';

interface BillSummaryProps {
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  tax: number;
  netAmount: number;
  onDiscountTypeChange: (value: DiscountType) => void;
  onDiscountValueChange: (value: number) => void;
  onTaxChange: (value: number) => void;
}

export function BillSummary({
  subtotal,
  discountType,
  discountValue,
  tax,
  netAmount,
  onDiscountTypeChange,
  onDiscountValueChange,
  onTaxChange,
}: BillSummaryProps) {
  const discountAmount =
    discountType === 'percentage'
      ? Math.min(subtotal, (subtotal * Math.max(0, discountValue)) / 100)
      : Math.min(subtotal, Math.max(0, discountValue));

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">Bill Summary</h2>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{subtotal.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-gray-600">Discount</label>
          <div className="flex gap-2">
            <select
              value={discountType}
              onChange={(e) => onDiscountTypeChange(e.target.value as DiscountType)}
              className="w-[120px] rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="amount">Amount (Rs)</option>
              <option value="percentage">Percent (%)</option>
            </select>
            <input
              type="number"
              min={0}
              step="0.01"
              value={discountValue}
              onChange={(e) => onDiscountValueChange(Number(e.target.value) || 0)}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Applied Discount</span>
          <span>{discountAmount.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-[120px_1fr] items-center gap-2">
          <label className="text-gray-600">Tax</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={tax}
            onChange={(e) => onTaxChange(Number(e.target.value) || 0)}
            className="rounded border border-gray-300 px-2 py-1.5 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t border-dashed border-gray-300 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">Net Amount</span>
            <span className="text-lg font-bold text-blue-700">{netAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
