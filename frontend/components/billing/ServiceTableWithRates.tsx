'use client';

import { useEffect, useState } from 'react';
import { Trash2, Loader2, ChevronDown } from 'lucide-react';
import { BillingServiceItem } from './types';
import doctorServiceRateService, { DoctorServiceRateSummaryDto } from '@/services/doctorServiceRateService';

export type PricingSource = 'doctor' | 'standard';

// Fallback services if no doctor is selected
const FALLBACK_SERVICES = [
  'Consultation Fee',
  'Follow-up Consultation',
  'Procedure',
  'Lab Test',
  'Imaging',
  'Injection',
  'Dressing',
  'Medical Certificate',
  'Report',
  'Other',
];

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

  // Get unique services from doctor's rates
  const doctorServices = doctorRates.map((rate) => rate.serviceName);
  
  // Get available services based on pricing source  
  const getAvailableServices = () => {
    if (pricingSource === 'doctor' && doctorServices.length > 0) {
      return doctorServices;
    }
    if (pricingSource === 'standard' && Object.keys(standardRates).length > 0) {
      return Object.keys(standardRates);
    }
    return FALLBACK_SERVICES;
  };

  // Fetch doctor-specific rates when doctor changes
  useEffect(() => {
    if (doctorId && pricingSource === 'doctor') {
      const fetchRates = async () => {
        try {
          const rates = await doctorServiceRateService.getRatesByDoctor(doctorId);
          setDoctorRates(rates);
        } catch (error) {
          console.error('Error fetching doctor rates:', error);
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

      if (pricingSource === 'doctor' && doctorId) {
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
      } else if (pricingSource === 'standard') {
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
  }, [pricingSource, doctorRates, standardRates, items]);
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
    onChange([
      ...items,
      {
        id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        service: '',
        qty: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeRow = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onChange(updated.length ? updated : items);
  };

  // Fetch available rates when service name is entered
  const handleServiceChange = async (id: string, serviceName: string) => {
    updateItem(id, { service: serviceName });

    if (!serviceName.trim()) {
      return;
    }

    setFetchingRates((prev) => ({ ...prev, [id]: true }));

    try {
      const rates: ServiceRateOption[] = [];

      if (pricingSource === 'doctor' && doctorId) {
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
      } else if (pricingSource === 'standard') {
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

      // Auto-select the first (or only) available rate
      if (rates.length > 0) {
        updateItem(id, { rate: rates[0].rate });
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
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Pricing Source Selector */}
      {doctorId && (
        <div className="mb-5 pb-5 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-3">Pricing Source</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
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
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Doctor-Specific Rates</span>
              <span className="text-xs text-gray-500">(Custom rates for this doctor)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
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
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Standard Rates</span>
              <span className="text-xs text-gray-500">(Hospital standard rates)</span>
            </label>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Service Items</h2>
          <p className="text-xs text-gray-500">
            {pricingSource === 'doctor' && doctorId
              ? 'Service rates will be fetched from doctor-specific rates. Select a rate from the dropdown.'
              : 'Service rates will be matched from standard rates. You can override the rate manually.'}
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
        >
          Add Row
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Service</th>
              <th className="px-3 py-2 text-right w-[120px]">Rate</th>
              <th className="px-3 py-2 text-right w-[90px]">Qty</th>
              <th className="px-3 py-2 text-right w-[120px]">Amount</th>
              <th className="px-3 py-2 text-center w-[64px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLoadingRates = fetchingRates[item.id];
              const rates = availableRates[item.id] || [];
              const hasAvailableRates = rates.length > 0;

              return (
                <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50/40">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        list={`services-${item.id}`}
                        value={item.service}
                        onChange={(e) => handleServiceChange(item.id, e.target.value)}
                        placeholder={pricingSource === 'doctor' && doctorId ? 'Select or enter service' : 'Enter service name'}
                        className="w-full rounded border border-gray-300 px-2 py-1.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                      <datalist id={`services-${item.id}`}>
                        {getAvailableServices().map((service) => (
                          <option key={service} value={service} />
                        ))}
                      </datalist>
                    </div>
                  </td>
                  <td className="px-3 py-2 relative">
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
                            className="w-full rounded border border-gray-300 px-2 py-1.5 text-right text-sm font-medium hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                          >
                            <span>{item.rate.toFixed(2)}</span>
                            {(isLoadingRates || (hasAvailableRates && rates.length > 1)) && (
                              <>
                                {isLoadingRates ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                )}
                              </>
                            )}
                          </button>

                          {/* Rate Dropdown Menu */}
                          {rateDropdownOpen[item.id] && !isLoadingRates && hasAvailableRates && rates.length > 1 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
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
                                  className="w-full text-left px-3 py-2 hover:bg-blue-50 border-t border-gray-100 first:border-t-0 text-sm"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">₹{option.rate.toFixed(2)}</span>
                                    <span className="text-xs text-gray-500">
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
                          className="w-full rounded border border-gray-300 px-2 py-1.5 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, { qty: Number(e.target.value) })}
                      className="w-full rounded border border-gray-300 px-2 py-1.5 text-right focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-900">
                    {item.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
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
