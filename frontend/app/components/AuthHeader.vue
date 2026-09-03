<!-- frontend/app/components/AuthHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerRelative]">
    <!-- LOGO SECTION -->
    <div class="flex-1">
      <NuxtLink to="/" :class="appConfig.layout.logoWrapper">
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
        <span :class="appConfig.typography.logoText">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

    <!-- ACTIONS SECTION -->
    <div :class="appConfig.layout.headerRight">
      <NuxtLink :to="isAuthenticated ? '/users/profile' : '/login'">
        <UAvatar icon="i-heroicons-user" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAuth } from '../composables/useAuth';
import { useAppConfig } from '#imports';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const { isAuthenticated } = useAuth();
</script>
