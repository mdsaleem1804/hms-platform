'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShieldPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RoleForm, RoleFormData, RoleFormErrors } from '@/components/roles/RoleForm';
import { PermissionTable } from '@/components/roles/PermissionTable';
import { ModulePermission } from '@/components/roles/PermissionRow';

// ——————————————————————————————————————————————
// Module list
// ——————————————————————————————————————————————
const MODULES = [
  'Dashboard',
  'Patient',
  'Appointment',
  'Billing',
  'Doctor',
  'Reports',
  'Settings',
] as const;

const createDefaultPermission = (module: string): ModulePermission => ({
  module,
  canCreate: false,
  canEdit: false,
  canView: false,
  canDelete: false,
  canExport: false,
});

// ——————————————————————————————————————————————
// Page
// ——————————————————————————————————————————————
export default function CreateRolePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<RoleFormData>({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState<RoleFormErrors>({});
  const [permissions, setPermissions] = useState<ModulePermission[]>(
    MODULES.map(createDefaultPermission),
  );

  // ——————— Form field change ———————
  const handleFormChange = (field: keyof RoleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'name' && value.trim()) {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  // ——————— Validation ———————
  const validate = (): boolean => {
    const errors: RoleFormErrors = {};
    if (!formData.name.trim()) {
      errors.name = 'Role name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ——————— Save ———————
  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      permissions,
    };

    // TODO: replace with API call
    console.log('[CreateRole] Payload:', JSON.stringify(payload, null, 2));
  };

  // ——————— Cancel ———————
  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
          <ShieldPlus size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Role</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Define a new role and configure module-level permissions.
          </p>
        </div>
      </div>

      {/* ── Section 1: Role Details ── */}
      <RoleForm
        data={formData}
        errors={formErrors}
        onChange={handleFormChange}
      />

      {/* ── Section 2: Permissions Matrix ── */}
      <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-gray-800">Permissions Matrix</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Set access levels per module.{' '}
            <span className="font-medium text-emerald-700">Full Control</span> enables all actions;{' '}
            <span className="font-medium text-gray-600">No Access</span> restricts all.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" />
            Full Control = all actions enabled
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-gray-400" />
            No Access = all actions disabled
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-blue-500" />
            Individual = select specific actions
          </span>
        </div>

        <PermissionTable permissions={permissions} onChange={setPermissions} />
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pb-8">
        <Button variant="secondary" type="button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="button" onClick={handleSave}>
          Save Role
        </Button>
      </div>

    </div>
  );
}
