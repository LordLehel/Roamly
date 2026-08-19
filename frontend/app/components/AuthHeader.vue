<!-- frontend/app/components/AuthHeader.vue -->
<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-surface-500/70 backdrop-blur-md shadow-sm relative z-50 border-b border-dark-text/10"
  >
    <div class="flex-1">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-dark-text hover:opacity-80 transition-opacity w-max"
      >
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
        <span class="text-xl font-semibold tracking-wider">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

    <div class="flex-1 flex justify-end items-center gap-4">
      <NuxtLink :to="isAuthenticated ? '/users/profile' : '/login'">
        <UAvatar icon="i-heroicons-user" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import { CONST_BRAND_NAME } from '../utils/constants';

const { isAuthenticated } = useAuth();
</script>
