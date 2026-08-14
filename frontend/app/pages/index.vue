<template>
  <UContainer class="py-8 max-w-max">
    <h1 class="text-3xl font-bold mb-8 border-solid border-b border-gray-700">Users Management</h1>

    <!-- MUTATION - creating new user -->
    <UCard class="mb-8">
      <template #header>
        <h3 class="text-xl font-semibold">Add New User</h3>
      </template>

      <!-- Create button -->
      <UButton
        color="neutral"
        variant="solid"
        :loading="isCreating"
        :label="isCreating ? 'Saving to Database...' : 'Create Test User'"
        @click="handleCreateUser"
      />

      <!-- Error state (Mutation) -->
      <UAlert
        v-if="createError"
        class="mt-4"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-circle"
        :title="`Failed to create: ${createError.message}`"
      />
    </UCard>

    <!-- QUERY - listing users -->
    <div>
      <!-- Loading state -->
      <div v-if="isLoading" class="flex items-center gap-2 text-gray-500">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
        <span>Fetching data from the backend...</span>
      </div>

      <!-- Error state (Query) -->
      <UAlert
        v-else-if="error"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        :title="`Error occurred: ${error}`"
      />

      <!-- Successful response -->
      <div v-else-if="usersData" class="space-y-6">
        <p class="font-medium flex items-center gap-2">
          Users in database:
          <UBadge color="neutral" variant="subtle">{{ usersData.data.length }}</UBadge>
        </p>

        <!-- users list -->
        <div class="space-y-3">
          <!-- User card -->
          <UCard v-for="user in usersData.data" :key="user.id" :ui="{ body: 'px-4 py-3' }">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <p class="font-semibold">{{ user.name }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- refresh users -->
        <UButton
          color="neutral"
          variant="outline"
          icon="i-heroicons-arrow-path"
          label="Refresh List manually"
          @click="() => refreshUsers()"
        />
      </div>
    </div>
  </UContainer>
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
