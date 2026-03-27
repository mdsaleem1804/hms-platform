'use client';

import React, { memo } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface AttenderSectionProps {
  attender: {
    name: string;
    phone: string;
    address: string;
    id_proof_type: string;
    id_proof_number: string;
  };
  errors: Record<string, string>;
  onNestedChange: (field: string, value: string) => void;
}

const idProofOptions = [
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
];

const AttenderSection = memo(({
  attender,
  errors,
  onNestedChange,
}: AttenderSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Attender Details (Optional)
      </h2>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            type="text"
            value={attender.name}
            onChange={(e) => onNestedChange('name', e.target.value)}
            placeholder="Full name"
            className="h-10"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <Input
            type="tel"
            value={attender.phone}
            onChange={(e) => onNestedChange('phone', e.target.value)}
            placeholder="10-digit number"
            className="h-10"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Type</label>
          <Select
            value={attender.id_proof_type}
            onChange={(e) => onNestedChange('id_proof_type', e.target.value)}
            options={idProofOptions}
          />
        </div>

        {attender.id_proof_type && (
          <div className="col-span-12 sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Proof Number *
            </label>
            <Input
              type="text"
              value={attender.id_proof_number}
              onChange={(e) => onNestedChange('id_proof_number', e.target.value)}
              placeholder="Enter ID number"
              error={errors['attender.id_proof_number']}
              className="h-10"
            />
          </div>
        )}

        <div className="col-span-12">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Textarea
            value={attender.address}
            onChange={(e) => onNestedChange('address', e.target.value)}
            placeholder="Enter full address"
            rows={2}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
});

AttenderSection.displayName = 'AttenderSection';

export default AttenderSection;
