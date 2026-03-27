'use client';

import React from 'react';

export type PermissionKey = 'canCreate' | 'canEdit' | 'canView' | 'canDelete' | 'canExport';

export interface ModulePermission {
  module: string;
  canCreate: boolean;
  canEdit: boolean;
  canView: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export const INDIVIDUAL_PERMISSIONS: PermissionKey[] = [
  'canCreate',
  'canEdit',
  'canView',
  'canDelete',
  'canExport',
];

interface PermissionCheckboxCellProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  colorClass?: string;
}

function PermissionCheckboxCell({
  checked,
  onChange,
  label,
  colorClass = 'accent-blue-600',
}: PermissionCheckboxCellProps) {
  return (
    <td className="px-3 py-3 text-center align-middle">
      <input
        type="checkbox"
        className={`h-[15px] w-[15px] rounded border-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${colorClass}`}
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </td>
  );
}

interface PermissionRowProps {
  permission: ModulePermission;
  icon?: React.ReactNode;
  onChange: (updated: ModulePermission) => void;
}

export function PermissionRow({ permission, icon, onChange }: PermissionRowProps) {
  const isFullControl = INDIVIDUAL_PERMISSIONS.every((key) => permission[key]);
  const isNoAccess = INDIVIDUAL_PERMISSIONS.every((key) => !permission[key]);

  const handleFullControl = () => {
    // Toggle: if already full control → clear all; otherwise → select all
    const enable = !isFullControl;
    onChange({
      ...permission,
      canCreate: enable,
      canEdit: enable,
      canView: enable,
      canDelete: enable,
      canExport: enable,
    });
  };

  const handleNoAccess = () => {
    onChange({
      ...permission,
      canCreate: false,
      canEdit: false,
      canView: false,
      canDelete: false,
      canExport: false,
    });
  };

  const handleIndividual = (key: PermissionKey) => {
    onChange({ ...permission, [key]: !permission[key] });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-100">
      {/* Module name */}
      <td className="px-4 py-3 min-w-[140px]">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
          <span className="text-sm font-medium text-gray-800">{permission.module}</span>
        </div>
      </td>

      {/* Full Control */}
      <PermissionCheckboxCell
        checked={isFullControl}
        onChange={handleFullControl}
        label={`${permission.module} Full Control`}
        colorClass="accent-emerald-600"
      />

      {/* Individual permissions */}
      <PermissionCheckboxCell
        checked={permission.canCreate}
        onChange={() => handleIndividual('canCreate')}
        label={`${permission.module} Create`}
        colorClass="accent-blue-600"
      />
      <PermissionCheckboxCell
        checked={permission.canEdit}
        onChange={() => handleIndividual('canEdit')}
        label={`${permission.module} Edit`}
        colorClass="accent-amber-500"
      />
      <PermissionCheckboxCell
        checked={permission.canView}
        onChange={() => handleIndividual('canView')}
        label={`${permission.module} View`}
        colorClass="accent-sky-600"
      />
      <PermissionCheckboxCell
        checked={permission.canDelete}
        onChange={() => handleIndividual('canDelete')}
        label={`${permission.module} Delete`}
        colorClass="accent-red-600"
      />
      <PermissionCheckboxCell
        checked={permission.canExport}
        onChange={() => handleIndividual('canExport')}
        label={`${permission.module} Export`}
        colorClass="accent-violet-600"
      />

      {/* No Access */}
      <PermissionCheckboxCell
        checked={isNoAccess}
        onChange={handleNoAccess}
        label={`${permission.module} No Access`}
        colorClass="accent-gray-500"
      />
    </tr>
  );
}
