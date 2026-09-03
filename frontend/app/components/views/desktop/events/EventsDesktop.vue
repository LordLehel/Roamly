<!-- frontend/app/components/views/desktop/events/EventsDesktop.vue -->
<template>
  <div :class="appConfig.calendar.eventsWrapper">
    <!-- EVENT HEADER -->
    <div :class="appConfig.calendar.eventsHeaderRow">
      <div :class="appConfig.calendar.headerActionLeft">
        <UTooltip v-if="isCurrentUserLeader" text="Delete Group">
          <UButton
            icon="i-heroicons-trash"
            variant="glassIconButtonDanger"
            @click="$emit('delete-group')"
          />
        </UTooltip>
        <UTooltip text="Leave Group">
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle"
            variant="glassIconButtonDanger"
            @click="$emit('leave-group')"
          />
        </UTooltip>
      </div>

      <!-- CENTER TITLE -->
      <div :class="appConfig.calendar.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <UButton
            variant="ghost"
            class="group flex items-center gap-2 p-0 hover:bg-transparent cursor-pointer outline-none"
          >
            <h1 :class="appConfig.typography.pageTitle">
              {{ isLoadingGroups ? 'Loading...' : selectedGroupDetails?.name || 'Select a Group' }}
            </h1>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-surface-500 transition-transform duration-200"
              :class="{ 'rotate-180': isGroupDropdownOpen }"
            />
          </UButton>

          <template #content>
            <div :class="appConfig.ui.wideDropdownMenu.slots.content">
              <button
                v-for="group in userGroupsList"
                :key="group.uuid"
                :class="appConfig.ui.wideDropdownMenu.slots.item"
                @click="$emit('select-group', group.uuid)"
              >
                <UIcon
                  :name="
                    group.uuid === selectedGroupUuid
                      ? 'i-heroicons-check'
                      : 'i-heroicons-user-group'
                  "
                  :class="appConfig.ui.wideDropdownMenu.slots.itemLeadingIcon"
                />
                <span>{{ group.name }}</span>
              </button>
            </div>
          </template>
        </UPopover>

        <p :class="appConfig.typography.pageSubtitle" class="mt-0">Calendar</p>
      </div>

      <!-- RIGHT ACTIONS -->
      <div :class="appConfig.calendar.headerActionRight">
        <UTooltip text="Members">
          <UButton icon="i-heroicons-users" variant="glassIconButton" to="/" />
        </UTooltip>
        <UTooltip text="Calendar">
          <UButton icon="i-heroicons-calendar" variant="glassIconButtonBrand" to="/events" />
        </UTooltip>
        <UTooltip text="Photos">
          <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
        </UTooltip>
        <UTooltip text="Documents">
          <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
        </UTooltip>
      </div>
    </div>

    <!-- TOOLBAR -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 w-full shrink-0">
      <div class="flex items-center gap-4 w-full sm:w-auto flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search events..."
          variant="search"
          class="w-full max-w-xs"
        />

        <UPopover v-model:open="isFilterOpen">
          <UTooltip text="Filter">
            <UButton icon="i-heroicons-funnel" label="Filter" variant="glassButton" />
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
                    @click="$emit('apply-filter')"
                  />
                </div>
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <div class="shrink-0 w-full sm:w-auto flex justify-end">
        <UButton
          icon="i-heroicons-calendar-days"
          label="Add Event"
          variant="actionOkButton"
          class="h-10 text-md px-6"
          @click="$emit('open-add-event')"
        >
          <template #leading><UIcon name="i-heroicons-plus" class="w-5 h-5 mr-1" /></template>
        </UButton>
      </div>
    </div>

    <!-- MAIN CONTENT GRID -->
    <div :class="appConfig.calendar.eventsGrid">
      <!-- COLUMN 1: DAYS -->
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnDays]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tl-xl']">Days</div>
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
              @click="$emit('update:selected-day-id', day.id)"
            >
              <span class="font-medium text-dark-text">{{ day.date }} ({{ day.dayOfWeek }})</span>
            </div>
            <div v-if="!sortedDaysList.length" class="p-4 text-center text-sm opacity-60">
              No days added.
            </div>
          </template>
        </div>
      </div>

      <!-- COLUMN 2: EVENTS LIST -->
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnEvents]">
        <div :class="appConfig.calendar.columnHeader">
          <span class="uppercase">Events</span>
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
              @click="$emit('update:selected-event', event)"
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
                  >{{ event.title }}</span
                >
              </div>
              <span :class="appConfig.calendar.eventItemTime"
                >{{ event.timeStart }} - {{ event.timeEnd }}</span
              >
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              class="p-6 text-center text-sm text-dark-text/60 font-medium"
            >
              {{ searchQuery ? 'No matching events found.' : 'No events found.' }}
            </div>
          </template>
        </div>
      </div>

      <!-- COLUMN 3: EVENT PREVIEW -->
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnPreview]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tr-xl']">Events - extended</div>
        <div
          v-if="selectedEvent"
          :class="[appConfig.calendar.previewWrapper, selectedEvent.isExpired ? 'opacity-70' : '']"
        >
          <div :class="appConfig.calendar.previewTitleRow">
            <div :class="appConfig.calendar.previewTypeWrapper">
              <UIcon
                :name="selectedEvent.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'"
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">{{
                selectedEvent.isPrivate ? 'Private' : 'Group'
              }}</span>
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
                @click="$emit('open-delete-event', selectedEvent)"
              />
            </UTooltip>
            <div v-else class="w-8"></div>
          </div>

          <div :class="appConfig.calendar.previewMetaRow">
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Creator:</span>
              <span :class="appConfig.calendar.metaValue">{{
                selectedEvent.creator?.username
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Date:</span>
              <span :class="appConfig.calendar.metaValue">{{
                selectedDayDetails?.date || 'N/A'
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Time:</span>
              <span :class="appConfig.calendar.metaValue"
                >{{ selectedEvent.timeStart }} - {{ selectedEvent.timeEnd }}</span
              >
            </div>

            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">Members:</span>
              <div :class="appConfig.calendar.participantsGroup">
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
                      @click="$emit('open-user-profile', p)"
                    />
                  </UTooltip>
                  <UTooltip
                    v-if="extraParticipantsCount > 0"
                    :text="'+' + extraParticipantsCount.toString() + ' more participants'"
                  >
                    <div
                      :class="appConfig.calendar.participantMoreBadge"
                      @click="$emit('open-all-participants')"
                    >
                      +{{ extraParticipantsCount }}
                    </div>
                  </UTooltip>
                </div>
                <span
                  v-if="extraParticipantsCount > 0"
                  :class="appConfig.calendar.participantViewAll"
                  @click="$emit('open-all-participants')"
                  >View all</span
                >
              </div>
            </div>

            <div :class="[appConfig.calendar.metaRowItem, 'mt-2']">
              <span :class="appConfig.calendar.metaLabel">Description:</span>
              <span :class="appConfig.calendar.metaValue">{{ selectedEvent.description }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Location:</span>
              <span :class="[appConfig.calendar.metaValue, appConfig.calendar.metaValueLink]">{{
                selectedEvent.location
              }}</span>
            </div>
          </div>

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

        <div v-else :class="appConfig.calendar.emptyPreview">Select an event to view details.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import type { GroupOutDto } from '~/types/groups.type';
import type { MockUser } from '~/utils/apiMock.utils';
import type { ProcessedDay, ClientEvent } from '~/utils/sort.utils';

// TS18046 fix: Explicit type casting
const appConfig = useAppConfig();

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

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });
</script>
