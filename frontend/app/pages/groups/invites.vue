// frontend/app/pages/groups/invites.vue
<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative">
    <h1 :class="appConfig.typography.pageTitle">
      {{ CONST_INVITES_HEADING }}
    </h1>

    <div class="flex items-center gap-4">
      <UButton icon="i-heroicons-funnel" :label="CONST_FILTER_LABEL" variant="glassButton" />
    </div>

    <ClientOnly>
      <div v-if="isLoading && invitesList.length === 0" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="invitesList.length > 0" class="flex flex-col gap-6 w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <UCard
            v-for="group in invitesList"
            :key="group.uuid"
            variant="interactiveGlass"
            class="relative flex flex-col justify-between cursor-pointer"
            @click="openJoinModal(group)"
          >
            <div class="absolute top-4 right-4 z-10">
              <UButton icon="i-heroicons-x-mark" variant="ghostDangerIconButton" @click.stop="openDeclineModal(group)" />
            </div>

            <div class="flex flex-col gap-6 w-full pt-2">
              <h3 :class="appConfig.typography.cardTitleCenter">
                {{ group.name }}
              </h3>

              <p class="text-sm text-center text-dark-text/80 font-medium">
                {{ group.leaders.length > 1 ? CONST_LEADERS_LABEL : CONST_LEADER_LABEL }} 
                <span class="font-bold">{{ group.leaders.join(', ') }}</span>
              </p>
              <div
                class="flex items-end justify-between w-full pt-4 border-t border-dark-text/10 text-xs text-dark-text/70"
              >
                <div>
                  <p class="opacity-70">{{ CONST_CREATED_AT_LABEL }}</p>
                  <p class="font-semibold">{{ group.created_at }}</p>
                </div>
                <div class="flex items-center gap-1.5 font-semibold">
                  <span>{{ group.current_size }}</span>
                  <UIcon name="i-heroicons-user" class="w-5 h-5 text-brand-500" />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <div ref="loadMoreTrigger" class="h-10 w-full flex items-center justify-center">
          <span v-if="isFetchingNextPage" class="text-dark-text/70 text-sm"
            >További meghívások betöltése...</span
          >
        </div>
      </div>

      <div v-else class="text-center py-10 text-dark-text/70">
        {{ CONST_NO_INVITES_MSG }}
      </div>

      <UModal
        v-model:open="groupsStore.isJoinModalOpen"
        :title="CONST_JOIN_GROUP_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default>
          <div class="hidden"></div>
        </template>
        <template #body>
          <p class="text-sm text-dark-text/80 py-2">
            {{ CONST_JOIN_GROUP_CONFIRM }}
            <span
              v-if="groupsStore.selectedGroupToJoin"
              class="block font-semibold mt-1 text-brand-500"
            >
              „{{ groupsStore.selectedGroupToJoin.name }}”
            </span>
          </p>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeJoinModal"
            />
            <UButton
              :label="CONST_JOIN_BTN"
              variant="actionOkButton"
              :loading="isJoining"
              @click="confirmJoin"
            />
          </div>
        </template>
      </UModal>

      <UModal
        v-model:open="groupsStore.isDeclineModalOpen"
        :title="CONST_DECLINE_INVITE_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default>
          <div class="hidden"></div>
        </template>
        <template #body>
          <p class="text-sm text-dark-text/80 py-2">
            {{ CONST_DECLINE_INVITE_CONFIRM }}
            <span
              v-if="groupsStore.selectedGroupToDecline"
              class="block font-semibold mt-1 text-brand-500"
            >
              „{{ groupsStore.selectedGroupToDecline.name }}”
            </span>
          </p>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeDeclineModal"
            />
            <UButton
              :label="CONST_DECLINE_BTN"
              variant="actionOkButton"
              :loading="isLeaving"
              @click="confirmDecline"
            />
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import { useAuth } from '~/composables/useAuth';
import { usePendingInvitesQuery } from '~/queries/groups.query';
import { useJoinGroupMutation, useLeaveGroupMutation } from '~/queries/groups.mutation';
import { useGroupsStore } from '~/stores/groups.store';
import type { GroupInvitesOutDto } from '~/types/groups.type';
import {
  CONST_INVITES_HEADING,
  CONST_FILTER_LABEL,
  CONST_CREATED_AT_LABEL,
  CONST_LEADER_LABEL,
  CONST_LEADERS_LABEL,
  CONST_JOIN_GROUP_TITLE,
  CONST_JOIN_GROUP_CONFIRM,
  CONST_JOIN_BTN,
  CONST_DECLINE_INVITE_TITLE,
  CONST_DECLINE_INVITE_CONFIRM,
  CONST_DECLINE_BTN,
  CONST_CANCEL_BTN_TEXT,
  CONST_NO_INVITES_MSG,
  CONST_LOADING_TEXT,
  CONST_FETCH_ERROR_TEXT,
} from '~/utils/constants';

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
});

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated } = useAuth();
const groupsStore = useGroupsStore();

