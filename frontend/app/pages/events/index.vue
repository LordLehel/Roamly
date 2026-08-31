<!-- frontend/app/pages/events/index.vue -->
<template>
  <div :class="appConfig.calendar.container">
    <!-- CÍMSOR -->
    <div :class="appConfig.calendar.headerRow">
      <div class="flex items-center gap-4">
        <UButton icon="i-heroicons-funnel" :label="CONST_FILTER_LABEL" variant="glassButton" />

        <UButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-user-plus"
          variant="glassIconButton"
          @click="groupsStore.openInviteModal()"
        />

        <UButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-trash"
          variant="glassIconButtonDanger"
          @click="handleDeleteCurrentGroup"
        />

        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="glassIconButtonDanger"
          @click="handleLeaveCurrentGroup"
        />
      </div>

      <!-- Group Selection Dropdown -->
      <div :class="appConfig.calendar.groupSelectWrapper">
        <USelectMenu
          v-model="selectedGroupUuid"
          :options="userGroupsList"
          value-attribute="uuid"
          option-attribute="name"
          :searchable="false"
          class="w-full flex justify-center"
        >
          <template #default>
            <div :class="appConfig.calendar.groupSelectTrigger">
              <h1 :class="appConfig.calendar.groupSelectTitle">
                {{ selectedGroupDetails?.name || CONST_SELECT_GROUP_PROMPT }}
              </h1>
              <UIcon name="i-heroicons-chevron-down" :class="appConfig.calendar.groupSelectIcon" />
            </div>
          </template>
        </USelectMenu>

        <p :class="appConfig.typography.pageSubtitle">{{ CONST_CALENDAR_SUBTITLE }}</p>
      </div>

      <div class="flex items-center gap-4">
        <UButton icon="i-heroicons-users" variant="glassIconButton" to="/" />
        <UButton icon="i-heroicons-calendar" variant="glassIconButtonBrand" to="/events" />
        <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
        <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
      </div>
    </div>

    <!-- MAIN CONTENT GRID (3 Columns) -->
    <div :class="appConfig.calendar.mainGrid">
      <!-- 1. COLUMN: DAYS -->
      <div
        :class="[
          appConfig.calendar.columnBase,
          'col-span-12 md:col-span-3 border-r bg-surface-500/20',
        ]"
      >
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tl-xl']">
          {{ CONST_DAYS_HEADER }}
        </div>

        <div :class="appConfig.calendar.columnBody">
          <div
            v-for="day in daysList"
            :key="day.id"
            :class="[
              appConfig.calendar.listItem,
              selectedDayId === day.id
                ? appConfig.calendar.listItemSelected
                : appConfig.calendar.listItemHover,
            ]"
            @click="selectedDayId = day.id"
          >
            <span class="font-medium text-dark-text">{{ day.date }} ({{ day.dayOfWeek }})</span>

            <UButton
              icon="i-heroicons-minus"
              variant="ghostDangerIconButton"
              @click.stop="eventsStore.openDeleteDayModal(day)"
            ></UButton>
          </div>
          <div class="flex items-center justify-center mt-4">
            <UButton
              v-if="isCurrentUserLeader"
              icon="i-heroicons-plus"
              variant="glassIconButton"
              class="bg-surface-500/0"
              @click="eventsStore.openAddDayModal()"
            />
          </div>
        </div>
      </div>

      <!-- 2. COLUMN: EVENTS LIST -->
      <div
        :class="[
          appConfig.calendar.columnBase,
          'col-span-12 md:col-span-4 border-r bg-surface-500/10',
        ]"
      >
        <div :class="appConfig.calendar.columnHeader">
          <span class="uppercase">{{ CONST_EVENTS_HEADER }}</span>
          <span v-if="selectedDayDetails">{{ selectedDayDetails.date }}</span>
        </div>

        <div :class="appConfig.calendar.columnBody">
          <div
            v-for="event in eventsList"
            :key="event.id"
            :class="[
              appConfig.calendar.listItem,
              appConfig.calendar.listItemHover,
              selectedEvent?.id === event.id ? appConfig.calendar.eventListItemSelected : '',
            ]"
            @click="selectedEvent = event"
          >
            <div class="flex items-center gap-3">
              <UIcon
                :name="event.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'"
                class="w-5 h-5 text-dark-text/70"
              />
              <span class="font-semibold text-dark-text">{{ event.title }}</span>
            </div>
            <span class="text-xs text-dark-text/70 font-bold"
              >{{ event.timeStart }} - {{ event.timeEnd }}</span
            >
          </div>
          <div
            v-if="!eventsList?.length"
            class="p-6 text-center text-sm text-dark-text/60 font-medium"
          >
            {{ CONST_NO_EVENTS_MSG }}
          </div>
        </div>
      </div>

      <!-- 3. COLUMN: EVENT PREVIEW -->
      <div
        :class="[
          appConfig.calendar.columnBase,
          'col-span-12 md:col-span-5 bg-surface-500/20 overflow-y-auto',
        ]"
      >
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tr-xl']">
          {{ CONST_EVENT_PREVIEW_HEADER }}
        </div>

        <div v-if="selectedEvent" :class="appConfig.calendar.previewWrapper">
          <!-- Title & Delete -->
          <div :class="appConfig.calendar.previewTitleRow">
            <div class="flex items-center gap-2 text-dark-text/80">
              <UIcon
                :name="selectedEvent.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'"
                class="w-5 h-5"
              />
              <span class="text-sm font-medium">{{
                selectedEvent.isPrivate ? CONST_PRIVATE_LBL : CONST_GROUP_EVENT_LBL
              }}</span>
            </div>
            <h2 class="text-xl font-bold text-dark-text text-center flex-1">
              {{ selectedEvent.title }}
            </h2>
            <UButton
              v-if="hasPermissionToDelete"
              icon="i-heroicons-trash"
              variant="ghostDangerIconButton"
              @click="eventsStore.openDeleteEventModal(selectedEvent)"
            />
          </div>

          <!-- Metadata -->
          <div :class="appConfig.calendar.previewMetaRow">
            <div class="flex gap-2">
              <span class="font-bold w-20">{{ CONST_CREATOR_LBL }}</span>
              <span>{{ selectedEvent.creator?.username }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold w-20">{{ CONST_DATE_LBL }}</span>
              <span>{{ selectedDayDetails?.date || 'N/A' }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold w-20">{{ CONST_TIME_LBL }}</span>
              <span>{{ selectedEvent.timeStart }} - {{ selectedEvent.timeEnd }}</span>
            </div>

            <div class="flex gap-2 items-center">
              <span class="font-bold w-20">{{ CONST_MEMBERS_LBL }}</span>
              <div class="flex -space-x-2">
                <UAvatar
                  v-for="i in 5"
                  :key="i"
                  icon="i-heroicons-user"
                  size="sm"
                  class="ring-2 ring-surface-500"
                />
              </div>
            </div>

            <div class="flex gap-2">
              <span class="font-bold w-20">{{ CONST_DESC_LBL }}</span>
              <span class="flex-1">{{ selectedEvent.description }}</span>
            </div>
            <div class="flex gap-2">
              <span class="font-bold w-20">{{ CONST_LOC_LBL }}</span>
              <span class="text-brand-600 underline underline-offset-2">{{
                selectedEvent.location
              }}</span>
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
            >
            </iframe>
          </div>
        </div>

        <div v-else :class="appConfig.calendar.emptyPreview">
          {{ CONST_SELECT_EVENT_PROMPT }}
        </div>
      </div>
    </div>

    <!-- Modals -->
    <EventsModals />
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { ref, computed, watch } from 'vue';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery } from '~/queries/groups.query';
import { useGroupDaysQuery, useGroupEventsQuery } from '~/queries/events.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import EventsModals from '~/components/modals/EventsModals.vue';
import type { EventOutDto } from '~/types/events.type';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

// Dummy groups if backend returns empty
const dummyGroups: GroupOutDto[] = [
  { uuid: 'g1', name: 'Weekend Trip', role: 'leader', current_size: 4, created_at: '2026-08-20' },
  {
    uuid: 'g2',
    name: 'Summer Festival',
    role: 'member',
    current_size: 12,
    created_at: '2026-07-15',
  },
  {
    uuid: 'g3',
    name: 'Mountain Hiking',
    role: 'leader',
    current_size: 6,
    created_at: '2026-05-10',
  },
  { uuid: 'g4', name: 'Book Club', role: 'member', current_size: 8, created_at: '2026-01-22' },
  { uuid: 'g5', name: 'Tech Meetup', role: 'leader', current_size: 25, created_at: '2025-11-05' },
];

const { data: groupsData } = useGroupsQuery(50);

const userGroupsList = computed(() => {
  const items = groupsData.value?.items;
  if (items && items.length > 0) {
    return items;
  }
  return dummyGroups;
});

const selectedGroupUuid = ref<string | undefined>(undefined);

watch(
  () => userGroupsList.value,
  (groups) => {
    if (groups.length > 0 && !selectedGroupUuid.value) {
      selectedGroupUuid.value = groups[0].uuid;
    }
  },
  { immediate: true },
);

const selectedGroupDetails = computed(() => {
  const uuid = selectedGroupUuid.value;
  if (!uuid) return undefined;
  return userGroupsList.value.find((g) => g.uuid === uuid);
});

const isCurrentUserLeader = computed(() => {
  const group = selectedGroupDetails.value;
  if (!group || !group.role) return false;
  return group.role.toLowerCase() === 'leader';
});

const hasPermissionToDelete = computed(() => {
  const creatorName = selectedEvent.value?.creator?.username;
  const currentUserName = currentUser.value?.username;
  return (
    isCurrentUserLeader.value ||
    (!!creatorName && !!currentUserName && creatorName === currentUserName)
  );
});

const { data: daysData } = useGroupDaysQuery(selectedGroupUuid);
const daysList = computed(() => daysData.value || []);
const selectedDayId = ref<string | undefined>(undefined);

watch(
  () => daysList.value,
  (days) => {
    if (days.length > 0 && !selectedDayId.value) {
      selectedDayId.value = days[0].id;
    }
  },
  { immediate: true },
);

const selectedDayDetails = computed(() => daysList.value.find((d) => d.id === selectedDayId.value));

const { data: eventsData } = useGroupEventsQuery(selectedGroupUuid, selectedDayId);
const eventsList = computed(() => eventsData.value || []);
const selectedEvent = ref<EventOutDto | null>(null);

watch(selectedDayId, () => {
  selectedEvent.value = null;
});

const handleDeleteCurrentGroup = () => {
  const group = selectedGroupDetails.value;
  if (!group) return;

  const dummyGroupToDelete: GroupOutDto = {
    uuid: group.uuid,
    name: group.name,
    role: 'leader',
    current_size: group.current_size,
    created_at: group.created_at,
  };
  groupsStore.openDeleteModal(dummyGroupToDelete);
};

const handleLeaveCurrentGroup = () => {
  const group = selectedGroupDetails.value;
  if (!group) return;

  groupsStore.openLeaveModal(group);
};
</script>
