<!-- frontend/app/components/modals/documents/GroupDocumentsModals.vue -->
<template>
  <div>
    <!-- UPLOAD DOCUMENT MODAL -->
    <UModal
      v-model:open="documentsStore.isUploadModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">
          {{ CONST_UPLOAD_DOCUMENT_HEADER ?? 'Upload Document' }}
        </h3>
      </template>
      <template #body>
        <UForm
          :schema="uploadDocumentSchema"
          :state="uploadForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpload"
        >
          <!-- Choose file -->
          <UFormField :label="'Select File ' + (CONST_ACCEPTED_FILE_FORMATS ?? '')" name="file">
            <template #default="{ error: fieldError }">
              <UInput
                type="file"
                :variant="fieldError ? 'glassError' : 'glass'"
                icon="i-heroicons-document-arrow-up"
                @change="onFileChange"
              />
            </template>
          </UFormField>

          <!-- Document type -->
          <UFormField label="Document Type" name="documentType">
            <template #default>
              <USelect
                v-model="uploadForm.documentType"
                :items="documentTypes"
                label-key="label"
                value-key="value"
                placeholder="Select a document type"
                :popper="{ strategy: 'fixed', placement: 'bottom-start' }"
                :ui="{ content: 'z-[10100]' }"
              />
            </template>
          </UFormField>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Issue date -->
            <UFormField label="Issue Date (Optional)" name="issueDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="uploadForm.issueDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <!-- Expire date -->
            <UFormField label="Expiry Date (Optional)" name="expiryDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="uploadForm.expiryDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>
          </div>

          <!-- Error Display -->
          <div v-if="uploadError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(uploadError) }}
          </div>

          <!-- Buttons -->
          <div :class="[appConfig.layout.flexBetween, 'mt-4']">
            <UButton
              label="Cancel"
              variant="actionCancelButton"
              :class="appConfig.typography.modalActionBtnCancel"
              @click="closeUploadModal"
            />
            <UButton
              type="submit"
              label="Upload"
              variant="actionOkButton"
              :class="appConfig.typography.modalActionBtnOk"
              :loading="isUploading"
              :disabled="!uploadForm.file"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- DELETE DOCUMENT MODAL -->
    <UModal
      v-model:open="documentsStore.isDeleteModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">
          {{ CONST_DELETE_DOCUMENT_HEADER ?? 'Delete Document' }}
        </h3>
      </template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ CONST_CONFIRM_DELETE_DOCUMENT }}
          <span :class="appConfig.typography.modalInlineHighlight">{{
            fileToDelete?.fileName
          }}</span
          >{{ CONST_ACTION_CANNOT_BE_UNDONE }}
        </p>

        <!-- Delete Error Display -->
        <div v-if="deleteError" :class="[appConfig.typography.formStatusError, 'mt-2']">
          {{ getErrorMessage(deleteError) }}
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            label="Cancel"
            variant="actionCancelButton"
            :class="appConfig.typography.modalActionBtnCancel"
            @click="documentsStore.closeDeleteModal()"
          />
          <UButton
            label="Delete"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="isDeleting"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig, useToast } from '#imports';
import { computed, reactive, ref } from 'vue';
import { useQueryCache } from '@pinia/colada';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import {
  useDeleteGroupFileMutation,
  useUploadGroupDocumentMutation,
} from '~/queries/files.mutation';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  documentTypes: { label: string; value: string }[];
}>();

const appConfig = useAppConfig();
const documentsStore = useDocumentsStore();
const queryCache = useQueryCache();
const toast = useToast();

const uploadError = ref<ApiError | Error | null>(null);
const deleteError = ref<ApiError | Error | null>(null);

// --- FRONTEND ZOD SCHEMA ---
const uploadDocumentSchema = z.object({
  file: z.any().refine((val) => val instanceof File, {
    message: 'Please select a file to upload.',
  }),
  documentType: z.string().min(1, 'Please select a document type.'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type UploadFormState = z.infer<typeof uploadDocumentSchema>;

// --- UPLOAD LOGIC ---
const uploadForm = reactive<UploadFormState>({
  file: null,
  documentType: '',
  issueDate: '',
  expiryDate: '',
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadForm.file = target.files[0] || null;
  } else {
    uploadForm.file = null;
  }
};

const uploadGroupUuidRef = computed(() => documentsStore.uploadGroupUuid || undefined);

const { mutate: uploadFile, isLoading: isUploading } = useUploadGroupDocumentMutation(
  uploadGroupUuidRef,
  {
    onSuccess: () => {
      uploadError.value = null;
      toast.add({ title: 'Success', description: 'Document uploaded successfully!' });
      closeUploadModal();
    },
    onError: (err: Error) => {
      uploadError.value = err;
    },
  },
);

const closeUploadModal = () => {
  documentsStore.closeUploadModal();
  uploadForm.file = null;
  uploadForm.documentType = '';
  uploadForm.issueDate = '';
  uploadForm.expiryDate = '';
  uploadError.value = null;
};

const handleUpload = (event: FormSubmitEvent<UploadFormState>) => {
  uploadError.value = null;

  const formData = new FormData();
  formData.append('file', event.data.file);

  if (event.data.documentType) {
    formData.append('document_type', event.data.documentType);
  }

  if (event.data.issueDate) {
    formData.append('issue_date', event.data.issueDate);
  }

  if (event.data.expiryDate) {
    formData.append('expiry_date', event.data.expiryDate);
  }

  uploadFile(formData);
};

// --- DELETE LOGIC ---
const fileToDelete = computed(() => documentsStore.fileToDelete);

const { mutate: deleteFile, isLoading: isDeleting } = useDeleteGroupFileMutation(
  computed(() => documentsStore.fileToDelete?.groupUuid),
  {
    onSuccess: () => {
      deleteError.value = null;
      queryCache.invalidateQueries({ key: ['group-files'] });
      documentsStore.closeDeleteModal();
      toast.add({ title: 'Success', description: 'Document deleted successfully!' });
    },
    onError: (err: Error) => {
      deleteError.value = err;
    },
  },
);

const confirmDelete = () => {
  if (!fileToDelete.value) return;
  deleteError.value = null;
  deleteFile(fileToDelete.value.fileId);
};
</script>
