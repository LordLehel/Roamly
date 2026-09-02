<!-- frontend/app/components/views/mobile/auth/RegisterMobile.vue -->
<template>
  <div class="mobile-wrapper p-4 text-center">
    <h1 class="text-xl font-bold text-dark-text">Here will be the mobile view for Register</h1>
    <p v-if="error" class="text-error-500 mt-2">{{ error.message }}</p>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
// import type { RegisterFormState } from '~/utils/schemas/register.schema';
import type { ApiError } from '~/types/apiError.type';

/* --- PROPS & EMITS --- */
defineProps<{
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  status: 'idle' | 'pending' | 'success' | 'error';
}>();

/*
const emit = defineEmits<{
  (e: 'submit', data: RegisterFormState): void;
}>();
*/
</script>
