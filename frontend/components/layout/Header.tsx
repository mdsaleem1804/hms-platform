'use client';

import { Search, Bell, Settings, LogOut, User, Calendar, Calculator, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center px-4 md:px-6 sticky top-0 z-40">
      <div className="flex justify-between items-center w-full">
        {/* Logo and Hospital Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LH</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Lakshmi Hospitals</h1>
              <p className="text-xs text-gray-500">HMIS</p>
            </div>
          </div>
        </div>

        {/* Search Bar and Quick Actions */}
        <div className="flex items-center gap-4 flex-1 max-w-md mx-6">
          {/* Patient Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Doctor Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Language Selector */}
          <button className="px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium">
            EN
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition relative"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  <div className="text-sm text-gray-500">No new notifications</div>
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Calendar"
          >
            <Calendar className="h-5 w-5" />
          </button>

          {/* Calculator */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Calculator"
          >
            <Calculator className="h-5 w-5" />
          </button>

          {/* Pending Tasks */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition relative"
            title="Pending Tasks"
          >
            <Clock className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-yellow-500 rounded-full"></span>
          </button>

          {/* Messages/Notifications */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Messages"
          >
            <MessageSquare className="h-5 w-5" />
          </button>

          {/* User Menu Dropdown */}
          <div className="relative group">
            <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
              <User className="h-5 w-5" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">
                <User className="h-4 w-4 inline mr-2" />
                Profile
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4 inline mr-2" />
                Settings
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg border-t border-gray-200">
                <LogOut className="h-4 w-4 inline mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Settings */}
          <button
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
