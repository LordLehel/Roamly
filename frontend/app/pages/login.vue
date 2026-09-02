<!-- frontend/app/pages/login.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
    <UCard variant="glass">
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">{{ CONST_LOGIN_HEADING }}</h1>
      </div>

      <UForm
        :schema="loginSchema"
        :state="form"
        :class="appConfig.layout.formWrapper"
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

        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
          {{ CONST_LOGIN_SUCCESS }}
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
            :label="CONST_LOGIN_TITLE"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>

    <div :class="appConfig.layout.singleButtonWrapper">
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
import { useAppConfig } from '#imports';

definePageMeta({
  layout: 'auth',
  middleware: ['guest'],
});

const router = useRouter();
const appConfig = useAppConfig();

const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

const {
  mutate: loginUser,
  isLoading,
  error,
  status,
} = useLoginUserMutation(() => router.push('/groups'));

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
