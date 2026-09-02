<!-- frontend/app/pages/index.vue -->
<template>
  <div>
    <HomeMobile
      v-if="isMobile"
      :feature-cards="featureCards"
      :active-card="activeCard"
      @toggle-card="toggleCard"
    />
    <HomeDesktop
      v-else
      :feature-cards="featureCards"
      :active-card="activeCard"
      @toggle-card="toggleCard"
    />
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import { useScreenSize } from '~/composables/useScreenSize';
import HomeDesktop from '~/components/views/desktop/home/HomeDesktop.vue';
import HomeMobile from '~/components/views/mobile/home/HomeMobile.vue';

/* --- PAGE CONFIGURATION --- */
definePageMeta({
  layout: 'default',
  middleware: ['guest'],
});

/* --- COMPOSABLES & STATE --- */
const { isMobile } = useScreenSize();
const activeCard = ref<string | null>(null);

/* --- EVENT HANDLERS --- */
const toggleCard = (id: string) => {
  activeCard.value = activeCard.value === id ? null : id;
};

/* --- MOCK DATA / CONSTANTS --- */
const featureCards = [
  {
    id: 'docs',
    title: CONST_DOCUMENT_MANAGEMENT,
    icon: 'i-heroicons-document-text',
    desc: CONST_DOCUMENT_MANAGEMENT_DESCRIPTION,
    extendedDesc: CONST_DOCUMENT_MANAGEMENT_EXTENDED,
  },
  {
    id: 'calendar',
    title: CONST_EVENT_CALENDAR,
    icon: 'i-heroicons-calendar-days',
    desc: CONST_EVENT_CALENDAR_DESCRIPTION,
    extendedDesc: CONST_EVENT_CALENDAR_EXTENDED,
  },
  {
    id: 'gallery',
    title: CONST_GROUP_GALLERY,
    icon: 'i-heroicons-photo',
    desc: CONST_GROUP_GALLERY_DESCRIPTION,
    extendedDesc: CONST_GROUP_GALLERY_EXTENDED,
  },
];
</script>