watch(
  isAuthenticated,
  (isAuth) => {
    if (!isAuth) {
      router.push('/login');
    }
  },
  { immediate: true },
);

const currentCursor = ref<string | undefined>(undefined);
const { data: invitesData, isLoading, error } = usePendingInvitesQuery(15, currentCursor);

const { mutate: joinGroup, isLoading: isJoining } = useJoinGroupMutation();
const { mutate: leaveGroup, isLoading: isLeaving } = useLeaveGroupMutation();

const invitesList = ref<GroupInvitesOutDto[]>([]);
const isFetchingNextPage = ref(false);

watch(
  () => invitesData.value,
  (newData) => {
    if (newData?.items) {
      if (!currentCursor.value) {
        invitesList.value = [...newData.items];
      } else {
        const newItems = newData.items.filter(
          (newItem) => !invitesList.value.some((existing) => existing.uuid === newItem.uuid),
        );
        invitesList.value.push(...newItems);
      }
    }
  },
  { immediate: true },
);

watch(
  () => isLoading.value,
  (loading) => {
    if (!loading) {
      isFetchingNextPage.value = false;
    }
  },
);

const fetchNextPage = () => {
  if (
    invitesData.value?.meta.has_next_page &&
    invitesData.value.meta.next_cursor &&
    !isFetchingNextPage.value
  ) {
    isFetchingNextPage.value = true;
    currentCursor.value = invitesData.value.meta.next_cursor;
  }
};

const loadMoreTrigger = ref<HTMLElement | null>(null);

useIntersectionObserver(
  loadMoreTrigger,
  (entries) => {
    const entry = entries[0];
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  },
  { rootMargin: '100px' },
);

// Join modal handlers
const openJoinModal = (group: GroupInvitesOutDto) => {
  groupsStore.openJoinModal(group);
};

const closeJoinModal = () => {
  groupsStore.closeJoinModal();
};

const confirmJoin = async () => {
  if (!groupsStore.selectedGroupToJoin) return;

  try {
    await joinGroup(groupsStore.selectedGroupToJoin.uuid);
    invitesList.value = [];
    currentCursor.value = undefined;
    closeJoinModal();
  } catch (err: unknown) {
    console.error('Error joining group:', err);
  }
};

// Decline modal handlers
const openDeclineModal = (group: GroupInvitesOutDto) => {
  groupsStore.openDeclineModal(group);
};

const closeDeclineModal = () => {
  groupsStore.closeDeclineModal();
};

const confirmDecline = async () => {
  if (!groupsStore.selectedGroupToDecline) return;

  try {
    await leaveGroup(groupsStore.selectedGroupToDecline.uuid);
    invitesList.value = [];
    currentCursor.value = undefined;
    closeDeclineModal();
  } catch (err: unknown) {
    console.error('Error declining invitation:', err);
  }
};
</script>
