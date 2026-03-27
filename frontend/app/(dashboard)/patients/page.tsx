'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { usePatients } from '@/hooks/usePatients';
import PatientsTable from '@/components/tables/PatientsTable';
import PatientsToolbar from '@/components/patients/PatientsToolbar';
import PatientsPagination from '@/components/patients/PatientsPagination';

export default function Patients() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(
    () => ({
      q: debouncedSearch || undefined,
      gender: gender || undefined,
      status: status || undefined,
      page,
      pageSize,
    }),
    [debouncedSearch, gender, status, page, pageSize]
  );

  const {
    patients,
    loading,
    error,
    totalPages,
    totalRecords,
  } = usePatients(query);

  const handleGenderChange = (value: string) => {
    setGender(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const handleExportCsv = () => {
    if (!patients.length) {
      toast.error('No patient records available to export');
      return;
    }

    const headers = ['UHID', 'Name', 'Mobile', 'DOB', 'Gender', 'Status'];
    const rows = patients.map((patient) => [
      patient.uhid,
      patient.patientName,
      patient.mobile,
      new Date(patient.dob).toLocaleDateString('en-IN'),
      patient.gender,
      patient.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patients-page-${page}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleExportPdf = async () => {
    if (!patients.length) {
      toast.error('No patient records available to export');
      return;
    }

    try {
      const win = window as Window & {
        jspdf?: { jsPDF: new (options?: { orientation?: string; unit?: string; format?: string }) => any };
      };

      if (!win.jspdf) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load PDF library'));
          document.head.appendChild(script);
        });
      }

      const jsPDF = win.jspdf?.jsPDF;
      if (!jsPDF) {
        throw new Error('PDF library unavailable');
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 48;

      doc.setFontSize(16);
      doc.text('Patient List', 40, y);
      y += 20;

      doc.setFontSize(10);
      doc.setTextColor(90);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 40, y);
      doc.text(`Page: ${page} | Rows: ${patients.length}`, pageWidth - 180, y, { align: 'left' });
      y += 20;

      const headers = ['UHID', 'Name', 'Mobile', 'DOB', 'Gender', 'Status'];
      const columns = [40, 150, 350, 470, 560, 640];
      const rowHeight = 22;

      const drawHeader = (currentY: number) => {
        doc.setFillColor(240, 244, 248);
        doc.rect(36, currentY - 14, pageWidth - 72, rowHeight, 'F');
        doc.setFontSize(10);
        doc.setTextColor(30);
        headers.forEach((header, index) => doc.text(header, columns[index], currentY));
      };

      const clip = (value: string, max = 24) =>
        value.length > max ? `${value.slice(0, max - 1)}...` : value;

      drawHeader(y);
      y += rowHeight;

      doc.setFontSize(10);
      patients.forEach((patient, index) => {
        if (y > 560) {
          doc.addPage();
          y = 48;
          drawHeader(y);
          y += rowHeight;
        }

        if (index % 2 === 1) {
          doc.setFillColor(250, 251, 253);
          doc.rect(36, y - 14, pageWidth - 72, rowHeight, 'F');
        }

        const row = [
          patient.uhid,
          clip(patient.patientName, 30),
          patient.mobile,
          new Date(patient.dob).toLocaleDateString('en-IN'),
          patient.gender,
          patient.status,
        ];

        row.forEach((value, colIndex) => doc.text(String(value), columns[colIndex], y));
        y += rowHeight;
      });

      doc.save(`patients-page-${page}-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success('PDF exported successfully');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  const handlePrint = () => {
    if (!patients.length) {
      toast.error('No patient records available to print');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      toast.error('Pop-up blocked. Please allow pop-ups to print.');
      return;
    }

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const rows = patients
      .map(
        (patient) => `
          <tr>
            <td>${escapeHtml(patient.uhid)}</td>
            <td>${escapeHtml(patient.patientName)}</td>
            <td>${escapeHtml(patient.mobile)}</td>
            <td>${escapeHtml(new Date(patient.dob).toLocaleDateString('en-IN'))}</td>
            <td>${escapeHtml(patient.gender)}</td>
            <td>${escapeHtml(patient.status)}</td>
          </tr>`
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Patient List</title>
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
          <h1>Patient List</h1>
          <p>Generated on ${new Date().toLocaleString('en-IN')} | Page ${page} | Rows ${patients.length}</p>
          <table>
            <thead>
              <tr>
                <th>UHID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>DOB</th>
                <th>Gender</th>
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

  return (
    <div className="space-y-4">
      <div className="mb-1">
        <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage patient records with search, filters, actions and exports.
        </p>
      </div>

      <PatientsToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        genderValue={gender}
        onGenderChange={handleGenderChange}
        statusValue={status}
        onStatusChange={handleStatusChange}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm mb-4">
          Error loading patients: {error}
        </div>
      )}
      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white py-16 text-center text-gray-500">
          Loading patients...
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <PatientsTable patients={patients} />
          <PatientsPagination
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
