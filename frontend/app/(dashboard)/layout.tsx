'use client';

import Sidebar from '@/components/layout/Sidebar';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar expanded={sidebarExpanded} onToggle={setSidebarExpanded} />
      <main
        className={`flex-1 min-h-screen transition-all duration-200 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
