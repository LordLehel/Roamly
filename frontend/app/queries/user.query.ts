import { useQuery } from '@pinia/colada';
import { z } from 'zod';
import { userService } from '~/services/userService';
import { checkIsAuthenticated } from '~/utils/auth.utils';
import { userProfileSchema } from '~/utils/user.schema';

export const useUserQuery = () => {
  return useQuery({
    key: ['users', 'list'],
    query: async () => {
      const response = await userService.getUsers();

      const rawData = response && 'data' in response ? response.data : response;

      return z.array(userProfileSchema).parse(rawData);
    },
    enabled: checkIsAuthenticated(),
  });
};

export const useCurrentUserQuery = () => {
  return useQuery({
    key: ['users', 'current'],
    query: async () => {
      const response = await userService.getCurrentUser();

      const rawData = response && 'data' in response ? response.data : response;

      return userProfileSchema.parse(rawData);
    },
    enabled: checkIsAuthenticated(),
    staleTime: 1000 * 60 * 5,
  });
};
