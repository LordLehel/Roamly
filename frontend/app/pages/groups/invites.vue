<!-- frontend/app/pages/groups/invites.vue -->
<template>
  <div>
    <InvitesMobile
      v-if="isMobile"
      :invites-list="invitesList"
      :is-loading="isLoading"
      :error="error"
      :is-fetching-next-page="isFetchingNextPage"
      @load-more="fetchNextPage"
    />

    <InvitesDesktop
      v-else
      :invites-list="invitesList"
      :is-loading="isLoading"
      :error="error"
      :is-fetching-next-page="isFetchingNextPage"
      @load-more="fetchNextPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { usePendingInvitesQuery } from '~/queries/groups.query';
import type { GroupInvitesOutDto } from '~/types/groups.type';

import InvitesDesktop from '~/components/views/desktop/groups/InvitesDesktop.vue';
import InvitesMobile from '~/components/views/mobile/groups/InvitesMobile.vue';

definePageMeta({ layout: 'general', middleware: ['auth'] });

useProtectedPage();
const { isMobile } = useScreenSize();

const currentCursor = ref<string | undefined>(undefined);
const { data: invitesData, isLoading, error } = usePendingInvitesQuery(15, currentCursor);

const invitesList = ref<GroupInvitesOutDto[]>([]);
const isFetchingNextPage = ref(false);

watch(
  () => invitesData.value,
  (newData) => {
    if (newData?.items) {
      if (!currentCursor.value) {
        invitesList.value = [...newData.items];
      } else {
        const newItems = newData.items.filter(
          (newItem) => !invitesList.value.some((existing) => existing.uuid === newItem.uuid),
        );
        invitesList.value.push(...newItems);
      }
    }
  },
  { immediate: true },
);

watch(
  () => isLoading.value,
  (loading) => {
    if (!loading) isFetchingNextPage.value = false;
  },
);

const fetchNextPage = () => {
  if (
    invitesData.value?.meta.has_next_page &&
    invitesData.value.meta.next_cursor &&
    !isFetchingNextPage.value
  ) {
    isFetchingNextPage.value = true;
    currentCursor.value = invitesData.value.meta.next_cursor;
  }
};
</script>
