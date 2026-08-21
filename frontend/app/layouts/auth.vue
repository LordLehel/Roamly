<template>
  <div :class="[appConfig.layout.base, CONST_BG_AUTH]">
    <AuthHeader />

    <main :class="appConfig.layout.mainAuth">
      <slot />
    </main>

    <footer :class="appConfig.footer.base">
      <div :class="appConfig.footer.text">{{ CONST_COPYRIGHT_LABEL }}</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useAppConfig, useRouter } from '#imports';
import { useAuth } from '~/composables/useAuth';

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated } = useAuth();

// If the user is authenticated, redirect to the <home page> - will be changed later
watch(
  isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      router.push('/');
    }
  },
  { immediate: true },
);
</script>
