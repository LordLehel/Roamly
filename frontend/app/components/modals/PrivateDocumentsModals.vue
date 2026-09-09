<!-- frontend/app/components/modals/documents/PrivateDocumentsModals.vue -->
<template>
  <div>
    <!-- ==================== -->
    <!-- UPLOAD DOCUMENT MODAL -->
    <!-- ==================== -->
    <UModal
      v-model:open="documentsStore.isPrivateUploadModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Upload Private Document</h3>
      </template>
      <template #body>
        <UForm
          :schema="uploadDocumentSchema"
          :state="uploadForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpload"
        >
          <!-- Choose file -->
          <UFormField label="Select File" name="file">
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
                :items="privateDocumentTypes"
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

            <!-- Expiry date -->
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
              :loading="uploadMutation.isLoading.value"
              :disabled="!uploadForm.file"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- ==================== -->
    <!-- UPDATE DOCUMENT MODAL -->
    <!-- ==================== -->
    <UModal
      v-model:open="documentsStore.isPrivateUpdateModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Update Private Document</h3>
      </template>
      <template #body>
        <UForm
          :schema="updateDocumentSchema"
          :state="updateForm"
          :class="appConfig.layout.modalForm"
          @submit="handleUpdate"
        >
          <!-- Current file name -->
          <div
            v-if="fileToUpdate"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-100/10 border border-surface-500/20"
          >
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-surface-400 shrink-0" />
            <span class="text-sm text-surface-400 truncate">{{ fileToUpdate.fileName }}</span>
          </div>

          <!-- Replace file (optional) -->
          <UFormField label="Replace File (Optional)" name="file">
            <template #default="{ error: fieldError }">
              <UInput
                type="file"
                :variant="fieldError ? 'glassError' : 'glass'"
                icon="i-heroicons-document-arrow-up"
                @change="onUpdateFileChange"
              />
            </template>
          </UFormField>

          <!-- Document type -->
          <UFormField label="Document Type" name="documentType">
            <template #default>
              <USelect
                v-model="updateForm.documentType"
                :items="privateDocumentTypes"
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
                  v-model="updateForm.issueDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <!-- Expiry date -->
            <UFormField label="Expiry Date (Optional)" name="expiryDate">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="updateForm.expiryDate"
                  type="date"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>
          </div>

          <!-- Error Display -->
          <div v-if="updateError" :class="appConfig.typography.formStatusError">
            {{ getErrorMessage(updateError) }}
          </div>

          <!-- Buttons -->
          <div :class="[appConfig.layout.flexBetween, 'mt-4']">
            <UButton
              label="Cancel"
              variant="actionCancelButton"
              :class="appConfig.typography.modalActionBtnCancel"
              @click="closeUpdateModal"
            />
            <UButton
              type="submit"
              label="Save"
              variant="actionOkButton"
              :class="appConfig.typography.modalActionBtnOk"
              :loading="isUpdating"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- ==================== -->
    <!-- DELETE DOCUMENT MODAL -->
    <!-- ==================== -->
    <UModal
      v-model:open="documentsStore.isPrivateDeleteModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Delete Document</h3>
      </template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          Are you sure you want to delete
          <span :class="appConfig.typography.modalInlineHighlight">{{
            privateFileToDelete?.fileName
          }}</span
          >? This action cannot be undone.
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
            @click="documentsStore.closePrivateDeleteModal()"
          />
          <UButton
            label="Delete"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :class="appConfig.typography.modalActionBtnOk"
            :loading="deleteMutation.isLoading.value"
            @click="confirmDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig, useToast } from '#imports';
import { computed, reactive, ref, watch } from 'vue';
import { useQueryCache } from '@pinia/colada';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import {
  useUploadPrivateDocumentMutation,
  useDeletePrivateDocumentMutation,
} from '~/queries/files.mutation';
import { filesService } from '~/services/files.service';
import { getErrorMessage } from '~/utils/error.utils';
import type { ApiError } from '~/types/apiError.type';

defineProps<{
  privateDocumentTypes: { label: string; value: string }[];
}>();

const appConfig = useAppConfig();
const documentsStore = useDocumentsStore();
const queryCache = useQueryCache();
const toast = useToast();

