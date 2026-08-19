<!-- frontend/app/pages/index.vue -->
<template>
  <div class="flex-1 flex flex-col items-center px-6 py-12 gap-24 relative z-10 w-full">
    <!-- HOME section -->
    <section id="home" class="flex flex-col items-center text-center mt-10 max-w-3xl scroll-mt-24">
      <UButton :label="CONST_GET_STARTED" to="/groups" variant="actionHeroButton" />
      <p class="mt-10 text-lg text-brand-50 font-medium opacity-90 leading-relaxed">
        {{ CONST_HOME_DESCRIPTION }}
      </p>
    </section>

    <!-- Cards Section -->
    <section class="flex flex-col md:flex-row flex-wrap gap-8 w-full max-w-6xl mt-12">
      <UCard
        v-for="card in featureCards"
        :key="card.id"
        :variant="activeCard === card.id ? 'outlineGlass' : 'interactiveGlass'"
        class="overflow-hidden"
        :class="[
          activeCard === card.id
            ? 'w-full order-1'
            : activeCard
              ? 'w-full md:flex-1 md:w-auto order-2'
              : 'w-full md:flex-1 order-0',
        ]"
      >
        <div
          :class="
            activeCard === card.id
              ? 'flex flex-col md:flex-row items-center w-full gap-8 h-full'
              : 'flex flex-col items-center flex-1 text-center w-full h-full'
          "
        >
          <!-- Left side-->
          <div
            :class="
              activeCard === card.id
                ? 'flex flex-col items-start justify-center md:w-1/3 text-left'
                : 'flex flex-col items-center w-full justify-between h-full'
            "
          >
            <div class="flex flex-col items-center">
              <!-- Title -->
              <h3
                class="text-lg font-bold mb-4 tracking-wide transition-colors duration-500"
                :class="activeCard === card.id ? 'text-white' : 'text-dark-text'"
              >
                {{ card.title }}
              </h3>

              <!-- Icon -->
              <UIcon
                :name="card.icon"
                class="w-14 h-14 mb-4 opacity-80 transition-colors duration-500"
                :class="activeCard === card.id ? 'text-white' : 'text-brand-500'"
              />

              <!-- Description -->
              <p
                class="text-sm mb-6 leading-relaxed transition-colors duration-500"
                :class="activeCard === card.id ? 'text-white/90' : 'text-dark-text/80 text-center'"
              >
                {{ card.desc }}
              </p>
            </div>

            <UButton
              variant="ghost"
              class="font-bold tracking-wide hover:underline underline-offset-4 transition-colors duration-500"
              :class="activeCard === card.id ? 'text-white hover:text-white/80' : 'text-brand-500'"
              @click="toggleCard(card.id)"
            >
              {{ activeCard === card.id ? CONST_SHOW_LESS : CONST_LEARN_MORE }}
            </UButton>
          </div>

          <!-- Right side -->
          <div
            v-if="activeCard === card.id"
            class="flex-1 p-4 md:border-l border-white/20 text-white/90 leading-relaxed flex items-center text-left"
          >
            {{ card.extendedDesc }}
          </div>
        </div>
      </UCard>
    </section>

    <!-- ABOUT section -->
    <section
      id="about"
      class="flex flex-col items-center text-center max-w-3xl pt-12 border-t border-dark-text/10 scroll-mt-24"
    >
      <h2 class="text-3xl font-bold text-surface-500 tracking-wide">{{ CONST_ABOUT_HERO }}</h2>
      <p class="mt-8 text-lg text-surface-500 font-medium opacity-90 leading-relaxed">
        {{ CONST_ABOUT_DESCRIPTION }}
      </p>
    </section>

    <!-- SUPPORT section -->
    <section
      id="support"
      class="flex flex-col items-center text-center max-w-3xl pt-12 border-t border-dark-text/10 scroll-mt-24"
    >
      <h2 class="text-3xl font-bold text-surface-500 tracking-wide">{{ CONST_SUPPORT_HERO }}</h2>
      <p class="mt-8 text-lg text-surface-500 font-medium opacity-90 leading-relaxed">
        {{ CONST_SUPPORT_DESCRIPTION }}
      </p>
      <div class="flex justify-center my-8 transition-transform hover:-translate-y-1">
        <img
          :src="CONST_SUPPORT_PICTURE_PATH"
          alt="Support Mascot"
          class="w-full max-w-lg rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] object-cover ring-1 ring-dark-text/20"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { definePageMeta } from '#imports';
import {
  CONST_GET_STARTED,
  CONST_HOME_DESCRIPTION,
  CONST_DOCUMENT_MANAGEMENT,
  CONST_DOCUMENT_MANAGEMENT_DESCRIPTION,
  CONST_DOCUMENT_MANAGEMENT_EXTENDED,
  CONST_EVENT_CALENDAR,
  CONST_EVENT_CALENDAR_DESCRIPTION,
  CONST_EVENT_CALENDAR_EXTENDED,
  CONST_GROUP_GALLERY,
  CONST_GROUP_GALLERY_DESCRIPTION,
  CONST_GROUP_GALLERY_EXTENDED,
  CONST_LEARN_MORE,
  CONST_SHOW_LESS,
  CONST_ABOUT_HERO,
  CONST_ABOUT_DESCRIPTION,
  CONST_SUPPORT_HERO,
  CONST_SUPPORT_DESCRIPTION,
  CONST_SUPPORT_PICTURE_PATH,
} from '../utils/constants';

definePageMeta({ layout: 'default' });

const activeCard = ref<string | null>(null);

const toggleCard = (id: string) => {
  activeCard.value = activeCard.value === id ? null : id;
};

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
