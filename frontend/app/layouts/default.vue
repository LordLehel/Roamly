<!-- frontend/app/layouts/default.vue -->
<template>
  <div
    class="min-h-screen flex flex-col bg-light-bg text-dark-text font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    :style="{ backgroundImage: bgImageUrl }"
  >
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="py-5 px-6 flex items-center justify-between text-xs text-dark-text bg-light-bg/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10"
    >
      <div class="font-medium opacity-80">{{ CONST_COPYRIGHT_LABEL }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { CONST_COPYRIGHT_LABEL } from '../utils/constants';

const route = useRoute();

const bgImageUrl = computed(() => {
  let pageName = route.name ? String(route.name).split('-')[0] : 'home';

  if (pageName === 'index' || pageName === '') {
    pageName = 'home';
  }

  return `url('/${pageName}/${pageName}-background.jpg')`;
});
</script>