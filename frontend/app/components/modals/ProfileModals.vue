<!-- frontend/app/components/modals/ProfileModals.vue -->
<template>
  <div>
    <!-- Edit Username -->
    <UModal
      v-model:open="profileStore.isEditUsernameModalOpen"
      :title="CONST_EDIT_USERNAME_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="edit-username-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleUpdateUsername"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_USERNAME_LABEL
            }}</label>
            <UInput v-model="editFormData.username" class="w-full" />
            <p v-if="usernameError" class="text-xs text-error-500 mt-1">{{ usernameError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="profileStore.closeEditUsernameModal()"
          />
          <UButton
            :label="CONST_EDIT_BTN"
            variant="actionOkButton"
            type="submit"
            form="edit-username-form"
            :loading="isUpdatingProfile"
          />
        </div>
      </template>
    </UModal>

    <!-- Edit Email -->
    <UModal
      v-model:open="profileStore.isEditEmailModalOpen"
      :title="CONST_EDIT_EMAIL_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="edit-email-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleUpdateEmail"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_EMAIL_LABEL
            }}</label>
            <UInput v-model="editFormData.email" type="email" class="w-full" />
            <p v-if="emailError" class="text-xs text-error-500 mt-1">{{ emailError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="profileStore.closeEditEmailModal()"
          />
          <UButton
            :label="CONST_EDIT_BTN"
            variant="actionOkButton"
            type="submit"
            form="edit-email-form"
            :loading="isUpdatingProfile"
          />
        </div>
      </template>
    </UModal>

    <!-- Change Password -->
    <UModal
      v-model:open="profileStore.isChangePasswordModalOpen"
      :title="CONST_CHANGE_PASSWORD_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="change-pwd-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleChangePassword"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_OLD_PASSWORD_LABEL
            }}</label>
            <UInput v-model="pwdData.oldPassword" type="password" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_NEW_PASSWORD_LABEL
            }}</label>
            <UInput v-model="pwdData.newPassword" type="password" class="w-full" />
          </div>
          <p v-if="passwordError" class="text-xs text-error-500 mt-1">{{ passwordError }}</p>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="profileStore.closeChangePasswordModal()"
          />
          <UButton
            :label="CONST_EDIT_BTN"
            variant="actionOkButton"
            type="submit"
            form="change-pwd-form"
            :loading="isChangingPwd"
          />
        </div>
      </template>
    </UModal>

    <!-- Delete Account -->
    <UModal
      v-model:open="profileStore.isDeleteModalOpen"
      :title="CONST_DELETE_ACCOUNT_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p class="text-sm text-dark-text/80 py-2">{{ CONST_DELETE_ACCOUNT_CONFIRM }}</p>
        <p v-if="deleteError" class="text-xs text-error-500 mt-1">{{ deleteError }}</p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="profileStore.closeDeleteModal()"
          />
          <UButton
            :label="CONST_DELETE_BTN"
            variant="actionOkButton"
            :loading="isDeleting"
            @click="handleDeleteProfile"
          />
        </div>
      </template>
    </UModal>

    <!-- Upload Picture -->
    <UModal
      v-model:open="profileStore.isUploadPictureModalOpen"
      :title="CONST_UPLOAD_PICTURE_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="upload-pic-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleUploadPicture"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_SELECT_FILE_LABEL
            }}</label>
            <input
              type="file"
              class="w-full text-sm text-dark-text/70 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-transparent file:text-brand-500 file:ring-1 file:ring-brand-500/40 hover:file:bg-brand-500/20 file:transition-colors file:cursor-pointer cursor-pointer"
              accept="image/*"
              @change="onPictureSelected"
            />
            <p v-if="uploadPicError" class="text-xs text-error-500 mt-1">{{ uploadPicError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="profileStore.closeUploadPictureModal()"
          />
          <UButton
            :label="CONST_UPLOAD_BTN"
            variant="actionOkButton"
            type="submit"
            form="upload-pic-form"
            :loading="isUploadingPic"
          />
        </div>
      </template>
    </UModal>

    <!-- View Picture Full -->
    <UModal
      v-model:open="profileStore.isViewPictureModalOpen"
      :title="CONST_VIEW_PICTURE_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <div
          class="w-full h-80 flex items-center justify-center bg-surface-600/10 rounded-2xl overflow-hidden mt-2"
        >
          <img
            v-if="profileStore.selectedUser?.profile_image_url"
            :src="profileStore.selectedUser.profile_image_url"
            alt="Profile Full"
            class="max-w-full max-h-full object-contain"
          />
          <UIcon v-else name="i-heroicons-user" class="w-32 h-32 text-surface-500/50" />
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end w-full">
          <UButton
            label="OK"
            variant="actionOkButton"
            @click="profileStore.closeViewPictureModal()"
          />
        </div>
      </template>
    </UModal>

    <!-- Upload Document (Dummy) -->
    <UModal
      v-model:open="profileStore.isUploadDocumentModalOpen"
      :title="CONST_UPLOAD_DOCUMENT_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="upload-doc-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="profileStore.closeUploadDocumentModal()"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_SELECT_FILE_LABEL
            }}</label>
            <input
              type="file"
              class="w-full text-sm text-dark-text/70 file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-transparent file:text-brand-500 file:ring-1 file:ring-brand-500/40 hover:file:bg-brand-500/20 file:transition-colors file:cursor-pointer cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_DOCUMENT_TYPE_LABEL
            }}</label>
            <USelect
              :items="[
                { label: 'ID Card', value: 'id' },
                { label: 'Passport', value: 'passport' },
              ]"
              label-key="label"
              value-key="value"
            />
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-dark-text mb-1">{{
                CONST_ISSUED_AT_LABEL
              }}</label>
              <UInput type="date" class="w-full" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-dark-text mb-1">{{
                CONST_ENDS_AT_LABEL
              }}</label>
              <UInput type="date" class="w-full" />
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="profileStore.closeUploadDocumentModal()"
          />
          <UButton
            :label="CONST_UPLOAD_BTN"
            variant="actionOkButton"
            type="submit"
            form="upload-doc-form"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useProfileStore } from '~/stores/profile.modals.store';
