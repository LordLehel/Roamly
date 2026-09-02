<!-- frontend/app/components/views/mobile/groups/MembersMobile.vue -->
<template>
  <div class="mobile-wrapper p-4 text-center">
    <h1 class="text-xl font-bold text-dark-text">Here will be the mobile view for Members</h1>
    <p class="mt-4 text-brand-500 font-medium">Group: {{ groupInfos?.name || 'Loading...' }}</p>
    <p class="text-dark-text/80">Members loaded: {{ filteredMembers.length }}</p>

    <div class="mt-4 w-full">
      <UInput
        :model-value="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search members..."
        variant="glass"
        @update:model-value="emit('update:searchQuery', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GroupProfileDto, GroupInfosOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  groupInfos: GroupInfosOutDto | undefined | null;
  filteredMembers: GroupProfileDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  searchQuery: string;
  isCurrentUserLeader: boolean;
  currentUserEmail: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void;
  (e: 'deleteGroup' | 'leaveGroup'): void;
  (e: 'openProfile', profile: GroupProfileDto): void;
}>();
</script>
