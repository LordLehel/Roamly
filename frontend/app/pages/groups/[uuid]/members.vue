<!-- frontend/app/pages/groups/[uuid]/members.vue -->
<template>
  <div>
    <MembersMobile
      v-if="isMobile"
      :group-infos="groupInfos"
      :filtered-members="filteredMembers"
      :is-loading="isLoading"
      :error="error"
      :search-query="searchQuery"
      :is-current-user-leader="isCurrentUserLeader"
      :current-user-email="currentUser?.email"
      @update:search-query="searchQuery = $event"
      @delete-group="handleDeleteCurrentGroup"
      @leave-group="handleLeaveCurrentGroup"
      @open-profile="handleOpenProfile"
    />

    <MembersDesktop
      v-else
      :group-infos="groupInfos"
      :filtered-members="filteredMembers"
      :is-loading="isLoading"
      :error="error"
      :search-query="searchQuery"
      :is-current-user-leader="isCurrentUserLeader"
      :current-user-email="currentUser?.email"
      @update:search-query="searchQuery = $event"
      @delete-group="handleDeleteCurrentGroup"
      @leave-group="handleLeaveCurrentGroup"
      @open-profile="handleOpenProfile"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useScreenSize } from '~/composables/useScreenSize';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { useGroupInfosQuery } from '~/queries/groups.query';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto, GroupProfileDto } from '~/types/groups.type';

import MembersMobile from '~/components/views/mobile/groups/MembersMobile.vue';
import MembersDesktop from '~/components/views/desktop/groups/MembersDesktop.vue';

definePageMeta({ layout: 'general', middleware: ['auth'] });

useProtectedPage();
const { isMobile } = useScreenSize();

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
