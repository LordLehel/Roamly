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
      <div
        class="flex items-center gap-2 border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
      >
        <UIcon name="i-heroicons-map" class="w-6 h-6 text-green-400-" />
        <span class="text-lg font-semibold tracking-wider text-green-50">ROAMLY</span>
      </div>

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
          <h1 class="text-2xl font-medium tracking-wide text-green-400">Register account</h1>
        </div>

        <!-- Form Body -->
        <form class="w-full flex flex-col gap-4" @submit.prevent="handleRegister">
          <UFormGroup label="Email" name="email">
            <p class="text-sm text-green-400">Email</p>
            <UInput
              v-model="form.email"
              type="email"
              color="neutral"
              variant="outline"
              placeholder="sir_real_99@roamly.com"
              class="w-full bg-green-950 text-green-50 focus:ring-green-500"
            />
          </UFormGroup>

          <UFormGroup label="Username" name="username">
            <p class="text-sm text-green-400">Username</p>
            <UInput
              v-model="form.username"
              type="text"
              color="neutral"
              variant="outline"
              placeholder="ex. sir_real_99"
              class="w-full bg-green-950 text-green-50 focus:ring-green-500"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <p class="text-sm text-green-400">Password</p>
            <UInput
              v-model="form.password"
              type="password"
              color="neutral"
              variant="outline"
              placeholder="********"
              class="w-full bg-green-950 text-green-50 focus:ring-green-500"
            />
          </UFormGroup>

          <UFormGroup label="Repeat password" name="repeatPassword">
            <p class="text-sm text-green-400">Repeat password</p>
            <UInput
              v-model="form.repeatPassword"
              type="password"
              color="neutral"
              variant="outline"
              placeholder="********"
              class="w-full bg-green-950 text-green-50 focus:ring-green-500"
            />
          </UFormGroup>

          <!-- register buttons -->
          <div class="flex items-center justify-between pt-6">
            <UButton
              label="Cancel"
              variant="outline"
              color="neutral"
              to="/"
              class="h-10 px-6 text-md border-green-500/50 bg-green-900 hover:bg-green-800 text-green-50 transition-colors"
            />

            <!-- register button -->
            <UButton
              type="submit"
              label="Register"
              color="neutral"
              variant="solid"
              class="h-10 px-6 text-md ring-1 ring-green-800 bg-green-900 hover:bg-green-800 hover:ring-1 hover:ring-green-500 text-green-50 transition-colors"
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
import { reactive } from 'vue';

// The forms default values
const form = reactive({
  email: '',
  username: '',
  password: '',
  repeatPassword: '',
});

// Registration form handler
const handleRegister = () => {
  if (form.password !== form.repeatPassword) {
    alert('The passwords do not match!');
    return;
  }

  // Here will be the Pinia Colada mutation (useCreateUserMutation)
  console.log('Register form:', form);
};
</script>
