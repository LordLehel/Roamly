<!-- frontend/app/pages/about.vue -->
<template>
  <main class="flex-1 flex flex-col items-center px-6 py-12 gap-16 relative z-10 w-full">
    <!-- Top Section: Hero -->
    <section class="flex flex-col items-center text-center mt-10 max-w-3xl">
      <h1 class="text-4xl font-bold text-green-50 tracking-wide">About Roamly</h1>

      <p class="mt-10 text-lg text-green-50 font-medium opacity-90 leading-relaxed">
        Our team is dedicated to providing the best experience for travelers. We are passionate
        about helping groups plan their trips efficiently and enjoyably. Our goal is to make travel
        planning a breeze, so you can focus on creating unforgettable memories.
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'default',
});
</script>
