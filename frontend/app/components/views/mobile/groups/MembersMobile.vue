<!-- frontend/app/components/views/mobile/groups/MembersMobile.vue -->
<!-- frontend/app/components/views/mobile/groups/MembersMobile.vue -->
<template>
  <!-- JAVÍTÁS: Nincsenek kikényszerített magasság és overflow szabályok. Hagyjuk a pageWrapper-t dolgozni. -->
  <div :class="[appConfig.layout.pageWrapper, 'px-4 py-6']">
    <!-- HEADER & SEARCH SECTION -->
    <div class="flex flex-col gap-6">
      <!-- NAV ACTIONS (Members, Calendar, Photos, Docs) -->
      <!-- JAVÍTÁS: Csak justify-between az elosztáshoz flex-wrap nélkül, ahogy a gombokhoz kérted -->
      <div class="flex justify-between items-center w-full">
        <UTooltip :text="CONST_TOOLTIP_MEMBERS ?? 'Members'">
          <UButton icon="i-heroicons-users" variant="glassIconButtonBrand" to="/" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_CALENDAR ?? 'Calendar'">
          <UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_PHOTOS ?? 'Photos'">
          <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
        </UTooltip>
        <UTooltip :text="CONST_TOOLTIP_DOCUMENTS ?? 'Documents'">
          <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
        </UTooltip>
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
      class="flex flex-col gap-4 shadow-md bg-surface-500/40 rounded-2xl ring-1 ring-dark-text/10 p-4 w-full"
    >
      <h2 :class="appConfig.typography.cardTitle" class="text-surface-600 mb-2">Upcoming events</h2>
      <div class="flex flex-col gap-3 w-full">
        <UCard v-for="i in 3" :key="i" variant="glass" class="bg-surface-500/70 w-full">
          <div class="flex items-center justify-between border-b border-dark-text/10 pb-1.5 mb-1.5">
            <h3 class="text-sm font-bold text-dark-text truncate">Event Name {{ i }}</h3>
            <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-brand-500 shrink-0" />
          </div>
          <div class="flex justify-between items-center text-xs text-dark-text/80">
            <span>06.15.2023 - 18:00</span>
            <span class="truncate ml-2 text-right">Sample Location {{ i }}</span>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAppConfig } from '#imports';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupInfosOutDto, GroupProfileDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';

/* --- COMPOSABLES & STORES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

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

/* --- HELPERS --- */
const isCurrentUser = (email: string) => {
  return props.currentUserEmail === email;
};
</script>
