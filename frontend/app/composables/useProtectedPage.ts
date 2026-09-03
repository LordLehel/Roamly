// frontend/app/composables/useProtectedPage.ts
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';

export const useProtectedPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  watch(
    isAuthenticated,
    (isAuth) => {
      if (!isAuth) {
        router.push('/login');
      }
    },
    { immediate: true },
  );

  return {
    isAuthenticated,
  };
};
