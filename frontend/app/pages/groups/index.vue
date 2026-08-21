// frontend/app/pages/groups/index.vue
<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative">
    <h1 :class="appConfig.typography.pageTitle">
      {{ CONST_GROUPS_HEADING }}
    </h1>

    <div class="flex items-center gap-4">
      <UButton icon="i-heroicons-funnel" :label="CONST_FILTER_LABEL" variant="glassButton" />
      <UButton icon="i-heroicons-plus" variant="glassIconButton" @click="openCreateModal" />
      <UButton icon="i-heroicons-envelope" variant="glassIconButton" to="/groups/invites" />
    </div>

    <ClientOnly>
      <div v-if="isLoading && groupsList.length === 0" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="groupsList.length > 0" class="flex flex-col gap-6 w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <UCard
            v-for="group in groupsList"
            :key="group.uuid"
            variant="pointedGlass"
            class="relative flex flex-col justify-between cursor-pointer"
            @click="router.push(`/groups/${group.uuid}/members`)"
          >
            <div class="absolute top-4 left-4 z-10">
              <UButton
                icon="i-heroicons-arrow-right-on-rectangle"
                variant="ghostDangerIconButton"
                @click.stop="openLeaveModal(group)"
              />
            </div>

            <div v-if="group.role.toLowerCase() === 'leader'" class="absolute top-4 right-4 z-10">
              <UButton
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                @click.stop="openDeleteModal(group)"
              />
            </div>

            <div class="flex flex-col gap-6 w-full pt-2">
              <h3 :class="appConfig.typography.cardTitleCenter">
                {{ group.name }}
              </h3>
              <p class="text-sm text-center text-dark-text/80 font-medium">
                {{ CONST_YOUR_ROLE_LABEL }} <span class="font-bold capitalize">{{ group.role }}</span>
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
            >Loading more groups...</span
          >
        </div>
      </div>

      <div v-else class="text-center py-10 text-dark-text/70">
        {{ CONST_NO_GROUPS_MSG }}
      </div>

      <UModal v-model:open="groupsStore.isCreateModalOpen" :title="CONST_CREATE_GROUP_TITLE" :dismissible="false" :close="false">
        <template #default><div class="hidden"></div></template>
        <template #body>
          <form id="create-group-form" class="flex flex-col gap-4 py-2" @submit.prevent="handleCreateGroup">
            <div>
              <label class="block text-sm font-medium text-dark-text mb-1">{{ CONST_GROUP_NAME_LABEL }}</label>
              <UInput v-model="newGroupName" :placeholder="CONST_GROUP_NAME_PLACEHOLDER" variant="glass" class="w-full" />
              <p v-if="formError" class="text-xs text-error-500 mt-1">{{ formError }}</p>
            </div>
          </form>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton :label="CONST_CANCEL_BTN_TEXT" variant="actionCancelButton" type="button" @click="closeCreateModal" />
            <UButton :label="CONST_CREATE_BTN" variant="actionOkButton" type="submit" form="create-group-form" :loading="isCreating" />
          </div>
        </template>
      </UModal>

      <UModal v-model:open="groupsStore.isDeleteModalOpen" :title="CONST_DELETE_GROUP_TITLE" :dismissible="false" :close="false">
        <template #default><div class="hidden"></div></template>
        <template #body>
          <p class="text-sm text-dark-text/80 py-2">
            {{ CONST_DELETE_GROUP_CONFIRM }}
            <span v-if="groupsStore.selectedGroupToDelete" class="block font-semibold mt-1 text-brand-500">
              „{{ groupsStore.selectedGroupToDelete.name }}”
            </span>
          </p>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton :label="CONST_CANCEL_BTN_TEXT" variant="actionCancelButton" @click="closeDeleteModal" />
            <UButton :label="CONST_DELETE_BTN" variant="actionOkButton" :loading="isDeleting" @click="confirmDelete" />
          </div>
        </template>
      </UModal>

      <UModal v-model:open="groupsStore.isLeaveModalOpen" :title="CONST_LEAVE_GROUP_TITLE" :dismissible="false" :close="false">
        <template #default><div class="hidden"></div></template>
        <template #body>
          <div class="flex flex-col gap-2 py-2">
            <p class="text-sm text-dark-text/80">
              {{ CONST_LEAVE_GROUP_CONFIRM }}
              <span v-if="groupsStore.selectedGroupToLeave" class="block font-semibold mt-1 text-brand-500">
                „{{ groupsStore.selectedGroupToLeave.name }}”
              </span>
            </p>
            <p v-if="groupsStore.selectedGroupToLeave?.current_size === 1 && groupsStore.selectedGroupToLeave?.role?.toLowerCase() === 'leader'" class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20">
              {{ CONST_LEAVE_GROUP_WARNING }}
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton :label="CONST_CANCEL_BTN_TEXT" variant="actionCancelButton" @click="closeLeaveModal" />
            <UButton :label="CONST_LEAVE_BTN" variant="actionOkButton" :loading="isLeaving" @click="confirmLeave" />
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
import { useGroupsQuery } from '~/queries/groups.query';
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useLeaveGroupMutation,
} from '~/queries/groups.mutation';
import { createGroupSchema } from '~/utils/groups.schema';
import { useGroupsStore } from '~/stores/groups.store';
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';
import {
  CONST_GROUPS_HEADING,
  CONST_FILTER_LABEL,
  CONST_CREATED_AT_LABEL,
  CONST_YOUR_ROLE_LABEL,
  CONST_DELETE_GROUP_TITLE,
  CONST_DELETE_GROUP_CONFIRM,
  CONST_DELETE_BTN,
  CONST_LEAVE_GROUP_TITLE,
  CONST_LEAVE_GROUP_CONFIRM,
  CONST_LEAVE_GROUP_WARNING,
  CONST_LEAVE_BTN,
  CONST_CANCEL_BTN_TEXT,
  CONST_CREATE_GROUP_TITLE,
  CONST_GROUP_NAME_LABEL,
  CONST_GROUP_NAME_PLACEHOLDER,
  CONST_CREATE_BTN,
  CONST_NO_GROUPS_MSG,
  CONST_LOADING_TEXT,
  CONST_FETCH_ERROR_TEXT,
  CONST_INVALID_DATA_ERROR,
  CONST_CREATE_ERROR_GENERIC,
} from '~/utils/constants';

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
});

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated } = useAuth();
const groupsStore = useGroupsStore();

