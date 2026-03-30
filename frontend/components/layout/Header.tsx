'use client';

import { Search, Bell, Settings, LogOut, User, Calendar, Calculator, MessageSquare, Clock } from 'lucide-react';
import { useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import patientService from '@/services/patientService';
import doctorService from '@/services/doctorService';
import PatientDetailsModal from './header/PatientDetailsModal';
import DoctorDetailsModal from './header/DoctorDetailsModal';

interface PatientSearchResult {
  id: number;
  uhid: string;
  patientName: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup: string;
  mobile: string;
}

interface DoctorSearchResult {
  id: string;
  name: string;
  specialization: string;
  mobile: string;
  email?: string;
  departmentId: string;
}

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // Search state
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [patientResults, setPatientResults] = useState<PatientSearchResult[]>([]);
  const [doctorResults, setDoctorResults] = useState<DoctorSearchResult[]>([]);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);
  const [isSearchingDoctors, setIsSearchingDoctors] = useState(false);

  // Modal state
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorSearchResult | null>(null);

  // Debounce timers
  const patientSearchTimer = useRef<NodeJS.Timeout>();
  const doctorSearchTimer = useRef<NodeJS.Timeout>();

  // Patient Search with debouncing
  useEffect(() => {
    if (patientSearchTimer.current) {
      clearTimeout(patientSearchTimer.current);
    }

    if (!patientSearch.trim()) {
      setPatientResults([]);
      return;
    }

    setIsSearchingPatients(true);
    patientSearchTimer.current = setTimeout(async () => {
      try {
        const results = await patientService.searchPatients(patientSearch, 5);
        setPatientResults(results);
      } catch (error) {
        console.error('Failed to search patients:', error);
        setPatientResults([]);
      } finally {
        setIsSearchingPatients(false);
      }
    }, 300);

    return () => {
      if (patientSearchTimer.current) {
        clearTimeout(patientSearchTimer.current);
      }
    };
  }, [patientSearch]);

  // Doctor Search with debouncing
  useEffect(() => {
    if (doctorSearchTimer.current) {
      clearTimeout(doctorSearchTimer.current);
    }

    if (!doctorSearch.trim()) {
      setDoctorResults([]);
      return;
    }

    setIsSearchingDoctors(true);
    doctorSearchTimer.current = setTimeout(async () => {
      try {
        const results = await doctorService.searchDoctors(doctorSearch, 5);
        setDoctorResults(results);
      } catch (error) {
        console.error('Failed to search doctors:', error);
        setDoctorResults([]);
      } finally {
        setIsSearchingDoctors(false);
      }
    }, 300);

    return () => {
      if (doctorSearchTimer.current) {
        clearTimeout(doctorSearchTimer.current);
      }
    };
  }, [doctorSearch]);

  const handlePatientSelect = (patient: PatientSearchResult) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    setPatientSearch('');
    setPatientResults([]);
  };

  const handleDoctorSelect = (doctor: DoctorSearchResult) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
    setDoctorSearch('');
    setDoctorResults([]);
  };

  const handleLogout = () => {
    authContext?.logout();
    router.push('/login');
  };

  return (
    <>
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
          <div className="flex items-center gap-3 flex-1 max-w-2xl mx-6">
            {/* Patient Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search patients..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isSearchingPatients ? (
                <div className="absolute right-2 top-2.5 h-4 w-4">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              )}

              {/* Patient Results Dropdown */}
              {patientSearch && patientResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {patientResults.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handlePatientSelect(patient)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient.patientName}
                          </p>
                          <p className="text-xs text-gray-500">{patient.mobile}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          View
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search doctors..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isSearchingDoctors ? (
                <div className="absolute right-2 top-2.5 h-4 w-4">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
              ) : (
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
              )}

              {/* Doctor Results Dropdown */}
              {doctorSearch && doctorResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {doctorResults.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{doctor.name}</p>
                          <p className="text-xs text-gray-500">{doctor.specialization}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          View
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg border-t border-gray-200"
              >
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

    {/* Patient Details Modal */}
    <PatientDetailsModal
      isOpen={showPatientModal}
      patient={selectedPatient}
      onClose={() => {
        setShowPatientModal(false);
        setSelectedPatient(null);
      }}
    />

    {/* Doctor Details Modal */}
    <DoctorDetailsModal
      isOpen={showDoctorModal}
      doctor={selectedDoctor}
      onClose={() => {
        setShowDoctorModal(false);
        setSelectedDoctor(null);
      }}
    />
    </>
  );
}
