<!-- frontend/app/components/ProfileHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <div class="flex-1 flex items-center gap-4">
      <UButton icon="i-heroicons-arrow-left" variant="glassIconButton" class="shrink-0" to="/" />
    </div>

    <div class="flex-1 flex justify-center">
      <NuxtLink to="/" :class="appConfig.layout.logoWrapper">
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
        <span :class="appConfig.typography.logoText">{{ CONST_BRAND_NAME }}</span>
      </NuxtLink>
    </div>

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
          </template>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useCurrentUserQuery } from '../queries/user.query';
import { useAppConfig } from '#imports';
import type { DropdownMenuItem } from '@nuxt/ui';

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile } = useCurrentUserQuery();

const handleLogout = () => {
  logout();
  router.push('/login');
};

const profileDropdownItems = ref<DropdownMenuItem[]>([
  {
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/users/profile',
  },
  {
    label: 'Groups',
    icon: 'i-heroicons-user-group',
    to: '/groups',
  },
  {
    label: 'Events',
    icon: 'i-heroicons-calendar-days',
    to: '/events',
  },
]);
</script>
