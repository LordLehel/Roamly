<!-- frontend/app/layouts/profile.vue -->
<template>
  <div :class="[appConfig.layout.base, bgClass]">
    <ProfileHeader />

    <main :class="appConfig.layout.mainDefault">
      <slot />
    </main>

    <footer :class="appConfig.footer.base">
      <div :class="appConfig.footer.text">{{ CONST_COPYRIGHT_LABEL }}</div>
    </footer>

    <GroupModals />
    <GroupInvitesModals />
    <GroupMembersModals />
    <ProfileModals />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useAppConfig } from '#imports';
import GroupModals from '~/components/modals/GroupModals.vue';
import GroupInvitesModals from '~/components/modals/GroupInvitesModals.vue';
import GroupMembersModals from '~/components/modals/GroupMembersModals.vue';
import ProfileModals from '~/components/modals/ProfileModals.vue';

const route = useRoute();
const appConfig = useAppConfig();

// The name of the current page
const pageName = computed(() => {
  const name = route.name ? String(route.name).split('-')[0] : 'home';
  return name ?? 'home';
});

// Background class
const bgClass = computed(() => {
  switch (pageName.value) {
    case 'groups':
      return CONST_BG_GROUPS;
    case 'profile':
      return CONST_BG_PROFILE;
    default:
      return CONST_BG_GROUPS;
  }
});
</script>
