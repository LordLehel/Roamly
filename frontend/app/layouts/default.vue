<!-- frontend/app/layouts/default.vue -->
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
import { computed } from 'vue';
import { useRoute, useAppConfig } from '#imports';

const route = useRoute();
const appConfig = useAppConfig();

const pageName = computed(() => {
  const name = route.name ? String(route.name).split('-')[0] : 'home';
  return name ?? 'home';
});

const bgClass = computed(() => {
  switch (pageName.value) {
    default:
      return CONST_BG_HOME;
  }
});
</script>
