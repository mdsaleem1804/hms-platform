'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

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
      const response = await fetch('http://localhost:7000/api/auth/login', {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HMS</h1>
            <p className="text-gray-600">Hospital Management System</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Enter password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-4 font-semibold">
              DEMO CREDENTIALS - Click to Fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-2 rounded border border-gray-300 transition-colors duration-200"
                  title={`${cred.role}\n${cred.email}`}
                >
                  {cred.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Hospital Management System v1.0</p>
        </div>
      </div>
    </div>
  );
}
