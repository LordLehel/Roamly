<!-- frontend/app/components/views/mobile/users/ProfileMobile.vue -->
<template>
  <div class="mobile-wrapper p-4 text-center">
    <h1 class="text-xl font-bold text-dark-text">Here will be the mobile view</h1>
    <p v-if="currentUser" class="mt-4 text-brand-500 font-medium">
      Loaded profile for: {{ currentUser.username }}
    </p>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
// import { useAppConfig } from '#imports';
import type { useProfileStore } from '~/stores/profile.modals.store';
import type { UserOutDto } from '~/types/user.type';
import type { ApiError } from '~/types/apiError.type';

/* --- INTERFACES --- */
interface DummyDocument {
  id: number;
  title: string;
  uploadedAt: string;
  type: string;
  fileType: string;
  fileSize: string;
  issued: string;
  ends: string;
}

/* --- COMPOSABLES --- */
// const appConfig = useAppConfig();

/* --- PROPS --- */
defineProps<{
  currentUser: UserOutDto | null | undefined;
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  dummyDocuments: DummyDocument[];
  profileStore: ReturnType<typeof useProfileStore>;
}>();
</script>
