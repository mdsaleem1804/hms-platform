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
    <div className="min-h-screen bg-gray-50">
      <Sidebar expanded={sidebarExpanded} onToggle={setSidebarExpanded} />
      <main className={`${sidebarExpanded ? 'ml-64' : 'ml-16'} min-h-screen flex flex-col items-stretch transition-all duration-200`}>
        <div className="w-full max-w-6xl mx-auto px-6 py-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
