<!-- frontend/app/components/views/desktop/events/EventsDesktop.vue -->
<template>
  <div :class="appConfig.calendar.eventsWrapper">
    <div :class="appConfig.calendar.eventsHeaderRow">
      <div :class="appConfig.calendar.headerActionLeft">
        <UTooltip v-if="isCurrentUserLeader" text="Delete Group"
          ><UButton
            icon="i-heroicons-trash"
            variant="glassIconButtonDanger"
            @click="$emit('delete-group')"
        /></UTooltip>
        <UTooltip text="Leave Group"
          ><UButton
            icon="i-heroicons-arrow-right-on-rectangle"
            variant="glassIconButtonDanger"
            @click="$emit('leave-group')"
        /></UTooltip>
      </div>

      <div :class="appConfig.calendar.headerCenter">
        <UPopover v-model:open="isGroupDropdownOpen">
          <UButton
            variant="ghost"
            class="group flex items-center gap-2 p-0 hover:bg-transparent cursor-pointer outline-none"
          >
            <h1 :class="appConfig.typography.pageTitle">
              {{
                isLoadingGroups
                  ? 'Loading...'
                  : selectedGroupDetails?.name || CONST_SELECT_GROUP_PROMPT
              }}
            </h1>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-surface-500 transition-transform duration-200"
              :class="{ 'rotate-180': isGroupDropdownOpen }"
            />
          </UButton>
          <template #content>
            <div
              :class="[
                appConfig.ui.wideDropdownMenu.slots.content,
                'max-h-[50vh] overflow-y-auto custom-scrollbar',
              ]"
            >
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
        <p :class="appConfig.typography.pageSubtitle" class="mt-0">{{ CONST_CALENDAR_SUBTITLE }}</p>
      </div>

      <div :class="appConfig.calendar.headerActionRight">
        <UTooltip :text="CONST_TOOLTIP_MEMBERS ?? 'Members'">
          <UButton icon="i-heroicons-users" variant="glassIconButton" :to="membersRoute" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_CALENDAR ?? 'Calendar'">
          <UButton
            icon="i-heroicons-calendar"
            variant="glassIconButton"
            class="text-brand-500"
            :to="eventsRoute"
          />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_PHOTOS ?? 'Photos'">
          <UButton icon="i-heroicons-photo" variant="glassIconButton" :to="mediaRoute" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_DOCUMENTS ?? 'Documents'">
          <UButton
            icon="i-heroicons-document-text"
            variant="glassIconButton"
            :to="documentsRoute"
          />
        </UTooltip>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 w-full shrink-0">
      <div class="flex items-center gap-4 w-full sm:w-auto flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          :placeholder="CONST_SEARCH_EVENTS_PLACEHOLDER"
          variant="search"
          :ui="{ leading: 'pl-3' }"
          class="w-full max-w-xs"
        />
        <UPopover v-model:open="isFilterOpen">
          <UTooltip :text="CONST_TOOLTIP_FILTER_EVENTS"
            ><UButton icon="i-heroicons-funnel" label="Filter" variant="glassButton"
          /></UTooltip>
          <template #content>
            <div :class="appConfig.calendar.filterDropdownContent">
              <div :class="appConfig.calendar.filterFormGroup">
                <div>
                  <label :class="appConfig.calendar.filterLabel">{{ CONST_START_DATE_LABEL }}</label
                  ><input
                    v-model="filterStartDate"
                    type="date"
                    :class="appConfig.calendar.filterDateInput"
                  />
                </div>
                <div>
                  <label :class="appConfig.calendar.filterLabel">{{ CONST_END_DATE_LABEL }}</label
                  ><input
                    v-model="filterEndDate"
                    type="date"
                    :class="appConfig.calendar.filterDateInput"
                  />
                </div>
                <div :class="appConfig.calendar.filterButtonWrapper">
                  <div :class="appConfig.calendar.filterButtonWrapper">
                    <UButton
                      label="Clear Filter"
                      variant="smallHollowActionButton"
                      :class="[
                        filterStartDate || filterEndDate
                          ? 'text-error-500 ring-error-500/40 hover:bg-error-500/20 cursor-pointer'
                          : 'text-dark-text/40 ring-dark-text/20 bg-transparent hover:bg-transparent opacity-60 cursor-not-allowed',
                      ]"
                      :disabled="!filterStartDate && !filterEndDate"
                      @click="clearFilters"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UPopover>
        <UTooltip :text="showOnlyActiveEvents ? 'Show All Events' : 'Hide Expired Events'">
          <UButton
            icon="i-heroicons-clock"
            :label="showOnlyActiveEvents ? 'Active' : 'All'"
            :variant="showOnlyActiveEvents ? 'glassOutlineButton' : 'glassButton'"
            :class="[
              showOnlyActiveEvents ? 'ring-2 ring-success-500 text-success-600' : '',
              'shrink-0 whitespace-nowrap px-4 py-2 min-w-22!',
            ]"
            @click="showOnlyActiveEvents = !showOnlyActiveEvents"
          />
        </UTooltip>
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

    <div :class="appConfig.calendar.eventsGrid">
      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnDays]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tl-xl']">
          {{ CONST_DAYS_HEADER }}
        </div>
        <div :class="appConfig.calendar.columnBody">
          <div v-if="isLoadingDays" class="p-4 text-center text-sm opacity-60">
            {{ CONST_LOADING_DAYS_MSG }}
          </div>
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

      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnEvents]">
        <div :class="appConfig.calendar.columnHeader">
          <span class="uppercase">{{ CONST_EVENTS_HEADER }}</span>
          <span v-if="selectedDayDetails">{{ selectedDayDetails.date }}</span>
        </div>
        <div :class="appConfig.calendar.columnBody">
          <div v-if="isLoadingEvents" class="p-4 text-center text-sm opacity-60">
            {{ CONST_LOADING_EVENTS_MSG }}
          </div>
          <template v-else>
            <div
              v-for="event in filteredAndSortedEventsList"
              :key="event.uuid"
              :class="[
                appConfig.calendar.listItem,
                appConfig.calendar.listItemHover,
                selectedEvent?.uuid === event.uuid ? appConfig.calendar.eventListItemSelected : '',
                event.isExpired ? appConfig.calendar.expiredItemWrapper : '',
                'group relative flex items-center justify-between',
              ]"
              @click="$emit('update:selected-event', event)"
            >
              <div :class="appConfig.calendar.eventItemWrapper" class="flex-1 min-w-0 pr-2 gap-3!">
                <UTooltip :text="event.is_private ? 'Private Event' : 'Public Event'">
                  <UIcon
                    :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                    class="w-5 h-5 text-dark-text/70 shrink-0"
                  />
                </UTooltip>
                <span
                  :class="[
                    appConfig.calendar.eventItemTitle,
                    event.isExpired ? appConfig.calendar.expiredItemText : '',
                  ]"
                  class="truncate"
                  >{{ event.title }}</span
                >
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span :class="appConfig.calendar.eventItemTime"
                  >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                >
              </div>
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              class="p-8 text-center text-sm text-dark-text/60 font-medium flex flex-col items-center justify-center h-48 gap-2"
            >
              <UIcon name="i-heroicons-calendar" class="w-8 h-8 opacity-40" />
              <span>{{ searchQuery ? CONST_NO_MATCHING_EVENTS_MSG : CONST_NO_EVENTS_MSG }}</span>
            </div>
          </template>
        </div>
      </div>

      <div :class="[appConfig.calendar.columnBase, appConfig.calendar.columnPreview]">
        <div :class="[appConfig.calendar.columnHeader, 'rounded-tr-xl']">
          {{ CONST_EVENT_PREVIEW_HEADER }}
        </div>
        <div
          v-if="selectedEvent"
          :class="[appConfig.calendar.previewWrapper, selectedEvent.isExpired ? 'opacity-70' : '']"
        >
          <div :class="appConfig.calendar.previewTitleRow" class="justify-between">
            <div :class="appConfig.calendar.previewTypeWrapper">
              <UIcon
                :name="selectedEvent.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">{{
                selectedEvent.is_private ? CONST_PRIVATE_LBL : CONST_GROUP_EVENT_LBL
              }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UTooltip
                v-if="selectedEvent.creator?.email === currentUserEmail && selectedEvent.is_private"
                text="Add Members"
              >
                <UButton
                  icon="i-heroicons-user-plus"
                  variant="ghostBrandIconButton"
                  class="text-dark-text/80 hover:text-brand-500 p-1"
                  @click="$emit('open-add-members', selectedEvent)"
                />
              </UTooltip>
              <UTooltip v-if="canManageEvent(selectedEvent)" text="Delete Event">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  class="text-error-500 hover:text-error-600"
                  @click="$emit('open-delete-event', selectedEvent)"
                />
              </UTooltip>
              <UTooltip v-if="canLeaveEvent(selectedEvent)" text="Leave Event">
                <UButton
                  icon="i-heroicons-arrow-right-on-rectangle"
                  variant="ghostDangerIconButton"
                  class="text-error-500 hover:text-error-600"
                  @click="$emit('open-leave-event', selectedEvent)"
                />
              </UTooltip>
            </div>
          </div>
          <h2 :class="appConfig.calendar.previewMainTitle">
            {{ selectedEvent.title }}
            <span v-if="selectedEvent.isExpired" :class="appConfig.calendar.previewExpiredBadge"
              >Expired</span
            >
          </h2>

          <div :class="appConfig.calendar.previewMetaRow">
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_CREATOR_LBL }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                selectedEvent.creator?.username
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_DATE_LBL }}</span>
              <span
                v-if="
                  new Date(selectedEvent.start_time).toLocaleDateString() ===
                  new Date(selectedEvent.end_time).toLocaleDateString()
                "
                :class="appConfig.calendar.metaValue"
              >
                {{ new Date(selectedEvent.start_time).toLocaleDateString() }}
              </span>
              <span v-else :class="appConfig.calendar.metaValue">
                {{ new Date(selectedEvent.start_time).toLocaleDateString() }} -
                {{ new Date(selectedEvent.end_time).toLocaleDateString() }}
              </span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_TIME_LBL }}</span>
              <span
                v-if="selectedEvent.timeStartFormatted === selectedEvent.timeEndFormatted"
                :class="appConfig.calendar.metaValue"
              >
                {{ selectedEvent.timeStartFormatted }}
              </span>
              <span v-else :class="appConfig.calendar.metaValue">
                {{ selectedEvent.timeStartFormatted }} - {{ selectedEvent.timeEndFormatted }}
              </span>
            </div>

            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_MEMBERS_LBL }}</span>
              <div :class="appConfig.calendar.participantsGroup">
                <template v-if="selectedEvent.is_private">
                  <div
                    :class="[
                      appConfig.calendar.participantsAvatars,
                      (selectedEvent.members?.length || 0) > 5
                        ? appConfig.calendar.participantsOverlap
                        : appConfig.calendar.participantsGap,
                    ]"
                  >
                    <UTooltip
                      v-for="p in selectedEvent.members?.slice(0, 5)"
                      :key="p.uuid"
                      :text="p.username"
                    >
                      <UAvatar
                        :alt="p.username"
                        :src="p.profile_image_url || undefined"
                        icon="i-heroicons-user"
                        :class="appConfig.calendar.participantAvatar"
                        @click="$emit('open-user-profile', p)"
                      />
                    </UTooltip>
                    <UTooltip
                      v-if="(selectedEvent.members?.length || 0) > 5"
                      :text="
                        '+' +
                        ((selectedEvent.members?.length || 0) - 5).toString() +
                        ' more participants'
                      "
                    >
                      <div
                        :class="appConfig.calendar.participantMoreBadge"
                        @click="$emit('open-all-participants')"
                      >
                        +{{ (selectedEvent.members?.length || 0) - 5 }}
                      </div>
                    </UTooltip>
                  </div>
                  <UButton
                    variant="link"
                    :class="appConfig.calendar.metaValueLink"
                    @click="$emit('open-all-participants')"
                    >Show participants</UButton
                  >
                </template>
                <template v-else>
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-bold text-dark-text">Everyone</span>
                  </div>
                </template>
              </div>
            </div>
            <div :class="[appConfig.calendar.metaRowItem, 'mt-2']">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_DESC_LBL }}</span>
              <span :class="appConfig.calendar.metaValue">{{ selectedEvent.description }}</span>
            </div>
            <div
              v-if="selectedEvent.address || selectedEvent.latitude !== null"
              :class="[appConfig.calendar.metaRowItem, 'mt-4', 'flex-col', 'items-start', 'gap-2']"
            >
              <span :class="appConfig.calendar.metaLabel">{{ CONST_LOC_LBL }}</span>
              <span v-if="selectedEvent.address" :class="appConfig.calendar.metaValue">
                {{ selectedEvent.address }}
              </span>
              <div
                v-if="
                  selectedEvent.latitude !== null &&
                  selectedEvent.latitude !== undefined &&
                  selectedEvent.longitude !== null &&
                  selectedEvent.longitude !== undefined
                "
                class="w-full h-48 rounded-lg overflow-hidden border border-gray-200 mt-1 relative z-0"
              >
                <ClientOnly>
                  <MapEventMapPreview
                    :latitude="selectedEvent.latitude"
                    :longitude="selectedEvent.longitude"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
        <div v-else :class="appConfig.calendar.emptyPreview">{{ CONST_SELECT_EVENT_PROMPT }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import type { GroupOutDto } from '~/types/groups.type';
import type { EventCreatorDto, UiDay, UiEvent } from '~/types/events.type';
import { CONST_LOC_LBL } from '~/utils/constants/events.constants';

const props = defineProps<{
  userGroupsList: GroupOutDto[];
  selectedGroupUuid?: string;
  selectedGroupDetails?: GroupOutDto;
  selectedDayId?: string;
  selectedEvent: UiEvent | null | undefined;
  isLoadingGroups: boolean;
  isLoadingDays: boolean;
  isLoadingEvents: boolean;
  sortedDaysList: UiDay[];
  filteredAndSortedEventsList: UiEvent[];
  selectedDayDetails?: UiDay;
  isCurrentUserLeader: boolean;
  currentUserEmail?: string;
}>();

const appConfig = useAppConfig();

defineEmits<{
  (e: 'select-group', uuid: string): void;
  (e: 'update:selected-day-id', id: string | undefined): void;
  (e: 'update:selected-event', event: UiEvent | null): void;
  (
    e: 'delete-group' | 'leave-group' | 'apply-filter' | 'open-add-event' | 'open-all-participants',
  ): void;
  (e: 'open-delete-event' | 'open-leave-event' | 'open-add-members', event: UiEvent): void;
  (e: 'open-user-profile', user: EventCreatorDto): void;
}>();

const canManageEvent = (event: UiEvent | null | undefined) => {
  if (!event) return false;
  return props.isCurrentUserLeader || event.creator?.email === props.currentUserEmail;
};

const canLeaveEvent = (event: UiEvent | null | undefined) => {
  if (!event) return false;
  if (event.creator?.email === props.currentUserEmail) return false;
  return event.members?.some((m) => m.email === props.currentUserEmail) ?? false;
};

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });
const showOnlyActiveEvents = defineModel<boolean>('showOnlyActiveEvents', { default: true });

const clearFilters = () => {
  filterStartDate.value = '';
  filterEndDate.value = '';
};

// Contextual nav
const membersRoute = computed(() =>
  props.selectedGroupUuid ? `/groups/${props.selectedGroupUuid}/members` : '/groups',
);
const eventsRoute = computed(() =>
  props.selectedGroupUuid ? `/events?groupId=${props.selectedGroupUuid}` : '/events',
);
const mediaRoute = computed(() =>
  props.selectedGroupUuid ? `/files/media?groupId=${props.selectedGroupUuid}` : '/files/media',
);
const documentsRoute = computed(() =>
  props.selectedGroupUuid
    ? `/files/documents?groupId=${props.selectedGroupUuid}`
    : '/files/documents',
);
</script>
