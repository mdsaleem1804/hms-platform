'use client';

import { PaymentMode } from './types';

interface PaymentSectionProps {
  paymentMode: PaymentMode;
  paidAmount: number;
  transactionId: string;
  balanceAmount: number;
  onPaymentModeChange: (value: PaymentMode) => void;
  onPaidAmountChange: (value: number) => void;
  onTransactionIdChange: (value: string) => void;
}

export function PaymentSection({
  paymentMode,
  paidAmount,
  transactionId,
  balanceAmount,
  onPaymentModeChange,
  onPaidAmountChange,
  onTransactionIdChange,
}: PaymentSectionProps) {
  const requireTransactionId = paymentMode === 'upi' || paymentMode === 'card';

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900">Payment Details</h2>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Payment Mode
          </label>
          <select
            value={paymentMode}
            onChange={(e) => onPaymentModeChange(e.target.value as PaymentMode)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Paid Amount
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={paidAmount}
            onChange={(e) => onPaidAmountChange(Number(e.target.value) || 0)}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {requireTransactionId && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => onTransactionIdChange(e.target.value)}
              placeholder="Enter UPI/Card reference"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Balance Amount</span>
            <span className={`font-semibold ${balanceAmount > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {balanceAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
