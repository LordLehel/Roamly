<template>
  <UCard variant="glass">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-medium tracking-wide text-green-50">Log into account</h1>
    </div>

    <!-- Login form -->
    <UForm
      :schema="loginSchema"
      :state="form"
      class="w-full flex flex-col gap-4"
      @submit="handleLogin"
    >
      <UFormField name="email" label="Email">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="ex. sir_real_99@roamly.com"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="password" label="Password">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="********"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <!-- Colada Mutation error -->
      <div v-if="error" class="text-red-400 text-sm text-center font-medium">
        {{ getErrorMessage(error) }}
      </div>
      <div v-if="status === 'success'" class="text-green-400 text-sm text-center font-medium">
        Login successful! Redirecting...
      </div>

      <div class="flex items-center justify-between pt-6">
        <UButton label="Cancel" variant="glass" :disabled="isLoading" @click="clearForm" />
        <!-- Loading state -->
        <UButton type="submit" label="Log in" variant="glass" :loading="isLoading" />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '../utils/login.schema';
import { useLoginUserMutation } from '../queries/auth.mutation';
import { getErrorMessage } from '../utils/error.utils';

definePageMeta({
  layout: 'auth',
});

const router = useRouter();

const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

const {
  mutate: loginUser,
  isLoading,
  error,
  status,
} = useLoginUserMutation((data) => {
  if (data?.token) {
    localStorage.setItem('auth_token', data.token);
  }
  setTimeout(() => router.push('/'), 2000);
});

const clearForm = () => {
  Object.assign(form, { email: '', password: '' });
};

const handleLogin = (event: FormSubmitEvent<LoginFormState>) => {
  loginUser({
    email: event.data.email,
    password: event.data.password,
  });
};
</script>
