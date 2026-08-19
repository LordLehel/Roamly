<!-- frontend/app/components/AppHeader.vue -->
<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-surface-500/70 backdrop-blur-md shadow-sm z-50 border-b border-dark-text/10 sticky top-0"
  >
    <div class="flex-1">
      <NuxtLink
        to="/#home"
        class="flex items-center gap-2 text-dark-text hover:opacity-80 transition-opacity w-max"
      >
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
        <span class="text-xl font-semibold tracking-wider">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

    <nav class="hidden md:flex gap-8 font-bold tracking-wide">
      <NuxtLink
        to="/#home"
        class="hover:text-brand-500 hover:underline underline-offset-4 transition-colors"
        >{{ CONST_HOME_TITLE }}</NuxtLink
      >
      <NuxtLink
        to="/#about"
        class="hover:text-brand-500 hover:underline underline-offset-4 transition-colors"
        >{{ CONST_ABOUT_TITLE }}</NuxtLink
      >
      <NuxtLink
        to="/#support"
        class="hover:text-brand-500 hover:underline underline-offset-4 transition-colors"
        >{{ CONST_SUPPORT_TITLE }}</NuxtLink
      >
    </nav>

    <div class="flex-1 flex justify-end items-center gap-4">
      <ClientOnly>
        <div class="flex items-center gap-4">
          <template v-if="isAuthenticated">
            <span class="font-bold text-dark-text tracking-wide text-sm hidden sm:block">
              {{ userProfile?.username || 'Loading...' }}
            </span>
            <UButton
              icon="i-heroicons-arrow-left-on-rectangle"
              :label="CONST_LOGOUT_TITLE"
              variant="smallHollowActionButton"
              @click="handleLogout"
            />
            <NuxtLink to="/users/profile">
              <UAvatar :alt="userProfile?.username || 'User'" icon="i-heroicons-user" />
            </NuxtLink>
          </template>

          <template v-else>
            <UButton :label="CONST_LOGIN_TITLE" to="/login" variant="smallHollowActionButton" />
            <NuxtLink to="/login">
              <UAvatar icon="i-heroicons-user" />
            </NuxtLink>
          </template>
        </div>

        <template #fallback>
          <div class="flex items-center gap-3">
            <UButton
              :label="CONST_LOGIN_TITLE"
              to="/login"
              variant="smallHollowActionButton"
              class="opacity-50"
            />
            <UAvatar icon="i-heroicons-user" class="opacity-50" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useCurrentUserQuery } from '../queries/user.query';
import {
  CONST_BRAND_NAME,
  CONST_HOME_TITLE,
  CONST_ABOUT_TITLE,
  CONST_SUPPORT_TITLE,
  CONST_LOGIN_TITLE,
  CONST_LOGOUT_TITLE,
} from '../utils/constants';

const { isAuthenticated, logout } = useAuth();
const { data: userProfile, error } = useCurrentUserQuery();

watch(error, (newError) => {
  if (newError) {
    handleLogout();
  }
});

const handleLogout = () => {
  logout();
};
</script>
