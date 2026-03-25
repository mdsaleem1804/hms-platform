import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  required?: boolean;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, required, options, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className={cn('block text-sm font-medium text-gray-700 mb-2')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors duration-200',
          'text-gray-900 bg-white',
          'appearance-none cursor-pointer',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
);

Select.displayName = 'Select';
