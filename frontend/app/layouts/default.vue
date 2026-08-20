<template>
  <div :class="[appConfig.layout.base, bgClass]">
    <AppHeader />

    <main :class="appConfig.layout.mainDefault">
      <slot />
    </main>

    <footer :class="appConfig.footer.base">
      <div :class="appConfig.footer.text">{{ CONST_COPYRIGHT_LABEL }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter, useAppConfig } from '#imports';
import { useAuth } from '~/composables/useAuth';
import { CONST_COPYRIGHT_LABEL, CONST_BG_HOME } from '../utils/constants';

const route = useRoute();
const router = useRouter();
const appConfig = useAppConfig();
const { isAuthenticated } = useAuth();

const publicPages = ['index', 'home'];

// get page name
const pageName = computed(() => {
  const name = route.name ? String(route.name).split('-')[0] : 'home';
  return name ?? 'home';
});

// redirect logic
watch(
  isAuthenticated,
  (isAuth) => {
    if (!isAuth && !publicPages.includes(pageName.value)) {
      router.push('/login');
    }
  },
  { immediate: true },
);

// background logic
const bgClass = computed(() => {
  switch (pageName.value) {
    default:
      return CONST_BG_HOME;
  }
});
</script>
