import { useApi } from '~/composables/useApi';
import type { UserOutDto, UserInDto } from '~/types/user.type';
import type { ApiResponse } from '~/types/api.type';

export const userService = {
  getUsers() {
    const api = useApi();
    return api<ApiResponse<UserOutDto[]>>('/users');
  },

  createUser(userData: UserInDto) {
    const api = useApi();
    return api<UserOutDto>('/users', {
      method: 'POST',
      body: userData,
    });
  },
};
