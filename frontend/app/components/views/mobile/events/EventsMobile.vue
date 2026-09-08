<!-- frontend/app/components/views/mobile/events/EventsMobile.vue -->
<template>
  <div class="flex flex-col flex-1 gap-4 w-full p-4 pb-20">
    <div :class="appConfig.calendar.mobileTopActions">
      <UTooltip :text="CONST_TOOLTIP_MEMBERS ?? 'Members'"
        ><UButton icon="i-heroicons-users" variant="glassIconButton" to="/groups"
      /></UTooltip>
      <UTooltip :text="CONST_TOOLTIP_CALENDAR ?? 'Calendar'"
        ><UButton
          icon="i-heroicons-calendar"
          variant="glassIconButton"
          class="text-brand-500"
          to="/events"
      /></UTooltip>
      <UTooltip :text="CONST_TOOLTIP_PHOTOS ?? 'Photos'"
        ><UButton icon="i-heroicons-photo" variant="glassIconButton" to="/files/media"
      /></UTooltip>
      <UTooltip :text="CONST_TOOLTIP_DOCUMENTS ?? 'Documents'"
        ><UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/files/documents"
      /></UTooltip>
    </div>

    <div :class="appConfig.calendar.mobileMainWrapper">
      <div :class="appConfig.calendar.mobileHeader">
        <UPopover v-model:open="isGroupDropdownOpen" class="w-full" :popper="{ strategy: 'fixed' }">
          <UButton block variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="appConfig.typography.pageTitle" class="text-2xl! truncate">
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
            <p :class="appConfig.typography.pageSubtitle" class="mt-0">
              {{ CONST_CALENDAR_SUBTITLE }}
            </p>
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
      </div>

      <div :class="appConfig.calendar.mobileToolbar">
        <UPopover
          v-model:open="isFilterOpen"
          :popper="{ strategy: 'fixed', placement: 'bottom-end' }"
        >
          <UTooltip :text="CONST_TOOLTIP_FILTER_EVENTS"
            ><UButton
              icon="i-heroicons-funnel"
              label="Filter"
              variant="glassOutlineButton"
              :class="appConfig.calendar.mobileFilterButton"
          /></UTooltip>
          <template #content>
            <div
              :class="appConfig.calendar.filterDropdownContent"
              class="w-[calc(100vw-3rem)] mx-2"
            >
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
          </template>
        </UPopover>
        <UInput
          v-model="searchQuery"
          :placeholder="CONST_SEARCH_EVENTS_PLACEHOLDER"
          variant="search"
          class="flex-1"
        />
        <UTooltip text="Add Event">
          <UButton
            icon="i-heroicons-plus"
            variant="glassIconButton"
            @click="$emit('open-add-event')"
          />
        </UTooltip>
      </div>

      <div :class="appConfig.calendar.mobileContentWrapper">
        <div class="w-full mt-2 flex items-center gap-2">
          <UPopover
            v-model:open="isDateDropdownOpen"
            class="flex-1 min-w-0"
            :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
          >
            <UButton
              block
              variant="glassOutlineButton"
              :class="appConfig.calendar.mobileDateButton"
            >
              <span class="truncate">{{
                selectedDayDetails
                  ? `${selectedDayDetails.date} (${selectedDayDetails.dayOfWeek})`
                  : CONST_SELECT_DATE_LABEL
              }}</span>
              <UIcon
                name="i-heroicons-chevron-up-down"
                class="w-5 h-5 text-dark-text/70 transition-transform duration-200"
                :class="{ 'rotate-180': isDateDropdownOpen }"
              />
            </UButton>
            <template #content>
              <div
                :class="appConfig.ui.wideDropdownMenu.slots.content"
                class="w-[calc(100vw-3rem)] mx-2 max-h-64 overflow-y-auto mt-1"
              >
                <div v-if="isLoadingDays" class="p-4 text-center text-sm opacity-60">
                  {{ CONST_LOADING_DAYS_MSG }}
                </div>
                <template v-else>
                  <button
                    v-for="day in sortedDaysList"
                    :key="day.id"
                    :class="[
                      appConfig.ui.wideDropdownMenu.slots.item,
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

        <div :class="appConfig.calendar.mobileEventsWrapper">
          <div v-if="isLoadingEvents" class="p-4 text-center text-sm opacity-60">
            {{ CONST_LOADING_EVENTS_MSG }}
          </div>
          <template v-else>
            <div
              v-for="(event, index) in filteredAndSortedEventsList"
              :key="event.uuid"
              :class="[
                appConfig.calendar.mobileEventItem,
                event.isExpired ? 'opacity-50 grayscale' : '',
                index !== filteredAndSortedEventsList.length - 1
                  ? appConfig.calendar.mobileEventItemBorder
                  : '',
              ]"
              @click="$emit('open-preview-modal', event)"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0 pr-2">
                <UTooltip :text="event.is_private ? CONST_PRIVATE_LBL : CONST_GROUP_EVENT_LBL">
                  <UIcon
                    :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                    class="w-5 h-5 text-dark-text/70 shrink-0"
                  />
                </UTooltip>
                <span
                  class="font-bold text-dark-text text-sm truncate"
                  :class="event.isExpired ? 'line-through decoration-dark-text/40' : ''"
                  >{{ event.title }}</span
                >
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-xs font-bold text-dark-text/80 whitespace-nowrap"
                  >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                >
              </div>
            </div>
            <div
              v-if="!filteredAndSortedEventsList?.length"
              :class="appConfig.calendar.mobileEmptyState"
              class="flex flex-col items-center justify-center py-12 gap-2"
            >
              <UIcon name="i-heroicons-calendar" class="w-8 h-8 opacity-40" />
              <span>{{ searchQuery ? CONST_NO_MATCHING_EVENTS_MSG : CONST_NO_EVENTS_MSG }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupOutDto } from '~/types/groups.type';
import type { EventCreatorDto, UiDay, UiEvent } from '~/types/events.type';

defineProps<{
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

const emit = defineEmits<{
  (e: 'select-group', uuid: string): void;
  (e: 'update:selected-day-id', id: string | undefined): void;
  (e: 'update:selected-event', event: UiEvent | null): void;
  (
    e: 'delete-group' | 'leave-group' | 'apply-filter' | 'open-add-event' | 'open-all-participants',
  ): void;
  (
    e: 'open-delete-event' | 'open-leave-event' | 'open-add-members' | 'open-preview-modal',
    event: UiEvent,
  ): void;
  (e: 'open-user-profile', user: EventCreatorDto): void;
}>();

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterStartDate = defineModel<string>('filterStartDate', { default: '' });
const filterEndDate = defineModel<string>('filterEndDate', { default: '' });
const isGroupDropdownOpen = defineModel<boolean>('isGroupDropdownOpen', { default: false });
const isFilterOpen = defineModel<boolean>('isFilterOpen', { default: false });
const showOnlyActiveEvents = defineModel<boolean>('showOnlyActiveEvents', { default: true });

const isDateDropdownOpen = ref(false);

const selectDay = (id: string) => {
  emit('update:selected-day-id', id);
  isDateDropdownOpen.value = false;
};

const clearFilters = () => {
  filterStartDate.value = '';
  filterEndDate.value = '';
};
</script>
