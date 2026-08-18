// frontend/app/queries/user.query.ts
import { useQuery } from '@pinia/colada';
import { z } from 'zod';
import { userService } from '~/services/userService';
import { useAuth } from '~/composables/useAuth';
import { userProfileSchema } from '~/utils/user.schema';

export const useUserQuery = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    key: ['users', 'list'],
    query: async () => {
      const response = await userService.getUsers();

      const rawData = response && 'data' in response ? response.data : response;

      return z.array(userProfileSchema).parse(rawData);
    },
    enabled: isAuthenticated,
  });
};

export const useCurrentUserQuery = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    key: ['users', 'current'],
    query: async () => {
      const response = await userService.getCurrentUser();

      const rawData = response && 'data' in response ? response.data : response;

      return userProfileSchema.parse(rawData);
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
};