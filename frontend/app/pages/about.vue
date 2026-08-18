<!-- frontend/app/pages/about.vue -->
<template>
  <main class="flex-1 flex flex-col items-center px-6 py-12 gap-16 relative z-10 w-full">
    <!-- Top Section: Hero -->
    <section class="flex flex-col items-center text-center mt-10 max-w-3xl">
      <h1 class="text-4xl font-bold text-light-bg tracking-wide">{{ CONST_ABOUT_HERO }}</h1>

      <p class="mt-10 text-lg text-light-bg font-medium opacity-90 leading-relaxed">
        {{ CONST_ABOUT_DESCRIPTION }}
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import { CONST_ABOUT_HERO, CONST_ABOUT_DESCRIPTION } from '../utils/constants';

definePageMeta({
  layout: 'default',
});
</script>
