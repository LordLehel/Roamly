// frontend/app/utils/error.utils.ts
import type { ApiError } from '../types/apiError.type';

export const getErrorMessage = (err: unknown): string => {
  const error = err as ApiError;

  // Extracting error message
  let rawMessage = '';
  if (err instanceof Error) {
    rawMessage = err.message;
  } else if (typeof err === 'string') {
    rawMessage = err;
  } else if (error?.message) {
    rawMessage = error.message;
  }

  // Network and fetch errors
  if (
    rawMessage.includes('NetworkError') ||
    rawMessage.includes('Failed to fetch') ||
    rawMessage.includes('<no response>') ||
    rawMessage.includes('fetch resource')
  ) {
    return 'The server is not responding. Please check your internet connection or try again later.';
  }

  // Server side errors
  if (error?.response?.status && error.response.status >= 500) {
    return 'An internal server error occurred. Our team has been notified. Please try again later.';
  }

  // Structured errors sent by the backend
  const errData = error?.response?._data?.message;

  // Simple string sent by backend
  if (typeof errData === 'string') {
    return errData;
  }

  // Zod validation object sent by backend
  if (errData && typeof errData === 'object') {
    return Object.values(errData).flat().join(' | ');
  }

  // Fallback
  return rawMessage || 'An unexpected error occurred. Please try again.';
};
