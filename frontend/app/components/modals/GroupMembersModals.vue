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
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeUpdateModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
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
          <p v-if="inviteError" :class="appConfig.typography.modalErrorBox">{{ inviteError }}</p>
          <p v-if="inviteSuccess" :class="appConfig.typography.modalSuccessBox">
            {{ inviteSuccess }}
          </p>
        </form>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            :disabled="!!inviteSuccess"
            @click="groupsStore.closeInviteModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
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
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeRemoveUserModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
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
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closePromoteUserModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            label="Promote"
            variant="actionOkButton"
            :loading="isPromoting"
            @click="handlePromoteUser"
          />
        </div>
      </template>
    </UModal>

    <!-- DEMOTE USER MODAL -->
    <UModal
      v-model:open="groupsStore.isDemoteUserModalOpen"
      title="Demote User"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          Are you sure you want to demote
          <span :class="appConfig.typography.modalInlineHighlight"
            >„{{ groupsStore.selectedUserNameToDemote }}”</span
          >
          to a regular member? They will lose their leadership privileges.
        </p>
        <p v-if="demoteErrorText" :class="appConfig.typography.inputError">{{ demoteErrorText }}</p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeDemoteUserModal()"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            label="Demote"
            variant="actionCancelButton"
            class="text-orange-500 hover:text-white hover:bg-orange-600 ring-orange-500"
            :loading="isDemoting"
            @click="handleDemoteUser"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupsStore } from '~/stores/groups.modals.store';
import {
  useUpdateGroupMutation,
  useInviteUserMutation,
  useRemoveUserMutation,
  usePromoteUserMutation,
  useDemoteUserMutation,
} from '~/queries/groups.mutation';
import { useAppConfig } from '#imports';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();
const route = useRoute();
const membersGroupUuid = computed(() => route.params.uuid as string);

/* --- UPDATE LOGIC --- */
const updateGroupName = ref('');
const updateValidationError = ref('');
const {
  mutate: updateGroup,
  isLoading: isUpdating,
  error: updateApiError,
  reset: resetUpdate,
} = useUpdateGroupMutation({
  onSuccess: () => groupsStore.closeUpdateModal(),
});
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
  if (membersGroupUuid.value)
    updateGroup({ groupUuid: membersGroupUuid.value, name: validationResult.data.groupName });
};

/* --- INVITE LOGIC --- */
const inviteEmail = ref('');
const inviteRole = ref('invitedMember');
const inviteValidationError = ref('');
const roleOptions = [
  { label: 'Member', value: 'invitedMember' },
  { label: 'Leader', value: 'invitedLeader' },
];
const {
  mutate: inviteUser,
  isLoading: isInviting,
  error: inviteApiError,
  status: inviteStatus,
  reset: resetInvite,
} = useInviteUserMutation({
  onSuccess: () => setTimeout(() => groupsStore.closeInviteModal(), 2000),
});
const inviteError = computed(
  () =>
    inviteValidationError.value ||
    (inviteApiError.value ? getErrorMessage(inviteApiError.value) : ''),
);
const inviteSuccess = computed(() =>
  inviteStatus.value === 'success' ? CONST_INVITE_SUCCESS_MSG : '',
);

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
  if (membersGroupUuid.value)
    inviteUser({
      groupUuid: membersGroupUuid.value,
      data: {
        invitedUserEmail: validationResult.data.email,
        inviteWithRole: validationResult.data.role,
      },
    });
};

/* --- REMOVE LOGIC --- */
const {
  mutate: removeUser,
  isLoading: isRemoving,
  error: removeApiError,
  reset: resetRemove,
} = useRemoveUserMutation({
  onSuccess: () => groupsStore.closeRemoveUserModal(),
});
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

/* --- PROMOTE LOGIC --- */
const {
  mutate: promoteUser,
  isLoading: isPromoting,
  error: promoteApiError,
  reset: resetPromote,
} = usePromoteUserMutation({
  onSuccess: () => groupsStore.closePromoteUserModal(),
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
  promoteUser({ groupUuid: membersGroupUuid.value, email: groupsStore.selectedUserEmailToPromote });
};

/* --- DEMOTE LOGIC --- */
const {
  mutate: demoteUser,
  isLoading: isDemoting,
  error: demoteApiError,
  reset: resetDemote,
} = useDemoteUserMutation({
  onSuccess: () => groupsStore.closeDemoteUserModal(),
});
const demoteErrorText = computed(() =>
  demoteApiError.value ? getErrorMessage(demoteApiError.value) : '',
);

watch(
  () => groupsStore.isDemoteUserModalOpen,
  (isOpen: boolean) => {
    if (!isOpen) resetDemote();
  },
);
const handleDemoteUser = () => {
  if (!groupsStore.selectedUserEmailToDemote || !membersGroupUuid.value) return;
  resetDemote();
  demoteUser({ groupUuid: membersGroupUuid.value, email: groupsStore.selectedUserEmailToDemote });
};
</script>