import {
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useChangePasswordMutation,
  useUploadProfilePictureMutation,
} from '~/queries/user.mutation';
import {
  updateUsernameSchema,
  updateEmailSchema,
  changePasswordSchema,
} from '~/utils/schemas/users.validation';
import type { ApiError } from '~/types/apiError.type';

const profileStore = useProfileStore();
const router = useRouter();
const { logout } = useAuth();

const getErrorMessage = (error: unknown) => {
  const apiErr = error as ApiError;
  const msg = apiErr?.response?._data?.message;
  return typeof msg === 'string' ? msg : CONST_INVALID_DATA_ERROR;
};

// ---- MUTATIONS ----

const {
  mutate: updateProfile,
  isLoading: isUpdatingProfile,
  error: updateApiError,
  reset: resetUpdateProfile,
} = useUpdateProfileMutation({
  onSuccess: () => {
    profileStore.closeEditUsernameModal();
    profileStore.closeEditEmailModal();
  },
});

const {
  mutate: changePwd,
  isLoading: isChangingPwd,
  error: pwdApiError,
  reset: resetPwd,
} = useChangePasswordMutation({
  onSuccess: () => {
    profileStore.closeChangePasswordModal();
  },
});

const {
  mutate: deleteProfile,
  isLoading: isDeleting,
  error: deleteApiError,
  reset: resetDelete,
} = useDeleteProfileMutation({
  onSuccess: () => {
    profileStore.closeDeleteModal();
    logout();
    router.push('/login');
  },
});

const {
  mutate: uploadPicture,
  isLoading: isUploadingPic,
  error: uploadPicApiError,
  reset: resetUploadPic,
} = useUploadProfilePictureMutation({
  onSuccess: () => {
    profileStore.closeUploadPictureModal();
  },
});

