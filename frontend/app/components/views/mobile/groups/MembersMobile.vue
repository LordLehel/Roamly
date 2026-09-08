<!-- frontend/app/components/views/mobile/groups/MembersMobile.vue -->
<template>
  <div :class="[appConfig.layout.pageWrapper, 'px-4 py-6']">
    <!-- HEADER & SEARCH SECTION -->
    <div class="flex flex-col gap-6">
      <!-- NAV ACTIONS (Members, Calendar, Photos, Docs) -->
      <div class="flex justify-between items-center w-full">
        <UTooltip :text="CONST_TOOLTIP_MEMBERS ?? 'Members'"
          ><UButton
            icon="i-heroicons-users"
            variant="glassIconButton"
            class="text-brand-500"
            to="/groups"
        /></UTooltip>
        <UTooltip :text="CONST_TOOLTIP_CALENDAR ?? 'Calendar'"
          ><UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/events"
        /></UTooltip>
        <UTooltip :text="CONST_TOOLTIP_PHOTOS ?? 'Photos'"
          ><UButton icon="i-heroicons-photo" variant="glassIconButton" to="/media"
        /></UTooltip>
        <UTooltip :text="CONST_TOOLTIP_DOCUMENTS ?? 'Documents'"
          ><UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/documents"
        /></UTooltip>
      </div>

      <!-- TITLE & ACTIONS -->
      <div class="flex flex-col items-center gap-1 my-2">
        <div class="flex items-center gap-2">
          <h1 :class="appConfig.typography.pageTitle">
            {{ (groupInfos?.name || CONST_LOADING_TEXT) ?? 'Loading...' }}
          </h1>
          <UTooltip v-if="isCurrentUserLeader" :text="CONST_TOOLTIP_EDIT_GROUP ?? 'Edit Group'">
            <UButton
              icon="i-heroicons-pencil"
              variant="ghostBrandIconButton"
              class="w-6! h-6! p-0"
              @click="groupsStore.openUpdateModal(groupInfos?.name || '')"
            />
          </UTooltip>
        </div>
        <p :class="appConfig.typography.pageSubtitle" class="mt-0!">Members</p>
      </div>

      <!-- SEARCH & INVITE -->
      <div class="flex items-center gap-3 w-full">
        <!-- flex-1 kiterjeszti a searchbart -->
        <div class="flex-1">
          <UInput
            :model-value="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Filter members..."
            variant="search"
            class="w-full! max-w-none!"
            @update:model-value="emit('update:searchQuery', $event)"
          />
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UTooltip v-if="isCurrentUserLeader" :text="CONST_TOOLTIP_INVITE_USER ?? 'Invite User'">
            <UButton
              icon="i-heroicons-user-plus"
              variant="glassIconButtonHighlight"
              @click="groupsStore.openInviteModal()"
            />
          </UTooltip>
          <!-- MAIN ACTIONS (Leave / Delete) -->
          <UTooltip v-if="isCurrentUserLeader" :text="CONST_TOOLTIP_DELETE_GROUP ?? 'Delete Group'">
            <UButton
              icon="i-heroicons-trash"
              variant="glassIconButtonDanger"
              @click="emit('deleteGroup')"
            />
          </UTooltip>
          <UTooltip :text="CONST_TOOLTIP_LEAVE_GROUP ?? 'Leave Group'">
            <UButton
              icon="i-heroicons-arrow-right-on-rectangle"
              variant="glassIconButtonDanger"
              @click="emit('leaveGroup')"
            />
          </UTooltip>
        </div>
      </div>
    </div>

    <!-- MEMBERS LIST SECTION -->
    <div class="w-full">
      <ClientOnly>
        <div v-if="isLoading" :class="appConfig.typography.statusLoading">
          {{ CONST_LOADING_TEXT ?? 'Loading...' }}
        </div>
        <div v-else-if="error" :class="appConfig.typography.statusError">
          {{ CONST_FETCH_ERROR_TEXT ?? 'An error occurred' }}
        </div>

        <div v-else-if="filteredMembers?.length" class="flex flex-col gap-4 w-full">
          <UCard
            v-for="profile in filteredMembers"
            :key="profile.users.email"
            variant="interactiveGlass"
            class="relative cursor-pointer w-full"
            @click="emit('openProfile', profile)"
          >
            <div :class="appConfig.layout.memberCardInner">
              <div class="shrink-0 pt-1">
                <UAvatar
                  :alt="profile.users.username"
                  size="profileLg"
                  icon="i-heroicons-user"
                  class="w-14 h-14"
                />
              </div>

              <div :class="appConfig.layout.memberCardContent">
                <div :class="appConfig.layout.flexBetween">
                  <div>
                    <h3 :class="appConfig.typography.cardTitle">{{ profile.users.username }}</h3>
                    <p
                      v-if="isCurrentUser(profile.users.email)"
                      class="text-xs text-left font-bold text-brand-500 mt-0.5"
                    >
                      You
                    </p>
                  </div>
                  <UTooltip
                    v-if="isCurrentUserLeader && profile.roles.type.toLowerCase() === 'member'"
                    :text="CONST_TOOLTIP_PROMOTE_USER ?? 'Promote'"
                  >
                    <UButton
                      icon="i-heroicons-arrow-up-circle"
                      variant="ghostBrandIconButton"
                      class="text-dark-text/70"
                      @click.stop="
                        groupsStore.openPromoteUserModal(
                          profile.users.email,
                          profile.users.username,
                        )
                      "
                    />
                  </UTooltip>
                </div>

                <div :class="[appConfig.layout.flexBetween, 'items-end mt-4']">
                  <p class="text-sm font-medium text-dark-text/80">
                    Role: <span class="font-bold capitalize">{{ profile.roles.type }}</span>
                  </p>
                  <UTooltip
                    v-if="isCurrentUserLeader && !isCurrentUser(profile.users.email)"
                    :text="CONST_TOOLTIP_REMOVE_USER ?? 'Remove'"
                  >
                    <UButton
                      icon="i-heroicons-user-minus"
                      variant="ghostDangerIconButton"
                      @click.stop="groupsStore.openRemoveUserModal(profile.users.email)"
                    />
                  </UTooltip>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </ClientOnly>
    </div>

    <!-- UPCOMING EVENTS SECTION -->
    <div
      :class="[
        appConfig.layout.cardGrid +
          'shadow-md bg-surface-500/40 rounded-2xl ring-1 ring-dark-text/10 p-4 w-full mt-4',
      ]"
    >
      <h2 :class="appConfig.typography.cardTitle" class="text-surface-600 mb-2">
        {{ CONST_UPCOMING_EVENTS_HEADING }}
      </h2>

      <ClientOnly>
        <div v-if="isLoadingEvents" class="text-sm font-medium text-dark-text/60 py-2">
          {{ CONST_LOADING_EVENTS_MSG }}
        </div>
        <div
          v-else-if="todayUpcomingEvents.length === 0"
          class="text-sm font-medium text-dark-text/60 py-2"
        >
          {{ CONST_NO_UPCOMING_EVENTS_MSG }}
        </div>

        <div v-else class="flex flex-col gap-3 w-full">
          <UCard
            v-for="event in todayUpcomingEvents"
            :key="event.uuid"
            variant="interactiveGlass"
            class="w-full cursor-pointer hover:bg-surface-500/90 transition-colors"
            @click="navigateToEvent(event.uuid)"
          >
            <div class="flex flex-col gap-2.5 w-full">
              <div class="flex items-start justify-between border-b border-dark-text/10 pb-2">
                <div class="flex items-center gap-2 min-w-0 pr-2">
                  <UTooltip :text="event.is_private ? 'Private Event' : 'Group Event'">
                    <UIcon
                      :name="event.is_private ? 'i-heroicons-user' : 'i-heroicons-user-group'"
                      class="w-4 h-4 text-brand-500 shrink-0"
                    />
                  </UTooltip>
                  <h3 class="text-sm font-bold text-dark-text truncate">{{ event.title }}</h3>
                </div>
                <div
                  class="flex items-center gap-1 text-brand-600 shrink-0 bg-brand-500/10 px-1.5 py-0.5 rounded text-xs font-bold"
                >
                  <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
                  <span>{{ event.timeStartFormatted }}</span>
                </div>
              </div>

              <div class="flex flex-col gap-1.5 text-xs text-dark-text/80">
                <div class="flex justify-between items-center">
                  <span class="font-medium opacity-70"
                    >Creator:
                    <span class="font-bold text-dark-text opacity-100">{{
                      event.creator?.username
                    }}</span></span
                  >
                  <span class="font-semibold"
                    >{{ event.timeStartFormatted }} - {{ event.timeEndFormatted }}</span
                  >
                </div>
                <p class="truncate opacity-80" :title="event.description || undefined">
                  {{ event.description || 'No description provided.' }}
                </p>
              </div>

              <div
                :class="[
                  appConfig.layout.flexBetween,
                  'mt-1 pt-2 border-t border-dark-text/5 items-start',
                ]"
              >
                <span class="text-[11px] font-bold text-dark-text/50 uppercase tracking-wider mt-1"
                  >Participants</span
                >

                <div :class="appConfig.calendar.participantsGroup">
                  <template v-if="event.is_private">
                    <div
                      :class="[
                        appConfig.calendar.participantsAvatars,
                        appConfig.calendar.participantsGap,
                      ]"
                    >
                      <UTooltip
                        v-for="p in event.members?.slice(0, 5)"
                        :key="p.uuid"
                        :text="p.username"
                      >
                        <UAvatar
                          :alt="p.username"
                          :src="p.profile_image_url || undefined"
                          icon="i-heroicons-user"
                          size="sm"
                          :class="appConfig.calendar.participantAvatar"
                        />
                      </UTooltip>

                      <UTooltip
                        v-if="(event.members?.length || 0) > 5"
                        :text="
                          '+' + ((event.members?.length || 0) - 5).toString() + ' more participants'
                        "
                      >
                        <button
                          class="flex items-center justify-center w-5 h-5 rounded-full bg-surface-200 hover:bg-surface-300 ring-2 ring-white text-xs font-bold text-dark-text transition-colors z-10 cursor-pointer"
                          @click.stop="eventsStore.openParticipantsModal(event)"
                        >
                          +{{ (event.members?.length || 0) - 5 }}
                        </button>
                      </UTooltip>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-dark-text">Everyone</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAppConfig } from '#imports';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useEventsQuery } from '~/queries/events.query';
