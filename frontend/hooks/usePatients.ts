'use client';

import { useState, useEffect } from 'react';
import { patientService } from '@/services/api';

interface Patient {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth: string;
  gender: string;
}

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await patientService.getAll();
        setPatients(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch patients');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return { patients, loading, error };
};
