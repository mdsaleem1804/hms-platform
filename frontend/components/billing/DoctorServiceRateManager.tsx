'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import doctorServiceRateService, { DoctorServiceRateSummaryDto } from '@/services/doctorServiceRateService';
import doctorService, { DoctorSummary } from '@/services/doctorService';

interface DoctorServiceRateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  embedded?: boolean;
}

export function DoctorServiceRateManager({ isOpen, onClose, embedded = false }: DoctorServiceRateManagerProps) {
  const [doctors, setDoctors] = useState<DoctorSummary[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [rates, setRates] = useState<DoctorServiceRateSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: '',
    rate: 0,
    effectiveFrom: new Date().toISOString().split('T')[0],
    effectiveTo: '',
  });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctors = await doctorService.getAll();
        setDoctors(doctors || []);
      } catch (error) {
        console.error('Error loading doctors:', error);
        toast.error('Failed to load doctors');
      }
    };

    if (isOpen) {
      loadDoctors();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadRates = async () => {
      if (!selectedDoctorId) {
        setRates([]);
        return;
      }

      setIsLoading(true);
      try {
        const ratesData = await doctorServiceRateService.getRatesByDoctor(selectedDoctorId);
        setRates(ratesData);
      } catch (error) {
        console.error('Error loading rates:', error);
        toast.error('Failed to load service rates');
      } finally {
        setIsLoading(false);
      }
    };

    loadRates();
  }, [selectedDoctorId]);

  const handleReset = () => {
    setFormData({
      serviceName: '',
      serviceDescription: '',
      rate: 0,
      effectiveFrom: new Date().toISOString().split('T')[0],
      effectiveTo: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctorId || !formData.serviceName || formData.rate < 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await doctorServiceRateService.updateRate(editingId, {
          serviceName: formData.serviceName,
          serviceDescription: formData.serviceDescription || undefined,
          rate: formData.rate,
          effectiveFrom: formData.effectiveFrom,
          effectiveTo: formData.effectiveTo || null,
        });
        toast.success('Service rate updated');
      } else {
        await doctorServiceRateService.createRate({
          doctorId: selectedDoctorId,
          serviceName: formData.serviceName,
          serviceDescription: formData.serviceDescription || undefined,
          rate: formData.rate,
          effectiveFrom: formData.effectiveFrom,
          effectiveTo: formData.effectiveTo || null,
        });
        toast.success('Service rate created');
      }

      handleReset();
      const ratesData = await doctorServiceRateService.getRatesByDoctor(selectedDoctorId);
      setRates(ratesData);
    } catch (error) {
      console.error('Error saving service rate:', error);
      toast.error('Failed to save service rate');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (rateId: string) => {
    if (!confirm('Are you sure you want to delete this service rate?')) return;

    try {
      await doctorServiceRateService.deleteRate(rateId);
      toast.success('Service rate deleted');
      const ratesData = await doctorServiceRateService.getRatesByDoctor(selectedDoctorId);
      setRates(ratesData);
    } catch (error) {
      console.error('Error deleting service rate:', error);
      toast.error('Failed to delete service rate');
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className={`w-full ${embedded ? '' : 'max-w-4xl max-h-[90vh] overflow-y-auto'} rounded-xl bg-white shadow-xl`}>
      <div className={`${embedded ? '' : 'sticky top-0'} flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4`}>
        <h2 className="text-lg font-semibold text-gray-900">Doctor Service Rates</h2>
        {!embedded && (
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="space-y-6 p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Doctor</label>
          <select
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              handleReset();
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctorId && (
          <>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                {editingId ? 'Edit Rate' : 'Add New Rate'}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceName: e.target.value })
                    }
                    placeholder="e.g., Consultation, Lab Test, X-Ray"
                    className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Rate (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData({ ...formData, rate: Number(e.target.value) })
                    }
                    placeholder="0.00"
                    className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.serviceDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceDescription: e.target.value })
                    }
                    placeholder="Optional service description"
                    className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Effective From *
                  </label>
                  <input
                    type="date"
                    value={formData.effectiveFrom}
                    onChange={(e) =>
                      setFormData({ ...formData, effectiveFrom: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Effective To (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.effectiveTo}
                    onChange={(e) =>
                      setFormData({ ...formData, effectiveTo: e.target.value })
                    }
                    className="w-full rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        {editingId ? 'Update Rate' : 'Add Rate'}
                      </>
                    )}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Service Rates</h3>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : rates.length > 0 ? (
                <div className="space-y-2">
                  {rates.map((rate) => (
                    <div
                      key={rate.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {rate.serviceName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ₹{rate.rate.toFixed(2)} • Valid from {rate.effectiveFrom}
                          {rate.effectiveTo && ` to ${rate.effectiveTo}`}
                        </p>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(rate.id);
                            setFormData({
                              serviceName: rate.serviceName,
                              serviceDescription: '',
                              rate: rate.rate,
                              effectiveFrom: rate.effectiveFrom,
                              effectiveTo: rate.effectiveTo || '',
                            });
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
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
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <p className="text-sm text-gray-500">No service rates defined for this doctor</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {content}
    </div>
  );
}
