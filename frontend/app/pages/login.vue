<!-- frontend/app/pages/login.vue -->
<template>
  <!-- Ez a wrapper tartja össze a kártyát és a gombot egyetlen középre zárt oszlopban -->
  <div class="w-full max-w-md mx-auto flex flex-col gap-6">
    <UCard variant="glass">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-medium tracking-wide text-brand-950">{{ CONST_LOGIN_HEADING }}</h1>
      </div>

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
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            :disabled="isLoading"
            @click="clearForm"
          />
          <UButton
            type="submit"
            :label="CONST_LOGIN_TITLE"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>

    <div class="pt-2 text-center w-full">
      <UButton
        to="/register"
        :label="CONST_REGISTER_PROMPT_BTN"
        variant="actionAccentHeroButton"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '../utils/schemas/login.schema';
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
} = useLoginUserMutation(() => router.push('/'));

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
