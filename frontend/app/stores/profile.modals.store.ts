// frontend/app/stores/profile.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserOutDto } from '~/types/user.type';

export const useProfileStore = defineStore('profile', () => {
  const isEditUsernameModalOpen = ref(false);
  const isEditEmailModalOpen = ref(false);
  const isChangePasswordModalOpen = ref(false);
  const isDeleteModalOpen = ref(false);
  const isUploadPictureModalOpen = ref(false);
  const isViewPictureModalOpen = ref(false);
  const isUploadDocumentModalOpen = ref(false);

  const selectedUser = ref<UserOutDto | null>(null);

  const openEditUsernameModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isEditUsernameModalOpen.value = true;
  };
  const closeEditUsernameModal = () => {
    isEditUsernameModalOpen.value = false;
    selectedUser.value = null;
  };

  const openEditEmailModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isEditEmailModalOpen.value = true;
  };
  const closeEditEmailModal = () => {
    isEditEmailModalOpen.value = false;
    selectedUser.value = null;
  };

  const openChangePasswordModal = () => {
    isChangePasswordModalOpen.value = true;
  };
  const closeChangePasswordModal = () => {
    isChangePasswordModalOpen.value = false;
  };

  const openDeleteModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isDeleteModalOpen.value = true;
  };
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    selectedUser.value = null;
  };

  const openUploadPictureModal = () => {
    isUploadPictureModalOpen.value = true;
  };
  const closeUploadPictureModal = () => {
    isUploadPictureModalOpen.value = false;
  };

  const openViewPictureModal = (user: UserOutDto) => {
    selectedUser.value = user;
    isViewPictureModalOpen.value = true;
  };
  const closeViewPictureModal = () => {
    isViewPictureModalOpen.value = false;
    selectedUser.value = null;
  };

  const openUploadDocumentModal = () => {
    isUploadDocumentModalOpen.value = true;
  };
  const closeUploadDocumentModal = () => {
    isUploadDocumentModalOpen.value = false;
  };

  return {
    isEditUsernameModalOpen,
    isEditEmailModalOpen,
    isChangePasswordModalOpen,
    isDeleteModalOpen,
    isUploadPictureModalOpen,
    isViewPictureModalOpen,
    isUploadDocumentModalOpen,
    
    selectedUser,

    openEditUsernameModal,
    closeEditUsernameModal,
    openEditEmailModal,
    closeEditEmailModal,
    openChangePasswordModal,
    closeChangePasswordModal,
    openDeleteModal,
    closeDeleteModal,
    openUploadPictureModal,
    closeUploadPictureModal,
    openViewPictureModal,
    closeViewPictureModal,
    openUploadDocumentModal,
    closeUploadDocumentModal,
  };
});