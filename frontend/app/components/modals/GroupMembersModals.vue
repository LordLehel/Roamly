<!-- frontend/app/components/modals/GroupMembersModals.vue -->
<template>
  <div>
    <!-- UPDATE MODAL -->
    <UModal
      v-model:open="groupsStore.isUpdateModalOpen"
      :title="CONST_EDIT_GROUP_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="update-group-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleUpdateGroup"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_GROUP_NAME_LABEL
            }}</label>
            <UInput
              v-model="updateGroupName"
              :placeholder="CONST_GROUP_NAME_PLACEHOLDER"
              class="w-full"
            />
            <p v-if="updateError" class="text-xs text-error-500 mt-1">{{ updateError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeUpdateModal()"
          />
          <UButton
            :label="CONST_EDIT_BTN"
            variant="actionOkButton"
            type="submit"
            form="update-group-form"
            :loading="isUpdating"
          />
        </div>
      </template>
    </UModal>

    <!-- INVITE MODAL -->
    <UModal
      v-model:open="groupsStore.isInviteModalOpen"
      :title="CONST_INVITE_USER_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="invite-user-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleInviteUser"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_USER_EMAIL_LABEL
            }}</label>
            <UInput
              v-model="inviteEmail"
              :placeholder="CONST_USER_EMAIL_PLACEHOLDER"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_ROLE_SELECTION_LABEL
            }}</label>
            <USelect
              v-model="inviteRole"
              :items="roleOptions"
              label-key="label"
              value-key="value"
              class="min-w-40"
            />
          </div>
          <p
            v-if="inviteError"
            class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
          >
            {{ inviteError }}
          </p>
          <p
            v-if="inviteSuccess"
            class="text-xs font-semibold text-brand-500 mt-2 bg-brand-500/10 p-2 rounded border border-brand-500/20"
          >
            {{ inviteSuccess }}
          </p>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            :disabled="!!inviteSuccess"
            @click="groupsStore.closeInviteModal()"
          />
          <UButton
            :label="CONST_INVITE_BTN"
            variant="actionOkButton"
            type="submit"
            form="invite-user-form"
            :loading="isInviting"
            :disabled="!!inviteSuccess"
          />
        </div>
      </template>
    </UModal>

    <!-- REMOVE USER MODAL -->
    <UModal
      v-model:open="groupsStore.isRemoveUserModalOpen"
      :title="CONST_REMOVE_USER_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p class="text-sm text-dark-text/80 py-2">
          {{ CONST_REMOVE_USER_CONFIRM }}
          <span class="block font-semibold mt-1 text-brand-500"
            >„{{ groupsStore.selectedUserEmailToRemove }}”</span
          >
        </p>
        <p v-if="removeErrorText" class="text-xs text-error-500 mt-1">{{ removeErrorText }}</p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <!-- JAVÍTÁS: () használata -->
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeRemoveUserModal()"
          />
          <UButton
            :label="CONST_REMOVE_BTN"
            variant="actionOkButton"
            :loading="isRemoving"
            @click="handleRemoveUser"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import {
  useUpdateGroupMutation,
  useInviteUserMutation,
  useRemoveUserMutation,
} from '~/queries/groups.mutation';

const groupsStore = useGroupsStore();
const route = useRoute();

const membersGroupUuid = computed(() => route.params.uuid as string);

const {
  mutate: updateGroup,
  isLoading: isUpdating,
  error: updateApiError,
  reset: resetUpdate,
} = useUpdateGroupMutation({
  onSuccess: () => {
    groupsStore.closeUpdateModal();
  },
});
const {
  mutate: inviteUser,
  isLoading: isInviting,
  error: inviteApiError,
  status: inviteStatus,
  reset: resetInvite,
} = useInviteUserMutation({
  onSuccess: () => {
    setTimeout(() => {
      groupsStore.closeInviteModal();
    }, 2000);
  },
});
const {
  mutate: removeUser,
  isLoading: isRemoving,
  error: removeApiError,
  reset: resetRemove,
} = useRemoveUserMutation({
  onSuccess: () => {
    groupsStore.closeRemoveUserModal();
  },
});

// Update Group
const updateGroupName = ref('');
const updateValidationError = ref('');
const updateError = computed(
  () =>
    updateValidationError.value ||
    (updateApiError.value ? getErrorMessage(updateApiError.value) : ''),
);

watch(
  () => groupsStore.isUpdateModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) {
      updateGroupName.value = '';
      updateValidationError.value = '';
      resetUpdate();
    }
  },
);

const handleUpdateGroup = () => {
  resetUpdate();
  updateValidationError.value = '';
  const validationResult = updateGroupSchema.safeParse({ groupName: updateGroupName.value });
  if (!validationResult.success) {
    updateValidationError.value =
      validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  if (membersGroupUuid.value) {
    updateGroup({ groupUuid: membersGroupUuid.value, name: validationResult.data.groupName });
  }
};

// Invite User
const inviteEmail = ref('');
const inviteRole = ref('invitedMember');
const inviteValidationError = ref('');
const inviteError = computed(
  () =>
    inviteValidationError.value ||
    (inviteApiError.value ? getErrorMessage(inviteApiError.value) : ''),
);
const inviteSuccess = computed(() =>
  inviteStatus.value === 'success' ? CONST_INVITE_SUCCESS_MSG : '',
);
const roleOptions = [
  { label: 'Member', value: 'invitedMember' },
  { label: 'Leader', value: 'invitedLeader' },
];

watch(
  () => groupsStore.isInviteModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) {
      inviteEmail.value = '';
      inviteValidationError.value = '';
      resetInvite();
    }
  },
);

const handleInviteUser = () => {
  resetInvite();
  inviteValidationError.value = '';
  const validationResult = inviteUserSchema.safeParse({
    email: inviteEmail.value,
    role: inviteRole.value,
  });
  if (!validationResult.success) {
    inviteValidationError.value =
      validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  if (membersGroupUuid.value) {
    inviteUser({
      groupUuid: membersGroupUuid.value,
      data: {
        invitedUserEmail: validationResult.data.email,
        inviteWithRole: validationResult.data.role,
      },
    });
  }
};

// Remove User
const removeErrorText = computed(() =>
  removeApiError.value ? getErrorMessage(removeApiError.value) : '',
);

watch(
  () => groupsStore.isRemoveUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) resetRemove();
  },
);

const handleRemoveUser = () => {
  if (!groupsStore.selectedUserEmailToRemove || !membersGroupUuid.value) return;
  resetRemove();
  removeUser({ groupUuid: membersGroupUuid.value, email: groupsStore.selectedUserEmailToRemove });
};
</script>
