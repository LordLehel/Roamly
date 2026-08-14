export const getErrorMessage = (err: unknown): string => {
  // The error response is from the _data property
  const errData = (err as { response?: { _data?: { message?: Record<string, string[]> } } })
    ?.response?._data?.message;

  if (errData && typeof errData === 'object') {
    return Object.values(errData).flat().join(' | ');
  }

  return (err as Error)?.message || 'Registration failed!';
};
