'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#111827',
          color: '#ffffff',
          fontSize: '14px',
          maxWidth: '420px',
        },
        success: {
          duration: 3500,
        },
      }}
    />
  );
}
