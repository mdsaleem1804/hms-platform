'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trash2, Loader2, ChevronDown } from 'lucide-react';
import { BillingServiceItem } from './types';
import doctorServiceRateService, { DoctorServiceRateSummaryDto } from '@/services/doctorServiceRateService';

export type PricingSource = 'doctor' | 'standard';

interface ServiceRateOption {
  rate: number;
  source: 'doctor' | 'standard';
  dateRange?: string;
}

interface ServiceTableWithRatesProps {
  items: BillingServiceItem[];
  onChange: (items: BillingServiceItem[]) => void;
  doctorId?: string;
  pricingSource?: PricingSource;
  onPricingSourceChange?: (source: PricingSource) => void;
  standardRates?: Record<string, number>;
}

const toAmount = (qty: number, rate: number) => Math.max(1, qty) * Math.max(0, rate);

export function ServiceTableWithRates({
  items,
  onChange,
  doctorId,
  pricingSource = 'doctor',
  onPricingSourceChange,
  standardRates = {},
}: ServiceTableWithRatesProps) {
  const [availableRates, setAvailableRates] = useState<Record<string, ServiceRateOption[]>>({});
  const [rateDropdownOpen, setRateDropdownOpen] = useState<Record<string, boolean>>({});
  const [fetchingRates, setFetchingRates] = useState<Record<string, boolean>>({});
  const [doctorRates, setDoctorRates] = useState<DoctorServiceRateSummaryDto[]>([]);
  const [rowPricingSources, setRowPricingSources] = useState<Record<string, PricingSource>>({});

  // Build de-duplicated lists to keep dropdown options clean.
  const doctorServices = useMemo(
    () => Array.from(new Set(doctorRates.map((rate) => rate.serviceName).filter(Boolean))).sort(),
    [doctorRates]
  );

  const standardServices = useMemo(
    () => Object.keys(standardRates).filter(Boolean).sort(),
    [standardRates]
  );

  const availableServices = useMemo(() => {
    if (pricingSource === 'doctor') {
      if (!doctorId) return [];
      return doctorServices;
    }

    return standardServices;
  }, [doctorId, doctorServices, pricingSource, standardServices]);

  const getAvailableServicesForSource = (source: PricingSource) => {
    if (source === 'doctor') {
      if (!doctorId) return [];
      return doctorServices;
    }

    return standardServices;
  };

  useEffect(() => {
    setRowPricingSources((prev) => {
      const next: Record<string, PricingSource> = {};

      for (const item of items) {
        next[item.id] = prev[item.id] ?? pricingSource;
      }

      return next;
    });
  }, [items, pricingSource]);

  // Fetch doctor-specific rates when doctor changes
  useEffect(() => {
    if (doctorId && pricingSource === 'doctor') {
      const fetchRates = async () => {
        try {
          const rates = await doctorServiceRateService.getRatesByDoctor(doctorId);
          setDoctorRates(rates);
        } catch (error) {
          console.error('[ServiceTable] Error fetching doctor rates:', error);
          setDoctorRates([]);
        }
      };
      fetchRates();
    } else {
      setDoctorRates([]);
    }
  }, [doctorId, pricingSource]);

  // Update available rates for all items when pricing source or doctor rates change
  useEffect(() => {
    const updated: Record<string, ServiceRateOption[]> = {};
    
    for (const item of items) {
      if (!item.service.trim()) continue;

      const rates: ServiceRateOption[] = [];

      const rowPricingSource = rowPricingSources[item.id] ?? pricingSource;

      if (rowPricingSource === 'doctor' && doctorId) {
        const doctorRate = doctorRates.find(
          (r) => r.serviceName.toLowerCase() === item.service.toLowerCase()
        );
        if (doctorRate) {
          const dateRange =
            doctorRate.effectiveTo
              ? `${doctorRate.effectiveFrom} to ${doctorRate.effectiveTo}`
              : `From ${doctorRate.effectiveFrom}`;
          rates.push({
            rate: doctorRate.rate,
            source: 'doctor',
            dateRange,
          });
        }
      } else if (rowPricingSource === 'standard') {
        const standardRate = standardRates[item.service];
        if (standardRate) {
          rates.push({
            rate: standardRate,
            source: 'standard',
          });
        }
      }

      updated[item.id] = rates;
    }

    setAvailableRates(updated);
  }, [pricingSource, rowPricingSources, doctorRates, standardRates, items, doctorId]);
  const updateItem = (id: string, patch: Partial<BillingServiceItem>) => {
    const updated = items.map((item) => {
      if (item.id !== id) return item;
      const next = { ...item, ...patch };
      return {
        ...next,
        qty: Math.max(1, Number(next.qty) || 1),
        rate: Math.max(0, Number(next.rate) || 0),
        amount: toAmount(Number(next.qty) || 1, Number(next.rate) || 0),
      };
    });

    onChange(updated);
  };

  const addRow = () => {
    const nextId = `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setRowPricingSources((prev) => ({
      ...prev,
      [nextId]: pricingSource,
    }));

    onChange([
      ...items,
      {
        id: nextId,
        service: '',
        qty: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRowPricingSources((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    const updated = items.filter((item) => item.id !== id);
    onChange(updated.length ? updated : items);
  };

  // Fetch available rates when service name is entered
  const handleServiceChange = async (id: string, serviceName: string) => {
    const rowPricingSource = rowPricingSources[id] ?? pricingSource;

    if (!serviceName.trim()) {
      updateItem(id, { service: '' });
      return;
    }

    setFetchingRates((prev) => ({ ...prev, [id]: true }));

    try {
      const rates: ServiceRateOption[] = [];

      if (rowPricingSource === 'doctor' && doctorId) {
        // Get doctor-specific rates for this service
        const doctorRate = doctorRates.find(
          (r) => r.serviceName.toLowerCase() === serviceName.toLowerCase()
        );
        if (doctorRate) {
          const dateRange =
            doctorRate.effectiveTo
              ? `${doctorRate.effectiveFrom} to ${doctorRate.effectiveTo}`
              : `From ${doctorRate.effectiveFrom}`;
          rates.push({
            rate: doctorRate.rate,
            source: 'doctor',
            dateRange,
          });
        }
      } else if (rowPricingSource === 'standard') {
        // Get standard rate for this service
        const standardRate = standardRates[serviceName];
        if (standardRate) {
          rates.push({
            rate: standardRate,
            source: 'standard',
          });
        }
      }

      setAvailableRates((prev) => ({
        ...prev,
        [id]: rates,
      }));

      if (rates.length > 0) {
        // Apply both service and rate in one update to avoid stale-props overwrite.
        updateItem(id, { service: serviceName, rate: rates[0].rate });
      } else {
        updateItem(id, { service: serviceName });
      }
    } catch (error) {
      console.error('Error fetching service rates:', error);
      setAvailableRates((prev) => ({
        ...prev,
        [id]: [],
      }));
    } finally {
      setFetchingRates((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Pricing Source Selector */}
      {doctorId && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-25 border-b border-blue-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-3 text-base font-semibold text-gray-900">How should we price these services?</h3>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="pricing-source"
                    value="doctor"
                    checked={pricingSource === 'doctor'}
                    onChange={() => {
                      if (onPricingSourceChange) {
                        onPricingSourceChange('doctor');
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-base font-medium text-gray-900 group-hover:text-blue-700">Doctor's Custom Rates</span>
                    <p className="text-sm text-gray-600">Uses this doctor's personalized rates</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="pricing-source"
                    value="standard"
                    checked={pricingSource === 'standard'}
                    onChange={() => {
                      if (onPricingSourceChange) {
                        onPricingSourceChange('standard');
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-base font-medium text-gray-900 group-hover:text-blue-700">Hospital Standard Rates</span>
                    <p className="text-sm text-gray-600">Uses hospital's default rates</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Items Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Service Items</h2>
          <p className="mt-1 text-sm text-gray-600">
            {!doctorId
              ? 'Select a doctor first to load service options'
              : pricingSource === 'doctor' && availableServices.length > 0
              ? `${availableServices.length} service${availableServices.length !== 1 ? 's' : ''} available for this doctor`
              : pricingSource === 'doctor'
              ? 'This doctor has no custom rates configured yet'
              : 'Select from hospital standard rates'}
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Add Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Service Name</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 w-[120px]">Rate (₹)</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 w-[80px]">Qty</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700 w-[120px]">Amount (₹)</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 w-[60px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => {
              const isLoadingRates = fetchingRates[item.id];
              const rates = availableRates[item.id] || [];
              const hasAvailableRates = rates.length > 0;
              const isServiceEmpty = !item.service.trim();
              const rowPricingSource = rowPricingSources[item.id] ?? pricingSource;
              const rowAvailableServices = getAvailableServicesForSource(rowPricingSource);

              return (
                <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative min-w-[240px]">
                      {rowAvailableServices.length > 0 ? (
                        <select
                          value={item.service}
                          onChange={(e) => handleServiceChange(item.id, e.target.value)}
                          className={`w-full rounded-lg border-2 px-3 py-2.5 text-base focus:outline-none transition-all ${
                            isServiceEmpty
                              ? 'border-gray-200 bg-gray-50 text-gray-700'
                              : 'border-blue-300 bg-blue-50 text-gray-900'
                          } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                        >
                          <option value="">Select service</option>
                          {rowAvailableServices.map((service) => (
                            <option key={service} value={service}>{service}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={item.service}
                          onChange={(e) => handleServiceChange(item.id, e.target.value)}
                          placeholder={!doctorId ? 'Select doctor first' : 'Enter service name'}
                          className={`w-full rounded-lg border-2 px-3 py-2.5 text-base focus:outline-none transition-all ${
                            isServiceEmpty
                              ? 'border-gray-200 bg-gray-50 placeholder-gray-400'
                              : 'border-blue-300 bg-blue-50'
                          } focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 relative">
                    <div className="flex items-center gap-2">
                      {/* Rate Dropdown */}
                      {item.service.trim() && (
                        <div className="relative flex-1">
                          <button
                            type="button"
                            onClick={() =>
                              setRateDropdownOpen((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            disabled={isLoadingRates || rates.length === 0}
                            className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 text-right text-base font-semibold text-gray-900 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                          >
                            <span>{item.rate.toFixed(2)}</span>
                            {(isLoadingRates || (hasAvailableRates && rates.length > 1)) && (
                              <>
                                {isLoadingRates ? (
                                  <Loader2 className="ml-2 h-4 w-4 animate-spin text-blue-500" />
                                ) : (
                                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                                )}
                              </>
                            )}
                          </button>

                          {/* Rate Dropdown Menu */}
                          {rateDropdownOpen[item.id] && !isLoadingRates && hasAvailableRates && rates.length > 1 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                              {rates.map((option, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    updateItem(item.id, { rate: option.rate });
                                    setRateDropdownOpen((prev) => ({
                                      ...prev,
                                      [item.id]: false,
                                    }));
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-t border-gray-100 first:border-t-0 text-base transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">₹{option.rate.toFixed(2)}</span>
                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                      {option.source === 'doctor' && (
                                        <>Doctor {option.dateRange && `(${option.dateRange})`}</>
                                      )}
                                      {option.source === 'standard' && 'Standard'}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Manual Rate Input */}
                      {!item.service.trim() && (
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                          placeholder="0.00"
                          className="w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-3 py-2.5 text-right text-base font-medium text-gray-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                      className="w-full rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 text-right text-base font-medium text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex min-w-[96px] justify-end rounded-lg bg-emerald-50 px-3 py-2.5 text-base font-semibold text-emerald-700">
                      {item.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
