// frontend/app/services/userService.ts
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
    return api<ApiResponse<UserOutDto>>('/users/me');
  },

  updateProfile(data: { username?: string; email?: string; phone_number?: string }) {
    const api = useApi();
    return api<ApiResponse<UserOutDto>>('/users/me', {
      method: 'PATCH',
      body: data,
    });
  },

  deleteProfile() {
    const api = useApi();
    return api<ApiResponse<void>>('/users/me', {
      method: 'DELETE',
    });
  },

  changePassword(data: { oldPassword: string; newPassword: string }) {
    const api = useApi();
    return api<ApiResponse<void>>('/users/me/password', {
      method: 'PATCH',
      body: data,
    });
  },

  uploadProfilePicture(file: File) {
    const api = useApi();
    const formData = new FormData();
    formData.append('picture', file);

    return api<ApiResponse<UserOutDto>>('/users/profile-picture', {
      method: 'POST',
      body: formData,
    });
  },
};
