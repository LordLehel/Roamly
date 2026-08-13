<template>
  <!-- MAIN CONTAINER -->
  <div
    class="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2F3E32] font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style="background-image: url('/home/home-background.jpg')"
  >
    <!-- HEADER -->
    <header
      class="flex items-center justify-between px-6 py-4 bg-[#EDF1EE]/70 backdrop-blur-md shadow-sm relative z-10"
    >
      <!-- Left side: Logo -->
      <div class="flex-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-[#2F3E32] hover:opacity-80 transition-opacity w-max"
        >
          <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-[#7A9A82]" />
          <span class="text-xl font-semibold tracking-wider">ROAMLY</span>
        </NuxtLink>
      </div>

      <!-- Center: Navigation Bar -->
      <nav class="hidden md:flex gap-8 font-bold tracking-wide">
        <NuxtLink
          to="/"
          class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors"
        >
          About
        </NuxtLink>
        <NuxtLink
          to="/support"
          class="hover:text-[#7A9A82] text-[#7A9A82] underline underline-offset-4 transition-colors"
        >
          Support
        </NuxtLink>
      </nav>

      <!-- Right side: Profile / Auth -->
      <div class="flex-1 flex justify-end items-center gap-4">
        <ClientOnly>
          <!-- SIGNED IN -->
          <div v-if="isAuthenticated" class="flex items-center gap-4">
            <!-- Just the username -->
            <span class="font-bold text-[#2F3E32] tracking-wide text-sm hidden sm:block">
              {{ username || 'Loading...' }}
            </span>

            <!-- Logout -->
            <UButton
              icon="i-heroicons-arrow-left-on-rectangle"
              label="Log out"
              variant="outline"
              class="rounded-full text-[#7A9A82] ring-1 ring-[#7A9A82]/40 hover:bg-[#7A9A82]/10 px-4 py-1.5 transition-colors text-xs font-semibold"
              @click="handleLogout"
            />

            <!-- Profile Link -->
            <NuxtLink to="/profile">
              <UAvatar
                :alt="username"
                size="sm"
                class="bg-[#2F3E32] text-[#FAF9F6] ring-2 ring-[#2F3E32]/10 shadow-sm cursor-pointer hover:ring-[#7A9A82] transition-all"
              />
            </NuxtLink>
          </div>

          <!-- LOGGED OUT -->
          <template v-else>
            <UButton
              label="Log in"
              to="/login"
              variant="solid"
              class="rounded-full bg-[#E5A93B] hover:bg-[#D49933] text-white px-5 py-2 transition-colors shadow-sm font-bold tracking-wide"
            />
            <UTooltip text="You're not signed in" :popper="{ placement: 'bottom' }">
              <UAvatar
                icon="i-heroicons-user"
                size="sm"
                class="bg-[#2F3E32] text-[#FAF9F6] ring-2 ring-[#2F3E32]/10 shadow-sm cursor-pointer"
              />
            </UTooltip>
          </template>

          <!-- Fallback SSR  -->
          <template #fallback>
            <div class="flex items-center gap-3">
              <UButton
                label="Log in"
                to="/login"
                variant="solid"
                class="rounded-full bg-[#E5A93B] hover:bg-[#D49933] text-white px-5 py-2 transition-colors shadow-sm font-bold tracking-wide opacity-50"
              />
              <UAvatar
                icon="i-heroicons-user"
                size="sm"
                class="bg-[#2F3E32] opacity-50 ring-2 ring-[#2F3E32]/10 shadow-sm"
              />
            </div>
          </template>
        </ClientOnly>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-1 flex flex-col items-center px-6 py-12 gap-16 relative z-10">
      <!-- Top Section: Hero -->
      <section class="flex flex-col items-center text-center mt-10 max-w-3xl">
        <h1 class="text-4xl font-bold text-[#FAF9F6] tracking-wide">How can we help you?</h1>

        <p class="mt-10 text-lg text-[#FAF9F6] font-medium opacity-90 leading-relaxed">
          Need assistance with your travel documents, calendar syncing, or account settings? Our
          support team is here to ensure your Roamly experience is smooth and effortless.
        </p>

        <div class="flex justify-center my-8 mt-16">
          <img
            src="/support/json-statham.jpg"
            alt="JSON Statham"
            class="w-full max-w-lg rounded-[20px] shadow-[0_10px_30px_rgba(47,62,50,0.12)] object-cover"
          />
        </div>
      </section>
    </main>

    <!-- FOOTER -->
    <footer
      class="py-5 px-6 flex items-center text-xs text-[#2F3E32] bg-[#EDF1EE]/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10"
    >
      <div class="font-medium opacity-80">Copyright - Roamly Co. 2024</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '../composables/useApi';
import type { UserProfileResponse } from '../types/api.type';

const router = useRouter();
const api = useApi();

const isAuthenticated = ref(false);
const username = ref('');

onMounted(async () => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    isAuthenticated.value = true;

    try {
      const response = await api<UserProfileResponse>('/users/profile');

      username.value = response.username || response.data?.username || 'User';
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      handleLogout();
    }
  }
});

const handleLogout = () => {
  localStorage.removeItem('auth_token');
  isAuthenticated.value = false;
  username.value = '';
  router.push('/login');
};
</script>
