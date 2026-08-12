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
        <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-green-400-" />
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

        <!-- Form Body -->
        <form class="w-full flex flex-col gap-4" novalidate @submit.prevent="handleRegister">
          <UFormField name="email">
            <p class="text-sm text-green-400">Email</p>
            <UInput
              v-model="form.email"
              type="email"
              color="neutral"
              variant="outline"
              placeholder="sir_real_99@roamly.com"
              class="w-full"
              :ui="{
                base: errors.email
                  ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                  : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
              }"
            />
          </UFormField>

          <UFormField name="username">
            <p class="text-sm text-green-400">Username</p>
            <UInput
              v-model="form.username"
              type="text"
              color="neutral"
              variant="outline"
              placeholder="ex. sir_real_99"
              class="w-full"
              :ui="{
                base: errors.username
                  ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                  : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
              }"
            />
          </UFormField>

          <UFormField name="password">
            <p class="text-sm text-green-400">Password</p>
            <UInput
              v-model="form.password"
              type="password"
              color="neutral"
              variant="outline"
              placeholder="********"
              class="w-full"
              :ui="{
                base: errors.password
                  ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                  : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
              }"
            />
          </UFormField>

          <UFormField name="repeatPassword">
            <p class="text-sm text-green-400">Repeat password</p>
            <UInput
              v-model="form.repeatPassword"
              type="password"
              color="neutral"
              variant="outline"
              placeholder="********"
              class="w-full"
              :ui="{
                base: errors.repeatPassword
                  ? 'bg-red-950/50 text-red-50 ring-1 ring-red-500 !placeholder-red-400 focus:ring-1 focus:ring-red-500 transition-colors'
                  : 'bg-green-950/50 text-green-50 ring-1 ring-green-500/50 !placeholder-green-400 focus:ring-1 focus:ring-green-500 transition-colors',
              }"
            />
          </UFormField>

          <!-- Error message -->
          <div v-if="generalErrorMessage" class="text-red-400 text-sm text-center font-medium">
            {{ generalErrorMessage }}
          </div>

          <!-- register buttons -->
          <div class="flex items-center justify-between pt-6">
            <!-- cancel button -->
            <UButton
              label="Cancel"
              variant="outline"
              color="neutral"
              class="h-10 px-6 text-md ring-1 ring-green-800 bg-green-950/50 hover:bg-green-800 hover:ring- hover:ring-green-500 text-green-50 transition-colors"
              @click="clearForm"
            />

            <!-- register button -->
            <UButton
              type="submit"
              label="Register"
              color="neutral"
              variant="solid"
              class="h-10 px-6 text-md ring-1 ring-green-800 bg-green-950/50 hover:bg-green-800 hover:ring- hover:ring-green-500 text-green-50 transition-colors"
            />
          </div>
        </form>
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
import { reactive, ref, watch } from 'vue';
import { useApi } from '~/composables/useApi';

const api = useApi();
const router = useRouter();

interface RegisterResponse {
  status: string;
  message: string;
}

interface ApiErrorResponse {
  data?: {
    message?: string;
  };
  message?: string;
}

// The forms default values
const form = reactive({
  email: '',
  username: '',
  password: '',
  repeatPassword: '',
});

// The forms errors
const errors = reactive({
  email: false,
  username: false,
  password: false,
  repeatPassword: false,
});

// The forms error message
const generalErrorMessage = ref('');
const successMessage = ref('');

//email validation
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// watchers
watch(
  () => form.email,
  () => {
    errors.email = false;
    generalErrorMessage.value = '';
  },
);

watch(
  () => form.username,
  () => {
    errors.username = false;
    generalErrorMessage.value = '';
  },
);

watch(
  () => form.password,
  () => {
    errors.password = false;
    generalErrorMessage.value = '';
  },
);

watch(
  () => form.repeatPassword,
  () => {
    errors.repeatPassword = false;
    generalErrorMessage.value = '';
  },
);

watch(
  () => form.repeatPassword,
  () => {
    errors.repeatPassword = false;
    generalErrorMessage.value = '';
  },
);

const clearForm = () => {
  form.email = '';
  form.username = '';
  form.password = '';
  form.repeatPassword = '';
  errors.email = false;
  errors.username = false;
  errors.password = false;
  errors.repeatPassword = false;
  generalErrorMessage.value = '';
};

// Registration form handler
const handleRegister = async () => {
  errors.email = false;
  errors.username = false;
  errors.password = false;
  errors.repeatPassword = false;
  generalErrorMessage.value = '';

  let hasError = false;
  const missingFields: string[] = [];

  if (!form.email.trim()) {
    errors.email = true;
    missingFields.push('Email');
  }
  if (!form.username.trim()) {
    errors.username = true;
    missingFields.push('Username');
  }
  if (!form.password.trim()) {
    errors.password = true;
    missingFields.push('Password');
  }
  if (!form.repeatPassword.trim()) {
    errors.repeatPassword = true;
    missingFields.push('Repeat password');
  }

  if (missingFields.length > 0) {
    generalErrorMessage.value = `Missing fields: ${missingFields.join(', ')}`;
    hasError = true;
  } else {
    if (!validateEmail(form.email)) {
      errors.email = true;
      generalErrorMessage.value = 'Helytelen e-mail cím formátum!';
      hasError = true;
    } else if (form.password !== form.repeatPassword) {
      errors.password = true;
      errors.repeatPassword = true;
      generalErrorMessage.value = 'A jelszavak nem egyeznek!';
      hasError = true;
    }
  }

  if (hasError) return;

  try {
    // API hívás a backend felé a pontos interfésszel
    const response = await api<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: {
        username: form.username,
        email: form.email,
        password: form.password,
      },
    });

    successMessage.value = response.message || 'Registration successful!';

    // Siker esetén átirányítás a login oldalra 2 másodperc múlva
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (err: unknown) {
    const errorObj = err as ApiErrorResponse;
    const backendMessage = errorObj?.data?.message || errorObj?.message || 'Registration failed!';
    generalErrorMessage.value = backendMessage;

    if (
      backendMessage.toLowerCase().includes('email') ||
      backendMessage.toLowerCase().includes('exist') ||
      backendMessage.toLowerCase().includes('taken')
    ) {
      errors.email = true;
    }
  }

  console.log('Sending request to register user with data:', form);
};
</script>
