'use client';

import { ToasterProvider } from './ToasterProvider';
import Header from '@/components/layout/Header';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <Header />
          {children}
          <ToasterProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
