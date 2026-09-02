<!-- frontend/app/components/views/mobile/home/HomeMobile.vue -->
<template>
  <div class="mobile-wrapper px-4 py-8 flex flex-col gap-16 overflow-x-hidden">
    <!-- HERO SECTION -->
    <section id="home" :class="appConfig.layout.homeHeroSection" class="mt-4">
      <UButton
        :label="CONST_GET_STARTED ?? 'Get Started'"
        to="/groups"
        variant="actionHeroButton"
        class="mb-8"
      />
      <p :class="appConfig.typography.homeHeroText">
        {{ CONST_HOME_DESCRIPTION }}
      </p>
    </section>

    <!-- FEATURE CARDS SECTION -->
    <section class="flex flex-col gap-8 w-full">
      <UCard
        v-for="card in featureCards"
        :key="card.id"
        :variant="activeCard === card.id ? 'outlineGlass' : 'interactiveGlass'"
        class="overflow-hidden transition-all duration-500 w-full"
      >
        <div class="flex flex-col items-center text-center w-full h-full p-2">
          <h3
            class="text-lg font-bold mb-4 tracking-wide transition-colors duration-500"
            :class="activeCard === card.id ? 'text-white' : 'text-dark-text'"
          >
            {{ card.title }}
          </h3>

          <UIcon
            :name="card.icon"
            class="w-14 h-14 mb-4 opacity-80 transition-colors duration-500"
            :class="activeCard === card.id ? 'text-white' : 'text-brand-500'"
          />

          <p
            class="text-sm mb-6 leading-relaxed transition-colors duration-500"
            :class="activeCard === card.id ? 'text-white/90' : 'text-dark-text/80 text-center'"
          >
            {{ card.desc }}
          </p>

          <UButton
            variant="ghost"
            class="font-bold tracking-wide hover:underline underline-offset-4 transition-colors duration-500 cursor-pointer"
            :class="activeCard === card.id ? 'text-white hover:text-white/80' : 'text-brand-500'"
            @click="emit('toggleCard', card.id)"
          >
            {{
              activeCard === card.id
                ? (CONST_SHOW_LESS ?? 'Show Less')
                : (CONST_LEARN_MORE ?? 'Learn More')
            }}
          </UButton>

          <div
            v-if="activeCard === card.id"
            class="w-full mt-6 pt-6 border-t border-white/20 text-white/90 leading-relaxed text-left animate-fade-in"
          >
            {{ card.extendedDesc }}
          </div>
        </div>
      </UCard>
    </section>

    <!-- ABOUT SECTION -->
    <section id="about" :class="appConfig.layout.homeContentSection">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ CONST_ABOUT_HERO }}</h2>
      <p :class="appConfig.typography.homeSectionText">{{ CONST_ABOUT_DESCRIPTION }}</p>
    </section>

    <!-- SUPPORT SECTION -->
    <section id="support" :class="appConfig.layout.homeContentSection" class="mb-12">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ CONST_SUPPORT_HERO }}</h2>
      <p :class="appConfig.typography.homeSectionText">{{ CONST_SUPPORT_DESCRIPTION }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAppConfig } from '#imports';

/* --- INTERFACES --- */
interface FeatureCard {
  id: string;
  title: string;
  icon: string;
  desc: string;
  extendedDesc: string;
}

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS & EMITS --- */
defineProps<{
  featureCards: FeatureCard[];
  activeCard: string | null;
}>();

const emit = defineEmits<{
  (e: 'toggleCard', id: string): void;
}>();
</script>
