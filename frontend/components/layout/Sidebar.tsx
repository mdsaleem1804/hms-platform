'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <aside className="w-64 bg-gray-900 text-white shadow-lg">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">HMS</h1>
        <p className="text-gray-400 text-sm">Platform</p>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        <Link href="/dashboard">
          <div
            className={`px-4 py-2 rounded-lg transition ${
              isActive('dashboard')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Dashboard
          </div>
        </Link>

        <Link href="/patients">
          <div
            className={`px-4 py-2 rounded-lg transition ${
              isActive('patients')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Patients
          </div>
        </Link>

        <Link href="/appointments">
          <div
            className={`px-4 py-2 rounded-lg transition ${
              isActive('appointments')
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            Appointments
          </div>
        </Link>
      </nav>

      <div className="absolute bottom-4 left-4 right-4 border-t border-gray-700 pt-4">
        <p className="text-gray-400 text-xs">© 2024 HMS Platform</p>
      </div>
    </aside>
  );
}
