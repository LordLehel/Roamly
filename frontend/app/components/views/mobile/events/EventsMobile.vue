<!-- frontend/app/components/views/mobile/events/EventsMobile.vue -->
<template>
  <div class="flex flex-col flex-1 gap-4 w-full p-4 pb-20">
    <!-- TOP ACTION BUTTONS -->
    <div :class="config.calendar.mobileTopActions">
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

    <!-- MAIN WRAPPER -->
    <div :class="config.calendar.mobileMainWrapper">
      <!-- HEADER SECTION (Group Dropdown) -->
      <div :class="config.calendar.mobileHeader">
        <UPopover v-model:open="isGroupDropdownOpen" class="w-full">
          <UButton block variant="ghost" :class="config.calendar.mobileHeaderButton">
            <div :class="config.calendar.mobileHeaderTitleRow">
              <h1 :class="config.typography.pageTitle" class="text-2xl! truncate">
                {{
                  isLoadingGroups
                    ? (CONST_LOADING_TEXT ?? 'Loading...')
                    : selectedGroupDetails?.name || CONST_SELECT_GROUP_PROMPT
                }}
              </h1>
              <UIcon
                name="i-heroicons-chevron-down"
                class="w-5 h-5 text-surface-500 transition-transform duration-200"
                :class="{ 'rotate-180': isGroupDropdownOpen }"
              />
            </div>
            <p :class="config.typography.pageSubtitle" class="mt-0">
              {{ CONST_CALENDAR_SUBTITLE }}
            </p>
          </UButton>

          <template #content>
            <div :class="config.ui.wideDropdownMenu.slots.content">
              <button
                v-for="group in userGroupsList"
                :key="group.uuid"
                :class="config.ui.wideDropdownMenu.slots.item"
                @click="$emit('select-group', group.uuid)"
              >
                <UIcon
                  :name="
                    group.uuid === selectedGroupUuid
                      ? 'i-heroicons-check'
                      : 'i-heroicons-user-group'
                  "
                  :class="config.ui.wideDropdownMenu.slots.itemLeadingIcon"
                />
                <span>{{ group.name }}</span>
              </button>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- TOOLBAR SECTION (Filter, Search, Add) -->
      <div :class="config.calendar.mobileToolbar">
        <UPopover v-model:open="isFilterOpen">
          <UTooltip :text="CONST_TOOLTIP_FILTER_EVENTS">
            <UButton
              icon="i-heroicons-funnel"
              :label="CONST_FILTER_LABEL"
              variant="glassOutlineButton"
              :class="config.calendar.mobileFilterButton"
            />
          </UTooltip>
          <template #content>
            <div :class="config.calendar.filterDropdownContent" class="w-[calc(100vw-3rem)] mx-2">
              <div :class="config.calendar.filterFormGroup">
                <div>
                  <label :class="config.calendar.filterLabel">{{
                    CONST_START_DATE_LABEL ?? 'Start Date'
                  }}</label>
                  <input
                    v-model="filterStartDate"
                    type="date"
                    :class="config.calendar.filterDateInput"
                  />
                </div>
                <div>
                  <label :class="config.calendar.filterLabel">{{
                    CONST_END_DATE_LABEL ?? 'End Date'
                  }}</label>
                  <input
                    v-model="filterEndDate"
                    type="date"
                    :class="config.calendar.filterDateInput"
                  />
                </div>
                <div :class="config.calendar.filterButtonWrapper">
                  <UButton
                    :label="CONST_APPLY_FILTER_BTN ?? 'Apply Filter'"
                    variant="smallPrimaryActionButton"
                    @click="$emit('apply-filter')"
                  />
                </div>
              </div>
            </div>
          </template>
        </UPopover>

        <UInput
          v-model="searchQuery"
          :placeholder="CONST_SEARCH_EVENTS_PLACEHOLDER ?? 'Search events...'"
          variant="search"
          class="flex-1"
        />

        <UTooltip :text="CONST_TOOLTIP_ADD_EVENT ?? 'Add Event'">
          <UButton
            icon="i-heroicons-plus"
            variant="glassIconButtonHighlight"
            class="shrink-0 transition-colors w-10 h-10"
            @click="$emit('open-add-event')"
          />
        </UTooltip>
      </div>

      <div :class="config.calendar.mobileContentWrapper">
        <!-- DATE SELECTOR (Title-like Dropdown) -->
        <div class="w-full mt-2">
          <UPopover v-model:open="isDateDropdownOpen" class="w-full">
            <UButton block variant="glassOutlineButton" :class="config.calendar.mobileDateButton">
              <span>
                {{
                  selectedDayDetails
                    ? `${selectedDayDetails.date} (${selectedDayDetails.dayOfWeek})`
                    : CONST_SELECT_DATE_LABEL
                }}
              </span>
              <UIcon
                name="i-heroicons-chevron-up-down"
                class="w-5 h-5 text-dark-text/70 transition-transform duration-200"
                :class="{ 'rotate-180': isDateDropdownOpen }"
              />
            </UButton>
            <template #content>
              <div
                :class="config.ui.wideDropdownMenu.slots.content"
                class="w-[calc(100vw-3rem)] mx-2 max-h-64 overflow-y-auto mt-1"
              >
                <div v-if="isLoadingDays" class="p-4 text-center text-sm opacity-60">
                  {{ CONST_LOADING_DAYS_MSG ?? 'Loading days...' }}
                </div>
                <template v-else>
                  <button
                    v-for="day in sortedDaysList"
                    :key="day.id"
                    :class="[
                      config.ui.wideDropdownMenu.slots.item,
                      selectedDayId === day.id ? 'bg-brand-500/20' : '',
                      day.isExpired ? 'opacity-50 grayscale' : '',
                    ]"
                    @click="selectDay(day.id)"
                  >
                    <span>{{ day.date }} ({{ day.dayOfWeek }})</span>
                  </button>
                </template>
              </div>
            </template>
          </UPopover>
        </div>

        <!-- EVENTS LIST -->
        <div :class="config.calendar.mobileEventsWrapper">
          <div v-if="isLoadingEvents" class="p-4 text-center text-sm opacity-60">
            {{ CONST_LOADING_EVENTS_MSG ?? 'Loading events...' }}
          </div>
          <template v-else>
            <div
              v-for="(event, index) in filteredAndSortedEventsList"
              :key="event.id"
              :class="[
                config.calendar.mobileEventItem,
                event.isExpired ? 'opacity-50 grayscale' : '',
                index !== filteredAndSortedEventsList.length - 1
                  ? config.calendar.mobileEventItemBorder
                  : '',
              ]"
              @click="$emit('open-preview-modal', event)"
            >
              <div class="flex items-center gap-3">
                <UIcon
                  :name="event.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'"
                  class="w-5 h-5 text-dark-text/70"
                />
                <span
                  class="font-bold text-dark-text text-sm truncate max-w-37.5"
                  :class="event.isExpired ? 'line-through decoration-dark-text/40' : ''"
                  >{{ event.title }}</span
                >
              </div>
              <span class="text-xs font-bold text-dark-text/80 whitespace-nowrap">
                {{ event.timeStart }} - {{ event.timeEnd }}
              </span>
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              :class="config.calendar.mobileEmptyState"
            >
              {{
                searchQuery
                  ? (CONST_NO_MATCHING_EVENTS_MSG ?? 'No matching events found.')
                  : CONST_NO_EVENTS_MSG
              }}
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { ref } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupOutDto } from '~/types/groups.type';
import type { MockUser } from '~/utils/apiMock.utils';
import type { ProcessedDay, ClientEvent } from '~/utils/sort.utils';

/* CONSTANTS */
const config = useAppConfig();

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

const emit = defineEmits<{
  (e: 'select-group', uuid: string): void;
  (e: 'update:selected-day-id', id: string | undefined): void;
  (e: 'update:selected-event', event: ClientEvent | null): void;
  (
    e: 'delete-group' | 'leave-group' | 'apply-filter' | 'open-add-event' | 'open-all-participants',
  ): void;
  (e: 'open-delete-event' | 'open-preview-modal', event: ClientEvent): void;
  (e: 'open-user-profile', user: MockUser): void;
}>();

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });

const isDateDropdownOpen = ref(false);

const selectDay = (id: string) => {
  emit('update:selected-day-id', id);
  isDateDropdownOpen.value = false;
};
</script>
