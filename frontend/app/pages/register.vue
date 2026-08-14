<template>
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
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormSubmitEvent } from '#ui/types';
import { registerSchema, type RegisterFormState } from '../utils/register.schema';
import { useCreateUserMutation } from '../queries/user.mutation';
import { getErrorMessage } from '../utils/error.utils';

definePageMeta({
  layout: 'auth',
});

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
