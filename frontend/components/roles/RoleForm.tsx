'use client';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export interface RoleFormData {
  name: string;
  description: string;
}

export interface RoleFormErrors {
  name?: string;
}

interface RoleFormProps {
  data: RoleFormData;
  errors: RoleFormErrors;
  onChange: (field: keyof RoleFormData, value: string) => void;
}

export function RoleForm({ data, errors, onChange }: RoleFormProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">Role Details</h2>
      <p className="text-sm text-gray-500 mb-5">
        Define the name and purpose of this role.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Role Name"
          required
          placeholder="e.g. Receptionist"
          value={data.name}
          error={errors.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
        <Textarea
          label="Description"
          placeholder="Brief description of this role's responsibilities..."
          value={data.description}
          rows={3}
          onChange={(e) => onChange('description', e.target.value)}
        />
      </div>
    </section>
  );
}
