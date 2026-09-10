<!-- frontend/app/components/views/mobile/auth/VerifyEmailMobile.vue -->
<template>
  <div :class="[appConfig.layout.mobileAuthWrapper, 'px-4 py-6']">
    <UCard variant="glass">
      <!-- TITLE -->
      <div :class="appConfig.typography.authTitleWrapper">
        <h1 :class="appConfig.typography.authTitle">Verify your email</h1>
        <p class="text-sm text-surface-400 text-center mt-1 leading-relaxed">
          We sent a 6-digit code to
          <span class="font-semibold text-dark-text break-all">{{ email }}</span
          >. Enter it below to complete your registration.
        </p>
      </div>

      <!-- OTP INPUTS -->
      <div :class="appConfig.layout.formWrapper">
        <div class="flex items-center justify-center gap-2 py-2">
          <input
            v-for="(_, i) in otpCells"
            :key="i"
            :ref="(el) => setRef(el, i)"
            v-model="otpCells[i]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-11 h-13 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150 bg-white/5 text-dark-text caret-brand-500 border-surface-500/30 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-40"
            :class="{
              'border-error-500 focus:border-error-500 focus:ring-error-500/30': !!error,
              'border-success-500 focus:border-success-500 focus:ring-success-500/30': isVerified,
            }"
            :disabled="isVerifying || isVerified"
            @input="onInput(i, $event)"
            @keydown="onKeydown(i, $event)"
            @paste="onPaste"
            @focus="($event.target as HTMLInputElement).select()"
          />
        </div>

        <!-- Error -->
        <div v-if="error" :class="appConfig.typography.formStatusError" class="text-center">
          {{ getErrorMessage(error) }}
        </div>

        <!-- Success -->
        <div v-if="isVerified" :class="appConfig.typography.formStatusSuccess" class="text-center">
          Email verified! Redirecting to login...
        </div>

        <!-- Verify button -->
        <div class="flex flex-col gap-3 pt-2 w-full">
          <UButton
            label="Verify"
            variant="actionOkButton"
            class="w-full"
            :loading="isVerifying"
            :disabled="!isOtpComplete || isVerified"
            @click="emit('submit', otpValue)"
          />
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-3 py-1">
          <div class="flex-1 h-px bg-surface-500/20" />
          <span class="text-xs text-surface-400">or</span>
          <div class="flex-1 h-px bg-surface-500/20" />
        </div>

        <!-- Resend -->
        <div class="flex flex-col items-center gap-1.5">
          <p class="text-xs text-surface-400">Didn't receive a code?</p>
          <UButton
            label="Resend code"
            variant="link"
            class="text-sm font-semibold text-brand-500 hover:text-brand-400 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="isResending || resendCooldown > 0 || isVerified"
            :loading="isResending"
            @click="emit('resend')"
          />
          <p v-if="resendCooldown > 0" class="text-xs text-surface-400">
            Resend available in {{ resendCooldown }}s
          </p>
          <div
            v-if="resendSuccess"
            :class="appConfig.typography.formStatusSuccess"
            class="text-xs text-center"
          >
            A new code was sent to your email!
          </div>
          <div
            v-if="resendError"
            :class="appConfig.typography.formStatusError"
            class="text-xs text-center"
          >
            {{ getErrorMessage(resendError) }}
          </div>
        </div>
      </div>
    </UCard>

    <!-- Back to register -->
    <div :class="appConfig.layout.singleButtonWrapper">
      <UButton to="/register" label="Back to Register" variant="actionOkButton" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { reactive, ref, computed, watch } from 'vue';
import { useAppConfig } from '#imports';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS --- */
const props = defineProps<{
  email: string;
  isVerifying: boolean;
  isResending: boolean;
  isVerified: boolean;
  resendCooldown: number;
  resendSuccess: boolean;
  error: ApiError | Error | null | undefined;
  resendError: ApiError | Error | null | undefined;
}>();

/* --- EMITS --- */
const emit = defineEmits<{
  submit: [otp: string];
  resend: [];
}>();

/* --- OTP STATE --- */
const OTP_LENGTH = 6;
const otpCells = reactive<string[]>(Array(OTP_LENGTH).fill(''));
const inputRefs = ref<(HTMLInputElement | null)[]>(Array(OTP_LENGTH).fill(null));

const setRef = (el: unknown, i: number) => {
  inputRefs.value[i] = el as HTMLInputElement | null;
};

const otpValue = computed(() => otpCells.join(''));
const isOtpComplete = computed(
  () => otpValue.value.length === OTP_LENGTH && otpCells.every((c) => c !== ''),
);

const focusCell = (index: number) => {
  inputRefs.value[index]?.focus();
};

const onInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const val = target.value.replace(/\D/g, '').slice(-1);
  otpCells[index] = val;

  if (val && index < OTP_LENGTH - 1) {
    focusCell(index + 1);
  }

  if (isOtpComplete.value) {
    emit('submit', otpValue.value);
  }
};

const onKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (otpCells[index]) {
      otpCells[index] = '';
    } else if (index > 0) {
      otpCells[index - 1] = '';
      focusCell(index - 1);
    }
    event.preventDefault();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    focusCell(index - 1);
    event.preventDefault();
  } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
    focusCell(index + 1);
    event.preventDefault();
  }
};

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH) ?? '';
  pasted.split('').forEach((char, i) => {
    if (i < OTP_LENGTH) otpCells[i] = char;
  });
  focusCell(Math.min(pasted.length, OTP_LENGTH - 1));

  if (isOtpComplete.value) {
    emit('submit', otpValue.value);
  }
};

/* --- Clear cells and refocus when verification fails --- */
watch(
  () => props.error,
  (newErr) => {
    if (newErr) {
      otpCells.forEach((_, i) => {
        otpCells[i] = '';
      });
      focusCell(0);
    }
  },
);
</script>
