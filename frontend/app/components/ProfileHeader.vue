<!-- frontend/app/components/ProfileHeader.vue -->
<template>
  <header :class="[appConfig.layout.headerBase, appConfig.layout.headerSticky]">
    <div class="flex-1 flex items-center gap-4">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="glassIconButton"
        class="shrink-0"
        :to="selectedView"
      />
      <USelect
        v-model="selectedView"
        :items="CONST_NAV_VIEWS"
        label-key="label"
        value-key="value"
        @update:model-value="onViewChange"
      />
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
            <NuxtLink to="/users/profile">
              <UAvatar :alt="userProfile?.username || 'User'" icon="i-heroicons-user" />
            </NuxtLink>
          </template>
        </div>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useCurrentUserQuery } from '../queries/user.query';
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
const router = useRouter();
const route = useRoute();
const { isAuthenticated, logout } = useAuth();
const { data: userProfile } = useCurrentUserQuery();

const getCurrentViewValue = (path: string) => {
  const found = CONST_NAV_VIEWS.find((item) => item.value === path || path.includes(item.value));
  return found ? found.value : path;
};
const selectedView = ref(getCurrentViewValue(route.path));
watch(
  () => route.path,
  (newPath) => {
    selectedView.value = getCurrentViewValue(newPath);
  },
);
const onViewChange = (path: string | undefined) => {
  router.push(path ?? '/');
};
const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
