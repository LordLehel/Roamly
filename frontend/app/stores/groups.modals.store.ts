// frontend/app/stores/groups.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupOutDto, GroupInvitesOutDto } from '~/types/groups.type';

export const useGroupsStore = defineStore('groups', () => {
  const isCreateModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const isLeaveModalOpen = ref(false);
  const isJoinModalOpen = ref(false);
  const isDeclineModalOpen = ref(false);
  const isRemoveUserModalOpen = ref(false);
  const isUpdateModalOpen = ref(false);
  const isInviteModalOpen = ref(false);
  const groupNameToUpdate = ref('');

  const selectedGroupToDelete = ref<GroupOutDto | null>(null);
  const selectedGroupToLeave = ref<GroupOutDto | null>(null);
  const selectedGroupToJoin = ref<GroupInvitesOutDto | null>(null);
  const selectedGroupToDecline = ref<GroupInvitesOutDto | null>(null);
  const selectedUserEmailToRemove = ref<string | null>(null);

  // Create modal
  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };

  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
  };

  // Delete modal
  const openDeleteModal = (group: GroupOutDto) => {
    selectedGroupToDelete.value = group;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    selectedGroupToDelete.value = null;
  };

  // Leave modal
  const openLeaveModal = (group: GroupOutDto) => {
    selectedGroupToLeave.value = group;
    isLeaveModalOpen.value = true;
  };

  const closeLeaveModal = () => {
    isLeaveModalOpen.value = false;
    selectedGroupToLeave.value = null;
  };

  // Join modal
  const openJoinModal = (group: GroupInvitesOutDto) => {
    selectedGroupToJoin.value = group;
    isJoinModalOpen.value = true;
  };

  const closeJoinModal = () => {
    isJoinModalOpen.value = false;
    selectedGroupToJoin.value = null;
  };

  // Decline modal
  const openDeclineModal = (group: GroupInvitesOutDto) => {
    selectedGroupToDecline.value = group;
    isDeclineModalOpen.value = true;
  };

  const closeDeclineModal = () => {
    isDeclineModalOpen.value = false;
    selectedGroupToDecline.value = null;
  };

  // Update modal
  const openUpdateModal = (currentName: string) => {
    groupNameToUpdate.value = currentName;
    isUpdateModalOpen.value = true;
  };

  const closeUpdateModal = () => {
    isUpdateModalOpen.value = false;
  };

  // Invite Modal
  const openInviteModal = () => {
    isInviteModalOpen.value = true;
  };
  const closeInviteModal = () => {
    isInviteModalOpen.value = false;
  };

  // Remove User Modal
  const openRemoveUserModal = (email: string) => {
    selectedUserEmailToRemove.value = email;
    isRemoveUserModalOpen.value = true;
  };
  const closeRemoveUserModal = () => {
    isRemoveUserModalOpen.value = false;
    selectedUserEmailToRemove.value = null;
  };

  return {
    isCreateModalOpen,
    isDeleteModalOpen,
    isJoinModalOpen,
    isDeclineModalOpen,
    isLeaveModalOpen,
    isUpdateModalOpen,
    isInviteModalOpen,
    isRemoveUserModalOpen,
    groupNameToUpdate,

    selectedGroupToLeave,
    selectedGroupToJoin,
    selectedGroupToDecline,
    selectedGroupToDelete,
    selectedUserEmailToRemove,

    openCreateModal,
    closeCreateModal,
    openDeleteModal,
    closeDeleteModal,
    openLeaveModal,
    closeLeaveModal,
    openJoinModal,
    closeJoinModal,
    openDeclineModal,
    closeDeclineModal,
    openUpdateModal,
    closeUpdateModal,
    openInviteModal,
    closeInviteModal,
    openRemoveUserModal,
    closeRemoveUserModal,
  };
});
