<!-- frontend/app/pages/verify-email.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ CONST_LOADING_TEXT ?? 'Loading...' }}</span>
        </div>
      </template>

      <VerifyEmailMobile
        v-if="isMobile"
        :email="email"
        :is-verifying="verifyMutation.isLoading.value"
        :is-resending="resendMutation.isLoading.value"
        :is-verified="isVerified"
        :resend-cooldown="resendCooldown"
        :resend-success="resendSuccess"
        :error="verifyMutation.error.value"
        :resend-error="resendMutation.error.value"
        @submit="handleVerify"
        @resend="handleResend"
      />
      <VerifyEmailDesktop
        v-else
        :email="email"
        :is-verifying="verifyMutation.isLoading.value"
        :is-resending="resendMutation.isLoading.value"
        :is-verified="isVerified"
        :resend-cooldown="resendCooldown"
        :resend-success="resendSuccess"
        :error="verifyMutation.error.value"
        :resend-error="resendMutation.error.value"
        @submit="handleVerify"
        @resend="handleResend"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useScreenSize } from '~/composables/useScreenSize';
import { useVerifyEmailMutation, useResendVerificationMutation } from '~/queries/auth.mutation';
import VerifyEmailDesktop from '~/components/views/desktop/auth/VerifyEmailDesktop.vue';
import VerifyEmailMobile from '~/components/views/mobile/auth/VerifyEmailMobile.vue';

/* --- PAGE CONFIGURATION ---
 * Uses the same auth layout and guest middleware as register/login.
 * If a logged-in user somehow lands here they get redirected away by the guest middleware.
 */
definePageMeta({ layout: 'auth', middleware: ['guest'] });

/* --- COMPOSABLES --- */
const { isMobile } = useScreenSize();
const route = useRoute();
const router = useRouter();

/* --- EMAIL FROM QUERY PARAM ---
 * register.vue passes ?email=... when it redirects here.
 * If the param is missing the user arrived directly — still usable
 * (they can type their email manually via the resend flow) but we
 * show an empty string and let the backend reject gracefully.
 */
const email = (route.query.email as string) ?? '';

/* --- STATE --- */
const isVerified = ref(false);
const resendSuccess = ref(false);

/* --- RESEND COOLDOWN (30 s) --- */
const RESEND_COOLDOWN_SECONDS = 30;
const resendCooldown = ref(0);
let cooldownInterval: ReturnType<typeof setInterval> | null = null;

const startCooldown = () => {
  resendCooldown.value = RESEND_COOLDOWN_SECONDS;
  cooldownInterval = setInterval(() => {
    resendCooldown.value -= 1;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval!);
      cooldownInterval = null;
    }
  }, 1000);
};

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval);
});

/* --- MUTATIONS ---
 * Keep the full mutation objects — never destructure isLoading/error,
 * as they are reactive Refs that lose their reference when unboxed.
 */
const verifyMutation = useVerifyEmailMutation({
  onSuccess: () => {
    isVerified.value = true;
    // Give the user a moment to see the success message before navigating
    setTimeout(() => router.push('/login'), 1500);
  },
});

const resendMutation = useResendVerificationMutation({
  onSuccess: () => {
    resendSuccess.value = true;
    startCooldown();
    // Clear the success notice after 4 s
    setTimeout(() => {
      resendSuccess.value = false;
    }, 4000);
  },
});

/* --- HANDLERS --- */
const handleVerify = (otp: string) => {
  if (!otp || otp.length !== 6) return;
  resendSuccess.value = false;
  verifyMutation.mutate({ email, otp });
};

const handleResend = () => {
  if (resendCooldown.value > 0 || resendMutation.isLoading.value) return;
  resendSuccess.value = false;
  resendMutation.mutate(email);
};
</script>
