<!-- frontend/app/components/modals/GroupInvitesModals.vue -->
<template>
  <div>
    <!-- JOIN MODAL -->
    <UModal
      v-model:open="groupsStore.isJoinModalOpen"
      :title="CONST_JOIN_GROUP_TITLE"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ CONST_JOIN_GROUP_CONFIRM }}
          <span v-if="groupsStore.selectedGroupToJoin" :class="appConfig.typography.modalHighlight">
            „{{ groupsStore.selectedGroupToJoin.name }}”
          </span>
        </p>
        <p v-if="joinErrorText" :class="appConfig.typography.modalErrorBox">
          {{ joinErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeJoinModal"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="CONST_JOIN_BTN"
            variant="actionOkButton"
            :loading="isJoining"
            @click="confirmJoin"
          />
        </div>
      </template>
    </UModal>

    <!-- DECLINE MODAL -->
    <UModal
      v-model:open="groupsStore.isDeclineModalOpen"
      :title="CONST_DECLINE_INVITE_TITLE"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeSm }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ CONST_DECLINE_INVITE_CONFIRM }}
          <span
            v-if="groupsStore.selectedGroupToDecline"
            :class="appConfig.typography.modalHighlight"
          >
            „{{ groupsStore.selectedGroupToDecline.name }}”
          </span>
        </p>
        <p v-if="declineErrorText" :class="appConfig.typography.modalErrorBox">
          {{ declineErrorText }}
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.modalActions">
          <UButton
            :class="appConfig.typography.modalActionBtnCancel"
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeDeclineModal"
          />
          <UButton
            :class="appConfig.typography.modalActionBtnOk"
            :label="CONST_DECLINE_BTN"
            variant="actionOkButton"
            :loading="isLeaving"
            @click="confirmDecline"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed } from 'vue';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useJoinGroupMutation, useLeaveGroupMutation } from '~/queries/groups.mutation';
import { useAppConfig } from '#imports';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

/* --- API MUTATIONS --- */
const {
  mutate: joinGroup,
  isLoading: isJoining,
  error: joinApiError,
  reset: resetJoin,
} = useJoinGroupMutation({
  onSuccess: () => groupsStore.closeJoinModal(),
});

const {
  mutate: leaveGroup,
  isLoading: isLeaving,
  error: declineApiError,
  reset: resetDecline,
} = useLeaveGroupMutation({
  onSuccess: () => groupsStore.closeDeclineModal(),
});

/* --- COMPUTED --- */
const joinErrorText = computed(() =>
  joinApiError.value ? getErrorMessage(joinApiError.value) : '',
);
const declineErrorText = computed(() =>
  declineApiError.value ? getErrorMessage(declineApiError.value) : '',
);

/* --- HANDLERS --- */
const confirmJoin = () => {
  if (!groupsStore.selectedGroupToJoin) return;
  resetJoin();
  joinGroup(groupsStore.selectedGroupToJoin.uuid);
};

const confirmDecline = () => {
  if (!groupsStore.selectedGroupToDecline) return;
  resetDecline();
  leaveGroup(groupsStore.selectedGroupToDecline.uuid);
};
</script>
