'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import GlobalSearch from '@/components/ui/GlobalSearch';
import { DoctorSummary } from '@/services/doctorService';

interface BillingListToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  doctorIdValue: string;
  onDoctorIdChange: (value: string) => void;
  fromDateValue: string;
  toDateValue: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  doctors: DoctorSummary[];
  onClearFilters?: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
}

export default function BillingListToolbar({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  doctorIdValue,
  onDoctorIdChange,
  fromDateValue,
  toDateValue,
  onFromDateChange,
  onToDateChange,
  doctors,
  onClearFilters,
  onExportExcel,
  onPrint,
}: BillingListToolbarProps) {
  const [exportOpen, setExportOpen] = useState(false);

  const hasFilters = useMemo(
    () => Boolean(searchValue || statusValue || doctorIdValue || fromDateValue || toDateValue),
    [searchValue, statusValue, doctorIdValue, fromDateValue, toDateValue]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Search
            </label>
            <GlobalSearch
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Bill no, patient name, or mobile"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </label>
            <select
              value={statusValue}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Doctor
            </label>
            <select
              value={doctorIdValue}
              onChange={(e) => onDoctorIdChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              From
            </label>
            <input
              type="date"
              value={fromDateValue}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              To
            </label>
            <input
              type="date"
              value={toDateValue}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear Filters
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Export
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onExportExcel();
                    setExportOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export Excel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPrint();
                    setExportOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Print
                </button>
              </div>
            )}
          </div>

          <Link
            href="/billing/opd/create"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Create Bill
          </Link>
        </div>
      </div>

      {hasFilters && (
        <p className="mt-3 text-xs text-gray-500">
          Filters are active. Results are fetched server-side.
        </p>
      )}
    </div>
  );
}
