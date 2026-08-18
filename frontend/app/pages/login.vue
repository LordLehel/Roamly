<!-- frontend/app/pages/login.vue -->
<template>
  <UCard variant="glass">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-medium tracking-wide text-brand-950">{{ CONST_LOGIN_HEADING }}</h1>
    </div>

    <!-- Login form -->
    <UForm
      :schema="loginSchema"
      :state="form"
      class="w-full flex flex-col gap-4"
      @submit="handleLogin"
    >
      <UFormField name="email" :label="CONST_EMAIL_LABEL">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="ex. sir_real_99@roamly.com"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="password" :label="CONST_PASSWORD_LABEL">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="********"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <div v-if="error" class="text-error-400 text-sm text-center font-medium">
        {{ getErrorMessage(error) }}
      </div>
      <div v-if="status === 'success'" class="text-success-400 text-sm text-center font-medium">
        {{ CONST_LOGIN_SUCCESS }}
      </div>

      <div class="flex items-center justify-between pt-6">
        <UButton :label="CONST_CANCEL_BTN" variant="actionCancelButton" :disabled="isLoading" @click="clearForm" />
        <!-- Loading state -->
        <UButton type="submit" :label="CONST_LOGIN_TITLE" variant="actionOkButton" :loading="isLoading" />
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
import {
  CONST_LOGIN_HEADING,
  CONST_EMAIL_LABEL,
  CONST_PASSWORD_LABEL,
  CONST_LOGIN_SUCCESS,
  CONST_CANCEL_BTN,
  CONST_LOGIN_TITLE,
} from '../utils/constants';

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