'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Save } from 'lucide-react';
import dashboardService, { HospitalSettings } from '@/services/dashboardService';
import { DoctorServiceRateManager } from '@/components/billing/DoctorServiceRateManager';
import { notify } from '@/lib/toast';

const defaultSettings: HospitalSettings = {
  hospitalName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phoneNumber: '',
  alternatePhoneNumber: '',
  email: '',
  website: '',
  gstNumber: '',
  registrationNumber: '',
  reportHeaderTagline: 'Healthcare Management System',
  reportFooterNote: 'Thank you for choosing our hospital. Please retain this bill for your records.',
};

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}{required ? ' *' : ''}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

export default function HospitalSettingsPage() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<HospitalSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hospital' | 'service-rates'>('hospital');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'service-rates') {
      setActiveTab('service-rates');
    }
  }, [searchParams]);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        const settings = await dashboardService.getHospitalSettings();
        if (!active) return;
        setFormData({ ...defaultSettings, ...settings });
      } catch (error) {
        if (!active) return;
        notify.error(error instanceof Error ? error.message : 'Failed to load hospital settings', {
          id: 'settings:hospital:load:error',
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const updateField = (key: keyof HospitalSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.hospitalName.trim()) {
      notify.warning('Hospital name is required', { id: 'settings:hospital:name:required' });
      return;
    }

    try {
      setSaving(true);
      const updated = await dashboardService.updateHospitalSettings({
        ...formData,
        hospitalName: formData.hospitalName.trim(),
      });
      setFormData({ ...defaultSettings, ...updated });
      notify.success('Hospital settings saved successfully', { id: 'settings:hospital:save:success' });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to save hospital settings', {
        id: 'settings:hospital:save:error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Loading hospital settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage hospital settings and service rates.
          </p>
        </div>
        {activeTab === 'hospital' && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('hospital')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'hospital'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Hospital Settings
          </button>
          <button
            onClick={() => setActiveTab('service-rates')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'service-rates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Service Rates
          </button>
        </div>
      </div>

      {/* Hospital Settings Tab */}
      {activeTab === 'hospital' && (
        <>
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Basic Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Hospital Name" value={formData.hospitalName} onChange={(v) => updateField('hospitalName', v)} required />
              <Field label="Tagline" value={formData.reportHeaderTagline} onChange={(v) => updateField('reportHeaderTagline', v)} />
              <Field label="Phone Number" value={formData.phoneNumber} onChange={(v) => updateField('phoneNumber', v)} />
              <Field label="Alternate Phone" value={formData.alternatePhoneNumber} onChange={(v) => updateField('alternatePhoneNumber', v)} />
              <Field label="Email" value={formData.email} onChange={(v) => updateField('email', v)} type="email" />
              <Field label="Website" value={formData.website} onChange={(v) => updateField('website', v)} />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Address</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Address Line 1" value={formData.addressLine1} onChange={(v) => updateField('addressLine1', v)} />
              <Field label="Address Line 2" value={formData.addressLine2} onChange={(v) => updateField('addressLine2', v)} />
              <Field label="City" value={formData.city} onChange={(v) => updateField('city', v)} />
              <Field label="State" value={formData.state} onChange={(v) => updateField('state', v)} />
              <Field label="Postal Code" value={formData.postalCode} onChange={(v) => updateField('postalCode', v)} />
              <Field label="Country" value={formData.country} onChange={(v) => updateField('country', v)} />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Compliance and Report Footer</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="GST Number" value={formData.gstNumber} onChange={(v) => updateField('gstNumber', v)} />
              <Field label="Registration Number" value={formData.registrationNumber} onChange={(v) => updateField('registrationNumber', v)} />
            </div>
            <label className="mt-4 block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Report Footer Note</span>
              <textarea
                value={formData.reportFooterNote}
                onChange={(event) => updateField('reportFooterNote', event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </section>
        </>
      )}

      {/* Service Rates Tab */}
      {activeTab === 'service-rates' && (
        <DoctorServiceRateManager isOpen={true} onClose={() => setActiveTab('hospital')} />
      )}
    </div>
  );
}
