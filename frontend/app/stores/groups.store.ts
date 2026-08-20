import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GroupOutDto } from '~/types/groups.type';

export const useGroupsStore = defineStore('groups', () => {
  const isCreateModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const selectedGroupToDelete = ref<GroupOutDto | null>(null);

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

  return {
    isCreateModalOpen,
    isDeleteModalOpen,
    selectedGroupToDelete,
    openCreateModal,
    closeCreateModal,
    openDeleteModal,
    closeDeleteModal,
  };
});