import type { Metadata } from 'next';
import { ToasterProvider } from './ToasterProvider';
import Header from '@/components/layout/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'HMS Platform',
  description: 'Hospital Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
