<!-- frontend/app/pages/events/index.vue -->
<template>
  <ClientOnly>
    <template #fallback>
      <div class="min-h-screen flex items-center justify-center">
        <span class="opacity-50 font-medium">{{ CONST_LOADING_TEXT ?? 'Loading...' }}</span>
      </div>
    </template>

    <EventsMobile
      v-if="isMobile"
      v-model:search-query="searchQuery"
      v-model:filter-start-date="filterStartDate"
      v-model:filter-end-date="filterEndDate"
      v-model:is-group-dropdown-open="isGroupDropdownOpen"
      v-model:is-filter-open="isFilterOpen"
      :user-groups-list="userGroupsList"
      :selected-group-uuid="selectedGroupUuid"
      :selected-group-details="selectedGroupDetails"
      :selected-day-id="selectedDayId"
      :selected-event="selectedEvent"
      :is-loading-groups="isLoadingGroups"
      :is-loading-days="isLoadingEvents"
      :is-loading-events="isLoadingEvents"
      :sorted-days-list="sortedDaysList"
      :filtered-and-sorted-events-list="filteredAndSortedEventsList"
      :selected-day-details="selectedDayDetails"
      :is-current-user-leader="isCurrentUserLeader"
      :has-permission-to-delete="hasPermissionToDelete"
      :display-participants="displayParticipants"
      :extra-participants-count="extraParticipantsCount"
      @select-group="selectGroup"
      @update:selected-day-id="selectedDayId = $event"
      @update:selected-event="selectedEvent = $event"
      @delete-group="handleDeleteCurrentGroup"
      @leave-group="handleLeaveCurrentGroup"
      @apply-filter="applyDateFilter"
      @open-add-event="eventsStore.openAddEventModal()"
      @open-delete-event="handleOpenDeleteEventModal"
      @open-user-profile="openUserProfile"
      @open-all-participants="openAllParticipantsModal"
      @open-preview-modal="handleOpenPreviewModal"
    />

    <EventsDesktop
      v-else
      v-model:search-query="searchQuery"
      v-model:filter-start-date="filterStartDate"
      v-model:filter-end-date="filterEndDate"
      v-model:is-group-dropdown-open="isGroupDropdownOpen"
      v-model:is-filter-open="isFilterOpen"
      :user-groups-list="userGroupsList"
      :selected-group-uuid="selectedGroupUuid"
      :selected-group-details="selectedGroupDetails"
      :selected-day-id="selectedDayId"
      :selected-event="selectedEvent"
      :is-loading-groups="isLoadingGroups"
      :is-loading-days="isLoadingEvents"
      :is-loading-events="isLoadingEvents"
      :sorted-days-list="sortedDaysList"
      :filtered-and-sorted-events-list="filteredAndSortedEventsList"
      :selected-day-details="selectedDayDetails"
      :is-current-user-leader="isCurrentUserLeader"
      :has-permission-to-delete="hasPermissionToDelete"
      :display-participants="displayParticipants"
      :extra-participants-count="extraParticipantsCount"
      @select-group="selectGroup"
      @update:selected-day-id="selectedDayId = $event"
      @update:selected-event="selectedEvent = $event"
      @delete-group="handleDeleteCurrentGroup"
      @leave-group="handleLeaveCurrentGroup"
      @apply-filter="applyDateFilter"
      @open-add-event="eventsStore.openAddEventModal()"
      @open-delete-event="handleOpenDeleteEventModal"
      @open-user-profile="openUserProfile"
      @open-all-participants="openAllParticipantsModal"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, computed, watch } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery } from '~/queries/groups.query';
import { useEventsQuery } from '~/queries/events.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';

import type { GroupOutDto } from '~/types/groups.type';
import type { UiDay, UiEvent, EventCreatorDto } from '~/types/events.type';
import { processAvailableDates, processAndSortEvents } from '~/utils/sort.utils';
import { filterEventsByQuery } from '~/utils/filter.utils';

import EventsDesktop from '~/components/views/desktop/events/EventsDesktop.vue';
import EventsMobile from '~/components/views/mobile/events/EventsMobile.vue';

/* --- META --- */
definePageMeta({ layout: 'general', middleware: ['auth'] });

/* --- PAGE CONFIGURATION --- */
const { isMobile } = useScreenSize();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

const selectedGroupUuid = ref<string | undefined>(undefined);
const selectedDayId = ref<string | undefined>(undefined);
const selectedEvent = ref<UiEvent | null | undefined>(null);

const isGroupDropdownOpen = ref(false);
const isFilterOpen = ref(false);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;