import { useEventsStore } from '~/stores/events.modals.store';
import { processAndSortEvents } from '~/utils/sort.utils';
import type { GroupInfosOutDto, GroupProfileDto } from '~/types/groups.type';
import type { UiEvent } from '~/types/events.type';
import type { ApiError } from '~/types/apiError.type';

/* --- COMPOSABLES & STORES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();
const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();

const navigateToEvent = (eventUuid: string) => {
  router.push({ path: '/events', query: { eventId: eventUuid } });
};

/* --- PROPS & EMITS --- */
const props = defineProps<{
  groupInfos: GroupInfosOutDto | undefined | null;
  filteredMembers: GroupProfileDto[];
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  searchQuery: string;
  isCurrentUserLeader: boolean;
  currentUserEmail: string | undefined;
}>();

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void;
  (e: 'deleteGroup' | 'leaveGroup'): void;
  (e: 'openProfile', profile: GroupProfileDto): void;
}>();

/* --- FETCHING UPCOMING EVENTS --- */
const groupUuid = computed(() => route.params.uuid as string);
const selectedDateId = ref<string | undefined>('ALL');
const { data: eventsData, isLoading: isLoadingEvents } = useEventsQuery(groupUuid, selectedDateId);

const todayUpcomingEvents = computed(() => {
  const processedEvents = processAndSortEvents(eventsData.value || []);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();

  return processedEvents
    .filter((e: UiEvent) => {
      if (e.isExpired) return false;

      const eventStart = new Date(e.start_time).getTime();
      const eventEnd = new Date(e.end_time).getTime();

      return eventStart <= endOfToday && eventEnd >= startOfToday;
    })
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 3); // Maximum a 3 legközelebbi
});

/* --- HELPERS --- */
const isCurrentUser = (email: string) => {
  return props.currentUserEmail === email;
};
</script>
