'use client';

import React from 'react';
import {
  BarChart2,
  CalendarDays,
  CreditCard,
  Eye,
  FilePlus,
  FileX,
  LayoutDashboard,
  Lock,
  PencilLine,
  Settings,
  Share2,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { ModulePermission, PermissionRow } from './PermissionRow';

// ——————————————————————————————————————————————
// Column header definitions
// ——————————————————————————————————————————————
const COLUMN_HEADERS: Array<{ label: string; icon: React.ReactNode; colorClass: string }> = [
  { label: 'Full Control', icon: <ShieldCheck size={13} />, colorClass: 'text-emerald-600' },
  { label: 'Create',       icon: <FilePlus size={13} />,    colorClass: 'text-blue-600'    },
  { label: 'Edit',         icon: <PencilLine size={13} />,  colorClass: 'text-amber-500'   },
  { label: 'View',         icon: <Eye size={13} />,         colorClass: 'text-sky-600'     },
  { label: 'Delete',       icon: <FileX size={13} />,       colorClass: 'text-red-600'     },
  { label: 'Export',       icon: <Share2 size={13} />,      colorClass: 'text-violet-600'  },
  { label: 'No Access',    icon: <Lock size={13} />,        colorClass: 'text-gray-500'    },
];

// ——————————————————————————————————————————————
// Module icon lookup
// ——————————————————————————————————————————————
const MODULE_ICONS: Record<string, React.ReactNode> = {
  Dashboard:   <LayoutDashboard size={15} />,
  Patient:     <Users size={15} />,
  Appointment: <CalendarDays size={15} />,
  Billing:     <CreditCard size={15} />,
  Doctor:      <UserCheck size={15} />,
  Reports:     <BarChart2 size={15} />,
  Settings:    <Settings size={15} />,
};

// ——————————————————————————————————————————————
// PermissionTable
// ——————————————————————————————————————————————
interface PermissionTableProps {
  permissions: ModulePermission[];
  onChange: (updated: ModulePermission[]) => void;
}

export function PermissionTable({ permissions, onChange }: PermissionTableProps) {
  const handleRowChange = (updated: ModulePermission) => {
    onChange(permissions.map((p) => (p.module === updated.module ? updated : p)));
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[150px]"
            >
              Module
            </th>
            {COLUMN_HEADERS.map(({ label, icon, colorClass }) => (
              <th
                key={label}
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide whitespace-nowrap min-w-[80px]"
              >
                <div className={`flex flex-col items-center gap-1 ${colorClass}`}>
                  {icon}
                  <span>{label}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {permissions.map((permission) => (
            <PermissionRow
              key={permission.module}
              permission={permission}
              icon={MODULE_ICONS[permission.module]}
              onChange={handleRowChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
