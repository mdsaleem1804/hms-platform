'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { DoctorServiceRateManager } from '@/components/billing/DoctorServiceRateManager';

export default function DoctorServiceRatesPage() {
  const [isManagerOpen, setIsManagerOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Service Rates</h1>
          <p className="text-sm text-gray-500">
            Manage service rates for doctors. Different doctors can have different rates for the same service.
          </p>
        </div>
        <Link
          href="/billing/opd"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to Billing
        </Link>
      </div>

      <DoctorServiceRateManager isOpen={isManagerOpen} onClose={() => setIsManagerOpen(true)} embedded={true} />
    </div>
  );
}
