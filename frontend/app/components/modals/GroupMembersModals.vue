<!-- frontend/app/components/modals/GroupMembersModals.vue -->
<template>
  <div>
    <!-- UPDATE MODAL -->
    <UModal
      v-model:open="groupsStore.isUpdateModalOpen"
      :title="CONST_EDIT_GROUP_TITLE"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="update-group-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="handleUpdateGroup"
        >
          <div>
            <label :class="appConfig.typography.inputLabel">{{ CONST_GROUP_NAME_LABEL }}</label>
            <UInput
              v-model="updateGroupName"
              :placeholder="CONST_GROUP_NAME_PLACEHOLDER"
              variant="glass"
              class="w-full"
            />
            <p v-if="updateError" :class="appConfig.typography.inputError">{{ updateError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
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
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="invite-user-form"
          :class="appConfig.layout.modalForm"
          @submit.prevent="handleInviteUser"
        >
          <div>
            <label :class="appConfig.typography.inputLabel">{{ CONST_USER_EMAIL_LABEL }}</label>
            <UInput
              v-model="inviteEmail"
              :placeholder="CONST_USER_EMAIL_PLACEHOLDER"
              variant="glass"
              class="w-full"
            />
          </div>
          <div>
            <label :class="appConfig.typography.inputLabel">{{ CONST_ROLE_SELECTION_LABEL }}</label>
            <USelect
              v-model="inviteRole"
              :items="roleOptions"
              label-key="label"
              value-key="value"
              class="min-w-40"
            />
          </div>
          <p v-if="inviteError" :class="appConfig.typography.modalErrorBox">
            {{ inviteError }}
          </p>
          <p v-if="inviteSuccess" :class="appConfig.typography.modalSuccessBox">
            {{ inviteSuccess }}
          </p>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
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
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ CONST_REMOVE_USER_CONFIRM }}
          <span :class="appConfig.typography.modalHighlight"
            >„{{ groupsStore.selectedUserEmailToRemove }}”</span
          >
        </p>
        <p v-if="removeErrorText" :class="appConfig.typography.inputError">{{ removeErrorText }}</p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
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

    <!-- PROMOTE USER MODAL -->
    <UModal
      v-model:open="groupsStore.isPromoteUserModalOpen"
      title="Promote User"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          Are you sure you want to promote
          <span :class="appConfig.typography.modalInlineHighlight"
            >„{{ groupsStore.selectedUserNameToPromote }}”</span
          >
          to leader?
        </p>
        <p v-if="promoteErrorText" :class="appConfig.typography.inputError">
          {{ promoteErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closePromoteUserModal()"
          />
          <UButton
            label="Promote"
            variant="actionOkButton"
            :loading="isPromoting"
            @click="handlePromoteUser"
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
  usePromoteUserMutation,
} from '~/queries/groups.mutation';
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
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

// Promote User
const {
  mutate: promoteUser,
  isLoading: isPromoting,
  error: promoteApiError,
  reset: resetPromote,
} = usePromoteUserMutation({
  onSuccess: () => {
    groupsStore.closePromoteUserModal();
  },
});

const promoteErrorText = computed(() =>
  promoteApiError.value ? getErrorMessage(promoteApiError.value) : '',
);

watch(
  () => groupsStore.isPromoteUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) resetPromote();
  },
);

const handlePromoteUser = () => {
  if (!groupsStore.selectedUserEmailToPromote || !membersGroupUuid.value) return;
  resetPromote();
  promoteUser({
    groupUuid: membersGroupUuid.value,
    email: groupsStore.selectedUserEmailToPromote,
  });
};
</script>
