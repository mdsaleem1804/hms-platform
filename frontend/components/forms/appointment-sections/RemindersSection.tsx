'use client';

import React, { memo } from 'react';

export interface Reminder {
  id: string;
  channel: string;
  timing: string;
}

interface RemindersSectionProps {
  reminders: Reminder[];
  onAddReminder: () => void;
  onRemoveReminder: (id: string) => void;
  onReminderChange: (id: string, field: 'channel' | 'timing', value: string) => void;
}

const channelOptions = [
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '📱' },
];

const timingOptions = [
  { value: '15min', label: '15 minutes before' },
  { value: '30min', label: '30 minutes before' },
  { value: '1hour', label: '1 hour before' },
  { value: '2hours', label: '2 hours before' },
  { value: '1day', label: '1 day before' },
  { value: '2days', label: '2 days before' },
];

const channelLabel: Record<string, { icon: string; label: string; bg: string; text: string }> = {
  email: { icon: '✉️', label: 'Email', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
  sms: { icon: '💬', label: 'SMS', bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
  whatsapp: { icon: '📱', label: 'WhatsApp', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
};

const RemindersSection = memo(({
  reminders,
  onAddReminder,
  onRemoveReminder,
  onReminderChange,
}: RemindersSectionProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Reminders</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Set up one or more reminders to be sent before the appointment.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddReminder}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">No reminders set</p>
          <p className="text-xs text-gray-400 mt-1">Click &quot;Add Reminder&quot; to schedule notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder, index) => (
            <div
              key={reminder.id}
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl"
            >
              <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">
                #{index + 1}
              </span>

              {/* Channel */}
              <div className="flex gap-2 flex-shrink-0">
                {channelOptions.map(ch => {
                  const isActive = reminder.channel === ch.value;
                  const style = channelLabel[ch.value];
                  return (
                    <button
                      key={ch.value}
                      type="button"
                      onClick={() => onReminderChange(reminder.id, 'channel', ch.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        isActive
                          ? `${style.bg} ${style.text} border-current shadow-sm`
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      <span>{ch.icon}</span>
                      {ch.label}
                    </button>
                  );
                })}
              </div>

              {/* Timing */}
              <select
                value={reminder.timing}
                onChange={e => onReminderChange(reminder.id, 'timing', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timingOptions.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              {/* Remove */}
              <button
                type="button"
                onClick={() => onRemoveReminder(reminder.id)}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                aria-label="Remove reminder"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

RemindersSection.displayName = 'RemindersSection';
export default RemindersSection;
