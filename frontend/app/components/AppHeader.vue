<!-- frontend/app/components/AppHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <div class="flex-1">
      <NuxtLink to="/#home" :class="appConfig.layout.logoWrapper">
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
        <span :class="appConfig.typography.logoText">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

    <nav :class="appConfig.layout.navWrapper">
      <NuxtLink to="/#home" :class="appConfig.typography.navLink">{{ CONST_HOME_TITLE }}</NuxtLink>
      <NuxtLink to="/#about" :class="appConfig.typography.navLink">{{
        CONST_ABOUT_TITLE
      }}</NuxtLink>
      <NuxtLink to="/#support" :class="appConfig.typography.navLink">{{
        CONST_SUPPORT_TITLE
      }}</NuxtLink>
    </nav>

    <div :class="appConfig.layout.headerRight">
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
            <NuxtLink to="/login"><UAvatar icon="i-heroicons-user" /></NuxtLink>
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
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile, error } = useCurrentUserQuery();

watch(error, (newError) => {
  if (newError) handleLogout();
});

const handleLogout = () => logout();
</script>
