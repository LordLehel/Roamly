<!-- frontend/app/pages/dashboard.vue -->
<template>
  <main class="flex-1 w-full">
    <UContainer class="py-8">
      <h1 class="text-3xl font-bold mb-4 text-[#2F3E32]">Dashboard</h1>
      <p class="text-lg text-gray-500 mb-8">Closed data will be managed here.</p>
    </UContainer>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'default'
});
</script>