<!-- frontend/app/pages/users/profile.vue -->
<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10 relative">
    <!-- Profile Heading -->
    <div>
      <h1 :class="appConfig.typography.pageTitle">{{ CONST_PROFILE_HEADING }}</h1>
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="currentUser" class="w-full relative">
        <!-- PROFILE Card -->
        <div
          class="w-full bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] ring-1 ring-surface-500/50 p-8 flex flex-col md:flex-row gap-10 relative"
        >
          <!-- Delete Button -->
          <div class="absolute top-4 right-4 z-10">
            <UButton
              icon="i-heroicons-trash"
              variant="glassIconButtonDanger"
              @click="isDeleteModalOpen = true"
            />
          </div>

          <!-- Profile picture -->
          <div class="relative w-40 h-40 shrink-0 mx-auto md:mx-0 md:ml-12 mt-8 md:mt-0">
            <div
              class="w-full h-full bg-brand-500 rounded-2xl overflow-hidden shadow-lg border border-surface-500/50 flex items-center justify-center relative"
            >
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <UIcon v-else name="i-heroicons-user" class="w-20 h-20 text-surface-500" />

              <div
                class="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent pointer-events-none"
              ></div>

              <UButton
                icon="i-heroicons-eye"
                variant="ghostDangerIconButton"
                class="absolute bottom-2 left-2 text-surface-500"
                @click="isViewPictureModalOpen = true"
              />
              <UButton
                icon="i-heroicons-arrow-up-tray"
                variant="ghostDangerIconButton"
                class="absolute bottom-2 right-2 text-surface-500"
                @click="isUploadPictureModalOpen = true"
              />
            </div>
          </div>

          <!-- Right side: user details -->
          <div class="flex-1 flex flex-col justify-center gap-3 text-dark-text pt-2">
            <!-- Username -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_USERNAME_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold text-lg">{{ currentUser.username }}</p>
                <UButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  @click="openEditUsername"
                />
              </div>
            </div>
            <!-- Email -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_EMAIL_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold">{{ currentUser.email }}</p>
                <UButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  @click="openEditEmail"
                />
              </div>
            </div>
            <!-- Password -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_PASSWORD_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold text-xl leading-none">************</p>
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="isChangePasswordModalOpen = true"
                  />
                </div>
              </div>
            </div>
            <!-- Registered -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_REGISTERED_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold">
                  {{
                    currentUser.created_at
                      ? new Date(currentUser.created_at).toLocaleDateString()
                      : 'N/A'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- DOCUMENT SECTION -->
        <div class="mt-12 flex flex-col gap-6">
          <div class="flex flex-col md:flex-row justify-between items-center w-full gap-6">
            <div class="flex items-center gap-4">
              <UButton
                icon="i-heroicons-funnel"
                :label="CONST_FILTER_LABEL"
                variant="glassButton"
              />
              <UButton
                icon="i-heroicons-plus"
                variant="glassIconButton"
                @click="isUploadDocumentModalOpen = true"
              />
            </div>
            <h2 class="text-2xl font-bold text-surface-500 tracking-wide text-center flex-1">
              {{ CONST_DOCUMENTS_HEADING }}
            </h2>
            <div class="w-30 hidden md:block"></div>
          </div>

          <!-- Dummy Document List -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
            <UCard
              v-for="doc in dummyDocuments"
              :key="doc.id"
              variant="documentGlass"
              class="relative"
            >
              <!-- Title and action buttons -->
              <div
                class="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-linear-to-b from-black/50 to-transparent text-white"
              >
                <p class="font-bold truncate pr-2 shadow-sm">{{ doc.title }}</p>
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                  />
                </div>
              </div>

              <!-- File Preview (Proxy) -->
              <div
                class="w-full h-40 bg-surface-600/30 flex flex-col items-center justify-center relative"
              >
                <UIcon name="i-heroicons-photo" class="w-16 h-16 text-surface-500/50" />

                <div class="absolute bottom-2 px-4 w-full flex justify-between">
                  <UButton icon="i-heroicons-eye" variant="ghostDangerIconButton" />
                  <UButton icon="i-heroicons-arrow-down-tray" variant="ghostDangerIconButton" />
                </div>
              </div>

              <!-- Metadata -->
              <div class="p-4 flex flex-col gap-1.5 text-xs text-dark-text/80">
                <p>
                  Uploaded at: <span class="font-bold text-dark-text">{{ doc.uploadedAt }}</span>
                </p>
                <p>
                  Document type: <span class="font-bold text-dark-text">{{ doc.type }}</span>
                </p>
                <div class="my-1 border-t border-dark-text/10 w-full"></div>
                <div class="flex justify-between w-full">
                  <p>
                    File type: <span class="font-bold text-dark-text">{{ doc.fileType }}</span>
                  </p>
                  <p>
                    File size: <span class="font-bold text-dark-text">{{ doc.fileSize }}</span>
                  </p>
                </div>
                <div class="my-1 border-t border-dark-text/10 w-full"></div>
                <p>
                  Issued: <span class="font-bold text-dark-text">{{ doc.issued }}</span>
                </p>
                <p>
                  Ends: <span class="font-bold text-dark-text">{{ doc.ends }}</span>
                </p>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- MODALS -->

    <!-- Edit Username -->
    <UModal
      v-model:open="isEditUsernameModalOpen"
      :title="CONST_EDIT_USERNAME_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="edit-username-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleUpdateProfile('username')"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_USERNAME_LABEL
            }}</label>
            <UInput v-model="editFormData.username" class="w-full" />
            <p v-if="editError" class="text-xs text-error-500 mt-1">{{ editError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="closeModals"
          />
          <UButton
            :label="CONST_EDIT_BTN"
            variant="actionOkButton"
            type="submit"
            form="edit-username-form"
            :loading="isUpdating"
          />
        </div>
      </template>
    </UModal>

    <!-- Edit Email -->
    <UModal
      v-model:open="isEditEmailModalOpen"
      :title="CONST_EDIT_EMAIL_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form
          id="edit-email-form"
          class="flex flex-col gap-4 py-2"
          @submit.prevent="handleUpdateProfile('email')"
        >
          <div>
            <label class="block text-sm font-medium text-dark-text mb-1">{{
              CONST_EMAIL_LABEL
            }}</label>
            <UInput v-model="editFormData.email" type="email" class="w-full" />
            <p v-if="editError" class="text-xs text-error-500 mt-1">{{ editError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="closeModals"
          />
          <UButton
            :label="CONST_EDIT_BTN"
            variant="actionOkButton"
            type="submit"
            form="edit-email-form"
            :loading="isUpdating"
          />
        </div>
      </template>
    </UModal>

    <!-- Change Password -->
    <UModal
      v-model:open="isChangePasswordModalOpen"
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
          <p v-if="editError" class="text-xs text-error-500 mt-1">{{ editError }}</p>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="closeModals"
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
      v-model:open="isDeleteModalOpen"
      :title="CONST_DELETE_ACCOUNT_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p class="text-sm text-dark-text/80 py-2">{{ CONST_DELETE_ACCOUNT_CONFIRM }}</p>
        <p v-if="editError" class="text-xs text-error-500 mt-1">{{ editError }}</p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="closeModals"
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
      v-model:open="isUploadPictureModalOpen"
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
            <p v-if="editError" class="text-xs text-error-500 mt-1">{{ editError }}</p>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="closeModals"
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
      v-model:open="isViewPictureModalOpen"
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
            v-if="currentUser?.profile_image_url"
            :src="currentUser.profile_image_url"
            alt="Profile Full"
            class="max-w-full max-h-full object-contain"
          />
          <UIcon v-else name="i-heroicons-user" class="w-32 h-32 text-surface-500/50" />
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-end w-full">
          <UButton label="OK" variant="actionOkButton" @click="isViewPictureModalOpen = false" />
        </div>
      </template>
    </UModal>

    <!-- Upload Document (Dummy) -->
    <UModal
      v-model:open="isUploadDocumentModalOpen"
      :title="CONST_UPLOAD_DOCUMENT_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <form id="upload-doc-form" class="flex flex-col gap-4 py-2" @submit.prevent="closeModals">
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
            @click="closeModals"
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
import { useAppConfig } from '#imports';
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useCurrentUserQuery } from '~/queries/user.query';
import {
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useChangePasswordMutation,
  useUploadProfilePictureMutation,
} from '~/queries/user.mutation';
import type { ApiError } from '~/types/apiError.type';
import {
  CONST_PROFILE_HEADING,
  CONST_DOCUMENTS_HEADING,
  CONST_USERNAME_LABEL,
  CONST_EMAIL_LABEL,
  CONST_PASSWORD_LABEL,
  CONST_REGISTERED_LABEL,
  CONST_FILTER_LABEL,
  CONST_LOADING_TEXT,
  CONST_FETCH_ERROR_TEXT,
  CONST_EDIT_USERNAME_TITLE,
  CONST_EDIT_EMAIL_TITLE,
  CONST_CHANGE_PASSWORD_TITLE,
  CONST_DELETE_ACCOUNT_TITLE,
  CONST_DELETE_ACCOUNT_CONFIRM,
  CONST_UPLOAD_PICTURE_TITLE,
  CONST_VIEW_PICTURE_TITLE,
  CONST_UPLOAD_DOCUMENT_TITLE,
  CONST_OLD_PASSWORD_LABEL,
  CONST_NEW_PASSWORD_LABEL,
  CONST_SELECT_FILE_LABEL,
  CONST_DOCUMENT_TYPE_LABEL,
  CONST_ISSUED_AT_LABEL,
  CONST_ENDS_AT_LABEL,
  CONST_UPLOAD_BTN,
  CONST_EDIT_BTN,
  CONST_CANCEL_BTN_TEXT,
  CONST_DELETE_BTN,
} from '~/utils/constants';

definePageMeta({ layout: 'profile', middleware: ['auth'] });

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated, logout } = useAuth();

watch(
  isAuthenticated,
  (isAuth) => {
    if (!isAuth) router.push('/login');
  },
  { immediate: true },
);

const { data: currentUser, isLoading, error } = useCurrentUserQuery();

// Mutations
const { mutate: updateProfile, isLoading: isUpdating } = useUpdateProfileMutation();
const { mutate: changePwd, isLoading: isChangingPwd } = useChangePasswordMutation();
const { mutate: deleteProfile, isLoading: isDeleting } = useDeleteProfileMutation();
const { mutate: uploadPicture, isLoading: isUploadingPic } = useUploadProfilePictureMutation();

// Modal States
const isEditUsernameModalOpen = ref(false);
const isEditEmailModalOpen = ref(false);
const isChangePasswordModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isUploadPictureModalOpen = ref(false);
const isViewPictureModalOpen = ref(false);
const isUploadDocumentModalOpen = ref(false);

const editError = ref('');
const editFormData = reactive({ username: '', email: '' });
const pwdData = reactive({ oldPassword: '', newPassword: '' });
const selectedPicture = ref<File | null>(null);

const closeModals = () => {
  isEditUsernameModalOpen.value = false;
  isEditEmailModalOpen.value = false;
  isChangePasswordModalOpen.value = false;
  isDeleteModalOpen.value = false;
  isUploadPictureModalOpen.value = false;
  isUploadDocumentModalOpen.value = false;
  editError.value = '';
  pwdData.oldPassword = '';
  pwdData.newPassword = '';
  selectedPicture.value = null;
};

const openEditUsername = () => {
  editFormData.username = currentUser.value?.username || '';
  isEditUsernameModalOpen.value = true;
};

const openEditEmail = () => {
  editFormData.email = currentUser.value?.email || '';
  isEditEmailModalOpen.value = true;
};

const handleUpdateProfile = async (field: 'username' | 'email') => {
  editError.value = '';
  try {
    const payload =
      field === 'username' ? { username: editFormData.username } : { email: editFormData.email };
    await updateProfile(payload);
    closeModals();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    editError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'Error updating profile.';
  }
};

const handleChangePassword = async () => {
  editError.value = '';
  if (!pwdData.oldPassword || !pwdData.newPassword) {
    editError.value = 'Both fields are required!';
    return;
  }
  try {
    await changePwd({ oldPassword: pwdData.oldPassword, newPassword: pwdData.newPassword });
    closeModals();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    editError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'Error changing password.';
  }
};

const handleDeleteProfile = async () => {
  editError.value = '';
  try {
    await deleteProfile();
    logout();
    router.push('/login');
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    editError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'Error deleting profile.';
  }
};

const onPictureSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedPicture.value = target.files[0] ?? null;
  } else {
    selectedPicture.value = null;
  }
};

