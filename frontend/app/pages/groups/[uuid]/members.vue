<!-- frontend/app/pages/groups/[uuid]/members.vue -->
<template>
  <!-- MAIN CONTAINER: Height is adjusted to ensure navbar and footer fit perfectly without page scrolling -->
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

        <div class="flex flex-col items-center justify-center shrink-0">
          <div class="flex items-center gap-2">
            <h1 :class="appConfig.typography.pageTitle">{{ groupInfos?.name || 'Loading...' }}</h1>
            <UButton
              v-if="isCurrentUserLeader"
              icon="i-heroicons-pencil"
              variant="ghostBrandIconButton"
              @click="groupsStore.openUpdateModal(groupInfos?.name || '')"
            />
          </div>
          <p :class="appConfig.typography.pageSubtitle">Members</p>
        </div>

        <div :class="appConfig.layout.actionGroup" class="flex-1 justify-end">
          <UButton icon="i-heroicons-users" variant="glassIconButtonBrand" to="/" />
          <UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/" />
          <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
          <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
        </div>
      </div>

      <div :class="appConfig.layout.actionGroup">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Filter members..."
          variant="search"
        />
        <UButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-user-plus"
          variant="glassIconButtonHighlight"
          @click="groupsStore.openInviteModal()"
        />
      </div>
    </div>

    <!-- MEMBERS LIST SECTION (60%) -->
    <div
      class="flex-6 min-h-0 overflow-y-auto pr-2 relative z-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <ClientOnly>
        <div v-if="isLoading" :class="appConfig.typography.statusLoading">
          {{ CONST_LOADING_TEXT }}
        </div>
        <div v-else-if="error" :class="appConfig.typography.statusError">
          {{ CONST_FETCH_ERROR_TEXT }}
        </div>

        <div v-else-if="filteredMembers?.length" :class="[appConfig.layout.cardGrid]">
          <UCard
            v-for="profile in filteredMembers"
            :key="profile.users.email"
            variant="interactiveGlass"
            class="relative cursor-pointer"
            @click="handleOpenProfile(profile)"
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
                  <UButton
                    v-if="isCurrentUserLeader && profile.roles.type.toLowerCase() === 'member'"
                    icon="i-heroicons-arrow-up-circle"
                    variant="ghostBrandIconButton"
                    class="text-dark-text/70"
                    @click.stop="
                      groupsStore.openPromoteUserModal(profile.users.email, profile.users.username)
                    "
                  />
                </div>

                <div :class="[appConfig.layout.flexBetween, 'items-end mt-4']">
                  <p class="text-sm font-medium text-dark-text/80">
                    Role: <span class="font-bold capitalize">{{ profile.roles.type }}</span>
                  </p>
                  <UButton
                    v-if="isCurrentUserLeader && !isCurrentUser(profile.users.email)"
                    icon="i-heroicons-user-minus"
                    variant="ghostDangerIconButton"
                    @click.stop="groupsStore.openRemoveUserModal(profile.users.email)"
                  />
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
import { useAppConfig } from '#imports';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupInfosQuery } from '~/queries/groups.query';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto, GroupProfileDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const appConfig = useAppConfig();
const route = useRoute();
const groupsStore = useGroupsStore();

const groupUuid = computed(() => route.params.uuid as string);
const { data: currentUser } = useCurrentUserQuery();
const { data: groupInfos, isLoading, error } = useGroupInfosQuery(groupUuid);

// Filter logic
const searchQuery = ref('');
const debouncedQuery = ref('');
let debounceTimeout: ReturnType<typeof setTimeout>;

watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    debouncedQuery.value = newVal;
  }, 300);
});

const filteredMembers = computed(() => {
  if (!groupInfos.value?.group_profiles) return [];
  if (!debouncedQuery.value) return groupInfos.value.group_profiles;

  const query = debouncedQuery.value.toLowerCase();
  return groupInfos.value.group_profiles.filter(
    (profile) =>
      profile.users.username.toLowerCase().includes(query) ||
      profile.roles.type.toLowerCase().includes(query),
  );
});

const isCurrentUserLeader = computed(() => {
  const profile = groupInfos.value?.group_profiles?.find(
    (p) => p.users.email === currentUser.value?.email,
  );
  return profile?.roles.type.toLowerCase() === 'leader';
});

const isCurrentUser = computed(() => {
  return (email: string) => currentUser.value?.email === email;
});

const handleLeaveCurrentGroup = () => {
  const currentUserProfile = groupInfos.value?.group_profiles?.find(
    (p) => p.users.email === currentUser.value?.email,
  );
  const dummyGroupToLeave: GroupOutDto = {
    uuid: groupUuid.value,
    name: groupInfos.value?.name || '',
    role: currentUserProfile?.roles.type || '',
    current_size: groupInfos.value?.current_size || 0,
    created_at: groupInfos.value?.created_at || '',
  };
  groupsStore.openLeaveModal(dummyGroupToLeave);
};

const handleDeleteCurrentGroup = () => {
  const dummyGroupToDelete: GroupOutDto = {
    uuid: groupUuid.value,
    name: groupInfos.value?.name || '',
    role: 'leader',
    current_size: groupInfos.value?.current_size || 0,
    created_at: groupInfos.value?.created_at || '',
  };
  groupsStore.openDeleteModal(dummyGroupToDelete);
};

const handleOpenProfile = (profile: GroupProfileDto) => {
  groupsStore.openUserProfileModal({
    username: profile.users.username,
    email: profile.users.email,
    role: profile.roles.type,
    joinedAt: groupInfos.value?.created_at || 'Unknown',
    canViewDocuments: isCurrentUserLeader.value,
  });
};
</script>
