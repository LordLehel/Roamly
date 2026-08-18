<!-- frontend/app/components/AuthHeader.vue -->
<template>
  <header
    class="flex items-center justify-between px-6 py-4 bg-surface-500/70 backdrop-blur-md shadow-sm relative z-10 border-b border-dark-text/10"
  >
    <div class="flex-1">
      <UButton
        :label="CONST_GO_BACK_TITLE"
        variant="smallPrimaryActionButton"
        @click="$router.back()"
      />
    </div>

    <NuxtLink
      to="/"
      class="flex items-center gap-2 text-dark-text hover:opacity-80 transition-opacity"
    >
      <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-brand-500" />
      <span class="text-xl font-semibold tracking-wider">{{ CONST_BRAND_NAME }}</span>
    </NuxtLink>

    <div class="flex-1 flex justify-end items-center gap-4">
      <UButton
        v-if="isLoginPage"
        :label="CONST_REGISTER_TITLE"
        to="/register"
        variant="smallAccentActionButton"
      />
      <UButton
        v-else-if="isRegisterPage"
        :label="CONST_LOGIN_TITLE"
        :to="loginRedirectPath"
        variant="smallAccentActionButton"
      />

      <NuxtLink to="/login">
        <UAvatar icon="i-heroicons-user" />
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import {
  CONST_GO_BACK_TITLE,
  CONST_BRAND_NAME,
  CONST_REGISTER_TITLE,
  CONST_LOGIN_TITLE,
} from '../utils/constants';

const route = useRoute();
const { isAuthenticated } = useAuth();

const isLoginPage = computed(() => route.path === '/login/' || route.path === '/login');
const isRegisterPage = computed(() => route.path === '/register/' || route.path === '/register');

const loginRedirectPath = computed(() => (isAuthenticated.value ? '/users/profile' : '/login'));
</script>
