<!-- frontend/app/components/ProfileHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <!-- BACK BUTTON SECTION -->
    <div class="flex-1 flex items-center gap-4">
      <UButton icon="i-heroicons-arrow-left" variant="glassIconButton" class="shrink-0" to="/" />
    </div>

    <!-- LOGO SECTION -->
    <div class="flex-1 flex justify-center">
      <NuxtLink to="/" :class="appConfig.layout.logoWrapper">
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500 hidden sm:block" />
        <span :class="appConfig.typography.logoText">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

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

            <!-- Desktop menu -->
            <UDropdownMenu
              v-if="!isMobile"
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

            <!-- Mobile menu -->
            <UDropdownMenu
              :items="logOutItem"
              :content="{ align: 'start', side: 'left', alignOffset: -18 }"
              :ui="{
                content:
                  'w-30 bg-surface-500/90 backdrop-blur-md rounded-full ring-1 ring-brand-500/30 shadow-xl p-1',
                itemLeadingIcon: 'w-10 h-10 text-brand-500 shrink-0',
                item: 'text-md font-semibold',
              }"
            >
              <UButton
                variant="ghost"
                class="md:hidden p-0 m-0 rounded-full hover:bg-transparent focus-visible:ring-2 focus-visible:ring-brand-500 transition-transform hover:scale-105 cursor-pointer"
              >
                <UAvatar :alt="userProfile?.username || 'User'" icon="i-heroicons-user" />
              </UButton>
            </UDropdownMenu>

            <UDropdownMenu
              :items="profileDropdownItems"
              :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
              :ui="{
                content: 'w-36',
                itemLeadingIcon: 'w-10 h-10 text-brand-500 shrink-0',
                item: 'gap-2 text-md',
              }"
            >
              <UButton
                icon="i-heroicons-bars-3"
                variant="ghost"
                class="md:hidden p-1 text-dark-text"
              />
            </UDropdownMenu>
          </template>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useCurrentUserQuery } from '../queries/user.query';
import { useAppConfig } from '#imports';
import type { DropdownMenuItem } from '@nuxt/ui';

/* --- COMPOSABLES & STATE --- */
const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile } = useCurrentUserQuery();
const { isMobile } = useScreenSize();

/* --- MENU ITEMS --- */
const profileDropdownItems = ref<DropdownMenuItem[]>([
  { label: 'Profile', icon: 'i-heroicons-user-circle', to: '/users/profile' },
  { label: 'Groups', icon: 'i-heroicons-user-group', to: '/groups' },
  { label: 'Events', icon: 'i-heroicons-calendar-days', to: '/events' },
]);

const logOutItem = ref([
  {
    label: CONST_LOGOUT_TITLE,
    icon: 'i-heroicons-arrow-left-on-rectangle',
    onSelect: () => handleLogout(),
  },
]);

/* --- HANDLERS --- */
const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
