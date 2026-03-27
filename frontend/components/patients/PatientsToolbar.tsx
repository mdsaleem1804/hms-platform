'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

interface PatientsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  genderValue: string;
  onGenderChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
}

export default function PatientsToolbar({
  searchValue,
  onSearchChange,
  genderValue,
  onGenderChange,
  statusValue,
  onStatusChange,
  onExportCsv,
  onExportPdf,
  onPrint,
}: PatientsToolbarProps) {
  const [exportOpen, setExportOpen] = useState(false);

  const hasFilters = useMemo(
    () => Boolean(searchValue || genderValue || statusValue),
    [searchValue, genderValue, statusValue]
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Search
            </label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search UHID, name, or mobile"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Gender
            </label>
            <select
              value={genderValue}
              onChange={(e) => onGenderChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen((prev) => !prev)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Export
            </button>
            {exportOpen && (
              <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onExportCsv();
                    setExportOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExportPdf();
                    setExportOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export PDF
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
            href="/patients/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Add Patient
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
