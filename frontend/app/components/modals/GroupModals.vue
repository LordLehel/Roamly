<!-- frontend/app/components/modals/GroupModals.vue -->
<template>
  <div>
    <!-- CREATE MODAL -->
    <UModal
      v-model:open="groupsStore.isCreateModalOpen"
      :title="CONST_CREATE_GROUP_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="create-group-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleCreateGroup"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_GROUP_NAME_LABEL
            }}</label>
            <UInput
              v-model="newGroupName"
              :placeholder="CONST_GROUP_NAME_PLACEHOLDER"
              variant="glass"
              class="w-full"
            />
            <p v-if="createError" class="text-xs text-error-500 mt-1">{{ createError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            type="button"
            @click="groupsStore.closeCreateModal"
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

    <!-- DELETE GROUP MODAL -->
    <UModal
      v-model:open="groupsStore.isDeleteModalOpen"
      :title="CONST_DELETE_GROUP_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p class="text-sm text-dark-text/80 py-2">
          {{ CONST_DELETE_GROUP_CONFIRM }}
          <span
            v-if="groupsStore.selectedGroupToDelete"
            class="block font-semibold mt-1 text-brand-500"
          >
            „{{ groupsStore.selectedGroupToDelete.name }}”
          </span>
        </p>
        <p
          v-if="deleteErrorText"
          class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
        >
          {{ deleteErrorText }}
        </p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeDeleteModal"
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

    <!-- LEAVE GROUP MODAL -->
    <UModal
      v-model:open="groupsStore.isLeaveModalOpen"
      :title="CONST_LEAVE_GROUP_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <div class="flex flex-col gap-2 py-2">
          <p class="text-sm text-dark-text/80">
            {{ CONST_LEAVE_GROUP_CONFIRM }}
            <span
              v-if="groupsStore.selectedGroupToLeave"
              class="block font-semibold mt-1 text-brand-500"
            >
              „{{ groupsStore.selectedGroupToLeave.name }}”
            </span>
          </p>
          <p
            v-if="
              groupsStore.selectedGroupToLeave?.current_size === 1 &&
              groupsStore.selectedGroupToLeave?.role?.toLowerCase() === 'leader'
            "
            class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
          >
            {{ CONST_LEAVE_GROUP_WARNING }}
          </p>
          <p
            v-if="leaveErrorText"
            class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
          >
            {{ leaveErrorText }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeLeaveModal"
          />
          <UButton
            :label="CONST_LEAVE_BTN"
            variant="actionOkButton"
            :loading="isLeaving"
            @click="confirmLeave"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGroupsStore } from '~/stores/modals.store';
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useLeaveGroupMutation,
} from '~/queries/groups.mutation';

const groupsStore = useGroupsStore();
const router = useRouter();

const {
  mutate: createGroup,
  isLoading: isCreating,
  error: createApiError,
  reset: resetCreate,
} = useCreateGroupMutation({
  onSuccess: () => {
    groupsStore.closeCreateModal();
    newGroupName.value = '';
  },
});
const {
  mutate: deleteGroup,
  isLoading: isDeleting,
  error: deleteApiError,
  reset: resetDelete,
} = useDeleteGroupMutation({
  onSuccess: () => {
    groupsStore.closeDeleteModal();
    router.push('/groups');
  },
});
const {
  mutate: leaveGroup,
  isLoading: isLeaving,
  error: leaveApiError,
  reset: resetLeave,
} = useLeaveGroupMutation({
  onSuccess: () => {
    groupsStore.closeLeaveModal();
    router.push('/groups');
  },
});

const newGroupName = ref('');
const formValidationError = ref('');
const createError = computed(
  () =>
    formValidationError.value ||
    (createApiError.value ? getErrorMessage(createApiError.value) : ''),
);
const deleteErrorText = computed(() =>
  deleteApiError.value ? getErrorMessage(deleteApiError.value) : '',
);
const leaveErrorText = computed(() =>
  leaveApiError.value ? getErrorMessage(leaveApiError.value) : '',
);

const handleCreateGroup = () => {
  resetCreate();
  formValidationError.value = '';
  const validationResult = createGroupSchema.safeParse({ groupName: newGroupName.value });
  if (!validationResult.success) {
    formValidationError.value =
      validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }
  createGroup({ groupName: validationResult.data.groupName });
};

const confirmDelete = () => {
  if (!groupsStore.selectedGroupToDelete) return;
  resetDelete();
  deleteGroup(groupsStore.selectedGroupToDelete.uuid);
};

const confirmLeave = () => {
  if (!groupsStore.selectedGroupToLeave) return;
  resetLeave();
  leaveGroup(groupsStore.selectedGroupToLeave.uuid);
};
</script>