// ---- STATE & LOGIC ----

const editFormData = reactive({ username: '', email: '' });
const pwdData = reactive({ oldPassword: '', newPassword: '' });
const selectedPicture = ref<File | null>(null);

// -- Username Edit --
const usernameValidationError = ref('');
const usernameError = computed(
  () =>
    usernameValidationError.value ||
    (updateApiError.value ? getErrorMessage(updateApiError.value) : ''),
);

watch(
  () => profileStore.isEditUsernameModalOpen,
  (isOpen) => {
    if (isOpen && profileStore.selectedUser) {
      editFormData.username = profileStore.selectedUser.username || '';
      usernameValidationError.value = '';
      resetUpdateProfile();
    }
  },
);

const handleUpdateUsername = () => {
  resetUpdateProfile();
  usernameValidationError.value = '';

  const validationResult = updateUsernameSchema.safeParse({ username: editFormData.username });
  if (!validationResult.success) {
    usernameValidationError.value =
      validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  updateProfile({ username: validationResult.data.username });
};

// -- Email Edit --
const emailValidationError = ref('');
const emailError = computed(
  () =>
    emailValidationError.value ||
    (updateApiError.value ? getErrorMessage(updateApiError.value) : ''),
);

watch(
  () => profileStore.isEditEmailModalOpen,
  (isOpen) => {
    if (isOpen && profileStore.selectedUser) {
      editFormData.email = profileStore.selectedUser.email || '';
      emailValidationError.value = '';
      resetUpdateProfile();
    }
  },
);

const handleUpdateEmail = () => {
  resetUpdateProfile();
  emailValidationError.value = '';

  const validationResult = updateEmailSchema.safeParse({ email: editFormData.email });
  if (!validationResult.success) {
    emailValidationError.value =
      validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  updateProfile({ email: validationResult.data.email });
};

// -- Password Change --
const pwdValidationError = ref('');
const passwordError = computed(
  () => pwdValidationError.value || (pwdApiError.value ? getErrorMessage(pwdApiError.value) : ''),
);

watch(
  () => profileStore.isChangePasswordModalOpen,
  (isOpen) => {
    if (isOpen) {
      pwdData.oldPassword = '';
      pwdData.newPassword = '';
      pwdValidationError.value = '';
      resetPwd();
    }
  },
);

const handleChangePassword = () => {
  resetPwd();
  pwdValidationError.value = '';

  const validationResult = changePasswordSchema.safeParse({
    oldPassword: pwdData.oldPassword,
    newPassword: pwdData.newPassword,
  });

  if (!validationResult.success) {
    pwdValidationError.value =
      validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  changePwd({
    oldPassword: validationResult.data.oldPassword,
    newPassword: validationResult.data.newPassword,
  });
};

// -- Profile Delete --
const deleteError = computed(() =>
  deleteApiError.value ? getErrorMessage(deleteApiError.value) : '',
);

watch(
  () => profileStore.isDeleteModalOpen,
  (isOpen) => {
    if (isOpen) resetDelete();
  },
);

const handleDeleteProfile = () => {
  resetDelete();
  deleteProfile();
};

// -- Profile Picture Upload --
const uploadPicValidationError = ref('');
const uploadPicError = computed(
  () =>
    uploadPicValidationError.value ||
    (uploadPicApiError.value ? getErrorMessage(uploadPicApiError.value) : ''),
);

watch(
  () => profileStore.isUploadPictureModalOpen,
  (isOpen) => {
    if (isOpen) {
      selectedPicture.value = null;
      uploadPicValidationError.value = '';
      resetUploadPic();
    }
  },
);

const onPictureSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedPicture.value = target.files[0] ?? null;
  } else {
    selectedPicture.value = null;
  }
};

const handleUploadPicture = () => {
  resetUploadPic();
  uploadPicValidationError.value = '';
  if (!selectedPicture.value) {
    uploadPicValidationError.value = 'Please select a file first.';
    return;
  }
  uploadPicture(selectedPicture.value);
};
</script>
