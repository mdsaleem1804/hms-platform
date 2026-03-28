'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import BillingListToolbar from '@/components/billing/BillingListToolbar';
import BillingPagination from '@/components/billing/BillingPagination';
import BillingsTable from '@/components/tables/BillingsTable';
import { useBillings } from '@/hooks/useBillings';
import billingService, { BillingRecord } from '@/services/billingService';
import doctorService, { DoctorSummary } from '@/services/doctorService';

export default function OpdBillingListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [processingCancelId, setProcessingCancelId] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      page,
      pageSize,
      search: searchQuery || undefined,
      status: status || undefined,
      doctorId: doctorId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [page, pageSize, searchQuery, status, doctorId, fromDate, toDate]
  );

  const {
    billings,
    loading,
    error,
    totalPages,
    totalRecords,
    refetch,
  } = useBillings(query);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await doctorService.getAll();
        setDoctors(data);
      } catch {
        setDoctors([]);
      }
    };

    loadDoctors();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleDoctorChange = (value: string) => {
    setDoctorId(value);
    setPage(1);
  };

  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    setPage(1);
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const handleExportExcel = () => {
    if (!billings.length) {
      toast.error('No billing records available to export');
      return;
    }

    const headers = ['Bill Number', 'Date', 'Patient Name', 'UHID', 'Doctor', 'Visit Type', 'Net Amount', 'Paid Amount', 'Status'];
    const rows = billings.map((bill) => [
      bill.billNumber,
      new Date(bill.date).toLocaleDateString('en-IN'),
      bill.patientName,
      bill.patientUhid,
      bill.doctorName,
      bill.visitType,
      String(bill.netAmount),
      String(bill.paidAmount),
      bill.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `opd-billing-page-${page}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Excel export generated successfully');
  };

  const handlePrint = () => {
    if (!billings.length) {
      toast.error('No billing records available to print');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1280,height=900');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print.');
      return;
    }

    const rows = billings
      .map(
        (bill) => `
          <tr>
            <td>${bill.billNumber}</td>
            <td>${new Date(bill.date).toLocaleDateString('en-IN')}</td>
            <td>${bill.patientName}</td>
            <td>${bill.patientUhid}</td>
            <td>${bill.doctorName}</td>
            <td>${bill.visitType}</td>
            <td style="text-align:right">${Number(bill.netAmount).toFixed(2)}</td>
            <td style="text-align:right">${Number(bill.paidAmount).toFixed(2)}</td>
            <td>${bill.status}</td>
          </tr>`
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>OPD Billing List</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
            h1 { margin: 0 0 6px; font-size: 22px; }
            p { margin: 0 0 18px; color: #4b5563; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; font-weight: 600; }
            tr:nth-child(even) td { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>OPD Billing List</h1>
          <p>Generated on ${new Date().toLocaleString('en-IN')} | Page ${page} | Rows ${billings.length}</p>
          <table>
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Patient Name</th>
                <th>UHID</th>
                <th>Doctor</th>
                <th>Visit Type</th>
                <th style="text-align:right">Net Amount</th>
                <th style="text-align:right">Paid Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleEdit = (bill: BillingRecord) => {
    if (bill.status === 'Paid') {
      toast.error('Paid bills cannot be edited');
      return;
    }

    toast('Edit flow can be connected to a dedicated update screen/API next.');
  };

  const handleCancel = async (bill: BillingRecord) => {
    if (!window.confirm(`Cancel bill ${bill.billNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      setProcessingCancelId(bill.id);
      await billingService.cancel(bill.id);
      toast.success(`Bill ${bill.billNumber} cancelled successfully`);
      await refetch();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel bill';
      toast.error(message);
    } finally {
      setProcessingCancelId(null);
    }
  };

  const safeBillings = billings ?? [];

  return (
    <div className="space-y-4">
      <div className="mb-1">
        <h1 className="text-3xl font-bold text-gray-900">OPD Billing</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage OPD bills with fast search, filters, exports, and billing actions.
        </p>
      </div>

      <BillingListToolbar
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        statusValue={status}
        onStatusChange={handleStatusChange}
        doctorIdValue={doctorId}
        onDoctorIdChange={handleDoctorChange}
        fromDateValue={fromDate}
        toDateValue={toDate}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        doctors={doctors}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
      />

      {processingCancelId && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          Cancelling bill...
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Error loading bills: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500">
          Loading bills...
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <BillingsTable
            billings={safeBillings}
            onCancel={handleCancel}
            onEdit={handleEdit}
          />
          <BillingPagination
            page={page}
            pageSize={pageSize}
            totalRecords={totalRecords}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
