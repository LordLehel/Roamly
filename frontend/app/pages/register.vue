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
        <!-- Log in -->
        <UButton label="Log in" variant="glassOutline" to="/login" />
        <UAvatar icon="i-heroicons-user" size="sm" />
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex items-center justify-center p-4">
      <UCard variant="glass">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-medium tracking-wide text-green-50">Register account</h1>
        </div>

        <!-- Register form -->
        <UForm
          :schema="registerSchema"
          :state="form"
          class="w-full flex flex-col gap-4"
          @submit="handleRegister"
        >
          <UFormField name="email" label="Email">
            <template #default="{ error }">
              <!-- Dinamic variant -->
              <UInput
                v-model="form.email"
                type="email"
                placeholder="sir_real_99@roamly.com"
                :variant="error ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="username" label="Username">
            <template #default="{ error }">
              <UInput
                v-model="form.username"
                type="text"
                placeholder="ex. sir_real_99"
                :variant="error ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="phone" label="Phone number">
            <template #default="{ error }">
              <UInput
                v-model="form.phone"
                type="tel"
                placeholder="ex. +40 712 345 678"
                :variant="error ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="password" label="Password">
            <template #default="{ error }">
              <UInput
                v-model="form.password"
                type="password"
                placeholder="********"
                :variant="error ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="repeatPassword" label="Repeat password">
            <template #default="{ error }">
              <UInput
                v-model="form.repeatPassword"
                type="password"
                placeholder="********"
                :variant="error ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <div v-if="backendError" class="text-red-400 text-sm text-center font-medium">
            {{ backendError }}
          </div>
          <div v-if="successMessage" class="text-green-400 text-sm text-center font-medium">
            {{ successMessage }}
          </div>

          <div class="flex items-center justify-between pt-6">
            <!-- Cancel és Register gombok az új glass variánssal -->
            <UButton label="Cancel" variant="glass" @click="clearForm" />
            <UButton type="submit" label="Register" variant="glass" />
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import type { RegisterResponse, ApiErrorResponse } from '../types/api.type';
import { registerSchema, type RegisterFormState } from '../utils/register.schema';

const api = useApi();
const router = useRouter();

const form = reactive<RegisterFormState>({
  email: '',
  username: '',
  phone: '',
  password: '',
  repeatPassword: '',
});

const backendError = ref('');
const successMessage = ref('');

const clearForm = () => {
  Object.assign(form, { email: '', username: '', phone: '', password: '', repeatPassword: '' });
  backendError.value = '';
  successMessage.value = '';
};

const handleRegister = async () => {
  backendError.value = '';
  successMessage.value = '';

  try {
    const _response = await api<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: {
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      },
    });

    successMessage.value = 'Registration successful! Redirecting to login page...';
    setTimeout(() => router.push('/login'), 2000);
  } catch (err: unknown) {
    const errorObj = err as ApiErrorResponse;
    const errorData = errorObj?.data;

    let msg = 'Registration failed!';
    if (errorData && errorData.message) {
      if (typeof errorData.message === 'string') {
        msg = errorData.message;
      } else if (typeof errorData.message === 'object') {
        const allErrors: string[] = [];
        for (const fieldErrors of Object.values(errorData.message)) {
          if (Array.isArray(fieldErrors)) allErrors.push(...fieldErrors);
        }
        if (allErrors.length > 0) msg = allErrors.join(' | ');
      }
    } else if (errorObj?.message) {
      msg = errorObj.message;
    }

    backendError.value = msg;
  }
};
</script>
