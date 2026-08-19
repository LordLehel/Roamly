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
    return api<UserOutDto>('/auth/register', {
      method: 'POST',
      body: {
        username: userData.username,
        email: userData.email,
        phone_number: userData.phone_number,
        password: userData.password,
      },
    });
  },

  getCurrentUser() {
    const api = useApi();
    return api<ApiResponse<UserOutDto>>('/users/profile');
  },
};
