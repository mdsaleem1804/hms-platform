'use client';

import { useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requiredRole && authContext.user?.role !== requiredRole) {
      router.push('/dashboard');
      return;
    }
  }, [authContext?.isAuthenticated, authContext?.user?.role, requiredRole, router]);

  if (!authContext?.isAuthenticated) {
    return null;
  }

  if (requiredRole && authContext.user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.isAuthenticated) {
      router.push('/login');
      return;
    }

    const userRole = authContext.user?.role;
    const isAdmin =
      userRole === UserRole.SuperAdmin || userRole === UserRole.Admin;

    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
  }, [authContext?.isAuthenticated, authContext?.user?.role, router]);

  if (!authContext?.isAuthenticated) {
    return null;
  }

  const userRole = authContext.user?.role;
  const isAdmin =
    userRole === UserRole.SuperAdmin || userRole === UserRole.Admin;

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};
