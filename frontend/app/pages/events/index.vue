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
      v-model:show-only-active-events="showOnlyActiveEvents"
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
      :current-user-email="currentUserEmail"
      @select-group="selectGroup"
      @update:selected-day-id="selectedDayId = $event"
      @update:selected-event="selectedEvent = $event"
      @delete-group="handleDeleteCurrentGroup"
      @leave-group="handleLeaveCurrentGroup"
      @apply-filter="applyDateFilter"
      @open-add-event="eventsStore.openAddEventModal()"
      @open-delete-event="handleOpenDeleteEventModal"
      @open-user-profile="handleOpenUserProfile"
      @open-all-participants="openAllParticipantsModal"
      @open-preview-modal="handleOpenPreviewModal"
      @open-leave-event="eventsStore.openLeaveEventModal"
      @open-add-members="handleOpenAddMembersModal"
    />

    <EventsDesktop
      v-else
      v-model:search-query="searchQuery"
      v-model:filter-start-date="filterStartDate"
      v-model:filter-end-date="filterEndDate"
      v-model:is-group-dropdown-open="isGroupDropdownOpen"
      v-model:is-filter-open="isFilterOpen"
      v-model:show-only-active-events="showOnlyActiveEvents"
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
      :current-user-email="currentUserEmail"
      @select-group="selectGroup"
      @update:selected-day-id="selectedDayId = $event"
      @update:selected-event="selectedEvent = $event"
      @delete-group="handleDeleteCurrentGroup"
      @leave-group="handleLeaveCurrentGroup"
      @apply-filter="applyDateFilter"
      @open-add-event="eventsStore.openAddEventModal()"
      @open-delete-event="handleOpenDeleteEventModal"
      @open-user-profile="handleOpenUserProfile"
      @open-all-participants="openAllParticipantsModal"
      @open-leave-event="eventsStore.openLeaveEventModal"
      @open-add-members="handleOpenAddMembersModal"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import { useDatesQuery, useEventsQuery } from '~/queries/events.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';

import type { GroupOutDto } from '~/types/groups.type';
import type { UiDay, UiEvent, EventCreatorDto } from '~/types/events.type';
import { processAvailableDates, processAndSortEvents } from '~/utils/sort.utils';
import { filterEventsByQuery } from '~/utils/filter.utils';
import { useRoute, useRouter } from 'vue-router';

import EventsDesktop from '~/components/views/desktop/events/EventsDesktop.vue';
import EventsMobile from '~/components/views/mobile/events/EventsMobile.vue';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const route = useRoute();
const router = useRouter();
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
const showOnlyActiveEvents = ref(true);

const currentUserEmail = computed(() => currentUser.value?.email);

const { data: groupsData, isLoading: isLoadingGroups } = useGroupsQuery();
const userGroupsList = computed<GroupOutDto[]>(() => groupsData.value?.items || []);

const { data: groupInfosData } = useGroupInfosQuery(computed(() => selectedGroupUuid.value || ''));

watch(
  userGroupsList,
  (newGroups) => {
    if (newGroups.length > 0 && !selectedGroupUuid.value) {
      let initialUuid = newGroups[0]?.uuid;

      if (typeof window !== 'undefined') {
        const savedUuid = localStorage.getItem('roamly_last_group_uuid');
        if (savedUuid && newGroups.some((g) => g.uuid === savedUuid)) {
          initialUuid = savedUuid;
        }
      }

      selectedGroupUuid.value = initialUuid;
    }
  },
  { immediate: true },
);

watch(
  selectedGroupUuid,
  (newUuid) => {
    eventsStore.selectedGroupUuid = newUuid;
    if (newUuid && typeof window !== 'undefined') {
      localStorage.setItem('roamly_last_group_uuid', newUuid);
    }
  },
  { immediate: true },
);

const { data: datesResponse, isLoading: isLoadingDays } = useDatesQuery(selectedGroupUuid);

const sortedDaysList = computed<UiDay[]>(() => processAvailableDates(datesResponse.value || []));

watch(
  sortedDaysList,
  (newDays) => {
    if (newDays.length > 0) {
      const currentDayExists = newDays.some((d) => d.id === selectedDayId.value);
      if (!selectedDayId.value || !currentDayExists) selectedDayId.value = 'ALL';
    } else {
      selectedDayId.value = undefined;
    }
  },
  { immediate: true },
);

