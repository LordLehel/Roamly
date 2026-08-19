// frontend/app/queries/user.query.ts
import { useQuery } from '@pinia/colada';
import { userService } from '~/services/userService';
import { useAuth } from '~/composables/useAuth';

export const useCurrentUserQuery = () => {
  // we check if the user is authenticated
  const { isAuthenticated } = useAuth();
  console.log('useCurrentUserQuery lefutott. isAuthenticated:', isAuthenticated.value);

  // we get the current user parsed through zod validation
  return useQuery({
    key: ['users', 'current'],
    query: async () => {
      console.log('-> getCurrentUser() hívás indítása a userService-en keresztül...');
      try {
        const response = await userService.getCurrentUser();
        console.log('<- Válasz megérkezett a /users/profile végpontról:', response);
        return response.data;
      } catch (err) {
        console.error('X Hiba történt a getCurrentUser lekérdezése közben:', err);
        throw err;
      }
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};
