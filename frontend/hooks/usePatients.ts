'use client';

import { useState, useEffect, useCallback } from 'react';
import patientService, { PatientResponse } from '@/services/patientService';

export const usePatients = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch patients';
      setError(errorMsg);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
};
