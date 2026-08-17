// Checks if the user is authenticated
export const checkIsAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('auth_token');
  }
  return false;
};

// Logs the user out - deleting the auth_token from localStorage
export const logoutUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};