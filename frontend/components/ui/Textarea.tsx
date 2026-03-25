import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, required, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className={cn('block text-sm font-medium text-gray-700 mb-2')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'transition-colors duration-200',
          'text-gray-900 placeholder-gray-400',
          'resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        rows={4}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
);

Textarea.displayName = 'Textarea';
