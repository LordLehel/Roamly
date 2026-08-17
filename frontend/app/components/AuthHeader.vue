<!-- frontend/app/components/AuthHeader.vue -->
<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-[#EDF1EE]/70 backdrop-blur-md shadow-sm relative z-10 border-b border-[#2F3E32]/10"
  >
    <div class="flex-1">
      <UButton
        label="Go Back"
        variant="green_whole"
        @click="$router.back()"
      />
    </div>

    <NuxtLink
      to="/"
      class="flex items-center gap-2 text-[#2F3E32] hover:opacity-80 transition-opacity"
    >
      <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-[#7A9A82]" />
      <span class="text-xl font-semibold tracking-wider">ROAMLY</span>
    </NuxtLink>

    <div class="flex-1 flex justify-end items-center gap-4">
      <UButton
        v-if="isLoginPage"
        label="Register"
        to="/register"
        variant="yellow_whole"
      />
      <UButton
        v-else-if="isRegisterPage"
        label="Log in"
        to="/login"
        variant="yellow_whole"
      />

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