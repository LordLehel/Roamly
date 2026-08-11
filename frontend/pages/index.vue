<template>
  <div class="p-8 max-w-4xl mx-auto font-sans">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Users Management</h1>

    <!-- MUTATION - creating new user -->
    <div class="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">Add New User</h3>

      <button
        class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        :disabled="isCreating"
        @click="handleCreateUser"
      >
        {{ isCreating ? 'Saving to Database...' : 'Create Test User' }}
      </button>

      <!-- Loading state -->
      <p v-if="createError" class="mt-3 text-sm text-red-600 font-medium">
        Failed to create: {{ createError.message }}
      </p>
    </div>

    <!-- QUERY - listing users -->
    <div>
      <!-- Loading state -->
      <p v-if="isLoading" class="text-gray-500 animate-pulse flex items-center gap-2">
        Fetching data from the backend...
      </p>

      <!-- Error state -->
      <p v-else-if="error" class="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
        Error occurred: {{ error }}
      </p>

      <!-- Successful response -->
      <div v-else-if="usersData" class="space-y-6">
        <p class="text-gray-600 font-medium">
          Users in database:
          <span class="text-gray-900 font-bold">{{ usersData.data.length }}</span>
        </p>

        <!-- users list-->
        <ul class="space-y-3">
          <li
            v-for="user in usersData.data"
            :key="user.id"
            class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between"
          >
            <div>
              <p class="font-semibold text-gray-800">{{ user.name }}</p>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
            </div>
          </li>
        </ul>

        <!-- refresh users-->
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
          @click="() => refreshUsers"
        >
          Refresh List manually
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserInDto } from '../types/user.type';
import { useUserQuery } from '~/queries/user.query';
import { useCreateUserMutation } from '~/queries/user.mutation';

const { data: usersData, isLoading, error, refresh: refreshUsers } = useUserQuery();

// Mutation
const {
  mutate: createUserMutation,
  isLoading: isCreating,
  error: createError,
} = useCreateUserMutation(() => {
  alert('Successful registration');
  refreshUsers();
});

// Pressing Button
const handleCreateUser = () => {
  const dummyUser: UserInDto = {
    email: `test_${Date.now()}@example.com`,
    name: 'New Pinia Colada User',
    password: 'password123',
  };

  createUserMutation(dummyUser);
};
</script>
