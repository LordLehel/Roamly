import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDocumentsStore = defineStore('documentsModals', () => {
  const isDeleteModalOpen = ref(false);
  const isUploadModalOpen = ref(false);

  const fileToDelete = ref<{ fileId: number; groupUuid: string; fileName: string } | null>(null);
  const uploadGroupUuid = ref<string | null>(null);

  // Delete modal
  const openDeleteModal = (file: { fileId: number; groupUuid: string; fileName: string }) => {
    fileToDelete.value = file;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    fileToDelete.value = null;
  };

  // Upload modal
  const openUploadModal = (groupUuid: string) => {
    uploadGroupUuid.value = groupUuid;
    isUploadModalOpen.value = true;
  };

  // Új bezáró függvény a feltöltéshez
  const closeUploadModal = () => {
    isUploadModalOpen.value = false;
    uploadGroupUuid.value = null;
  };

  return {
    isDeleteModalOpen,
    isUploadModalOpen,

    fileToDelete,
    uploadGroupUuid,

    openDeleteModal,
    closeDeleteModal,
    openUploadModal,
    closeUploadModal,
  };
});
