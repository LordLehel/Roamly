<template>
  <!-- MAIN CONTAINER: full-screen, dark-background -->
  <div
    class="min-h-screen flex flex-col text-white font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style="background-image: url('/register/register-background.jpg')"
  >
    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-6 py-4 border-b border-green-900/50 bg-black/30 backdrop-blur-md"
    >
      <!-- Left side: Go Back -->
      <div class="flex-1">
        <UButton
          label="Go Back"
          variant="outline"
          color="neutral"
          class="border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
          @click="$router.back()"
        />
      </div>

      <!-- Center: Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
      >
        <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-green-400" />
        <span class="text-lg font-semibold tracking-wider text-green-50">ROAMLY</span>
      </NuxtLink>

      <!-- Right side: Log in & Profile -->
      <div class="flex-1 flex justify-end items-center gap-4">
        <UButton
          label="Log in"
          variant="outline"
          color="neutral"
          to="/login"
          class="border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
        />
        <UAvatar
          icon="i-heroicons-user"
          color="neutral"
          size="sm"
          class="ring-1 ring-green-500/50 bg-green-950/50 backdrop-blur-md hover:bg-green-800 text-green-50 transition-colors"
        />
      </div>
    </header>

    <!-- MAIN CONTENT: Register Form -->
    <main class="flex-1 flex items-center justify-center p-4">
      <!--Form card -->
      <UCard
        class="w-full max-w-md bg-black/60 backdrop-blur-xl ring-1 ring-green-500/30 shadow-2xl shadow-black/80"
        :ui="{ body: 'p-8' }"
      >
        <!-- Form Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-medium tracking-wide text-green-50">Register account</h1>
        </div>

        <UForm
          :schema="registerSchema"
          :state="form"
          class="w-full flex flex-col gap-4"
          @submit="handleRegister"
        >
          <!-- Email Field -->
          <UFormField name="email">
            <template #default="{ error }">
              <p class="text-sm text-green-400">Email</p>
              <UInput
                v-model="form.email"
                type="email"
                color="neutral"
                variant="outline"
                placeholder="sir_real_99@roamly.com"
                class="w-full"
                :ui="{
                  base: error
                    ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                    : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
                }"
              />
            </template>
          </UFormField>

          <!-- Username Field -->
          <UFormField name="username">
            <template #default="{ error }">
              <p class="text-sm text-green-400">Username</p>
              <UInput
                v-model="form.username"
                type="text"
                color="neutral"
                variant="outline"
                placeholder="ex. sir_real_99"
                class="w-full"
                :ui="{
                  base: error
                    ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                    : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
                }"
              />
            </template>
          </UFormField>

          <!-- Phone Field -->
          <UFormField name="phone">
            <template #default="{ error }">
              <p class="text-sm text-green-400">Phone number</p>
              <UInput
                v-model="form.phone"
                type="phone"
                color="neutral"
                variant="outline"
                placeholder="ex. +40 712 345 678"
                class="w-full"
                :ui="{
                  base: error
                    ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                    : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
                }"
              />
            </template>
          </UFormField>

          <!-- Password Field -->
          <UFormField name="password">
            <template #default="{ error }">
              <p class="text-sm text-green-400">Password</p>
              <UInput
                v-model="form.password"
                type="password"
                color="neutral"
                variant="outline"
                placeholder="********"
                class="w-full"
                :ui="{
                  base: error
                    ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                    : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
                }"
              />
            </template>
          </UFormField>

          <!-- Repeat Password Field -->
          <UFormField name="repeatPassword">
            <template #default="{ error }">
              <p class="text-sm text-green-400">Repeat password</p>
              <UInput
                v-model="form.repeatPassword"
                type="password"
                color="neutral"
                variant="outline"
                placeholder="********"
                class="w-full"
                :ui="{
                  base: error
                    ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                    : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
                }"
              />
            </template>
          </UFormField>

          <div v-if="backendError" class="text-red-400 text-sm text-center font-medium">
            {{ backendError }}
          </div>

          <!-- Success message -->
          <div v-if="successMessage" class="text-green-400 text-sm text-center font-medium">
            {{ successMessage }}
          </div>

          <!-- register buttons -->
          <div class="flex items-center justify-between pt-6">
            <!-- cancel button -->
            <UButton
              label="Cancel"
              variant="outline"
              color="neutral"
              class="h-10 px-6 text-md ring-1 ring-green-800 bg-green-950/50 hover:bg-green-800 hover:ring-1 hover:ring-green-500 text-green-50 transition-colors"
              @click="clearForm"
            />

            <!-- register button -->
            <UButton
              type="submit"
              label="Register"
              color="neutral"
              variant="solid"
              class="h-10 px-6 text-md ring-1 ring-green-800 bg-green-950/50 hover:bg-green-800 hover:ring-1 hover:ring-green-500 text-green-50 transition-colors"
            />
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
import { useApi } from '../composables/useApi';
import type { RegisterResponse, ApiErrorResponse } from '../types/api.type';
import type { RegisterFormState } from '../utils/register.schema.ts';

const api = useApi();
const router = useRouter();

interface RegisterResponse {
  status: string;
  message: string;
}

// Type for error response (Bővítve a Zod lehetséges formátumaival)
interface ApiErrorResponse {
  data?: {
    status?: string;
    // A message lehet egy sima string, vagy egy objektum, ami mezőnevekhez rendel string tömböket (Zod format)
    message?: string | Record<string, string[]>;
  };
  message?: string;
}

// The forms default values
const form = reactive({
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

  console.log('Sending request to register user with data:', form);
};
</script>
