<!-- frontend/app/components/modals/GroupInvitesModals.vue -->
<template>
  <div>
    <!-- JOIN MODAL -->
    <UModal
      v-model:open="groupsStore.isJoinModalOpen"
      :title="CONST_JOIN_GROUP_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
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
        <p
          v-if="joinErrorText"
          class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
        >
          {{ joinErrorText }}
        </p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeJoinModal"
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

    <!-- DECLINE MODAL -->
    <UModal
      v-model:open="groupsStore.isDeclineModalOpen"
      :title="CONST_DECLINE_INVITE_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
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
        <p
          v-if="declineErrorText"
          class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
        >
          {{ declineErrorText }}
        </p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="groupsStore.closeDeclineModal"
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useJoinGroupMutation, useLeaveGroupMutation } from '~/queries/groups.mutation';

const groupsStore = useGroupsStore();

const {
  mutate: joinGroup,
  isLoading: isJoining,
  error: joinApiError,
  reset: resetJoin,
} = useJoinGroupMutation({
  onSuccess: () => {
    groupsStore.closeJoinModal();
  },
});

const {
  mutate: leaveGroup,
  isLoading: isLeaving,
  error: declineApiError,
  reset: resetDecline,
} = useLeaveGroupMutation({
  onSuccess: () => {
    groupsStore.closeDeclineModal();
  },
});

const joinErrorText = computed(() =>
  joinApiError.value ? getErrorMessage(joinApiError.value) : '',
);
const declineErrorText = computed(() =>
  declineApiError.value ? getErrorMessage(declineApiError.value) : '',
);

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
