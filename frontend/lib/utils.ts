export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) {
    return '-';
  }
  
  const parsedDate = new Date(date);
  
  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    return '-';
  }
  
  return parsedDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: string): string => {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Extract error message from API response or error object
 * Prioritizes actual API error messages over generic error messages
 */
export const extractApiError = (error: unknown): string => {
  // Check if it's an Axios error with response data
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const responseData = error.response.data as any;
    
    // Try to extract message from API response
    if (responseData?.message) {
      return responseData.message;
    }
    
    // Try to extract from details array (if present)
    if (responseData?.details && Array.isArray(responseData.details) && responseData.details.length > 0) {
      return responseData.details[0];
    }
  }
  
  // Check for standard Error object
  if (error instanceof Error) {
    return error.message;
  }
  
  // Fallback
  return 'An error occurred';
};