watch(isAuthenticated, (isAuth) => { if (!isAuth) router.push('/login'); }, { immediate: true });

const currentCursor = ref<string | undefined>(undefined);
const { data: groupsData, isLoading, error } = useGroupsQuery(15, currentCursor);

const { mutate: createGroup, isLoading: isCreating } = useCreateGroupMutation();
const { mutate: deleteGroup, isLoading: isDeleting } = useDeleteGroupMutation();
const { mutate: leaveGroup, isLoading: isLeaving } = useLeaveGroupMutation();

const groupsList = ref<GroupOutDto[]>([]);
const isFetchingNextPage = ref(false);

watch(() => groupsData.value, (newData) => {
    if (newData?.items) {
      if (!currentCursor.value) {
        groupsList.value = [...newData.items];
      } else {
        const newItems = newData.items.filter((newItem) => !groupsList.value.some((existing) => existing.uuid === newItem.uuid));
        groupsList.value.push(...newItems);
      }
    }
  },
  { immediate: true },
);

watch(() => isLoading.value, (loading) => { if (!loading) isFetchingNextPage.value = false; });

const fetchNextPage = () => {
  if (groupsData.value?.meta.has_next_page && groupsData.value.meta.next_cursor && !isFetchingNextPage.value) {
    isFetchingNextPage.value = true;
    currentCursor.value = groupsData.value.meta.next_cursor;
  }
};

const loadMoreTrigger = ref<HTMLElement | null>(null);
useIntersectionObserver(loadMoreTrigger, (entries) => { if (entries[0]?.isIntersecting) fetchNextPage(); }, { rootMargin: '100px' });

const newGroupName = ref('');
const formError = ref('');

const openCreateModal = () => { newGroupName.value = ''; formError.value = ''; groupsStore.openCreateModal(); };
const closeCreateModal = () => { groupsStore.closeCreateModal(); newGroupName.value = ''; formError.value = ''; };

const handleCreateGroup = async () => {
  formError.value = '';
  const validationResult = createGroupSchema.safeParse({ groupName: newGroupName.value });
  if (!validationResult.success) { formError.value = validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR; return; }
  try {
    await createGroup({ groupName: validationResult.data.groupName });
    groupsList.value = []; currentCursor.value = undefined; closeCreateModal();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    formError.value = typeof apiErr.response?._data?.message === 'string' ? apiErr.response._data.message : CONST_CREATE_ERROR_GENERIC;
  }
};

const openDeleteModal = (group: GroupOutDto) => { groupsStore.openDeleteModal(group); };
const closeDeleteModal = () => { groupsStore.closeDeleteModal(); };
const confirmDelete = async () => {
  if (!groupsStore.selectedGroupToDelete) return;
  try {
    await deleteGroup(groupsStore.selectedGroupToDelete.uuid);
    groupsList.value = []; currentCursor.value = undefined; closeDeleteModal();
  } catch (err: unknown) { console.error('Error during deletion:', err); }
};

const openLeaveModal = (group: GroupOutDto) => { groupsStore.openLeaveModal(group); };
const closeLeaveModal = () => { groupsStore.closeLeaveModal(); };
const confirmLeave = async () => {
  if (!groupsStore.selectedGroupToLeave) return;
  try {
    await leaveGroup(groupsStore.selectedGroupToLeave.uuid);
    groupsList.value = []; currentCursor.value = undefined; closeLeaveModal();
  } catch (err: unknown) { console.error('Error during leaving group:', err); }
};
</script>