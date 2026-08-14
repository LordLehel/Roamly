<template>
  <div
    class="min-h-screen flex flex-col text-white font-sans bg-[url('/register/register-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
  >
    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-6 py-4 border-b border-green-900/50 bg-black/30 backdrop-blur-md"
    >
      <div class="flex-1">
        <!-- Go Back -->
        <UButton label="Go Back" variant="glassOutline" @click="router.back()" />
      </div>

      <NuxtLink
        to="/"
        class="flex items-center gap-2 border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
      >
        <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-green-400" />
        <span class="text-lg font-semibold tracking-wider text-green-50">ROAMLY</span>
      </NuxtLink>

      <div class="flex-1 flex justify-end items-center gap-4">
        <!-- Register -->
        <UButton label="Register" variant="glassOutline" to="/register" />
        <UAvatar icon="i-heroicons-user" size="sm" />
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex items-center justify-center p-4">
      <UCard variant="glass">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-medium tracking-wide text-green-50">Log into account</h1>
        </div>

        <!-- Login form -->
        <UForm
          :schema="loginSchema"
          :state="form"
          class="w-full flex flex-col gap-4"
          @submit="handleLogin"
        >
          <UFormField name="email" label="Email">
            <template #default="{ error: fieldError }">
              <UInput
                v-model="form.email"
                type="email"
                placeholder="ex. sir_real_99@roamly.com"
                :variant="fieldError ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="password" label="Password">
            <template #default="{ error: fieldError }">
              <UInput
                v-model="form.password"
                type="password"
                placeholder="********"
                :variant="fieldError ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <!-- Colada Mutation error -->
          <div v-if="error" class="text-red-400 text-sm text-center font-medium">
            {{ getErrorMessage(error) }}
          </div>
          <div v-if="status === 'success'" class="text-green-400 text-sm text-center font-medium">
            Login successful! Redirecting...
          </div>

          <div class="flex items-center justify-between pt-6">
            <UButton label="Cancel" variant="glass" :disabled="isLoading" @click="clearForm" />
            <!-- Loading state -->
            <UButton type="submit" label="Log in" variant="glass" :loading="isLoading" />
          </div>
        </UForm>
      </UCard>
    </main>

    <!-- FOOTER -->
    <footer
      class="py-3 text-center text-xs text-green-500 border-t border-green-900/50 bg-black/30 backdrop-blur-md"
    >
      Copyright - Roamly idk.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormSubmitEvent } from '#ui/types';
import { loginSchema, type LoginFormState } from '../utils/login.schema';
import { useLoginUserMutation } from '../queries/auth.mutation';
import { getErrorMessage } from '../utils/error.utils';

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
} = useLoginUserMutation((data) => {
  if (data?.token) {
    localStorage.setItem('auth_token', data.token);
  }
  setTimeout(() => router.push('/'), 2000);
});

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
