'use client';

import React, { createContext, useState, useEffect } from 'react';

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Doctor = 'Doctor',
  Patient = 'Patient',
  Accountant = 'Accountant',
  Receptionist = 'Receptionist',
  Pharmacist = 'Pharmacist',
  Pathologist = 'Pathologist',
  Radiologist = 'Radiologist',
  Nurse = 'Nurse',
}

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  login: (user: UserDto, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse stored auth data', e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsHydrated(true);
  }, []);

  const login = (userData: UserDto, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {isHydrated && children}
    </AuthContext.Provider>
  );
};
