export default defineNuxtRouteMiddleware(() => {
  const { isAuthenticated } = useAuth();

  // Ha a felhasználó nincs bejelentkezve, azonnal átirányítjuk a loginra
  if (!isAuthenticated.value) {
    return navigateTo('/login');
  }
});
