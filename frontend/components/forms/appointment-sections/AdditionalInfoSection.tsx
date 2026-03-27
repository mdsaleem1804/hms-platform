'use client';

import React, { memo } from 'react';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface AdditionalInfoSectionProps {
  formData: {
    notes: string;
    priority: string;
    status: string;
    token_number: string;
    follow_up: boolean;
    follow_up_visit_date: string;
    follow_up_notes: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFollowUpToggle: (value: boolean) => void;
}

const priorityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'low', label: 'Low' },
];

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

const priorityColors: Record<string, string> = {
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
  low: 'bg-gray-100 text-gray-600',
};

const AdditionalInfoSection = memo(({
  formData,
  onInputChange,
  onFollowUpToggle,
}: AdditionalInfoSectionProps) => {
  return (
    <div className="space-y-5">
      {/* Priority & Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
          Appointment Status & Priority
        </h2>

        <div className="grid grid-cols-12 gap-x-6 gap-y-5">

          {/* Priority */}
          <div className="col-span-12 sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Priority
            </label>
            <div className="flex flex-wrap gap-3">
              {priorityOptions.map(option => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all text-sm font-medium ${
                    formData.priority === option.value
                      ? `${priorityColors[option.value]} border-transparent ring-2 ring-offset-1 ring-current`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={onInputChange}
                    className="sr-only"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Appointment Status */}
          <div className="col-span-12 sm:col-span-4">
            <Select
              label="Appointment Status"
              name="status"
              value={formData.status}
              onChange={onInputChange}
              options={statusOptions}
            />
          </div>

          {/* Token Number */}
          <div className="col-span-12 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Token Number
              <span className="ml-1 text-xs text-gray-400 font-normal">(Auto)</span>
            </label>
            <input
              type="text"
              name="token_number"
              value={formData.token_number}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
            />
          </div>

        </div>
      </div>

      {/* Additional Information / Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
          Additional Information
        </h2>

        <Textarea
          label="Notes / Special Instructions"
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          placeholder="Enter any special notes, requirements, or instructions for this appointment…"
          rows={4}
        />
      </div>

      {/* Follow-up of Previous Visit */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-200">
          Follow-up of Previous Visit
        </h2>

        <label className="flex items-center gap-3 cursor-pointer select-none w-fit mb-5">
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.follow_up}
              onChange={e => onFollowUpToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
            <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            This appointment is a follow-up of a previous visit
          </span>
        </label>

        {formData.follow_up && (
          <div className="grid grid-cols-12 gap-x-6 gap-y-5 mt-1 pl-2 border-l-4 border-blue-200">
            <div className="col-span-12 sm:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Visit Date
              </label>
              <input
                type="date"
                name="follow_up_visit_date"
                value={formData.follow_up_visit_date}
                onChange={onInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-12 sm:col-span-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Visit Notes
              </label>
              <input
                type="text"
                name="follow_up_notes"
                value={formData.follow_up_notes}
                onChange={onInputChange}
                placeholder="Brief summary of the previous visit or reason for follow-up…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

AdditionalInfoSection.displayName = 'AdditionalInfoSection';
export default AdditionalInfoSection;
