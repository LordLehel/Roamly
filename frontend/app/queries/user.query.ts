import { useQuery } from '@pinia/colada';
import { userService } from '~/services/userService';

export const useUserQuery = () => {
  return useQuery({
    key: ['users', 'list'],
    query: () => userService.getUsers(),
  });
};
