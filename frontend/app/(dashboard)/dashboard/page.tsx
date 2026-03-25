'use client';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Total Patients</div>
          <div className="mt-2 text-3xl font-bold">1,234</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Today Appointments</div>
          <div className="mt-2 text-3xl font-bold">28</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Doctors Active</div>
          <div className="mt-2 text-3xl font-bold">15</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-500 text-sm font-medium">Pending Visits</div>
          <div className="mt-2 text-3xl font-bold">8</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500">Dashboard content placeholder</p>
      </div>
    </div>
  );
}
