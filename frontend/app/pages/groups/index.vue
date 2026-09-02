<!-- frontend/app/pages/groups/index.vue -->
<template>
  <div>
    <IndexMobile
      v-if="isMobile"
      :groups-list="groupsList"
      :is-loading="isLoading"
      :error="error"
      :is-fetching-next-page="isFetchingNextPage"
      @load-more="fetchNextPage"
    />

    <IndexDesktop
      v-else
      :groups-list="groupsList"
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
import { useGroupsQuery } from '~/queries/groups.query';
import type { GroupOutDto } from '~/types/groups.type';

import IndexDesktop from '~/components/views/desktop/groups/IndexDesktop.vue';
import IndexMobile from '~/components/views/mobile/groups/IndexMobile.vue';

definePageMeta({ layout: 'general', middleware: ['auth'] });

useProtectedPage();
const { isMobile } = useScreenSize();

const currentCursor = ref<string | undefined>(undefined);
const { data: groupsData, isLoading, error } = useGroupsQuery(15, currentCursor);

const groupsList = ref<GroupOutDto[]>([]);
const isFetchingNextPage = ref(false);

watch(
  () => groupsData.value,
  (newData) => {
    if (newData?.items) {
      if (!currentCursor.value) {
        groupsList.value = [...newData.items];
      } else {
        const newItems = newData.items.filter(
          (newItem) => !groupsList.value.some((existing) => existing.uuid === newItem.uuid),
        );
        groupsList.value.push(...newItems);
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
    groupsData.value?.meta.has_next_page &&
    groupsData.value.meta.next_cursor &&
    !isFetchingNextPage.value
  ) {
    isFetchingNextPage.value = true;
    currentCursor.value = groupsData.value.meta.next_cursor;
  }
};
</script>
