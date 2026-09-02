<!-- frontend/app/components/views/desktop/auth/RegisterDesktop.vue -->
<template>
  <UCard variant="glass">
    <div :class="appConfig.typography.authTitleWrapper">
      <h1 :class="appConfig.typography.authTitle">{{ CONST_REGISTER_HEADING ?? 'Register' }}</h1>
    </div>

    <UForm
      :schema="registerSchema"
      :state="form"
      :class="appConfig.layout.formWrapper"
      @submit="onSubmit"
    >
      <UFormField name="email" :label="CONST_EMAIL_LABEL ?? 'Email'">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.email"
            type="email"
            placeholder="ex. sir_real_99@roamly.com"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="username" :label="CONST_USERNAME_LABEL ?? 'Username'">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.username"
            type="text"
            placeholder="ex. sir_real_99"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="phone_number" :label="CONST_PHONE_LABEL ?? 'Phone'">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.phone_number"
            type="tel"
            placeholder="ex. +40 712 345 678"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="password" :label="CONST_PASSWORD_LABEL ?? 'Password'">
        <template #default="{ error: fieldError }">
          <UInput
            v-model="form.password"
            type="password"
            placeholder="********"
            :variant="fieldError ? 'glassError' : 'glass'"
          />
        </template>
      </UFormField>

      <UFormField name="repeatPassword" :label="CONST_REPEAT_PASSWORD_LABEL ?? 'Repeat Password'">
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
        {{ CONST_REGISTER_SUCCESS ?? 'Success!' }}
      </div>

      <div :class="appConfig.layout.formActions">
        <UButton
          :label="CONST_CANCEL_BTN_TEXT ?? 'Cancel'"
          variant="actionCancelButton"
          :disabled="isLoading"
          @click="clearForm"
        />
        <UButton
          type="submit"
          :label="CONST_REGISTER_TITLE ?? 'Register'"
          variant="actionOkButton"
          :loading="isLoading"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { registerSchema, type RegisterFormState } from '~/utils/schemas/register.schema';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();

defineProps<{
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  status: 'idle' | 'pending' | 'success' | 'error';
}>();

const emit = defineEmits<{
  (e: 'submit', data: RegisterFormState): void;
}>();

const form = reactive<RegisterFormState>({
  email: '',
  username: '',
  phone_number: '',
  password: '',
  repeatPassword: '',
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

const onSubmit = (event: FormSubmitEvent<RegisterFormState>) => {
  emit('submit', event.data);
};
</script>
