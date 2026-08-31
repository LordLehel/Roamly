<!-- frontend/app/pages/register.vue -->
<template>
  <UCard variant="glass">
    <div :class="appConfig.typography.authTitleWrapper">
      <h1 :class="appConfig.typography.authTitle">{{ CONST_REGISTER_HEADING }}</h1>
    </div>

    <UForm
      :schema="registerSchema"
      :state="form"
      :class="appConfig.layout.formWrapper"
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

      <div v-if="error" :class="appConfig.typography.formStatusError">
        {{ getErrorMessage(error) }}
      </div>
      <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
        {{ CONST_REGISTER_SUCCESS }}
      </div>

      <div :class="appConfig.layout.formActions">
        <UButton
          :label="CONST_CANCEL_BTN_TEXT"
          variant="actionCancelButton"
          :disabled="isLoading"
          @click="clearForm"
        />
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
import { registerSchema, type RegisterFormState } from '../utils/schemas/register.schema';
import { useCreateUserMutation } from '../queries/user.mutation';
import { getErrorMessage } from '../utils/error.utils';
import { useAppConfig } from '#imports';

definePageMeta({
  layout: 'auth',
});

const router = useRouter();
const appConfig = useAppConfig();

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
} = useCreateUserMutation({
  onSuccess: () => router.push('/login'),
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
