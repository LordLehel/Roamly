<!-- frontend/app/pages/users/profile.vue -->
<template>
  <div>
    <ProfileMobile
      v-if="isMobile"
      :current-user="currentUser"
      :is-loading="isLoading"
      :error="error"
      :dummy-documents="dummyDocuments"
      :profile-store="profileStore"
    />

    <ProfileDesktop
      v-else
      :current-user="currentUser"
      :is-loading="isLoading"
      :error="error"
      :dummy-documents="dummyDocuments"
      :profile-store="profileStore"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useProfileStore } from '~/stores/profile.modals.store';

import ProfileDesktop from '~/components/views/desktop/users/ProfileDesktop.vue';
import ProfileMobile from '~/components/views/mobile/users/ProfileMobile.vue';

definePageMeta({ layout: 'general', middleware: ['auth'] });

useProtectedPage();
const { isMobile } = useScreenSize();

const profileStore = useProfileStore();
const { data: currentUser, isLoading, error } = useCurrentUserQuery();

const dummyDocuments = ref([
  {
    id: 1,
    title: 'Summer Vacation Passport',
    uploadedAt: '2026.08.21',
    type: 'Passport',
    fileType: 'PDF',
    fileSize: '4.23 MB',
    issued: '2023.05.10',
    ends: '2033.05.10',
  },
  {
    id: 2,
    title: 'Driver License Front',
    uploadedAt: '2026.08.20',
    type: 'ID Card',
    fileType: 'PNG',
    fileSize: '2.89 MB',
    issued: '2020.11.15',
    ends: '2030.11.15',
  },
  {
    id: 3,
    title: 'Gym Membership',
    uploadedAt: '2026.08.19',
    type: 'Membership card',
    fileType: 'PDF',
    fileSize: '7.45 MB',
    issued: '2026.01.01',
    ends: '2027.01.01',
  },
  {
    id: 4,
    title: 'Student ID',
    uploadedAt: '2026.08.15',
    type: 'ID Card',
    fileType: 'PDF',
    fileSize: '3.22 MB',
    issued: '2025.10.01',
    ends: '2026.10.01',
  },
]);
</script>
