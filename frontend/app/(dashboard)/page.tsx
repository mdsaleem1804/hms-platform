'use client';

import { useContext } from 'react';
import { AuthContext, UserRole } from '@/context/AuthContext';

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const getDashboardMessage = () => {
    const role = user?.role;
    const roleMessages: Record<string, string> = {
      [UserRole.SuperAdmin]: 'Welcome to the Super Admin Dashboard',
      [UserRole.Admin]: 'Welcome to the Admin Dashboard',
      [UserRole.Doctor]: 'Welcome to the Doctor Dashboard',
      [UserRole.Patient]: 'Welcome to the Patient Dashboard',
      [UserRole.Accountant]: 'Welcome to the Accountant Dashboard',
      [UserRole.Receptionist]: 'Welcome to the Receptionist Dashboard',
      [UserRole.Pharmacist]: 'Welcome to the Pharmacist Dashboard',
      [UserRole.Pathologist]: 'Welcome to the Pathologist Dashboard',
      [UserRole.Radiologist]: 'Welcome to the Radiologist Dashboard',
      [UserRole.Nurse]: 'Welcome to the Nurse Dashboard',
    };
    return roleMessages[role as string] || 'Welcome to your Dashboard';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">{getDashboardMessage()}</p>
      </div>

      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg text-gray-900">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <p className="text-lg text-gray-900">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {user.role}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-lg text-gray-900">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    user.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            System Status
          </h3>
          <p className="text-green-600 font-medium">✓ All Systems Operational</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Database Connection
          </h3>
          <p className="text-green-600 font-medium">✓ Connected</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            API Status
          </h3>
          <p className="text-green-600 font-medium">✓ API Running</p>
        </div>
      </div>
    </div>
  );
}
