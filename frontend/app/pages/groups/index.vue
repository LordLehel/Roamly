<!-- frontend/app/pages/groups/index.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <h1 :class="appConfig.typography.pageTitle">{{ CONST_GROUPS_HEADING }}</h1>

    <!-- Action Group -->
    <div :class="appConfig.layout.actionGroup">
      <UTooltip :text="CONST_TOOLTIP_FILTER_GROUPS ?? 'Filter'">
        <UButton icon="i-heroicons-funnel" :label="CONST_FILTER_LABEL" variant="glassButton" />
      </UTooltip>
      <UTooltip :text="CONST_TOOLTIP_CREATE_GROUP ?? 'Create Group'">
        <UButton
          icon="i-heroicons-plus"
          variant="glassIconButton"
          @click="groupsStore.openCreateModal()"
        />
      </UTooltip>
      <UTooltip :text="CONST_TOOLTIP_VIEW_INVITES ?? 'Invites'">
        <UButton icon="i-heroicons-envelope" variant="glassIconButton" to="/groups/invites" />
      </UTooltip>
    </div>

    <ClientOnly>
      <div v-if="isLoading && groupsList.length === 0" :class="appConfig.typography.statusLoading">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="groupsList.length > 0" class="flex flex-col gap-6 w-full">
        <div :class="appConfig.layout.cardGrid">
          <UCard
            v-for="group in groupsList"
            :key="group.uuid"
            variant="pointedGlass"
            class="relative flex flex-col justify-between cursor-pointer"
            @click="router.push(`/groups/${group.uuid}/members`)"
          >
            <div class="absolute top-4 left-4 z-10">
              <UTooltip :text="CONST_TOOLTIP_LEAVE_GROUP ?? 'Leave Group'">
                <UButton
                  icon="i-heroicons-arrow-right-on-rectangle"
                  variant="ghostDangerIconButton"
                  @click.stop="groupsStore.openLeaveModal(group)"
                />
              </UTooltip>
            </div>

            <div v-if="group.role.toLowerCase() === 'leader'" class="absolute top-4 right-4 z-10">
              <UTooltip :text="CONST_TOOLTIP_DELETE_GROUP ?? 'Delete Group'">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  @click.stop="groupsStore.openDeleteModal(group)"
                />
              </UTooltip>
            </div>

            <div :class="appConfig.layout.cardContent">
              <h3 :class="appConfig.typography.cardTitleCenter">{{ group.name }}</h3>
              <p class="text-sm text-center text-dark-text/80 font-medium">
                {{ CONST_YOUR_ROLE_LABEL }}
                <span class="font-bold capitalize">{{ group.role }}</span>
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

        <div ref="loadMoreTrigger" class="h-10 w-full flex items-center justify-center">
          <span v-if="isFetchingNextPage" class="text-dark-text/70 text-sm">{{
            CONST_LOADING_GROUPS_MSG
          }}</span>
        </div>
      </div>

      <div v-else :class="appConfig.typography.statusLoading">
        {{ CONST_NO_GROUPS_MSG }}
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useIntersectionObserver } from '@vueuse/core';
import { useGroupsQuery } from '~/queries/groups.query';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const appConfig = useAppConfig();
const router = useRouter();
const groupsStore = useGroupsStore();

const currentCursor = ref<string | undefined>(undefined);
const { data: groupsData, isLoading, error } = useGroupsQuery(15, currentCursor);

const groupsList = ref<GroupOutDto[]>([]);
const isFetchingNextPage = ref(false);

watch(
  () => groupsData.value,
  (newData) => {
    if (newData?.items) {
      if (!currentCursor.value) {
        groupsList.value = [...newData.items];
      } else {
        const newItems = newData.items.filter(
          (newItem) => !groupsList.value.some((existing) => existing.uuid === newItem.uuid),
        );
        groupsList.value.push(...newItems);
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
    groupsData.value?.meta.has_next_page &&
    groupsData.value.meta.next_cursor &&
    !isFetchingNextPage.value
  ) {
    isFetchingNextPage.value = true;
    currentCursor.value = groupsData.value.meta.next_cursor;
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
