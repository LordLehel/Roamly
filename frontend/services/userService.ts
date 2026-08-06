import { useMyFetch } from '~/composables/useMyFetch';

export const userService = {
  async getUsers() {
    return await useMyFetch('/users');
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createUser(userData: any) {
    return await useMyFetch('/users', {
      method: 'POST',
      body: userData,
    });
  },

  // Keep in mind to change any to a specific type if you have a User interface defined!
};
