<!-- frontend/app/components/views/mobile/groups/IndexMobile.vue -->
<template>
  <div class="mobile-wrapper p-4 text-center">
    <h1 class="text-xl font-bold text-dark-text">Here will be the mobile view for Groups Index</h1>
    <p class="mt-4 text-brand-500 font-medium">Loaded {{ groupsList.length }} groups so far.</p>

    <!-- Ez a gomb szimulálja a betöltést addig, amíg nincs kész a végtelen görgetés mobilra -->
    <UButton
      v-if="!isLoading && groupsList.length > 0"
      class="mt-4"
      :loading="isFetchingNextPage"
      @click="emit('loadMore')"
    >
      Load More
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  groupsList: GroupOutDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  isFetchingNextPage: boolean;
}>();

const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();
</script>
