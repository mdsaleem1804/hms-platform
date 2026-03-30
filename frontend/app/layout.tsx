'use client';

import { ToasterProvider } from './ToasterProvider';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import './globals.css';

function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />}
      {children}
      <ToasterProvider />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
