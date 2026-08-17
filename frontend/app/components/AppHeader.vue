<template>
  <header class="flex items-center justify-between px-6 py-4 bg-[#EDF1EE]/70 backdrop-blur-md shadow-sm relative z-10 border-b border-[#2F3E32]/10">
    <div class="flex-1">
      <NuxtLink to="/" class="flex items-center gap-2 text-[#2F3E32] hover:opacity-80 transition-opacity w-max">
        <UIcon name="i-heroicons-map-pin" class="w-7 h-7 text-[#7A9A82]" />
        <span class="text-xl font-semibold tracking-wider">ROAMLY</span>
      </NuxtLink>
    </div>

    <nav class="hidden md:flex gap-8 font-bold tracking-wide">
      <NuxtLink to="/" class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors">Home</NuxtLink>
      <NuxtLink to="/about" class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors">About</NuxtLink>
      <NuxtLink to="/support" class="hover:text-[#7A9A82] hover:underline underline-offset-4 transition-colors">Support</NuxtLink>
    </nav>

    <div class="flex-1 flex justify-end items-center gap-4">
      <ClientOnly>
        <div class="flex items-center gap-4">
          <template v-if="isLoggedIn">
            <span class="font-bold text-[#2F3E32] tracking-wide text-sm hidden sm:block">
              {{ userProfile?.username || 'Loading...' }}
            </span>
            <UButton icon="i-heroicons-arrow-left-on-rectangle" label="Log out" variant="custom_outline" @click="handleLogout" />
            <NuxtLink to="/">
              <UAvatar :alt="userProfile?.username || 'User'" icon="i-heroicons-user" size="sm" />
            </NuxtLink>
          </template>

          <template v-else>
            <UButton label="Log in" to="/login" variant="custom_outline" />
            <UAvatar icon="i-heroicons-user" size="sm" />
          </template>
        </div>

        <template #fallback>
          <div class="flex items-center gap-3">
            <UButton label="Log in" to="/login" variant="custom_outline" class="opacity-50" />
            <UAvatar icon="i-heroicons-user" size="sm" class="opacity-50" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { checkIsAuthenticated, logoutUser } from '../utils/auth.utils';
import { useCurrentUserQuery } from '../queries/user.query';

const router = useRouter();
const isLoggedIn = ref(false);

onMounted(() => {
  isLoggedIn.value = checkIsAuthenticated();
});

const { data: userProfile, error } = useCurrentUserQuery();

watch(error, (newError) => {
  if (newError) {
    handleLogout();
  }
});

const handleLogout = () => {
  logoutUser();
  isLoggedIn.value = false;
  router.push('/login');
};
</script>