// frontend/app/stores/groups.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupOutDto } from '~/types/groups.type';

export const useGroupsStore = defineStore('groups', () => {
  const isCreateModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedGroupToDelete = ref<GroupOutDto | null>(null);

  const isJoinModalOpen = ref(false);
  const isDeclineModalOpen = ref(false);
  const selectedGroupToJoin = ref<GroupOutDto | null>(null);
  const selectedGroupToDecline = ref<GroupOutDto | null>(null);

  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };

  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
  };

  const openDeleteModal = (group: GroupOutDto) => {
    selectedGroupToDelete.value = group;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    selectedGroupToDelete.value = null;
  };

  const openJoinModal = (group: GroupOutDto) => {
    selectedGroupToJoin.value = group;
    isJoinModalOpen.value = true;
  };

  const closeJoinModal = () => {
    isJoinModalOpen.value = false;
    selectedGroupToJoin.value = null;
  };

  const openDeclineModal = (group: GroupOutDto) => {
    selectedGroupToDecline.value = group;
    isDeclineModalOpen.value = true;
  };

  const closeDeclineModal = () => {
    isDeclineModalOpen.value = false;
    selectedGroupToDecline.value = null;
  };

  return {
    isCreateModalOpen,
    isDeleteModalOpen,
    selectedGroupToDelete,
    isJoinModalOpen,
    isDeclineModalOpen,
    selectedGroupToJoin,
    selectedGroupToDecline,
    openCreateModal,
    closeCreateModal,
    openDeleteModal,
    closeDeleteModal,
    openJoinModal,
    closeJoinModal,
    openDeclineModal,
    closeDeclineModal,
  };
});