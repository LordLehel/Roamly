<!-- frontend/app/pages/events/index.vue -->
<!-- frontend/app/pages/events/index.vue -->
<template>
  <div :class="appConfig.calendar.eventsWrapper">
    <!-- EVENT HEADER -->
    <div :class="appConfig.calendar.eventsHeaderRow">
      <!-- Bal oldali gombok (Kereső, Filter és Invite törölve innen) -->
      <div :class="appConfig.calendar.headerActionLeft">
        <UTooltip v-if="isCurrentUserLeader" :text="CONST_TOOLTIP_DELETE_GROUP ?? 'Delete Group'">
          <UButton
            icon="i-heroicons-trash"
            variant="glassIconButtonDanger"
            @click="handleDeleteCurrentGroup"
          />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_LEAVE_GROUP ?? 'Leave Group'">
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle"
            variant="glassIconButtonDanger"
            @click="handleLeaveCurrentGroup"
          />
        </UTooltip>
      </div>

      <!-- Középső Cím -->
      <div :class="appConfig.calendar.headerCenter">
        <div :class="appConfig.calendar.headerTitleRow">
          <h1 :class="appConfig.typography.pageTitle">
            {{
              isLoadingGroups
                ? 'Loading...'
                : selectedGroupDetails?.name || CONST_SELECT_GROUP_PROMPT
            }}
          </h1>
          <UTooltip
            v-if="isCurrentUserLeader && !isLoadingGroups"
            :text="CONST_TOOLTIP_EDIT_GROUP ?? 'Edit Group'"
          >
            <UButton
              icon="i-heroicons-pencil"
              variant="ghostBrandIconButton"
              class="w-4 h-4"
              @click="groupsStore.openUpdateModal(selectedGroupDetails?.name || '')"
            />
          </UTooltip>
        </div>
        <p :class="appConfig.typography.pageSubtitle" class="mt-0">
          {{ CONST_CALENDAR_SUBTITLE ?? 'Calendar' }}
        </p>
      </div>

      <!-- Jobb oldali gombok -->
      <div :class="appConfig.calendar.headerActionRight">
        <UTooltip :text="CONST_TOOLTIP_MEMBERS ?? 'Members'">
          <UButton icon="i-heroicons-users" variant="glassIconButton" to="/" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_CALENDAR ?? 'Calendar'">
          <UButton icon="i-heroicons-calendar" variant="glassIconButtonBrand" to="/events" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_PHOTOS ?? 'Photos'">
          <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_DOCUMENTS ?? 'Documents'">
          <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
        </UTooltip>
      </div>
    </div>

    <!-- ÚJ: TOOLBAR (Search, Filter, Add Event) -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 w-full shrink-0">
      <!-- Bal oldal: Kereső és Szűrő -->
      <div class="flex items-center gap-4 w-full sm:w-auto flex-1">
        <!-- SEARCH BAR -->
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search events..."
          variant="search"
          class="w-full max-w-sm"
        />

        <!-- FILTER DROPDOWN -->
        <UPopover v-model:open="isFilterOpen">
          <UTooltip :text="CONST_TOOLTIP_FILTER_EVENTS ?? 'Filter'">
            <UButton
              icon="i-heroicons-funnel"
              :label="CONST_FILTER_LABEL ?? 'Filter'"
              variant="glassButton"
            />
          </UTooltip>

          <template #content>
            <div :class="appConfig.calendar.filterDropdownContent">
              <div :class="appConfig.calendar.filterFormGroup">
                <div>
                  <label :class="appConfig.calendar.filterLabel">Start Date</label>
                  <input
                    v-model="filterStartDate"
                    type="date"
                    :class="appConfig.calendar.filterDateInput"
                  />
                </div>
                <div>
                  <label :class="appConfig.calendar.filterLabel">End Date</label>
                  <input
                    v-model="filterEndDate"
                    type="date"
                    :class="appConfig.calendar.filterDateInput"
                  />
                </div>
                <div :class="appConfig.calendar.filterButtonWrapper">
                  <UButton
                    label="Apply Filter"
                    variant="smallPrimaryActionButton"
                    @click="applyDateFilter"
                  />
                </div>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Jobb oldal: Add Event Gomb -->
      <div class="shrink-0 w-full sm:w-auto flex justify-end">
        <UButton
          icon="i-heroicons-calendar-days"
          label="Add Event"
          variant="actionOkButton"
          class="h-10 text-sm px-6"
          @click="eventsStore.openAddEventModal()"
        >
          <template #leading>
            <UIcon name="i-heroicons-plus" class="w-5 h-5 mr-1" />
          </template>
        </UButton>
      </div>
    </div>

    <!-- MAIN CONTENT GRID (3 Columns) -->
    <div :class="appConfig.calendar.eventsGrid">
      <!-- 1. COLUMN: DAYS -->
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnDays]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tl-xl']">
          {{ CONST_DAYS_HEADER ?? 'Days' }}
        </div>

        <div :class="appConfig.calendar.columnBody">
          <div v-if="isLoadingDays" class="p-4 text-center text-sm opacity-60">Loading days...</div>
          <template v-else>
            <div
              v-for="day in sortedDaysList"
              :key="day.id"
              :class="[
                appConfig.calendar.listItem,
                selectedDayId === day.id
                  ? appConfig.calendar.listItemSelected
                  : appConfig.calendar.listItemHover,
                day.isExpired ? appConfig.calendar.expiredItemWrapper : '',
              ]"
              @click="selectedDayId = day.id"
            >
              <span class="font-medium text-dark-text">{{ day.date }} ({{ day.dayOfWeek }})</span>
            </div>
            <div v-if="!sortedDaysList.length" class="p-4 text-center text-sm opacity-60">
              No days added.
            </div>
          </template>
        </div>
      </div>

      <!-- 2. COLUMN: EVENTS LIST -->
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnEvents]">
        <div :class="appConfig.calendar.columnHeader">
          <span class="uppercase">{{ CONST_EVENTS_HEADER ?? 'Events' }}</span>
          <span v-if="selectedDayDetails">{{ selectedDayDetails.date }}</span>
        </div>

        <div :class="appConfig.calendar.columnBody">
          <div v-if="isLoadingEvents" class="p-4 text-center text-sm opacity-60">
            Loading events...
          </div>
          <template v-else>
            <div
              v-for="event in filteredAndSortedEventsList"
              :key="event.id"
              :class="[
                appConfig.calendar.listItem,
                appConfig.calendar.listItemHover,
                selectedEvent?.id === event.id ? appConfig.calendar.eventListItemSelected : '',
                event.isExpired ? appConfig.calendar.expiredItemWrapper : '',
              ]"
              @click="selectedEvent = event"
            >
              <div :class="appConfig.calendar.eventItemWrapper">
                <UIcon
                  :name="event.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'"
                  :class="appConfig.calendar.eventItemIcon"
                />
                <span
                  :class="[
                    appConfig.calendar.eventItemTitle,
                    event.isExpired ? appConfig.calendar.expiredItemText : '',
                  ]"
                >
                  {{ event.title }}
                </span>
              </div>
              <span :class="appConfig.calendar.eventItemTime"
                >{{ event.timeStart }} - {{ event.timeEnd }}</span
              >
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              class="p-6 text-center text-sm text-dark-text/60 font-medium"
            >
              {{
                searchQuery
                  ? 'No matching events found.'
                  : (CONST_NO_EVENTS_MSG ?? 'No events found.')
              }}
            </div>
          </template>
        </div>
      </div>

      <!-- 3. COLUMN: EVENT PREVIEW -->
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnPreview]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tr-xl']">
          {{ CONST_EVENT_PREVIEW_HEADER ?? 'Events - extended' }}
        </div>

        <div
          v-if="selectedEvent"
          :class="[appConfig.calendar.previewWrapper, selectedEvent.isExpired ? 'opacity-70' : '']"
        >
          <!-- Title & Delete -->
          <div :class="appConfig.calendar.previewTitleRow">
            <div :class="appConfig.calendar.previewTypeWrapper">
              <UIcon
                :name="selectedEvent.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'"
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">
                {{
                  selectedEvent.isPrivate
                    ? (CONST_PRIVATE_LBL ?? 'Private')
                    : (CONST_GROUP_EVENT_LBL ?? 'Group')
                }}
              </span>
            </div>

            <h2 :class="appConfig.calendar.previewMainTitle">
              {{ selectedEvent.title }}
              <span v-if="selectedEvent.isExpired" :class="appConfig.calendar.previewExpiredBadge"
                >Expired</span
              >
            </h2>

            <UTooltip v-if="hasPermissionToDelete" text="Delete Event">
              <UButton
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                @click="eventsStore.openDeleteEventModal(selectedEvent)"
              />
            </UTooltip>
            <div v-else class="w-8"></div>
          </div>

          <!-- Metadata -->
          <div :class="appConfig.calendar.previewMetaRow">
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{
                CONST_CREATOR_LBL ?? 'Creator:'
              }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                selectedEvent.creator?.username
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_DATE_LBL ?? 'Date:' }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                selectedDayDetails?.date || 'N/A'
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_TIME_LBL ?? 'Time:' }}</span>
              <span :class="appConfig.calendar.metaValue"
                >{{ selectedEvent.timeStart }} - {{ selectedEvent.timeEnd }}</span
              >
            </div>

            <!-- Members (Max 5 + Overflow Badge) -->
            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">{{
                CONST_MEMBERS_LBL ?? 'Members:'
              }}</span>

              <div :class="appConfig.calendar.participantsGroup">
                <!-- Avatars list -->
                <div
                  :class="[
                    appConfig.calendar.participantsAvatars,
                    extraParticipantsCount > 0
                      ? appConfig.calendar.participantsOverlap
                      : appConfig.calendar.participantsGap,
                  ]"
                >
                  <UTooltip v-for="p in displayParticipants" :key="p.id" :text="p.username">
                    <UAvatar
                      :alt="p.username"
                      :src="p.avatar || undefined"
                      icon="i-heroicons-user"
                      size="sm"
                      :class="[
                        appConfig.calendar.participantAvatar,
                        extraParticipantsCount > 0 ? appConfig.calendar.participantAvatarHover : '',
                      ]"
                      @click="openUserProfile(p)"
                    />
                  </UTooltip>

                  <!-- Badge -->
                  <UTooltip
                    v-if="extraParticipantsCount > 0"
                    :text="'+' + extraParticipantsCount.toString() + ' more participants'"
                  >
                    <div
                      :class="appConfig.calendar.participantMoreBadge"
                      @click="openAllParticipantsModal"
                    >
                      +{{ extraParticipantsCount }}
                    </div>
                  </UTooltip>
                </div>

                <!-- Link to view all -->
                <span
                  v-if="extraParticipantsCount > 0"
                  :class="appConfig.calendar.participantViewAll"
                  @click="openAllParticipantsModal"
                >
                  View all
                </span>
              </div>
            </div>

            <div :class="[appConfig.calendar.metaRowItem, 'mt-2']">
              <span :class="appConfig.calendar.metaLabel">{{
                CONST_DESC_LBL ?? 'Description:'
              }}</span>
              <span :class="appConfig.calendar.metaValue">{{ selectedEvent.description }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_LOC_LBL ?? 'Location:' }}</span>
              <span :class="[appConfig.calendar.metaValue, appConfig.calendar.metaValueLink]">
                {{ selectedEvent.location }}
              </span>
            </div>
          </div>

          <!-- Google Maps Iframe -->
          <div :class="appConfig.calendar.previewMapPlaceholder">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2756.295222740354!2d25.294699376865182!3d46.30397407701674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474b172fd7417c99%3A0xfcc71cd3e524ef71!2sWebGurus!5e0!3m2!1shu!2sro!4v1788172972596!5m2!1shu!2sro"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen="false"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div v-else :class="appConfig.calendar.emptyPreview">
          {{ CONST_SELECT_EVENT_PROMPT ?? 'Select an event to view details.' }}
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EventsModals />
    <UserProfileModal />
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { useAppConfig } from '#imports';
import { ref, computed, watch, onMounted } from 'vue';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import EventsModals from '~/components/modals/EventsModals.vue';
import UserProfileModal from '~/components/modals/UserProfileModal.vue';
import type { GroupOutDto } from '~/types/groups.type';
import {
  fetchMockGroups,
  fetchMockDays,
  fetchMockEvents,
  type MockDay,
  type MockEvent,
  type MockUser,
} from '~/utils/apiMock.utils';

