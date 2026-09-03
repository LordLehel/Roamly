<!-- frontend/app/components/LoadingScreen.vue -->
<template>
  <div
    class="fixed inset-0 z-9999 bg-light-bg/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
  >
    <UIcon name="i-heroicons-arrow-path" class="w-16 h-16 text-brand-500 animate-spin" />
    <h2 class="text-2xl font-bold text-dark-text tracking-widest animate-pulse">
      {{ CONST_BRAND_NAME }}
    </h2>
  </div>
</template>
