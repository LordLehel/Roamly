// frontend/app/utils/error.utils.ts
export const getErrorMessage = (err: unknown): string => {
  const errData = (err as { response?: { _data?: { message?: Record<string, string[]> | string } } })
    ?.response?._data?.message;

  // simple string
  if (typeof errData === 'string') {
    return errData;
  }

  // zod validation
  if (errData && typeof errData === 'object') {
    return Object.values(errData).flat().join(' | ');
  }

  // fallback
  return (err as Error)?.message || 'Registration failed!';
};