'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { Heart, Lock, Mail } from 'lucide-react';

const demoCredentials = [
  { email: 'superadmin@hospital.com', password: 'SuperAdmin@123', role: 'SuperAdmin' },
  { email: 'admin@hospital.com', password: 'Admin@123', role: 'Admin' },
  { email: 'doctor@hospital.com', password: 'Doctor@123', role: 'Doctor' },
  { email: 'patient@hospital.com', password: 'Patient@123', role: 'Patient' },
  { email: 'accountant@hospital.com', password: 'Accountant@123', role: 'Accountant' },
  { email: 'receptionist@hospital.com', password: 'Receptionist@123', role: 'Receptionist' },
  { email: 'pharmacist@hospital.com', password: 'Pharmacist@123', role: 'Pharmacist' },
  { email: 'pathologist@hospital.com', password: 'Pathologist@123', role: 'Pathologist' },
  { email: 'radiologist@hospital.com', password: 'Radiologist@123', role: 'Radiologist' },
  { email: 'nurse@hospital.com', password: 'Nurse@123', role: 'Nurse' },
];

export default function LoginPage() {
  const { login } = useContext(AuthContext)!;
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@hospital.com');
  const [password, setPassword] = useState('SuperAdmin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://153.75.224.163:7000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Map backend response to UserDto format
      const userData = {
        id: data.data.userId,
        email: data.data.userEmail,
        firstName: data.data.userName.split(' ')[0],
        lastName: data.data.userName.split(' ').slice(1).join(' '),
        role: data.data.role,
        isActive: true,
      };

      // Call login context to store token and user data
      login(userData, data.data.token);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Hospital Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center text-white">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 w-full">
            <div className="flex justify-center mb-6">
              <Heart className="w-24 h-24 text-red-300 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-center mb-4">Lakshmi Hospitals</h1>
            <p className="text-xl text-center text-blue-100 mb-8">
              Comprehensive Healthcare Management System
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm text-blue-100">Healthcare Professionals</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">100K+</p>
                <p className="text-sm text-blue-100">Patients Served</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-blue-100">Emergency Service</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-sm text-blue-100">Departments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-center mb-8">Sign in to access your hospital dashboard</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                <p className="text-red-700 text-sm font-semibold flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 hover:border-gray-400"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition-all duration-200 transform hover:shadow-lg hover:scale-105 disabled:scale-100 mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials Section */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200">
              <p className="text-xs text-gray-600 text-center mb-4 font-bold uppercase tracking-widest">
                Demo Access - Click to Fill
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => fillDemoCredentials(cred.email, cred.password)}
                    className="text-xs font-semibold bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-cyan-50 text-gray-700 hover:text-blue-600 px-2 py-2.5 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
                    title={`${cred.role}\n${cred.email}`}
                  >
                    {cred.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Lakshmi Hospitals © 2026 • Hospital Management System v1.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
