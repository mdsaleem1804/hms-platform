'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  ClipboardList,
  UserCheck,
  Stethoscope,
  Pill,
  Microscope,
  ImageIcon,
  Droplets,
  Ambulance,
  DollarSign,
  FileText,
  Users2,
  Activity,
  Package,
  Calendar,
  MessageSquare,
  BarChart3,
  Database,
  Settings,
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  category?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      category: 'Main',
    },
    {
      name: 'Patient Enquiry',
      path: '/patients',
      icon: <Users className="h-5 w-5" />,
      category: 'Patient Management',
    },
    {
      name: 'Reception & Registration',
      path: '/appointments', //reception-registration
      icon: <UserCheck className="h-5 w-5" />,
      category: 'Patient Management',
    },
    {
      name: 'Out Patient (OPD)',
      path: '/opd',
      icon: <ClipboardList className="h-5 w-5" />,
      category: 'Clinical',
    },
    {
      name: 'In Patient (IPD)',
      path: '/ipd',
      icon: <Stethoscope className="h-5 w-5" />,
      category: 'Clinical',
    },
    {
      name: 'Operation Theatre',
      path: '/operation-theatre',
      icon: <Pill className="h-5 w-5" />,
      category: 'Clinical',
    },
    {
      name: 'Pharmacy',
      path: '/pharmacy',
      icon: <Pill className="h-5 w-5" />,
      category: 'Services',
    },
    {
      name: 'Central Laboratory',
      path: '/laboratory',
      icon: <Microscope className="h-5 w-5" />,
      category: 'Services',
    },
    {
      name: 'Radiology',
      path: '/radiology',
      icon: <ImageIcon className="h-5 w-5" />,
      category: 'Services',
    },
    {
      name: 'Blood Bank',
      path: '/blood-bank',
      icon: <Droplets className="h-5 w-5" />,
      category: 'Services',
    },
    {
      name: 'Ambulance',
      path: '/ambulance',
      icon: <Ambulance className="h-5 w-5" />,
      category: 'Services',
    },
    {
      name: 'Accounts & Finance',
      path: '/accounts-finance',
      icon: <DollarSign className="h-5 w-5" />,
      category: 'Administration',
    },
    {
      name: 'OPD Billing',
      path: '/billing/opd',
      icon: <DollarSign className="h-5 w-5" />,
      category: 'Administration',
    },
    {
      name: 'Records & Certificates',
      path: '/records-certificates',
      icon: <FileText className="h-5 w-5" />,
      category: 'Administration',
    },
    {
      name: 'HR Management',
      path: '/hr',
      icon: <Users2 className="h-5 w-5" />,
      category: 'Administration',
    },
    {
      name: 'Activity Log',
      path: '/activity-log',
      icon: <Activity className="h-5 w-5" />,
      category: 'Administration',
    },
    {
      name: 'Inventory Management',
      path: '/inventory',
      icon: <Package className="h-5 w-5" />,
      category: 'Operations',
    },
    {
      name: 'Programmes & Calendar',
      path: '/programmes-calendar',
      icon: <Calendar className="h-5 w-5" />,
      category: 'Operations',
    },
    {
      name: 'Messages & Notifications',
      path: '/messages',
      icon: <MessageSquare className="h-5 w-5" />,
      category: 'Communication',
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: <BarChart3 className="h-5 w-5" />,
      category: 'Analytics',
    },
    {
      name: 'E-MRD',
      path: '/e-mrd',
      icon: <Database className="h-5 w-5" />,
      category: 'Analytics',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5" />,
      category: 'System',
    },
  ];

  // Group items by category
  const groupedItems = menuItems.reduce(
    (acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  return (
    <aside
      className={`${
        expanded ? 'w-64' : 'w-20'
      } h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-16 z-30 transition-all duration-300 overflow-y-auto`}
    >
      {/* Header with Toggle */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
        {expanded && (
          <h2 className="text-sm font-bold text-gray-900">MENU</h2>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto text-gray-400 hover:text-blue-700 p-1 rounded-lg hover:bg-gray-100 transition"
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${expanded ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-6 space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category}>
            {expanded && (
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {category}
              </h3>
            )}
            <div className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm
                    ${
                      pathname.startsWith(item.path)
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  title={expanded ? undefined : item.name}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {expanded && <span className="flex-1">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 border-t border-gray-200 text-xs text-gray-400 ${expanded ? '' : 'text-center'}`}>
        {expanded && <p>© 2026 Lakshmi Hospitals</p>}
      </div>
    </aside>
  );
}
