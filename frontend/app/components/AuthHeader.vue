<template>
  <header
    class="flex items-center justify-between px-6 py-4 border-b border-green-900/50 bg-black/30 backdrop-blur-md"
  >
    <div class="flex-1">
      <UButton label="Go Back" variant="glassOutline" @click="$router.back()" />
    </div>

    <NuxtLink
      to="/"
      class="flex items-center gap-2 border border-green-500/50 px-4 py-2 rounded-md bg-green-950/50 backdrop-blur-bg hover:bg-green-800 text-green-50 transition-colors"
    >
      <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-green-400" />
      <span class="text-lg font-semibold tracking-wider text-green-50">ROAMLY</span>
    </NuxtLink>

    <div class="flex-1 flex justify-end items-center gap-4">
      <!-- Dinamikus gomb az útvonal alapján -->
      <UButton v-if="isLoginPage" label="Register" variant="glassOutline" to="/register" />
      <UButton v-else-if="isRegisterPage" label="Log in" variant="glassOutline" to="/login" />

      <UAvatar icon="i-heroicons-user" size="sm" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoginPage = computed(() => route.path === '/login/' || route.path === '/login');
const isRegisterPage = computed(() => route.path === '/register/' || route.path === '/register');
</script>
