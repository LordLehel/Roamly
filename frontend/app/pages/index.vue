<!-- frontend/app/pages/index.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ CONST_LOADING_TEXT ?? 'Loading...' }}</span>
        </div>
      </template>

      <HomeMobile
        v-if="isMobile"
        :feature-cards="featureCards"
        :contact-links="contactLinks"
        :active-card="activeCard"
        @toggle-card="toggleCard"
      />
      <HomeDesktop
        v-else
        :feature-cards="featureCards"
        :contact-links="contactLinks"
        :active-card="activeCard"
        @toggle-card="toggleCard"
      />
    </ClientOnly>
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

const contactLinks = [
  { name: 'Discord', icon: 'i-mdi-discord', url: 'https://discord.com', target: '_blank' },
  { name: 'Instagram', icon: 'i-mdi-instagram', url: 'https://instagram.com', target: '_blank' },
  { name: 'Facebook', icon: 'i-mdi-facebook', url: 'https://facebook.com', target: '_blank' },
  { name: 'Email', icon: 'i-mdi-envelope', url: 'mailto:support@roamly.com', target: '_self' },
  { name: 'Phone', icon: 'i-mdi-phone', url: 'tel:+1234567890', target: '_self' },
];
</script>
