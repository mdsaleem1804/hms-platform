'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome to HMS Platform</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            Profile
          </button>
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