const uploadError = ref<ApiError | Error | null>(null);
const updateError = ref<ApiError | Error | null>(null);
const deleteError = ref<ApiError | Error | null>(null);
const isUpdating = ref(false);

// -------------------------
// UPLOAD LOGIC
// -------------------------

const uploadDocumentSchema = z.object({
  file: z.any().refine((val) => val instanceof File, {
    message: 'Please select a file to upload.',
  }),
  documentType: z.string().min(1, 'Please select a document type.'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type UploadFormState = z.infer<typeof uploadDocumentSchema>;

const uploadForm = reactive<UploadFormState>({
  file: null,
  documentType: '',
  issueDate: '',
  expiryDate: '',
});

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  uploadForm.file = target.files?.[0] ?? null;
};

// Keep the full mutation object — never destructure isLoading out of it
const uploadMutation = useUploadPrivateDocumentMutation({
  onSuccess: () => {
    uploadError.value = null;
    toast.add({ title: 'Success', description: 'Document uploaded successfully!' });
    closeUploadModal();
  },
  onError: (err: Error) => {
    uploadError.value = err;
  },
});

const closeUploadModal = () => {
  documentsStore.closePrivateUploadModal();
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
  if (event.data.documentType) formData.append('document_type', event.data.documentType);
  if (event.data.issueDate) formData.append('issue_date', event.data.issueDate);
  if (event.data.expiryDate) formData.append('expiry_date', event.data.expiryDate);

  uploadMutation.mutate(formData);
};

// -------------------------
// UPDATE LOGIC
// -------------------------

const updateDocumentSchema = z.object({
  file: z.any().optional(),
  documentType: z.string().min(1, 'Please select a document type.'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
});

type UpdateFormState = z.infer<typeof updateDocumentSchema>;

const updateForm = reactive<UpdateFormState>({
  file: null,
  documentType: '',
  issueDate: '',
  expiryDate: '',
});

const fileToUpdate = computed(() => documentsStore.privateFileToUpdate);

// Pre-fill the update form when the modal opens
watch(
  () => documentsStore.privateFileToUpdate,
  (file) => {
    if (file) {
      updateForm.file = null;
      updateForm.documentType = file.documentType ?? '';
      updateForm.issueDate = file.issueDate ?? '';
      updateForm.expiryDate = file.expiryDate ?? '';
    }
  },
);

const onUpdateFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateForm.file = target.files?.[0] ?? null;
};

const closeUpdateModal = () => {
  documentsStore.closePrivateUpdateModal();
  updateForm.file = null;
  updateForm.documentType = '';
  updateForm.issueDate = '';
  updateForm.expiryDate = '';
  updateError.value = null;
};

const handleUpdate = async (event: FormSubmitEvent<UpdateFormState>) => {
  if (!fileToUpdate.value) return;
  updateError.value = null;
  isUpdating.value = true;

  try {
    const formData = new FormData();
    if (event.data.file instanceof File) formData.append('file', event.data.file);
    if (event.data.documentType) formData.append('document_type', event.data.documentType);
    if (event.data.issueDate) formData.append('issue_date', event.data.issueDate);
    if (event.data.expiryDate) formData.append('expiry_date', event.data.expiryDate);

    await filesService.replacePrivateDocument(fileToUpdate.value.fileId, formData);
    queryCache.invalidateQueries({ key: ['private-documents'] });
    toast.add({ title: 'Success', description: 'Document updated successfully!' });
    closeUpdateModal();
  } catch (err) {
    updateError.value = err as Error;
  } finally {
    isUpdating.value = false;
  }
};

// -------------------------
// DELETE LOGIC
// -------------------------

const privateFileToDelete = computed(() => documentsStore.privateFileToDelete);

const deleteMutation = useDeletePrivateDocumentMutation({
  onSuccess: () => {
    deleteError.value = null;
    documentsStore.closePrivateDeleteModal();
    toast.add({ title: 'Success', description: 'Document deleted successfully!' });
  },
  onError: (err: Error) => {
    deleteError.value = err;
  },
});

const confirmDelete = () => {
  if (!privateFileToDelete.value) return;
  deleteError.value = null;
  deleteMutation.mutate(privateFileToDelete.value.fileId);
};
</script>