definePageMeta({ layout: 'general', middleware: ['auth'] });

/* COMPOSABLES & STORES */
const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

/* STATE & DATA LOADING LOGIC */
const userGroupsList = ref<GroupOutDto[]>([]);
const daysList = ref<MockDay[]>([]);
const eventsList = ref<MockEvent[]>([]);

const selectedGroupUuid = ref<string | undefined>(undefined);
const selectedDayId = ref<string | undefined>(undefined);
type ClientEvent = MockEvent & { isExpired?: boolean };
const selectedEvent = ref<ClientEvent | null>(null);

const isLoadingGroups = ref(true);
const isLoadingDays = ref(false);
const isLoadingEvents = ref(false);

// SEARCH ÉS FILTER STATE
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;

const isFilterOpen = ref(false);
const filterStartDate = ref('');
const filterEndDate = ref('');

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
  // Keresés nullázása új nap betöltésekor
  searchQuery.value = '';
});

/* SEARCH LOGIC */
watch(searchQuery, (newVal) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newVal;
  }, 300);
});

const applyDateFilter = () => {
  console.log('Filter intended:', filterStartDate.value, filterEndDate.value);
  // Itt hívnánk majd a backendet
  isFilterOpen.value = false; // Bezárja a popovert
};

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

/* RENDERING & SORTING LOGIC */
const getCurrentParsedDate = () => {
  const now = new Date();
  return {
    now,
    todayMidnight: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  };
};

