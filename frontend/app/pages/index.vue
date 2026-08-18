<!-- frontend/app/pages/index.vue -->
<template>
  <div class="flex-1 flex flex-col items-center px-6 py-12 gap-16 relative z-10 w-full">
    <section class="flex flex-col items-center text-center mt-10 max-w-3xl">
      <UButton
        :label="CONST_GET_STARTED"
        to="/groups"
        variant="actionHeroButton"
      />

      <p class="mt-10 text-lg text-brand-50 font-medium opacity-90 leading-relaxed">
        {{ CONST_HOME_DESCRIPTION }}
      </p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-24">
      <UCard variant="interactiveGlass">
        <div class="flex flex-col items-center flex-1">
          <h3 class="text-lg font-bold text-dark-text mb-4 tracking-wide">{{ CONST_DOCUMENT_MANAGEMENT }}</h3>
          <UIcon
            name="i-heroicons-document-text"
            class="w-14 h-14 text-brand-500 mb-4 opacity-80"
          />
          <p class="text-sm opacity-80 mb-6 leading-relaxed">
            {{ CONST_DOCUMENT_MANAGEMENT_DESCRIPTION }}
          </p>
        </div>
        <NuxtLink
          to="#"
          class="text-brand-500 font-bold tracking-wide hover:underline underline-offset-4 transition-all"
        >
          {{ CONST_LEARN_MORE }}
        </NuxtLink>
      </UCard>

      <UCard variant="interactiveGlass">
        <div class="flex flex-col items-center flex-1">
          <h3 class="text-lg font-bold text-dark-text mb-4 tracking-wide">{{ CONST_EVENT_CALENDAR }}</h3>
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-14 h-14 text-brand-500 mb-4 opacity-80"
          />
          <p class="text-sm opacity-80 mb-6 leading-relaxed">
            {{ CONST_EVENT_CALENDAR_DESCRIPTION }}
          </p>
        </div>
        <NuxtLink
          to="#"
          class="text-brand-500 font-bold tracking-wide hover:underline underline-offset-4 transition-all"
        >
          {{ CONST_LEARN_MORE }}
        </NuxtLink>
      </UCard>

      <UCard variant="interactiveGlass">
        <div class="flex flex-col items-center flex-1">
          <h3 class="text-lg font-bold text-dark-text mb-4 tracking-wide">{{ CONST_GROUP_GALLERY }}</h3>
          <UIcon name="i-heroicons-photo" class="w-14 h-14 text-brand-500 mb-4 opacity-80" />
          <p class="text-sm opacity-80 mb-6 leading-relaxed">
            {{ CONST_GROUP_GALLERY_DESCRIPTION }}
          </p>
        </div>
        <NuxtLink
          to="#"
          class="text-brand-500 font-bold tracking-wide hover:underline underline-offset-4 transition-all"
        >
          {{ CONST_LEARN_MORE }}
        </NuxtLink>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';
import {
  CONST_GET_STARTED,
  CONST_HOME_DESCRIPTION,
  CONST_DOCUMENT_MANAGEMENT,
  CONST_DOCUMENT_MANAGEMENT_DESCRIPTION,
  CONST_LEARN_MORE,
  CONST_EVENT_CALENDAR,
  CONST_EVENT_CALENDAR_DESCRIPTION,
  CONST_GROUP_GALLERY,
  CONST_GROUP_GALLERY_DESCRIPTION,
} from '../utils/constants';

definePageMeta({
  layout: 'default',
});
</script>