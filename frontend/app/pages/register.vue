<!-- frontend/app/pages/register.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ CONST_LOADING_TEXT ?? 'Loading...' }}</span>
        </div>
      </template>

      <RegisterMobile
        v-if="isMobile"
        :is-loading="registerMutation.isLoading.value"
        :error="registerMutation.error.value"
        :status="registerMutation.status.value"
        @submit="handleRegister"
      />
      <RegisterDesktop
        v-else
        :is-loading="registerMutation.isLoading.value"
        :error="registerMutation.error.value"
        :status="registerMutation.status.value"
        @submit="handleRegister"
      />
    </ClientOnly>
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

/* --- COMPOSABLES --- */
const { isMobile } = useScreenSize();
const router = useRouter();

/* --- STATE: track the submitted email so we can forward it to the verification page --- */
let pendingEmail = '';

/* --- API MUTATIONS --- */
// Keep the whole mutation object — never destructure isLoading/error out of it
const registerMutation = useCreateUserMutation({
  onSuccess: () => {
    // Redirect to the OTP verification page, carrying the email in the query string
    router.push({ path: '/verify-email', query: { email: pendingEmail } });
  },
});

/* --- EVENT HANDLERS --- */
const handleRegister = (data: RegisterFormState) => {
  pendingEmail = data.email;
  registerMutation.mutate({
    email: data.email,
    username: data.username,
    phone_number: data.phone_number,
    password: data.password,
  });
};
</script>