const selectedDayDetails = computed<UiDay | undefined>(() =>
  sortedDaysList.value.find((d) => d.id === selectedDayId.value),
);

const { data: eventsData, isLoading: isLoadingEvents } = useEventsQuery(
  selectedGroupUuid,
  selectedDayId,
);
const sortedEventsList = computed<UiEvent[]>(() => processAndSortEvents(eventsData.value || []));

watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
  }, 300);
});

const filteredAndSortedEventsList = computed<UiEvent[]>(() => {
  let filtered = filterEventsByQuery(sortedEventsList.value, debouncedSearchQuery.value);

  if (showOnlyActiveEvents.value) filtered = filtered.filter((e) => !e.isExpired);

  if (filterStartDate.value) {
    const startTarget = new Date(filterStartDate.value).getTime();
    filtered = filtered.filter((e) => new Date(e.start_time).getTime() >= startTarget);
  }

  if (filterEndDate.value) {
    const endTarget = new Date(filterEndDate.value);
    endTarget.setHours(23, 59, 59, 999);
    filtered = filtered.filter((e) => new Date(e.start_time).getTime() <= endTarget.getTime());
  }

  return filtered;
});

watch(
  filteredAndSortedEventsList,
  (newList) => {
    if (newList.length > 0) {
      const queryEventId = route.query.eventId as string;

      if (queryEventId) {
        const targetEvent = newList.find((e) => e.uuid === queryEventId);
        if (targetEvent) {
          selectedEvent.value = targetEvent;

          setTimeout(() => {
            if (isMobile.value) {
              handleOpenPreviewModal(targetEvent);
            }
            router.replace({ query: {} });
          }, 150);

          return;
        }
      }

      const currentInNewList = newList.find((e) => e.uuid === selectedEvent.value?.uuid);
      if (currentInNewList) {
        selectedEvent.value = currentInNewList;
      } else {
        selectedEvent.value = newList[0];
      }
    } else {
      selectedEvent.value = null;
    }
  },
  { immediate: true },
);

const selectedGroupDetails = computed(() =>
  userGroupsList.value.find((g) => g.uuid === selectedGroupUuid.value),
);
const isCurrentUserLeader = computed(
  () => selectedGroupDetails.value?.role?.toLowerCase() === 'leader',
);

const selectGroup = (uuid: string) => {
  selectedGroupUuid.value = uuid;
  isGroupDropdownOpen.value = false;
  selectedDayId.value = undefined;
};

const applyDateFilter = () => {
  isFilterOpen.value = false;
};
const handleDeleteCurrentGroup = () => {
  if (selectedGroupDetails.value) groupsStore.openDeleteModal(selectedGroupDetails.value);
};
const handleLeaveCurrentGroup = () => {
  if (selectedGroupDetails.value) groupsStore.openLeaveModal(selectedGroupDetails.value);
};
const handleOpenDeleteEventModal = (event: UiEvent) => {
  eventsStore.openDeleteEventModal(event);
};

const handleOpenPreviewModal = (event: UiEvent) => {
  selectedEvent.value = event;
  eventsStore.openPreviewModal(event, selectedDayDetails.value?.date);
};

const getGroupRole = (userEmail?: string | null): string => {
  if (!userEmail || !groupInfosData.value?.group_profiles) return 'Member';

  const profile = groupInfosData.value.group_profiles.find(
    (p) => p.users?.email?.toLowerCase() === userEmail.toLowerCase(),
  );

  const roleType = profile?.roles?.type?.toLowerCase();
  return roleType === 'leader' ? 'Leader' : 'Member';
};

const handleOpenUserProfile = (user: EventCreatorDto) => {
  groupsStore.selectedUserProfile = {
    username: user.username,
    email: user.email || 'N/A',
    role: getGroupRole(user.email), // <-- ITT VOLT A HARDKÓDOLT 'Participant'!
    joinedAt: 'Unknown',
    canViewDocuments: false,
  };
  groupsStore.isUserProfileModalOpen = true;
};

const openAllParticipantsModal = () => {
  if (selectedEvent.value?.members) eventsStore.openParticipantsModal(selectedEvent.value);
};

const handleOpenAddMembersModal = (event: UiEvent) => {
  selectedEvent.value = event;
  eventsStore.openAddMembersModal(event);
};
</script>
