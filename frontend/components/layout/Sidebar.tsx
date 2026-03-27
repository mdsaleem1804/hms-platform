'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar({ expanded: expandedProp, onToggle }: { expanded?: boolean, onToggle?: (expanded: boolean) => void } = {}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(expandedProp ?? true);
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Patients', path: '/patients', icon: '👥' },
    { name: 'Appointments', path: '/appointments', icon: '📅' },
  ];
  const handleToggle = () => {
    setExpanded((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };
  return (
    <aside className={`${expanded ? 'w-64' : 'w-16'} h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 z-40 transition-all duration-200`}>
      {/* Logo/Header */}
      <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold text-blue-700 tracking-tight transition-all duration-200 ${expanded ? '' : 'text-center text-lg'}`}>HMS</h1>
          {expanded && <p className="text-xs text-gray-400 mt-1">Hospital Management</p>}
        </div>
        <button
          onClick={handleToggle}
          className="ml-2 text-gray-400 hover:text-blue-700 focus:outline-none"
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {expanded ? <span>&#x25C0;</span> : <span>&#x25B6;</span>}
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} legacyBehavior>
            <a
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-base
                ${pathname.startsWith(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {expanded && item.name}
            </a>
          </Link>
        ))}
      </nav>
      {/* Copyright */}
      <div className={`px-6 py-4 border-t border-gray-100 text-xs text-gray-400 ${expanded ? '' : 'text-center px-0'}`}>© 2024 HMS</div>
    </aside>
  );
}
