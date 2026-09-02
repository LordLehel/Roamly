<!-- frontend/app/components/views/desktop/home/HomeDesktop.vue -->
<template>
  <div :class="appConfig.layout.homeWrapper">
    <section id="home" :class="appConfig.layout.homeHeroSection">
      <UButton
        :label="CONST_GET_STARTED ?? 'Get Started'"
        to="/groups"
        variant="actionHeroButton"
      />
      <p :class="appConfig.typography.homeHeroText">{{ CONST_HOME_DESCRIPTION }}</p>
    </section>

    <section :class="appConfig.layout.homeCardsSection">
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
          <div
            :class="
              activeCard === card.id
                ? 'flex flex-col items-start justify-center md:w-1/3 text-left'
                : 'flex flex-col items-center w-full justify-between h-full'
            "
          >
            <div class="flex flex-col items-center">
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
            </div>
            <UButton
              variant="ghost"
              class="font-bold tracking-wide hover:underline underline-offset-4 transition-colors duration-500 cursor-pointer"
              :class="activeCard === card.id ? 'text-white hover:text-white/80' : 'text-brand-500'"
              @click="emit('toggleCard', card.id)"
            >
              {{ activeCard === card.id ? CONST_SHOW_LESS : CONST_LEARN_MORE }}
            </UButton>
          </div>
          <div
            v-if="activeCard === card.id"
            class="flex-1 p-4 md:border-l border-white/20 text-white/90 leading-relaxed flex items-center text-left"
          >
            {{ card.extendedDesc }}
          </div>
        </div>
      </UCard>
    </section>

    <section id="about" :class="appConfig.layout.homeContentSection">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ CONST_ABOUT_HERO }}</h2>
      <p :class="appConfig.typography.homeSectionText">{{ CONST_ABOUT_DESCRIPTION }}</p>
    </section>

    <section id="support" :class="appConfig.layout.homeContentSection">
      <h2 :class="appConfig.typography.homeSectionTitle">{{ CONST_SUPPORT_HERO }}</h2>
      <p :class="appConfig.typography.homeSectionText">{{ CONST_SUPPORT_DESCRIPTION }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();

interface FeatureCard {
  id: string;
  title: string;
  icon: string;
  desc: string;
  extendedDesc: string;
}

defineProps<{
  featureCards: FeatureCard[];
  activeCard: string | null;
}>();

const emit = defineEmits<{
  (e: 'toggleCard', id: string): void;
}>();
</script>
