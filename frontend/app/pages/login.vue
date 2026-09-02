<!-- frontend/app/pages/login.vue -->
<template>
  <div>
    <LoginMobile
      v-if="isMobile"
      :is-loading="isLoading"
      :error="error"
      :status="status"
      @submit="handleLogin"
    />
    <LoginDesktop
      v-else
      :is-loading="isLoading"
      :error="error"
      :status="status"
      @submit="handleLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useScreenSize } from '~/composables/useScreenSize';
import { useLoginUserMutation } from '~/queries/auth.mutation';
import type { LoginFormState } from '~/utils/schemas/login.schema';

import LoginDesktop from '~/components/views/desktop/auth/LoginDesktop.vue';
import LoginMobile from '~/components/views/mobile/auth/LoginMobile.vue';

definePageMeta({ layout: 'auth', middleware: ['guest'] });

const { isMobile } = useScreenSize();
const router = useRouter();

const {
  mutate: loginUser,
  isLoading,
  error,
  status,
} = useLoginUserMutation(() => router.push('/groups'));

const handleLogin = (data: LoginFormState) => {
  loginUser({
    email: data.email,
    password: data.password,
  });
};
</script>
