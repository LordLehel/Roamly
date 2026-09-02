<template>
  <UApp>
    <Transition name="fade">
      <LoadingScreen v-if="isAppLoading" />
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#imports';
import LoadingScreen from '~/components/LoadingScreen.vue';

const isAppLoading = ref(true);
const nuxtApp = useNuxtApp();

nuxtApp.hook('page:start', () => {
  isAppLoading.value = true;
});

nuxtApp.hook('page:finish', () => {
  isAppLoading.value = false;
});

onMounted(() => {
  isAppLoading.value = false;
});
</script>
