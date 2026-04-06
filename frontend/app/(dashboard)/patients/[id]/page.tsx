'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import patientService, {
  AdmissionDetailsResponse,
  LabReportMedicalResponse,
  MedicalHistoryResponse,
  MedicationMedicalResponse,
  PatientResponse,
  ProgressNoteMedicalResponse,
  VitalSignsResponse,
} from '@/services/patientService';
import { notify } from '@/lib/toast';

type TabKey = 'overview' | 'medical' | 'clinical' | 'medications' | 'lab' | 'progress' | 'billing';

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params?.id);
  const [patient, setPatient] = useState<PatientResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [medicalLoading, setMedicalLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryResponse | null>(null);
  const [vitalSigns, setVitalSigns] = useState<VitalSignsResponse[]>([]);
  const [medications, setMedications] = useState<MedicationMedicalResponse[]>([]);
  const [labReports, setLabReports] = useState<LabReportMedicalResponse[]>([]);
  const [progressNotes, setProgressNotes] = useState<ProgressNoteMedicalResponse[]>([]);
  const [currentAdmission, setCurrentAdmission] = useState<AdmissionDetailsResponse | null>(null);
  const [admissionHistory, setAdmissionHistory] = useState<AdmissionDetailsResponse[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMedicalLoading(true);

        const [
          patientDetails,
          medicalHistoryData,
          vitalSignsData,
          medicationsData,
          labReportsData,
          progressNotesData,
          currentAdmissionData,
          admissionHistoryData,
        ] = await Promise.all([
          patientService.getPatientDetailsById(patientId),
          patientService.getMedicalHistory(patientId),
          patientService.getVitalSigns(patientId, 25),
          patientService.getMedications(patientId),
          patientService.getLabReports(patientId),
          patientService.getProgressNotes(patientId, 50),
          patientService.getCurrentAdmission(patientId),
          patientService.getAdmissionHistory(patientId),
        ]);

        setPatient(patientDetails);
        setMedicalHistory(medicalHistoryData);
        setVitalSigns(vitalSignsData);
        setMedications(medicationsData);
        setLabReports(labReportsData);
        setProgressNotes(progressNotesData);
        setCurrentAdmission(currentAdmissionData);
        setAdmissionHistory(admissionHistoryData);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load patient details';
        notify.error(message, { id: 'patient:detail:load:error' });
        router.push('/patients');
      } finally {
        setLoading(false);
        setMedicalLoading(false);
      }
    };

    if (!Number.isFinite(patientId) || patientId <= 0) {
      notify.warning('Invalid patient id', { id: 'patient:detail:invalid-id' });
      router.push('/patients');
      return;
    }

    load();
  }, [patientId, router]);

  const details = useMemo(() => {
    if (!patient) return [];
    return [
      { label: 'UHID', value: patient.uhid || '-' },
      { label: 'Name', value: patient.patientName || '-' },
      { label: 'Mobile', value: patient.mobile || '-' },
      { label: 'DOB', value: patient.dob ? new Date(patient.dob).toLocaleDateString('en-IN') : '-' },
      { label: 'Gender', value: patient.gender || '-' },
      { label: 'Status', value: patient.status || '-' },
      { label: 'Email', value: patient.email || '-' },
      { label: 'Address', value: patient.address || '-' },
    ];
  }, [patient]);

  const billingDetails = useMemo(() => {
    if (!patient) return [];
    return [
      { label: 'OPD Billings', value: patient.opdBillings?.length || 0 },
      { label: 'ECG Billings', value: patient.ecgBillings?.length || 0 },
      { label: 'X-ray Billings', value: patient.xrayBillings?.length || 0 },
      { label: 'Lab Billings', value: patient.labBillings?.length || 0 },
      { label: 'IP Billings', value: patient.ipBillings?.length || 0 },
    ];
  }, [patient]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading patient details...
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'medical', label: 'Medical History' },
    { key: 'clinical', label: 'Clinical' },
    { key: 'medications', label: 'Medications' },
    { key: 'lab', label: 'Lab Reports' },
    { key: 'progress', label: 'Progress Notes' },
    { key: 'billing', label: 'Billing' },
  ];

  const renderOverviewTab = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {patient.currentAppointment && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Current Appointment</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-emerald-100 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Doctor</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{patient.currentAppointment.doctorName}</p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{new Date(patient.currentAppointment.appointmentDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Time</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{patient.currentAppointment.startTime} - {patient.currentAppointment.endTime}</p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Status</p>
              <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {patient.currentAppointment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          <Link href={`/appointments?patientId=${patient.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        {patient.previousAppointments && patient.previousAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Appointment #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Doctor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {patient.previousAppointments.slice(-5).reverse().map((appointment, index) => (
                  <tr key={`${appointment.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{appointment.appointmentNo}</td>
                    <td className="px-4 py-3">{appointment.doctorName}</td>
                    <td className="px-4 py-3">{new Date(appointment.appointmentDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No appointment history available.</p>
        )}
      </div>
    </div>
  );

  const renderMedicalHistoryTab = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Medical Background</h2>
      {medicalLoading ? (
        <p className="text-sm text-gray-500">Loading medical history...</p>
      ) : !medicalHistory ? (
        <p className="text-sm text-gray-500">No medical history available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Known Allergies</p>
            <p className="mt-1 text-sm text-gray-900">{medicalHistory.knownAllergies || 'None reported'}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Chronic Conditions</p>
            <p className="mt-1 text-sm text-gray-900">{medicalHistory.chronicConditions || 'None reported'}</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Lifestyle</p>
            <p className="mt-1 text-sm text-gray-900">
              {medicalHistory.isSmoker ? 'Smoker' : 'Non-smoker'} | {medicalHistory.usesAlcohol ? 'Uses alcohol' : 'No alcohol'}
            </p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 sm:col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Additional Notes</p>
            <p className="mt-1 text-sm text-gray-900">{medicalHistory.additionalNotes || 'No additional notes.'}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderClinicalTab = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Current Admission</h2>
        {!currentAdmission ? (
          <p className="text-sm text-gray-500">No active admission for this patient.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"><p className="text-xs text-gray-500">Admission #</p><p className="text-sm font-medium text-gray-900">{currentAdmission.admissionNumber}</p></div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"><p className="text-xs text-gray-500">Department</p><p className="text-sm font-medium text-gray-900">{currentAdmission.department}</p></div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"><p className="text-xs text-gray-500">Doctor</p><p className="text-sm font-medium text-gray-900">{currentAdmission.assignedDoctorName || '-'}</p></div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"><p className="text-xs text-gray-500">Room / Bed</p><p className="text-sm font-medium text-gray-900">{currentAdmission.roomNumber || '-'} / {currentAdmission.bedNumber || '-'}</p></div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Vitals</h2>
        {vitalSigns.length === 0 ? (
          <p className="text-sm text-gray-500">No vital signs recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Recorded At</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Temp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">BP</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Pulse</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">SpO2</th>
                </tr>
              </thead>
              <tbody>
                {vitalSigns.slice(0, 10).map((vital) => (
                  <tr key={vital.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">{new Date(vital.recordedAt).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">{vital.temperature ?? '-'}</td>
                    <td className="px-4 py-3">{vital.systolicBP ?? '-'}/{vital.diastolicBP ?? '-'}</td>
                    <td className="px-4 py-3">{vital.pulseRate ?? '-'}</td>
                    <td className="px-4 py-3">{vital.oxygenSaturation ?? '-'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Admission History</h2>
        {admissionHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No historical admissions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Admission #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Diagnosis</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {admissionHistory.map((admission) => (
                  <tr key={admission.id} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-blue-600">{admission.admissionNumber}</td>
                    <td className="px-4 py-3">{new Date(admission.admissionDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">{admission.primaryDiagnosis || '-'}</td>
                    <td className="px-4 py-3">{admission.dischargeStatus || 'Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderMedicationsTab = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Medications</h2>
      {medications.length === 0 ? (
        <p className="text-sm text-gray-500">No medication records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Medication</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Dosage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Frequency</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((medication) => (
                <tr key={medication.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{medication.medicationName}</td>
                  <td className="px-4 py-3">{medication.dosage || '-'}</td>
                  <td className="px-4 py-3">{medication.frequency || '-'}</td>
                  <td className="px-4 py-3">
                    {new Date(medication.startDate).toLocaleDateString('en-IN')} - {medication.endDate ? new Date(medication.endDate).toLocaleDateString('en-IN') : 'Ongoing'}
                  </td>
                  <td className="px-4 py-3">{medication.isActive ? 'Active' : 'Stopped'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderLabReportsTab = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Lab Reports</h2>
      {labReports.length === 0 ? (
        <p className="text-sm text-gray-500">No lab reports available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Report #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Test</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Abnormal</th>
              </tr>
            </thead>
            <tbody>
              {labReports.map((report) => (
                <tr key={report.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-blue-600">{report.reportNumber}</td>
                  <td className="px-4 py-3">{report.testName}</td>
                  <td className="px-4 py-3">{new Date(report.testDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">{report.status}</td>
                  <td className="px-4 py-3">{report.isAbnormal ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderProgressNotesTab = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Progress Notes</h2>
      {progressNotes.length === 0 ? (
        <p className="text-sm text-gray-500">No progress notes available.</p>
      ) : (
        <div className="space-y-3">
          {progressNotes.map((note) => (
            <div key={note.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">{note.title}</p>
                <span className="text-xs text-gray-500">{new Date(note.notedAt).toLocaleString('en-IN')}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{note.noteContent}</p>
              <p className="mt-2 text-xs text-gray-500">{note.enteredByUserRole || 'Staff'} {note.enteredByUserName ? `• ${note.enteredByUserName}` : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Billing Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {billingDetails.map((item) => (
            <Link
              key={item.label}
              href={`/billing?type=${item.label.split(' ')[0].toLowerCase()}&patientId=${patient.id}`}
              className="rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-3 transition hover:border-blue-300 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="mt-1 text-xs text-gray-500">Click to view</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent OPD Billings</h2>
          <Link href={`/billing/opd?patientId=${patient.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        {patient.opdBillings && patient.opdBillings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Bill Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Doctor</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {patient.opdBillings.slice(-10).reverse().map((billing, index) => (
                  <tr key={`${billing.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-blue-600">{billing.billNumber}</td>
                    <td className="px-4 py-3">{new Date(billing.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">{billing.doctorName}</td>
                    <td className="px-4 py-3 text-right font-medium">₹{billing.netAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">{billing.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No OPD billings found.</p>
        )}
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'medical':
        return renderMedicalHistoryTab();
      case 'clinical':
        return renderClinicalTab();
      case 'medications':
        return renderMedicationsTab();
      case 'lab':
        return renderLabReportsTab();
      case 'progress':
        return renderProgressNotesTab();
      case 'billing':
        return renderBillingTab();
      case 'overview':
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
          <p className="mt-1 text-sm text-gray-500">View patient profile and basic contact information.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/appointments/book?patientId=${patient.id}`}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            Book Appointment
          </Link>
          <Link
            href={`/patients/${patient.id}/edit`}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Edit Patient
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-2 sm:p-3">
        <div className="flex gap-2 overflow-x-auto p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderActiveTab()}
    </div>
  );
}
