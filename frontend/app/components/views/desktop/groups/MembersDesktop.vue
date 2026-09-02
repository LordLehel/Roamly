<!-- frontend/app/components/views/desktop/groups/MembersDesktop.vue -->
<template>
  <div
    :class="appConfig.layout.pageWrapper"
    class="h-[calc(100vh-9rem)] py-2! overflow-hidden flex flex-col gap-4"
  >
    <!-- HEADER & SEARCH SECTION (20%) -->
    <div
      class="flex-2 min-h-0 flex flex-col justify-center gap-4 overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <div :class="appConfig.layout.pageHeader">
        <div :class="appConfig.layout.actionGroup" class="flex-1 justify-start">
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

        <div class="flex flex-col items-center justify-center shrink-0">
          <div class="flex items-center gap-2">
            <h1 :class="appConfig.typography.pageTitle">
              {{ (groupInfos?.name || CONST_LOADING_TEXT) ?? 'Loading...' }}
            </h1>
            <UTooltip v-if="isCurrentUserLeader" :text="CONST_TOOLTIP_EDIT_GROUP ?? 'Edit Group'">
              <UButton
                icon="i-heroicons-pencil"
                variant="ghostBrandIconButton"
                @click="groupsStore.openUpdateModal(groupInfos?.name || '')"
              />
            </UTooltip>
          </div>
          <p :class="appConfig.typography.pageSubtitle">Members</p>
        </div>

        <div :class="appConfig.layout.actionGroup" class="flex-1 justify-end">
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
      </div>

      <div :class="appConfig.layout.actionGroup">
        <!-- V-model helyett manuális update trigger a szülő felé -->
        <UInput
          :model-value="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Filter members..."
          variant="search"
          @update:model-value="emit('update:searchQuery', $event)"
        />
        <UTooltip v-if="isCurrentUserLeader" :text="CONST_TOOLTIP_INVITE_USER ?? 'Invite User'">
          <UButton
            icon="i-heroicons-user-plus"
            variant="glassIconButtonHighlight"
            @click="groupsStore.openInviteModal()"
          />
        </UTooltip>
      </div>
    </div>

    <!-- MEMBERS LIST SECTION (60%) -->
    <div
      class="flex-6 min-h-0 overflow-y-auto pr-2 relative z-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <ClientOnly>
        <div v-if="isLoading" :class="appConfig.typography.statusLoading">
          {{ CONST_LOADING_TEXT ?? 'Loading...' }}
        </div>
        <div v-else-if="error" :class="appConfig.typography.statusError">
          {{ CONST_FETCH_ERROR_TEXT ?? 'An error occurred' }}
        </div>

        <div v-else-if="filteredMembers?.length" :class="[appConfig.layout.cardGrid]">
          <UCard
            v-for="profile in filteredMembers"
            :key="profile.users.email"
            variant="interactiveGlass"
            class="relative cursor-pointer"
            @click="emit('openProfile', profile)"
          >
            <div :class="appConfig.layout.memberCardInner">
              <div class="shrink-0 pt-1">
                <UAvatar
                  :alt="profile.users.username"
                  size="profileLg"
                  icon="i-heroicons-user"
                  class="w-16 h-16"
                />
              </div>

              <div :class="appConfig.layout.memberCardContent">
                <div :class="appConfig.layout.flexBetween">
                  <div>
                    <h3 :class="appConfig.typography.cardTitle">{{ profile.users.username }}</h3>
                    <p
                      v-if="isCurrentUser(profile.users.email)"
                      class="text-sm text-left font-bold text-brand-500 mt-0.5"
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

    <!-- UPCOMING EVENTS SECTION (20%) -->
    <div
      class="flex-2 min-h-0 flex flex-col shadow-md bg-surface-500/40 rounded-2xl ring-1 ring-dark-text/10 p-4"
    >
      <h2 :class="appConfig.typography.cardTitle" class="shrink-0 mb-3 text-surface-600">
        Upcoming events
      </h2>

      <div class="flex-1 overflow-y-auto min-h-0 pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
          <UCard v-for="i in 3" :key="i" variant="glass" class="bg-surface-500/70">
            <div
              class="flex items-center justify-between border-b border-dark-text/10 pb-1.5 mb-1.5"
            >
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
