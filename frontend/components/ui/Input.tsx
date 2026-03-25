import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, required, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className={cn('block text-sm font-medium text-gray-700 mb-2')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors duration-200',
          'text-gray-900 placeholder-gray-400',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
);

Input.displayName = 'Input';
