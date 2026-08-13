<template>
  <!-- MAIN CONTAINER: full-screen, dark-background -->
  <div
    class="min-h-screen flex flex-col text-white font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style="background-image: url('/login/login-background.jpg')"
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

      <!-- Right side: Register & Profile -->
      <div class="flex-1 flex justify-end items-center gap-4">
        <UButton
          label="Register"
          variant="outline"
          color="neutral"
          to="/register"
          class="border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
        />
        <NuxtLink to="/">
          <UAvatar
            icon="i-heroicons-user"
            color="neutral"
            size="sm"
            class="ring-1 ring-green-500/50 bg-green-950/50 backdrop-blur-md hover:bg-green-800 text-green-50 transition-colors"
          />
        </NuxtLink>
      </div>
    </header>

    <!-- MAIN CONTENT: Login Form -->
    <main class="flex-1 flex items-center justify-center p-4">
      <!--Form card -->
      <UCard
        class="w-full max-w-md bg-black/60 backdrop-blur-xl ring-1 ring-green-500/30 shadow-2xl shadow-black/80"
        :ui="{ body: 'p-8' }"
      >
        <!-- Form Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-medium tracking-wide text-green-50">Log into account</h1>
        </div>

        <UForm
          :schema="loginSchema"
          :state="form"
          class="w-full flex flex-col gap-4"
          @submit="handleLogin"
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
                  base:
                    error || backendError
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
                  base:
                    error || backendError
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

          <!-- login buttons -->
          <div class="flex items-center justify-between pt-6">
            <!-- cancel button -->
            <UButton
              label="Cancel"
              variant="outline"
              color="neutral"
              class="h-10 px-6 text-md ring-1 ring-green-800 bg-green-950/50 hover:bg-green-800 hover:ring-1 hover:ring-green-500 text-green-50 transition-colors"
              @click="clearForm"
            />

            <!-- login button -->
            <UButton
              type="submit"
              label="Log in"
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
      class="py-4 px-6 flex items-center justify-between text-xs text-green-500 border-t border-green-900/50 bg-black/30 backdrop-blur-md"
    >
      <!-- Copyright -->
      <div class="opacity-75">Copyright - Roamly idk.</div>

      <!-- Links -->
      <div class="flex gap-4 font-medium tracking-wide">
        <NuxtLink
          to="/"
          class="hover:text-green-300 hover:underline underline-offset-4 transition-all"
        >
          Home
        </NuxtLink>
        <span class="opacity-50">|</span>
        <NuxtLink
          to="/about"
          class="hover:text-green-300 hover:underline underline-offset-4 transition-all"
        >
          About
        </NuxtLink>
        <span class="opacity-50">|</span>
        <NuxtLink
          to="/support"
          class="hover:text-green-300 hover:underline underline-offset-4 transition-all"
        >
          Support
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useApi } from '../composables/useApi';
import type { ApiErrorResponse, LoginResponse } from '../types/api.type';
import type { LoginFormState } from '../utils/login.schema';

const api = useApi();
const router = useRouter();

const form = reactive<LoginFormState>({
  email: '',
  password: '',
});

const backendError = ref('');
const successMessage = ref('');

watch(
  () => form.email,
  () => (backendError.value = ''),
);
watch(
  () => form.password,
  () => (backendError.value = ''),
);

const clearForm = () => {
  Object.assign(form, { email: '', password: '' });
  backendError.value = '';
  successMessage.value = '';
};

const handleLogin = async () => {
  backendError.value = '';
  successMessage.value = '';

  // Form validation: is empty?
  if (!form.email.trim() || !form.password.trim()) {
    backendError.value = 'Please fill in both email and password!';
    return;
  }

  try {
    const _response = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    });

    // store token
    if (_response.token) {
      localStorage.setItem('auth_token', _response.token);
    }

    successMessage.value = 'Login successful! Redirecting...';
    setTimeout(() => router.push('/'), 2000);
  } catch (err: unknown) {
    const errorObj = err as ApiErrorResponse;
    const errorData = errorObj?.data;

    let msg = 'Login failed!';

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
