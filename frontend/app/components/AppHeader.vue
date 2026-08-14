<template>
  <header
    class="flex items-center justify-between px-6 py-4 border-b border-green-900/50 bg-black/30 backdrop-blur-md"
  >
    <div class="flex-1">
      <slot name="left">
        <UButton label="Go Back" variant="glassOutline" @click="$router.back()" />
      </slot>
    </div>

    <NuxtLink
      to="/"
      class="flex items-center gap-2 border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
    >
      <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-green-400" />
      <span class="text-lg font-semibold tracking-wider text-green-50">ROAMLY</span>
    </NuxtLink>

    <div class="flex-1 flex justify-end items-center gap-4">
      <slot name="right">
        <!-- Log out / Log in -->
        <template v-if="isLoggedIn">
          <UButton label="Log out" variant="glassOutline" @click="handleLogout" />
        </template>
        <template v-else>
          <UButton label="Log in" variant="glassOutline" to="/login" />
        </template>
        <UAvatar icon="i-heroicons-user" size="sm" />
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = ref(false);

// Check if user is logged in
onMounted(() => {
  const token = localStorage.getItem('auth_token');
  isLoggedIn.value = !!token;
});

const handleLogout = () => {
  localStorage.removeItem('auth_token');
  isLoggedIn.value = false;
  router.push('/login');
};
</script>
