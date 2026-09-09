// frontend/app/stores/documents.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDocumentsStore = defineStore('documentsModals', () => {
  // ==========================================
  // GROUP DOCUMENT MODALS
  // ==========================================

  const isDeleteModalOpen = ref(false);
  const isUploadModalOpen = ref(false);
  const isGroupUpdateModalOpen = ref(false);

  const fileToDelete = ref<{ fileId: number; groupUuid: string; fileName: string } | null>(null);
  const uploadGroupUuid = ref<string | null>(null);
  const groupFileToUpdate = ref<{
    fileId: number;
    groupUuid: string;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  } | null>(null);

  // Group — Delete modal
  const openDeleteModal = (file: { fileId: number; groupUuid: string; fileName: string }) => {
    fileToDelete.value = file;
    isDeleteModalOpen.value = true;
  };

  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    fileToDelete.value = null;
  };

  // Group — Upload modal
  const openUploadModal = (groupUuid: string) => {
    uploadGroupUuid.value = groupUuid;
    isUploadModalOpen.value = true;
  };

  const closeUploadModal = () => {
    isUploadModalOpen.value = false;
    uploadGroupUuid.value = null;
  };

  // Group — Update modal
  const openGroupUpdateModal = (file: {
    fileId: number;
    groupUuid: string;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  }) => {
    groupFileToUpdate.value = file;
    isGroupUpdateModalOpen.value = true;
  };

  const closeGroupUpdateModal = () => {
    isGroupUpdateModalOpen.value = false;
    groupFileToUpdate.value = null;
  };

  // ==========================================
  // PRIVATE DOCUMENT MODALS
  // ==========================================

  const isPrivateUploadModalOpen = ref(false);
  const isPrivateUpdateModalOpen = ref(false);
  const isPrivateDeleteModalOpen = ref(false);

  const privateFileToDelete = ref<{ fileId: number; fileName: string } | null>(null);
  const privateFileToUpdate = ref<{
    fileId: number;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  } | null>(null);

  // Private — Upload modal
  const openPrivateUploadModal = () => {
    isPrivateUploadModalOpen.value = true;
  };

  const closePrivateUploadModal = () => {
    isPrivateUploadModalOpen.value = false;
  };

  // Private — Update modal
  const openPrivateUpdateModal = (file: {
    fileId: number;
    fileName: string;
    documentType?: string;
    issueDate?: string;
    expiryDate?: string;
  }) => {
    privateFileToUpdate.value = file;
    isPrivateUpdateModalOpen.value = true;
  };

  const closePrivateUpdateModal = () => {
    isPrivateUpdateModalOpen.value = false;
    privateFileToUpdate.value = null;
  };

  // Private — Delete modal
  const openPrivateDeleteModal = (file: { fileId: number; fileName: string }) => {
    privateFileToDelete.value = file;
    isPrivateDeleteModalOpen.value = true;
  };

  const closePrivateDeleteModal = () => {
    isPrivateDeleteModalOpen.value = false;
    privateFileToDelete.value = null;
  };

  return {
    // Group modals
    isDeleteModalOpen,
    isUploadModalOpen,
    isGroupUpdateModalOpen,
    fileToDelete,
    uploadGroupUuid,
    groupFileToUpdate,
    openDeleteModal,
    closeDeleteModal,
    openUploadModal,
    closeUploadModal,
    openGroupUpdateModal,
    closeGroupUpdateModal,

    // Private document modals
    isPrivateUploadModalOpen,
    isPrivateUpdateModalOpen,
    isPrivateDeleteModalOpen,
    privateFileToDelete,
    privateFileToUpdate,
    openPrivateUploadModal,
    closePrivateUploadModal,
    openPrivateUpdateModal,
    closePrivateUpdateModal,
    openPrivateDeleteModal,
    closePrivateDeleteModal,
  };
});
