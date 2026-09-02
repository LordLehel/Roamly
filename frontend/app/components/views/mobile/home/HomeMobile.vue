<!-- frontend/app/components/views/mobile/home/HomeMobile.vue -->
<template>
  <div class="mobile-wrapper p-4 text-center">
    <h1 class="text-xl font-bold text-dark-text">Here will be the mobile view for Home</h1>
    <p class="mt-4 text-brand-500 font-medium">Loaded {{ featureCards.length }} feature cards.</p>
  </div>
</template>

<script setup lang="ts">
/* --- INTERFACES --- */
interface FeatureCard {
  id: string;
  title: string;
  icon: string;
  desc: string;
  extendedDesc: string;
}

/* --- PROPS & EMITS --- */
defineProps<{
  featureCards: FeatureCard[];
  activeCard: string | null;
}>();

/*
const emit = defineEmits<{
  (e: 'toggleCard', id: string): void;
}>();
*/
</script>
