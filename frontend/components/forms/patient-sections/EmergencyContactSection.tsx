'use client';

import React, { memo } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface EmergencyContactSectionProps {
  emergencyContact: {
    name: string;
    relationship: string;
    contact_number: string;
  };
  onNestedChange: (field: string, value: string) => void;
}

const relationshipOptions = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'other', label: 'Other' },
];

const EmergencyContactSection = memo(({
  emergencyContact,
  onNestedChange,
}: EmergencyContactSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        Emergency Contact
      </h2>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            type="text"
            value={emergencyContact.name}
            onChange={(e) => onNestedChange('name', e.target.value)}
            placeholder="Full name"
            className="h-10"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
          <Select
            value={emergencyContact.relationship}
            onChange={(e) => onNestedChange('relationship', e.target.value)}
            options={relationshipOptions}
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <Input
            type="tel"
            value={emergencyContact.contact_number}
            onChange={(e) => onNestedChange('contact_number', e.target.value)}
            placeholder="10-digit number"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
});

EmergencyContactSection.displayName = 'EmergencyContactSection';

export default EmergencyContactSection;
