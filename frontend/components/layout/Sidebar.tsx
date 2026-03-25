'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => pathname.includes(path);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Patients', path: '/patients', icon: '👥' },
    { name: 'Appointments', path: '/appointments', icon: '📅' },
  ];

  return (
    <aside
      className={`${
        isExpanded ? 'w-64' : 'w-16'
      } bg-gray-900 text-white shadow-lg transition-all duration-300 flex flex-col fixed h-screen left-0 top-0 z-50`}
    >
      {/* Logo / Header */}
      <div className="p-4 border-b border-gray-700">
        {isExpanded ? (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">HMS</h1>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white transition"
                title="Collapse sidebar"
              >
                ←
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-1">Hospital Management</p>
          </>
        ) : (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition w-full text-center"
            title="Expand sidebar"
          >
            →
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-3 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {isExpanded && <span className="text-sm font-medium">{item.name}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        {isExpanded ? (
          <p className="text-gray-400 text-xs text-center">© 2024 HMS</p>
        ) : (
          <div className="text-center text-xs text-gray-400">©</div>
        )}
      </div>
    </aside>
  );
}