const sortedDaysList = computed(() => {
  const { todayMidnight } = getCurrentParsedDate();
  const currentYear = todayMidnight.getFullYear();

  const processed = daysList.value.map((day) => {
    const [month, dayOfMonth] = day.date.split('.').map(Number);
    const dayDate = new Date(currentYear, (month ?? 1) - 1, dayOfMonth ?? 1);
    const isExpired = dayDate < todayMidnight;
    return { ...day, dayDate, isExpired };
  });

  const active = processed
    .filter((d) => !d.isExpired)
    .sort((a, b) => a.dayDate.getTime() - b.dayDate.getTime());
  const expired = processed
    .filter((d) => d.isExpired)
    .sort((a, b) => a.dayDate.getTime() - b.dayDate.getTime());

  return [...active, ...expired];
});

const selectedDayDetails = computed(() => {
  return sortedDaysList.value.find((d) => d.id === selectedDayId.value);
});

const sortedEventsList = computed(() => {
  const dayDetails = selectedDayDetails.value;
  if (!dayDetails) return [];

  const { now } = getCurrentParsedDate();

  const processed = eventsList.value.map((event) => {
    let isExpired = dayDetails.isExpired;

    if (!isExpired) {
      const [endHours, endMinutes] = event.timeEnd.split(':').map(Number);
      const eventEndDate = new Date(dayDetails.dayDate);
      eventEndDate.setHours(endHours ?? 0, endMinutes ?? 0, 0, 0);

      if (eventEndDate < now) {
        isExpired = true;
      }
    }

    return { ...event, isExpired };
  });

  const active = processed
    .filter((e) => !e.isExpired)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  const expired = processed
    .filter((e) => e.isExpired)
    .sort((a, b) => a.timeStart.localeCompare(b.timeStart));

  return [...active, ...expired];
});

