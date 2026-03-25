'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-14 flex items-center px-4 md:px-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Welcome to HMS Platform</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Profile
          </button>
          <button className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