const handleUploadPicture = async () => {
  editError.value = '';
  if (!selectedPicture.value) {
    editError.value = 'Please select a file first!';
    return;
  }
  try {
    await uploadPicture(selectedPicture.value);
    closeModals();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    editError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'Error uploading picture.';
  }
};

// Dummy Data
const dummyDocuments = ref([
  {
    id: 1,
    title: 'Summer Vacation Passport',
    uploadedAt: '2026.08.21',
    type: 'Passport',
    fileType: 'PDF',
    fileSize: '4.23 MB',
    issued: '2023.05.10',
    ends: '2033.05.10',
  },
  {
    id: 2,
    title: 'Driver License Front',
    uploadedAt: '2026.08.20',
    type: 'ID Card',
    fileType: 'PNG',
    fileSize: '2.89 MB',
    issued: '2020.11.15',
    ends: '2030.11.15',
  },
  {
    id: 3,
    title: 'Gym Membership',
    uploadedAt: '2026.08.19',
    type: 'Membership card',
    fileType: 'PDF',
    fileSize: '7.45 MB',
    issued: '2026.01.01',
    ends: '2027.01.01',
  },
  {
    id: 4,
    title: 'Student ID',
    uploadedAt: '2026.08.15',
    type: 'ID Card',
    fileType: 'PDF',
    fileSize: '3.22 MB',
    issued: '2025.10.01',
    ends: '2026.10.01',
  },
]);
</script>
