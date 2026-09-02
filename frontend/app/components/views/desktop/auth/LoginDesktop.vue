<!-- frontend/app/components/views/desktop/auth/LoginDesktop.vue -->
<template>
  <div :class="appConfig.layout.authWrapper">
    <UCard variant="glass">
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">{{ CONST_LOGIN_HEADING ?? 'Login' }}</h1>
      </div>

      <UForm
        :schema="loginSchema"
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

        <div v-if="error" :class="appConfig.typography.formStatusError">
          {{ getErrorMessage(error) }}
        </div>
        <div v-if="status === 'success'" :class="appConfig.typography.formStatusSuccess">
          {{ CONST_LOGIN_SUCCESS ?? 'Success!' }}
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
            :label="CONST_LOGIN_TITLE ?? 'Login'"
            variant="actionOkButton"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </UCard>

    <div :class="appConfig.layout.singleButtonWrapper">
      <UTooltip :text="CONST_TOOLTIP_REGISTER_PROMPT ?? 'Register'">
        <UButton
          to="/register"
          :label="CONST_REGISTER_PROMPT_BTN ?? 'Create account'"
          variant="actionAccentHeroButton"
          class="w-full"
        />
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAppConfig } from '#imports';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '~/utils/schemas/login.schema';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

const appConfig = useAppConfig();

defineProps<{
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  status: 'idle' | 'pending' | 'success' | 'error';
}>();

const emit = defineEmits<{
  (e: 'submit', data: LoginFormState): void;
}>();

const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

const clearForm = () => {
  Object.assign(form, { email: '', password: '' });
};

const onSubmit = (event: FormSubmitEvent<LoginFormState>) => {
  emit('submit', event.data);
};
</script>
