<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative">
    <h1 class="text-3xl font-bold text-surface-500 tracking-wide text-center">
      {{ CONST_GROUPS_HEADING }}
    </h1>

    <div class="flex items-center gap-4">
      <UButton
        icon="i-heroicons-funnel"
        :label="CONST_FILTER_LABEL"
        variant="glassButton"
        class="px-8 rounded-full font-semibold justify-center"
      />
      <UButton
        icon="i-heroicons-plus"
        variant="glassButton"
        class="w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0"
        @click="openCreateModal"
      />
      <UButton
        icon="i-heroicons-envelope"
        variant="glassButton"
        class="w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0"
      />
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>
      <div v-else-if="groupsList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <UCard
          v-for="group in groupsList"
          :key="group.uuid"
          variant="interactiveGlass"
          class="relative flex flex-col justify-between"
        >
          <div class="absolute top-4 right-4 z-10">
            <UButton
              icon="i-heroicons-trash"
              variant="ghost"
              class="text-dark-text/70 hover:text-error-500 transition-colors"
              @click="openDeleteModal(group)"
            />
          </div>

          <div class="flex flex-col gap-6 w-full pt-2">
            <h3 class="text-xl font-bold text-center tracking-wide text-dark-text">
              {{ group.name }}
            </h3>
            <p class="text-sm text-center text-dark-text/80 font-medium">
              {{ CONST_ROLE_LABEL }} <span class="font-bold">{{ group.role }}</span>
            </p>
            <div class="flex items-end justify-between w-full pt-4 border-t border-dark-text/10 text-xs text-dark-text/70">
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
      <div v-else class="text-center py-10 text-dark-text/70">
        {{ CONST_NO_GROUPS_MSG }}
      </div>

      <UModal
        v-model:open="groupsStore.isCreateModalOpen"
        :title="CONST_CREATE_GROUP_TITLE"
        :dismissible="false"
        :close="false"
        :ui="{
          overlay: 'fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm',
          content: 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-md bg-white rounded-xl shadow-2xl ring-1 ring-black/5'
        }"
      >
        <template #default>
          <div class="hidden"></div>
        </template>
        <template #body>
          <form id="create-group-form" class="flex flex-col gap-4 py-2" @submit.prevent="handleCreateGroup">
            <div>
              <label class="block text-sm font-medium text-dark-text mb-1">
                {{ CONST_GROUP_NAME_LABEL }}
              </label>
              <UInput
                v-model="newGroupName"
                :placeholder="CONST_GROUP_NAME_PLACEHOLDER"
                class="w-full"
              />
              <p v-if="formError" class="text-xs text-error-500 mt-1">
                {{ formError }}
              </p>
            </div>
          </form>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              type="button"
              @click="closeCreateModal"
            />
            <UButton
              :label="CONST_CREATE_BTN"
              variant="actionOkButton"
              type="submit"
              form="create-group-form"
              :loading="isCreating"
            />
          </div>
        </template>
      </UModal>

      <UModal
        v-model:open="groupsStore.isDeleteModalOpen"
        :title="CONST_DELETE_GROUP_TITLE"
        :dismissible="false"
        :close="false"
        :ui="{
          overlay: 'fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm',
          content: 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-md bg-white rounded-xl shadow-2xl ring-1 ring-black/5'
        }"
      >
        <template #default>
          <div class="hidden"></div>
        </template>
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
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeDeleteModal"
            />
            <UButton
              :label="CONST_DELETE_BTN"
              variant="actionOkButton"
              :loading="isDeleting"
              @click="confirmDelete"
            />
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useGroupsQuery } from '~/queries/groups.query';
import { useCreateGroupMutation, useDeleteGroupMutation } from '~/queries/groups.mutation';
import { createGroupSchema } from '~/utils/groups.schema';
import { useGroupsStore } from '~/stores/groups.store';
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';
import {
  CONST_GROUPS_HEADING,
  CONST_FILTER_LABEL,
  CONST_CREATED_AT_LABEL,
  CONST_ROLE_LABEL,
  CONST_DELETE_GROUP_TITLE,
  CONST_DELETE_GROUP_CONFIRM,
  CONST_DELETE_BTN,
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
  { immediate: true }
);

const { data: groupsData, isLoading, error } = useGroupsQuery();
const { mutate: createGroup, isLoading: isCreating } = useCreateGroupMutation();
const { mutate: deleteGroup, isLoading: isDeleting } = useDeleteGroupMutation();

// We use Pinia's cache to keep the list of groups up to date
const groupsList = computed<GroupOutDto[]>(() => groupsData.value?.items ?? []);

const newGroupName = ref('');
const formError = ref('');

// Create modal
const openCreateModal = () => {
  newGroupName.value = '';
  formError.value = '';
  groupsStore.openCreateModal();
};

const closeCreateModal = () => {
  groupsStore.closeCreateModal();
  newGroupName.value = '';
  formError.value = '';
};

const handleCreateGroup = async () => {
  formError.value = '';
  const validationResult = createGroupSchema.safeParse({ groupName: newGroupName.value });

  if (!validationResult.success) {
    formError.value = validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  try {
    await createGroup({ groupName: validationResult.data.groupName });
    closeCreateModal();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    const msg = apiErr.response?._data?.message;

    formError.value = typeof msg === 'string'
      ? msg
      : CONST_CREATE_ERROR_GENERIC;
  }
};

// Delete modal
const openDeleteModal = (group: GroupOutDto) => {
  groupsStore.openDeleteModal(group);
};

const closeDeleteModal = () => {
  groupsStore.closeDeleteModal();
};

const confirmDelete = async () => {
  if (!groupsStore.selectedGroupToDelete) return;

  try {
    await deleteGroup(groupsStore.selectedGroupToDelete.uuid);
    closeDeleteModal();
  } catch (err: unknown) {
    console.error('Error during deletion:', err);
  }
};
</script>