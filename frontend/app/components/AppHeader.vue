<!-- frontend/app/components/AppHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <!-- LOGO SECTION -->
    <div class="flex-1">
      <NuxtLink to="/#home" :class="appConfig.layout.logoWrapper">
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
        <span :class="appConfig.typography.logoText">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

    <!-- DESKTOP NAV SECTION -->
    <nav :class="appConfig.layout.navWrapper">
      <NuxtLink to="/#home" :class="appConfig.typography.navLink">{{ CONST_HOME_TITLE }}</NuxtLink>
      <NuxtLink to="/#about" :class="appConfig.typography.navLink">{{
        CONST_ABOUT_TITLE
      }}</NuxtLink>
      <NuxtLink to="/#support" :class="appConfig.typography.navLink">{{
        CONST_SUPPORT_TITLE
      }}</NuxtLink>
    </nav>

    <!-- USER ACTIONS SECTION -->
    <div :class="appConfig.layout.headerRight">
      <ClientOnly>
        <div class="flex items-center gap-2 md:gap-4">
          <template v-if="isAuthenticated">
            <span class="font-bold text-dark-text tracking-wide text-sm hidden sm:block">
              {{ userProfile?.username || 'Loading...' }}
            </span>
            <UButton
              icon="i-heroicons-arrow-left-on-rectangle"
              :label="CONST_LOGOUT_TITLE"
              variant="smallHollowActionButton"
              class="hidden sm:flex"
              @click="handleLogout"
            />
            <UDropdownMenu
              :items="profileDropdownItems"
              :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
            >
              <UButton
                variant="ghost"
                class="p-0 m-0 rounded-full hover:bg-transparent focus-visible:ring-2 focus-visible:ring-brand-500 transition-transform hover:scale-105 cursor-pointer"
              >
                <UAvatar :alt="userProfile?.username || 'User'" icon="i-heroicons-user" />
              </UButton>
            </UDropdownMenu>
            <!-- mobile menu button -->
            <UButton
              icon="i-heroicons-bars-3"
              variant="ghost"
              class="md:hidden p-1 text-dark-text"
            />
          </template>
          <template v-else>
            <UButton
              :label="CONST_LOGIN_TITLE"
              to="/login"
              variant="smallHollowActionButton"
              class="hidden sm:flex"
            />
            <NuxtLink to="/login"><UAvatar icon="i-heroicons-user" /></NuxtLink>
          </template>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useCurrentUserQuery } from '../queries/user.query';
import { useAppConfig } from '#imports';
import type { DropdownMenuItem } from '@nuxt/ui';

/* --- COMPOSABLES & STATE --- */
const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile, error } = useCurrentUserQuery();

/* --- MENU ITEMS --- */
const profileDropdownItems = ref<DropdownMenuItem[]>([
  { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/users/profile' },
  { label: 'Groups', icon: 'i-heroicons-user-group', to: '/groups' },
  { label: 'Events', icon: 'i-heroicons-calendar-days', to: '/events' },
]);

/* --- WATCHERS --- */
watch(error, (newError) => {
  if (newError) handleLogout();
});

/* --- HANDLERS --- */
const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
