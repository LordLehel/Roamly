<!-- frontend/app/pages/register.vue -->
<template>
  <div>
    <RegisterMobile
      v-if="isMobile"
      :is-loading="isLoading"
      :error="error"
      :status="status"
      @submit="handleRegister"
    />
    <RegisterDesktop
      v-else
      :is-loading="isLoading"
      :error="error"
      :status="status"
      @submit="handleRegister"
    />
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useRouter } from 'vue-router';
import { useScreenSize } from '~/composables/useScreenSize';
import { useCreateUserMutation } from '~/queries/user.mutation';
import type { RegisterFormState } from '~/utils/schemas/register.schema';
import RegisterDesktop from '~/components/views/desktop/auth/RegisterDesktop.vue';
import RegisterMobile from '~/components/views/mobile/auth/RegisterMobile.vue';

/* --- PAGE CONFIGURATION --- */
definePageMeta({ layout: 'auth', middleware: ['guest'] });

/* --- COMPOSABLES & STORES --- */
const { isMobile } = useScreenSize();
const router = useRouter();

/* --- API MUTATIONS --- */
const {
  mutate: registerUser,
  isLoading,
  error,
  status,
} = useCreateUserMutation({
  onSuccess: () => router.push('/login'),
});

/* --- EVENT HANDLERS --- */
const handleRegister = (data: RegisterFormState) => {
  registerUser({
    email: data.email,
    username: data.username,
    phone_number: data.phone_number,
    password: data.password,
  });
};
</script>
