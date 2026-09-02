<!-- frontend/app/components/views/mobile/groups/InvitesMobile.vue -->
<template>
  <div class="mobile-wrapper p-4 text-center">
    <h1 class="text-xl font-bold text-dark-text">Here will be the mobile view for Invites</h1>
    <p class="mt-4 text-brand-500 font-medium">Loaded {{ invitesList.length }} invites so far.</p>

    <UButton
      v-if="!isLoading && invitesList.length > 0"
      class="mt-4"
      :loading="isFetchingNextPage"
      @click="emit('loadMore')"
    >
      Load More
    </UButton>
  </div>
</template>

<script setup lang="ts">
import type { GroupInvitesOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  invitesList: GroupInvitesOutDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  isFetchingNextPage: boolean;
}>();

const emit = defineEmits<{
  (e: 'loadMore'): void;
}>();
</script>
