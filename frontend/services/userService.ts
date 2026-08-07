import { useMyFetch } from '~/composables/useMyFetch';
import type { UserOutDto, UserInDto } from '~/types/user.type';
import type { ApiResponse } from '~/types/api.type';

export const userService = {
  async getUsers() {
    return await useMyFetch<ApiResponse<UserOutDto[]>>('/users');
  },

  async createUser(userData: UserInDto) {
    return await useMyFetch<UserOutDto>('/users', {
      method: 'POST',
      body: userData,
    });
  },
};