const filterStartDate = ref('');
const filterEndDate = ref('');
const activeFilterStartDate = ref('');
const activeFilterEndDate = ref('');

/* --- DATA --- */
const { data: groupsData, isLoading: isLoadingGroups } = useGroupsQuery();
const userGroupsList = computed<GroupOutDto[]>(() => groupsData.value?.items || []);

watch(
  userGroupsList,
  (newGroups) => {
    if (newGroups.length > 0 && !selectedGroupUuid.value) {
      selectedGroupUuid.value = newGroups[0]?.uuid;
    }
  },
  { immediate: true },
);

watch(selectedGroupUuid, (newUuid) => {
  eventsStore.selectedGroupUuid = newUuid;
});

const { data: eventsResponse, isLoading: isLoadingEvents } = useEventsQuery(
  selectedGroupUuid,
  activeFilterStartDate,
  activeFilterEndDate,
);

/* --- PROCESS --- */
const sortedDaysList = computed<UiDay[]>(() => {
  if (!eventsResponse.value?.available_dates) return [];
  return processAvailableDates(eventsResponse.value.available_dates);
});

watch(sortedDaysList, (newDays) => {
  if (newDays.length > 0 && !selectedDayId.value) {
    const validDay = newDays.find((d) => !d.isExpired) || newDays[0];
    selectedDayId.value = validDay?.id;
  }
});

const selectedDayDetails = computed<UiDay | undefined>(() =>
  sortedDaysList.value.find((d) => d.id === selectedDayId.value),
);

const sortedEventsList = computed<UiEvent[]>(() => {
  if (!eventsResponse.value?.events) return [];
  return processAndSortEvents(eventsResponse.value.events, selectedDayDetails.value);
});

watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
  }, 300);
});

const filteredAndSortedEventsList = computed<UiEvent[]>(() =>
  filterEventsByQuery(sortedEventsList.value, debouncedSearchQuery.value),
);

watch(filteredAndSortedEventsList, (newList) => {
  const currentExistsInNewList = newList.find((e) => e.uuid === selectedEvent.value?.uuid);
  if (newList.length > 0 && !currentExistsInNewList) {
    selectedEvent.value = newList[0];
  } else if (newList.length === 0) {
    selectedEvent.value = null;
  }
});

/* --- PERMISSIONS & HELPERS --- */
const selectedGroupDetails = computed(() =>
  userGroupsList.value.find((g) => g.uuid === selectedGroupUuid.value),
);
const isCurrentUserLeader = computed(
  () => selectedGroupDetails.value?.role?.toLowerCase() === 'leader',
);

const hasPermissionToDelete = computed(() => {
  const creatorName = selectedEvent.value?.creator?.username;
  const currentUserName = currentUser.value?.username;
  return (
    isCurrentUserLeader.value ||
    (!!creatorName && !!currentUserName && creatorName === currentUserName)
  );
});

const displayParticipants = computed(() => selectedEvent.value?.members?.slice(0, 5) || []);
const extraParticipantsCount = computed(() =>
  Math.max(0, (selectedEvent.value?.members?.length || 0) - 5),
);

/* --- EVENT HANDLERS --- */
const selectGroup = (uuid: string) => {
  selectedGroupUuid.value = uuid;
  isGroupDropdownOpen.value = false;
  selectedDayId.value = undefined;
};

const applyDateFilter = () => {
  activeFilterStartDate.value = filterStartDate.value;
  activeFilterEndDate.value = filterEndDate.value;
  isFilterOpen.value = false;
};

const handleDeleteCurrentGroup = () => {
  if (selectedGroupDetails.value) groupsStore.openDeleteModal(selectedGroupDetails.value);
};
const handleLeaveCurrentGroup = () => {
  if (selectedGroupDetails.value) groupsStore.openLeaveModal(selectedGroupDetails.value);
};

const openUserProfile = (user: EventCreatorDto) => {
  groupsStore.selectedUserProfile = {
    username: user.username,
    email: 'N/A',
    role: 'Participant',
    joinedAt: 'Unknown',
    canViewDocuments: false,
  };
  groupsStore.isUserProfileModalOpen = true;
};

const openAllParticipantsModal = () => {
  if (selectedEvent.value?.members) eventsStore.openParticipantsModal(selectedEvent.value.members);
};

const handleOpenDeleteEventModal = (event: UiEvent) => {
  eventsStore.openDeleteEventModal(event);
};

const handleOpenPreviewModal = (event: UiEvent) => {
  selectedEvent.value = event;
  eventsStore.openPreviewModal(event, selectedDayDetails.value?.date);
};
</script>
