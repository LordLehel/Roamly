<template>
  <div :class="appConfig.layout.loadingOverlay">
    <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 text-brand-500 animate-spin" />
    <h2 class="text-2xl font-bold text-dark-text tracking-widest animate-pulse">
      {{ CONST_BRAND_NAME }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
</script>
