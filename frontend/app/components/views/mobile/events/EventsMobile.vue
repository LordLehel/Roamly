<!-- frontend/app/components/views/mobile/events/EventsMobile.vue -->
<template>
  <div
    class="p-6 text-center text-dark-text min-h-screen flex flex-col items-center justify-center"
  >
    <h2 class="text-2xl font-bold mb-4">Mobil nézet (Helyőrző)</h2>
    <p class="opacity-70 mb-8">A mobil specifikus UI implementációja ide kerül.</p>

    <div v-if="isLoadingGroups" class="text-sm opacity-50">Adatok betöltése...</div>
    <div v-else class="text-sm">
      <p>Csoportok száma: {{ userGroupsList.length }}</p>
      <p>Kiválasztott nap: {{ selectedDayDetails?.date || 'Nincs' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GroupOutDto } from '~/types/groups.type';
import type { MockUser } from '~/utils/apiMock.utils';
import type { ProcessedDay, ClientEvent } from '~/utils/sort.utils';

defineProps<{
  userGroupsList: GroupOutDto[];
  selectedGroupUuid?: string;
  selectedGroupDetails?: GroupOutDto;
  selectedDayId?: string;
  selectedEvent: ClientEvent | null | undefined;
  isLoadingGroups: boolean;
  isLoadingDays: boolean;
  isLoadingEvents: boolean;
  sortedDaysList: ProcessedDay[];
  filteredAndSortedEventsList: ClientEvent[];
  selectedDayDetails?: ProcessedDay;
  isCurrentUserLeader: boolean;
  hasPermissionToDelete: boolean;
  displayParticipants: MockUser[];
  extraParticipantsCount: number;
}>();

defineEmits<{
  (e: 'select-group', uuid: string): void;
  (e: 'update:selected-day-id', id: string | undefined): void;
  (e: 'update:selected-event', event: ClientEvent | null): void;
  (
    e: 'delete-group' | 'leave-group' | 'apply-filter' | 'open-add-event' | 'open-all-participants',
  ): void;
  (e: 'open-delete-event', event: ClientEvent): void;
  (e: 'open-user-profile', user: MockUser): void;
}>();

/*
const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });
*/
</script>