// A keresés rászűrése a már rendezett listára
const filteredAndSortedEventsList = computed(() => {
  const query = debouncedSearchQuery.value.toLowerCase().trim();
  if (!query) return sortedEventsList.value;

  return sortedEventsList.value.filter(
    (event) =>
      event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query),
  );
});

watch(filteredAndSortedEventsList, (newList) => {
  const currentExistsInNewList = newList.find((e) => e.id === selectedEvent.value?.id);
  if (newList.length > 0 && !currentExistsInNewList) {
    selectedEvent.value = newList[0] as ClientEvent;
  } else if (newList.length === 0) {
    selectedEvent.value = null;
  }
});

const displayParticipants = computed(() => selectedEvent.value?.members?.slice(0, 5) || []);
const extraParticipantsCount = computed(() =>
  Math.max(0, (selectedEvent.value?.members?.length || 0) - 5),
);

/* EVENT HANDLERS */
const handleDeleteCurrentGroup = () => {
  const group = selectedGroupDetails.value;
  if (!group) return;

  const groupToDelete: GroupOutDto = {
    uuid: group.uuid,
    name: group.name,
    role: group.role ?? 'leader',
    current_size: group.current_size ?? 1,
    created_at: group.created_at ?? '',
  };
  groupsStore.openDeleteModal(groupToDelete);
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
</script>
