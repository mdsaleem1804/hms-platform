'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import dashboardService, { RateModule, RevenueRate } from '@/services/dashboardService';
import { notify } from '@/lib/toast';

const MODULES: RateModule[] = ['OPD', 'IPD', 'ECG', 'XRAY', 'LAB'];

const MODULE_CONFIG: Record<RateModule, { displayLabel: string; nameHint: string }> = {
  OPD: { displayLabel: 'Service Name', nameHint: 'e.g. Consultation, Follow Up, Procedure' },
  IPD: { displayLabel: 'Charge Name', nameHint: 'e.g. General Ward Admission' },
  ECG: { displayLabel: 'Test Name', nameHint: 'e.g. Resting ECG' },
  XRAY: { displayLabel: 'Procedure Name', nameHint: 'e.g. Chest X-Ray' },
  LAB: { displayLabel: 'Test Name', nameHint: 'e.g. Complete Blood Count' },
};

const defaultForm = {
  module: 'OPD' as RateModule,
  serviceCode: '',
  displayName: '',
  isActive: true,
  visitType: '',
  rate: 0,
};

export function HospitalStandardRateManager() {
  const [rates, setRates] = useState<RevenueRate[]>([]);
  const [activeModule, setActiveModule] = useState<RateModule>('OPD');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    let active = true;

    const loadRates = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getRevenueRates(activeModule);
        if (!active) {
          return;
        }

        setRates(data);
      } catch (error) {
        if (!active) {
          return;
        }

        notify.error(error instanceof Error ? error.message : 'Failed to load hospital standard rates', {
          id: 'settings:hospital-rates:load:error',
        });
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadRates();

    return () => {
      active = false;
    };
  }, [activeModule]);

  const handleReset = () => {
    setFormData({ ...defaultForm, module: activeModule });
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const displayName = formData.displayName.trim();

    if (!displayName) {
      notify.warning('Service name is required', { id: 'settings:hospital-rates:display:required' });
      return;
    }

    if (formData.rate < 0) {
      notify.warning('Rate cannot be negative', { id: 'settings:hospital-rates:rate:invalid' });
      return;
    }

    // On create: derive a stable key from the display name. On edit: preserve the existing key.
    const serviceCode = editingId
      ? formData.serviceCode
      : displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    try {
      setIsSaving(true);

      if (editingId) {
        const updated = await dashboardService.updateRevenueRate(editingId, {
          module: formData.module,
          serviceCode,
          displayName,
          isActive: formData.isActive,
          visitType: serviceCode,
          rate: formData.rate,
        });

        setRates((current) =>
          current
            .map((rate) => (rate.id === editingId ? updated : rate))
            .sort((left, right) => left.displayName.localeCompare(right.displayName))
        );
        notify.success('Hospital standard rate updated', { id: 'settings:hospital-rates:update:success' });
      } else {
        const created = await dashboardService.createRevenueRate({
          module: formData.module,
          serviceCode,
          displayName,
          isActive: formData.isActive,
          visitType: serviceCode,
          rate: formData.rate,
        });

        setRates((current) => [...current, created].sort((left, right) => left.displayName.localeCompare(right.displayName)));
        notify.success('Hospital standard rate created', { id: 'settings:hospital-rates:create:success' });
      }

      handleReset();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to save hospital standard rate', {
        id: 'settings:hospital-rates:save:error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (rate: RevenueRate) => {
    setEditingId(rate.id);
    setFormData({
      module: rate.module,
      serviceCode: rate.serviceCode,
      displayName: rate.displayName,
      isActive: rate.isActive,
      visitType: rate.serviceCode,
      rate: rate.rate,
    });
    setActiveModule(rate.module);
  };

  const handleDelete = async (rateId: string) => {
    if (!window.confirm('Are you sure you want to delete this hospital standard rate?')) {
      return;
    }

    try {
      await dashboardService.deleteRevenueRate(rateId);
      setRates((current) => current.filter((rate) => rate.id !== rateId));

      if (editingId === rateId) {
        handleReset();
      }

      notify.success('Hospital standard rate deleted', { id: 'settings:hospital-rates:delete:success' });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Failed to delete hospital standard rate', {
        id: 'settings:hospital-rates:delete:error',
      });
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Hospital Standard Rates</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage default service catalogs and pricing across OPD, IPD, ECG, X-ray, and Lab.
        </p>
      </div>

      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex flex-wrap gap-2">
          {MODULES.map((module) => (
            <button
              key={module}
              type="button"
              onClick={() => {
                setActiveModule(module);
                setEditingId(null);
                setFormData((current) => ({ ...defaultForm, module, isActive: current.isActive }));
              }}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                activeModule === module
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700'
              }`}
            >
              {module}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-6 xl:grid-cols-[360px,1fr]">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            {editingId ? `Edit ${activeModule} Rate` : `Add ${activeModule} Rate`}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">{MODULE_CONFIG[activeModule].displayLabel} *</span>
              <input
                type="text"
                value={formData.displayName}
                onChange={(event) => setFormData((current) => ({ ...current, module: activeModule, displayName: event.target.value }))}
                placeholder={MODULE_CONFIG[activeModule].nameHint}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Rate (₹) *</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={formData.rate}
                onChange={(event) => setFormData((current) => ({ ...current, rate: Number(event.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(event) => setFormData((current) => ({ ...current, module: activeModule, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Active (available for billing selection)
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Update Rate' : 'Add Rate'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Configured {activeModule} Rates</h3>

          {isLoading ? (
            <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
          ) : rates.length > 0 ? (
            <div className="space-y-2">
              {rates.map((rate) => (
                <div
                  key={rate.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{rate.displayName}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rate.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {rate.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-sm font-semibold text-emerald-700">₹{rate.rate.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => handleEdit(rate)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(rate.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
              No {activeModule} rates configured yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
