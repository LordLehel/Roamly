// frontend/app/queries/user.query.ts
import { useQuery } from '@pinia/colada';
import { userService } from '~/services/userService';
import { useAuth } from '~/composables/useAuth';

export const useCurrentUserQuery = () => {
  // we check if the user is authenticated
  const { isAuthenticated } = useAuth();

  // we get the current user parsed through zod validation
  return useQuery({
    key: ['users', 'current', isAuthenticated.value],
    query: async () => {
      const response = await userService.getCurrentUser();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 0,
  });
};
