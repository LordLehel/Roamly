<!-- frontend/app/pages/events/index.vue -->
<template>
  <div>
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
      :is-loading-days="isLoadingDays"
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
      :is-loading-days="isLoadingDays"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto } from '~/types/groups.type';
import {
  fetchMockGroups,
  fetchMockDays,
  fetchMockEvents,
  type MockDay,
  type MockEvent,
  type MockUser,
} from '~/utils/apiMock.utils';

// Import kiszervezett logikák és komponensek
import {
  processAndSortDays,
  processAndSortEvents,
  type ProcessedDay,
  type ClientEvent,
} from '~/utils/sort.utils';
import { filterEventsByQuery } from '~/utils/filter.utils';
import EventsDesktop from '~/components/views/desktop/events/EventsDesktop.vue';
import EventsMobile from '~/components/views/mobile/events/EventsMobile.vue';

definePageMeta({ layout: 'general', middleware: ['auth'] });

/* STORES & QUERIES */
const { isMobile } = useScreenSize();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

/* STATE */
const userGroupsList = ref<GroupOutDto[]>([]);
const daysList = ref<MockDay[]>([]);
const eventsList = ref<MockEvent[]>([]);

const selectedGroupUuid = ref<string | undefined>(undefined);
const selectedDayId = ref<string | undefined>(undefined);
const selectedEvent = ref<ClientEvent | null | undefined>(null);

const isLoadingGroups = ref(true);
const isLoadingDays = ref(false);
const isLoadingEvents = ref(false);
const isGroupDropdownOpen = ref(false);

const searchQuery = ref('');
const debouncedSearchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;

const isFilterOpen = ref(false);
const filterStartDate = ref('');
const filterEndDate = ref('');

/* LIFECYCLE & WATCHERS */
onMounted(async () => {
  isLoadingGroups.value = true;
  userGroupsList.value = await fetchMockGroups();
  isLoadingGroups.value = false;

  if (userGroupsList.value.length > 0) {
    selectedGroupUuid.value = userGroupsList.value[0]?.uuid;
  }
});

watch(selectedGroupUuid, async (newUuid) => {
  if (!newUuid) return;
  isLoadingDays.value = true;
  daysList.value = await fetchMockDays(newUuid);
  isLoadingDays.value = false;

  const validDay = sortedDaysList.value.find((d) => !d.isExpired) || sortedDaysList.value[0];
  selectedDayId.value = validDay?.id;
});

watch(selectedDayId, async (newDayId) => {
  if (!newDayId) {
    eventsList.value = [];
    return;
  }
  isLoadingEvents.value = true;
  eventsList.value = await fetchMockEvents(newDayId);
  isLoadingEvents.value = false;
  searchQuery.value = '';
});

watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
  }, 300);
});

/* COMPUTED PROPERTIES */
const selectedGroupDetails = computed(() => {
  if (!selectedGroupUuid.value) return undefined;
  return userGroupsList.value.find((g) => g.uuid === selectedGroupUuid.value);
});

const isCurrentUserLeader = computed(() => {
  const group = selectedGroupDetails.value;
  return group?.role?.toLowerCase() === 'leader';
});

const hasPermissionToDelete = computed(() => {
  const creatorName = selectedEvent.value?.creator?.username;
  const currentUserName = currentUser.value?.username;
  return (
    isCurrentUserLeader.value ||
    (!!creatorName && !!currentUserName && creatorName === currentUserName)
  );
});

/* SORTING & FILTERING INTEGRATION */
const sortedDaysList = computed<ProcessedDay[]>(() => processAndSortDays(daysList.value));

const selectedDayDetails = computed<ProcessedDay | undefined>(() => {
  return sortedDaysList.value.find((d) => d.id === selectedDayId.value);
});

const sortedEventsList = computed<ClientEvent[]>(() =>
  processAndSortEvents(eventsList.value, selectedDayDetails.value),
);

const filteredAndSortedEventsList = computed<ClientEvent[]>(() =>
  filterEventsByQuery(sortedEventsList.value, debouncedSearchQuery.value),
);

watch(filteredAndSortedEventsList, (newList) => {
  const currentExistsInNewList = newList.find((e) => e.id === selectedEvent.value?.id);
  if (newList.length > 0 && !currentExistsInNewList) {
    selectedEvent.value = newList[0];
  } else if (newList.length === 0) {
    selectedEvent.value = null;
  }
});

const displayParticipants = computed(() => selectedEvent.value?.members?.slice(0, 5) || []);
const extraParticipantsCount = computed(() =>
  Math.max(0, (selectedEvent.value?.members?.length || 0) - 5),
);

/* EVENT HANDLERS */
const selectGroup = (uuid: string) => {
  selectedGroupUuid.value = uuid;
  isGroupDropdownOpen.value = false;
};

const applyDateFilter = () => {
  isFilterOpen.value = false;
};

const handleDeleteCurrentGroup = () => {
  const group = selectedGroupDetails.value;
  if (!group) return;

  groupsStore.openDeleteModal({
    uuid: group.uuid,
    name: group.name,
    role: group.role ?? 'leader',
    current_size: group.current_size ?? 1,
    created_at: group.created_at ?? '',
  });
};

const handleLeaveCurrentGroup = () => {
  const group = selectedGroupDetails.value;
  if (!group) return;
  groupsStore.openLeaveModal(group);
};

const openUserProfile = (user: MockUser) => {
  groupsStore.selectedUserProfile = {
    username: user.username,
    email: user.email,
    role: user.role || 'Participant',
    joinedAt: user.joinedAt || 'Unknown',
    canViewDocuments: user.canViewDocuments ?? false,
  };
  groupsStore.isUserProfileModalOpen = true;
};

const openAllParticipantsModal = () => {
  if (selectedEvent.value && selectedEvent.value.members) {
    eventsStore.openParticipantsModal(selectedEvent.value.members);
  }
};

const handleOpenDeleteEventModal = (event: ClientEvent) => {
  eventsStore.openDeleteEventModal(event);
};
</script>
