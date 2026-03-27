type DateParts = {
  year: number;
  month: number;
  day: number;
};

const parseDateParts = (value: string | Date | null | undefined): DateParts | null => {
  if (!value) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
    };
  }

  const dateOnlyMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnlyMatch) {
    return {
      year: Number(dateOnlyMatch[1]),
      month: Number(dateOnlyMatch[2]),
      day: Number(dateOnlyMatch[3]),
    };
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
  };
};

const pad2 = (value: number) => String(value).padStart(2, '0');

export const toAppointmentDateInputValue = (value: string | Date | null | undefined): string => {
  const parts = parseDateParts(value);
  if (!parts) return '';
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
};

export const formatAppointmentDate = (
  value: string | Date | null | undefined,
  locale?: string | string[],
  options?: Intl.DateTimeFormatOptions
): string => {
  const parts = parseDateParts(value);
  if (!parts) return '';

  const date = new Date(parts.year, parts.month - 1, parts.day);
  return date.toLocaleDateString(locale, options);
};
