'use client';

import { useState, useEffect, useCallback } from 'react';
import patientService, {
  PatientListParams,
  PatientResponse,
} from '@/services/patientService';

export const usePatients = (params: PatientListParams = {}) => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getPatients(params);
      setPatients(data.items || []);
      setPage(data.page || 1);
      setPageSize(data.pageSize || 10);
      setTotalRecords(data.totalRecords || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch patients';
      setError(errorMsg);
      setPatients([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    page,
    pageSize,
    totalRecords,
    totalPages,
    refetch: fetchPatients,
  };
};
