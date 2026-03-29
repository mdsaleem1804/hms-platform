'use client';

export default function OPD() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Out-Patient Department (OPD)</h1>
          <p className="mt-2 text-gray-600">Manage out-patient consultations and follow-ups</p>
        </div>

        {/* In Progress Banner */}
        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-yellow-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Feature in Development</h3>
              <p className="mt-2 text-sm text-yellow-700">
                Out-patient department management including consultation scheduling, medical records,
                and prescription management will be available soon.
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Consultations', 'Medical Records', 'Prescriptions', 'Follow-up Care'].map((item) => (
            <div key={item} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded">
                <svg
                  className="h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{item}</h3>
              <p className="mt-2 text-sm text-gray-600">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
