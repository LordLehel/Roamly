<!-- frontend/app/pages/groups/[uuid]/members.vue -->
<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative">
    <div class="flex flex-col md:flex-row justify-between items-center w-full gap-6">
      <div class="flex items-center gap-4">
        <UButton icon="i-heroicons-funnel" label="Filter" variant="glassButton" />

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

      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center gap-2">
          <h1 :class="appConfig.typography.pageTitle">
            {{ groupInfos?.name || 'Loading...' }}
          </h1>
          <UButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-pencil"
            variant="ghostBrandIconButton"
            @click="groupsStore.openUpdateModal(groupInfos?.name || '')"
          />
        </div>
        <p :class="appConfig.typography.pageSubtitle">Members</p>
      </div>

      <div class="flex items-center gap-4">
        <UButton icon="i-heroicons-users" variant="glassIconButtonBrand" to="/" />
        <UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/" />
        <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
        <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
      </div>
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div
        v-else-if="groupInfos?.group_profiles?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4"
      >
        <UCard
          v-for="profile in groupInfos.group_profiles"
          :key="profile.users.email"
          variant="interactiveGlass"
          class="relative"
        >
          <div class="flex items-start gap-4 w-full h-full">
            <div class="shrink-0 pt-1">
              <UAvatar
                :alt="profile.users.username"
                size="profileLg"
                icon="i-heroicons-user"
                class="w-16 h-16"
              />
            </div>

            <div class="flex-1 flex flex-col justify-between h-full min-h-16">
              <div class="flex justify-between items-start w-full">
                <div>
                  <h3 :class="appConfig.typography.cardTitle">
                    {{ profile.users.username }}
                  </h3>
                  <p
                    v-if="isCurrentUser(profile.users.email)"
                    class="text-sm text-left font-bold text-brand-500 mt-0.5"
                  >
                    You
                  </p>
                </div>
                <div class="text-xs text-right text-dark-text/70 shrink-0">
                  <p class="opacity-70">Joined:</p>
                  <p class="font-semibold">
                    {{
                      groupInfos.created_at
                        ? new Date(groupInfos.created_at).toLocaleDateString()
                        : 'N/A'
                    }}
                  </p>
                </div>
              </div>

              <div class="flex justify-between items-end mt-4 w-full">
                <p class="text-sm font-medium text-dark-text/80">
                  Role:
                  <span class="font-bold capitalize">{{ profile.roles.type }}</span>
                </p>
                <UButton
                  v-if="isCurrentUserLeader && !isCurrentUser(profile.users.email)"
                  icon="i-heroicons-user-minus"
                  variant="ghostDangerIconButton"
                  @click="groupsStore.openRemoveUserModal(profile.users.email)"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupInfosQuery } from '~/queries/groups.query';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsStore } from '~/stores/modals.store';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const appConfig = useAppConfig();
const route = useRoute();
const groupsStore = useGroupsStore();

const groupUuid = computed(() => route.params.uuid as string);
const { data: currentUser } = useCurrentUserQuery();
const { data: groupInfos, isLoading, error } = useGroupInfosQuery(groupUuid);

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
</script>
