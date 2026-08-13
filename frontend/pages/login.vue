<template>
  <!-- MAIN CONTAINER: Alabástrom háttér, sötét erdei zöld alapszöveg -->
  <div
    class="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2F3E32] font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style="background-image: url('/login/login-background.jpg')"
  >
    <!-- HEADER: Sápadt zsályazöld sáv, puha árnyékkal, üveghatással -->
    <header
      class="flex items-center justify-between px-6 py-4 bg-[#EDF1EE]/70 backdrop-blur-md shadow-sm relative z-10"
    >
      <!-- Left side: Go Back -->
      <div class="flex-1">
        <UButton
          label="Go Back"
          variant="solid"
          class="rounded-full bg-[#7A9A82] hover:bg-[#68856F] text-white px-5 py-2 transition-colors shadow-sm font-bold tracking-wide"
          @click="$router.back()"
        />
      </div>

      <!-- Center: Logo -->
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-[#2F3E32] hover:opacity-80 transition-opacity"
      >
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-[#7A9A82]" />
        <span class="text-xl font-semibold tracking-wider">ROAMLY</span>
      </NuxtLink>

      <!-- Right side: Register & Profile -->
      <div class="flex-1 flex justify-end items-center gap-4">
        <UButton
          label="Register"
          to="/register"
          variant="solid"
          class="rounded-full bg-[#E5A93B] hover:bg-[#D49933] text-white px-5 py-2 transition-colors shadow-sm font-bold tracking-wide"
        />
        <NuxtLink to="/">
          <UAvatar
            icon="i-heroicons-user"
            size="sm"
            class="bg-[#2F3E32] text-[#FAF9F6] ring-2 ring-[#2F3E32]/10 shadow-sm"
          />
        </NuxtLink>
      </div>
    </header>

    <!-- MAIN CONTENT: Login Form -->
    <main class="flex-1 flex items-center justify-center p-6">
      <!-- Form card -->
      <UCard
        class="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] border-0 ring-1 ring-white/50"
        :ui="{ body: 'p-8' }"
      >
        <!-- Form Header -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-medium tracking-wide text-[#2F3E32]">Log into account</h1>
        </div>

        <UForm
          :schema="loginSchema"
          :state="form"
          class="w-full flex flex-col gap-5"
          @submit="handleLogin"
        >
          <!-- Email Field -->
          <UFormField name="email">
            <template #default="{ error }">
              <p class="text-sm font-medium text-[#2F3E32] mb-1.5 ml-1">Email</p>
              <UInput
                v-model="form.email"
                type="email"
                variant="none"
                placeholder="sir_real_99@roamly.com"
                class="w-full"
                :ui="{
                  base:
                    error || backendError
                      ? 'bg-red-50 text-red-900 rounded-xl ring-1 ring-red-500 !placeholder-red-300 focus:ring-2 focus:ring-red-500 transition-colors h-11 px-4 shadow-none'
                      : 'bg-[#E8F0F5] text-[#2F3E32] rounded-xl ring-1 ring-[#D0E0EB] !placeholder-gray-400 focus:ring-2 focus:ring-[#7A9A82] transition-colors h-11 px-4 shadow-none',
                }"
              />
            </template>
          </UFormField>

          <!-- Password Field -->
          <UFormField name="password">
            <template #default="{ error }">
              <p class="text-sm font-medium text-[#2F3E32] mb-1.5 ml-1">Password</p>
              <UInput
                v-model="form.password"
                type="password"
                variant="none"
                placeholder="********"
                class="w-full"
                :ui="{
                  base:
                    error || backendError
                      ? 'bg-red-50 text-red-900 rounded-xl ring-1 ring-red-500 !placeholder-red-300 focus:ring-2 focus:ring-red-500 transition-colors h-11 px-4 shadow-none'
                      : 'bg-[#E8F0F5] text-[#2F3E32] rounded-xl ring-1 ring-[#D0E0EB] !placeholder-gray-400 focus:ring-2 focus:ring-[#7A9A82] transition-colors h-11 px-4 shadow-none',
                }"
              />
            </template>
          </UFormField>

          <!-- Backend Error Message -->
          <div
            v-if="backendError"
            class="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded-xl"
          >
            {{ backendError }}
          </div>

          <!-- Success message -->
          <div
            v-if="successMessage"
            class="text-[#7A9A82] text-sm text-center font-medium bg-[#EDF1EE] p-2 rounded-lg"
          >
            {{ successMessage }}
          </div>

          <!-- Login buttons -->
          <div class="flex items-center justify-between pt-4">
            <!-- Cancel button -->
            <UButton
              label="Cancel"
              variant="ghost"
              class="rounded-full bg-gray-200 ring-1 ring-[#E5A93B] text-[#E5A93B] hover:bg-[#E5A93B] hover:text-white h-11 px-8 font-bold tracking-wide transition-colors"
              @click="clearForm"
            />

            <!-- Login button -->
            <UButton
              type="submit"
              label="Log in"
              variant="solid"
              class="rounded-full bg-[#7A9A82] hover:bg-[#68856F] text-white shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),0_2px_4px_rgba(122,154,130,0.3)] h-11 px-8 font-bold tracking-wide transition-all"
            />
          </div>
        </UForm>
      </UCard>
    </main>

    <!-- FOOTER -->
    <footer
      class="py-5 px-6 flex items-center justify-between text-xs text-[#2F3E32] bg-[#EDF1EE]/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10"
    >
      <!-- Copyright -->
      <div class="font-medium opacity-80">Copyright - Roamly Co. 2026</div>

      <!-- Links -->
      <div class="flex gap-4 font-semibold tracking-wide">
        <NuxtLink
          to="/"
          class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors"
        >
          Home
        </NuxtLink>
        <span class="opacity-30">|</span>
        <NuxtLink
          to="/about"
          class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors"
        >
          About
        </NuxtLink>
        <span class="opacity-30">|</span>
        <NuxtLink
          to="/support"
          class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors"
        >
          Support
        </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
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