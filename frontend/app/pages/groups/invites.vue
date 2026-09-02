<!--frontend/app/pages/groups/invites.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <h1 :class="appConfig.typography.pageTitle">{{ CONST_INVITES_HEADING }}</h1>

    <div :class="appConfig.layout.actionGroup">
      <UTooltip :text="CONST_TOOLTIP_FILTER_INVITES ?? 'Filter'">
        <UButton icon="i-heroicons-funnel" :label="CONST_FILTER_LABEL" variant="glassButton" />
      </UTooltip>
    </div>

    <ClientOnly>
      <div v-if="isLoading && invitesList.length === 0" :class="appConfig.typography.statusLoading">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="invitesList.length > 0" class="flex flex-col gap-6 w-full">
        <div :class="appConfig.layout.cardGrid">
          <UCard
            v-for="group in invitesList"
            :key="group.uuid"
            variant="interactiveGlass"
            class="relative flex flex-col justify-between cursor-pointer"
            @click="groupsStore.openJoinModal(group)"
          >
            <div class="absolute top-4 right-4 z-10">
              <UTooltip :text="CONST_TOOLTIP_DECLINE_INVITE ?? 'Decline'">
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="ghostDangerIconButton"
                  @click.stop="groupsStore.openDeclineModal(group)"
                />
              </UTooltip>
            </div>

            <div :class="appConfig.layout.cardContent">
              <h3 :class="appConfig.typography.cardTitleCenter">{{ group.name }}</h3>
              <p class="text-sm text-center text-dark-text/80 font-medium">
                {{ group.leaders.length > 1 ? CONST_LEADERS_LABEL : CONST_LEADER_LABEL }}
                <span class="font-bold">{{ group.leaders.join(', ') }}</span>
              </p>
              <div :class="appConfig.layout.cardFooter">
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
      </div>

      <div v-else :class="appConfig.typography.statusLoading">
        {{ CONST_NO_INVITES_MSG }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { ref, watch } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { usePendingInvitesQuery } from '~/queries/groups.query';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupInvitesOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

const currentCursor = ref<string | undefined>(undefined);
const { data: invitesData, isLoading, error } = usePendingInvitesQuery(15, currentCursor);

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
    if (!loading) isFetchingNextPage.value = false;
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
    if (entries[0]?.isIntersecting) fetchNextPage();
  },
  { rootMargin: '100px' },
);
</script>
