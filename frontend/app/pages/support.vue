<!-- frontend/app/pages/support.vue -->
<template>
  <!-- MAIN CONTENT -->
  <main class="flex-1 flex flex-col items-center px-6 py-12 gap-16 relative z-10 w-full">
    <!-- Top Section: Hero -->
    <section class="flex flex-col items-center text-center mt-10 max-w-3xl">
      <h1 class="text-4xl font-bold text-light-bg tracking-wide">{{ CONST_SUPPORT_HERO }}</h1>

      <p class="mt-10 text-lg text-light-bg font-medium opacity-90 leading-relaxed">
        {{ CONST_SUPPORT_DESCRIPTION }}
      </p>

      <div class="flex justify-center my-8 mt-16 transition-transform hover:-translate-y-1">
        <img
          :src="CONST_SUPPORT_PICTURE_PATH"
          alt="JSON Statham"
          class="w-full max-w-lg rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] object-cover ring-1 ring-light-bg/50"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import { CONST_SUPPORT_HERO, CONST_SUPPORT_DESCRIPTION, CONST_SUPPORT_PICTURE_PATH } from '../utils/constants';

definePageMeta({
  layout: 'default',
});
</script>