'use client';

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DEBOUNCE_MS = 300;

function GlobalSearchBase({ value, onChange, placeholder = 'Search...' }: GlobalSearchProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue.trim());
      }
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [inputValue, onChange, value]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
    onChange('');
  }, [onChange]);

  const showClear = useMemo(() => inputValue.length > 0, [inputValue]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showClear && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Clear search"
          title="Clear"
        >
          X
        </button>
      )}
    </div>
  );
}

const GlobalSearch = memo(GlobalSearchBase);

export default GlobalSearch;
