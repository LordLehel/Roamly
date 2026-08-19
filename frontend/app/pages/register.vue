<!-- frontend/app/pages/register.vue -->
<template>
  <UCard variant="glass">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-medium tracking-wide text-brand-950">
        {{ CONST_REGISTER_HEADING }}
      </h1>
    </div>

    <!-- Register form -->
    <UForm
      :schema="registerSchema"
      :state="form"
      class="w-full flex flex-col gap-4"
      @submit="handleRegister"
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

      <UFormField name="username" :label="CONST_USERNAME_LABEL">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.username"
            type="text"
            placeholder="ex. sir_real_99"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="phone_number" :label="CONST_PHONE_LABEL">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.phone_number"
            type="tel"
            placeholder="ex. +40 712 345 678"
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

      <UFormField name="repeatPassword" :label="CONST_REPEAT_PASSWORD_LABEL">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.repeatPassword"
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
        {{ CONST_REGISTER_SUCCESS }}
      </div>

      <div class="flex items-center justify-between pt-6">
        <UButton
          :label="CONST_CANCEL_BTN"
          variant="actionCancelButton"
          :disabled="isLoading"
          @click="clearForm"
        />
        <!-- Loading state -->
        <UButton
          type="submit"
          :label="CONST_REGISTER_TITLE"
          variant="actionOkButton"
          :loading="isLoading"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormSubmitEvent } from '#ui/types';
import { registerSchema, type RegisterFormState } from '../utils/register.schema';
import { useCreateUserMutation } from '../queries/user.mutation';
import { getErrorMessage } from '../utils/error.utils';
import {
  CONST_REGISTER_HEADING,
  CONST_EMAIL_LABEL,
  CONST_USERNAME_LABEL,
  CONST_PHONE_LABEL,
  CONST_PASSWORD_LABEL,
  CONST_REPEAT_PASSWORD_LABEL,
  CONST_REGISTER_SUCCESS,
  CONST_CANCEL_BTN,
  CONST_REGISTER_TITLE,
} from '../utils/constants';

definePageMeta({
  layout: 'auth',
});

const router = useRouter();

const form = reactive<RegisterFormState>({
  email: '',
  username: '',
  phone_number: '',
  password: '',
  repeatPassword: '',
});

const {
  mutate: registerUser,
  isLoading,
  error,
  status,
} = useCreateUserMutation(() => {
  setTimeout(() => router.push('/login'), 2000);
});

const clearForm = () => {
  Object.assign(form, {
    email: '',
    username: '',
    phone_number: '',
    password: '',
    repeatPassword: '',
  });
};

const handleRegister = (event: FormSubmitEvent<RegisterFormState>) => {
  registerUser({
    email: event.data.email,
    username: event.data.username,
    phone_number: event.data.phone_number,
    password: event.data.password,
  });
};
</script>
