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
import { useAppConfig } from '#imports';
const appConfig = useAppConfig();
</script>
