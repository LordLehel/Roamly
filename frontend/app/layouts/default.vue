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
import { 
  CONST_COPYRIGHT_LABEL, 
  CONST_BG_HOME, 
  CONST_BG_ABOUT, 
  CONST_BG_SUPPORT 
} from '../utils/constants';

const route = useRoute();
const appConfig = useAppConfig();

// Get the background class based on the current route
const bgClass = computed(() => {
  const pageName = route.name ? String(route.name).split('-')[0] : 'home';

  switch (pageName) {
    case 'about':
      return CONST_BG_ABOUT;
    case 'support':
      return CONST_BG_SUPPORT;
    case 'index':
    case 'home':
    default:
      return CONST_BG_HOME;
  }
});
</script>