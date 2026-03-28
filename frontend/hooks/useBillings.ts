'use client';

import { useCallback, useEffect, useState } from 'react';
import billingService, { BillingListParams, BillingRecord } from '@/services/billingService';

export const useBillings = (params: BillingListParams = {}) => {
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBillings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await billingService.getBillings(params);
      setBillings(data.items || []);
      setPage(data.page || 1);
      setPageSize(data.pageSize || 10);
      setTotalRecords(data.totalRecords || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch billings';
      setError(message);
      setBillings([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchBillings();
  }, [fetchBillings]);

  return {
    billings,
    loading,
    error,
    page,
    pageSize,
    totalRecords,
    totalPages,
    refetch: fetchBillings,
  };
};
