'use client';

import { Trash2 } from 'lucide-react';
import { BillingServiceItem } from './types';

interface ServiceTableProps {
  items: BillingServiceItem[];
  onChange: (items: BillingServiceItem[]) => void;
}

const toAmount = (qty: number, rate: number) => Math.max(1, qty) * Math.max(0, rate);

export function ServiceTable({ items, onChange }: ServiceTableProps) {
  const updateItem = (id: string, patch: Partial<BillingServiceItem>) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, ...patch };
      return {
        ...next,
        qty: Math.max(1, Number(next.qty) || 1),
        rate: Math.max(0, Number(next.rate) || 0),
        amount: toAmount(Number(next.qty) || 1, Number(next.rate) || 0),
      };
    });

    onChange(updated);
  };

  const addRow = () => {
    onChange([
      ...items,
      {
        id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        service: '',
        qty: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeRow = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onChange(updated.length ? updated : items);
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Service Items</h2>
          <p className="text-xs text-gray-500">Add billable services and edit inline.</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          Add Row
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-right w-[90px]">Qty</th>
              <th className="px-3 py-2 text-right w-[120px]">Rate</th>
              <th className="px-3 py-2 text-right w-[120px]">Amount</th>
              <th className="px-3 py-2 text-center w-[64px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50/40">
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={item.service}
                    onChange={(e) => updateItem(item.id, { service: e.target.value })}
                    placeholder="Service name"
                    className="w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2 text-right font-medium text-gray-800">
                  {item.amount.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(item.id)}
                    disabled={items.length <= 1}
                    className="inline-flex items-center justify-center rounded p-1.5 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300"
                    title="Remove row"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
