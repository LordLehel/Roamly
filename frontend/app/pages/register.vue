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
            <template #default="{ error: fieldError }">
              <!-- Dinamic variant -->
              <UInput
                v-model="form.email"
                type="email"
                placeholder="ex. sir_real_99@roamly.com"
                :variant="fieldError ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="username" label="Username">
            <template #default="{ error: fieldError }">
              <UInput
                v-model="form.username"
                type="text"
                placeholder="ex. sir_real_99"
                :variant="fieldError ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <UFormField name="phone" label="Phone number">
            <template #default="{ error: fieldError }">
              <UInput
                v-model="form.phone"
                type="tel"
                placeholder="ex. +40 712 345 678"
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

          <UFormField name="repeatPassword" label="Repeat password">
            <template #default="{ error: fieldError }">
              <UInput
                v-model="form.repeatPassword"
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
            Registration successful! Redirecting to login page...
          </div>

          <div class="flex items-center justify-between pt-6">
            <UButton label="Cancel" variant="glass" :disabled="isLoading" @click="clearForm" />
            <!-- Loading state -->
            <UButton type="submit" label="Register" variant="glass" :loading="isLoading" />
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
import { registerSchema, type RegisterFormState } from '../utils/register.schema';
import { useCreateUserMutation } from '../queries/user.mutation';
import { getErrorMessage } from '../utils/error.utils';

const router = useRouter();

const form = reactive<RegisterFormState>({
  email: '',
  username: '',
  phone: '',
  password: '',
  repeatPassword: '',
});

const {
  mutate: registerUser,
  isLoading,
  error,
  status,
} = useCreateUserMutation(() => {
  setTimeout(() => router.push('/login'), 2000);
});

const clearForm = () => {
  Object.assign(form, { email: '', username: '', phone: '', password: '', repeatPassword: '' });
};

const handleRegister = (event: FormSubmitEvent<RegisterFormState>) => {
  registerUser({
    email: event.data.email,
    username: event.data.username,
    phone: event.data.phone,
    password: event.data.password,
  });
};
</script>
