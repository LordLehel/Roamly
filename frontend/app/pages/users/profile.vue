<!-- frontend/app/pages/users/profile.vue -->
<template>
  <div>
    <ProfileMobile
      v-if="isMobile"
      :current-user="currentUser"
      :is-loading="isLoading"
      :error="error"
      :private-documents="privateDocuments"
      :is-loading-documents="isLoadingDocuments"
      :private-document-types="privateDocumentTypes"
      :profile-store="profileStore"
      :documents-store="documentsStore"
      @upload="documentsStore.openPrivateUploadModal()"
      @edit="handleEdit"
      @delete="handleDelete"
      @view="handleView"
      @download="handleDownload"
    />

    <ProfileDesktop
      v-else
      :current-user="currentUser"
      :is-loading="isLoading"
      :error="error"
      :private-documents="privateDocuments"
      :is-loading-documents="isLoadingDocuments"
      :private-document-types="privateDocumentTypes"
      :profile-store="profileStore"
      :documents-store="documentsStore"
      @upload="documentsStore.openPrivateUploadModal()"
      @edit="handleEdit"
      @delete="handleDelete"
      @view="handleView"
      @download="handleDownload"
    />

    <!-- Private Document Modals (rendered once at page level) -->
    <PrivateDocumentsModals :private-document-types="privateDocumentTypes" />
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { useCurrentUserQuery } from '~/queries/user.query';
import { usePrivateDocumentsQuery } from '~/queries/files.query';
import { useProfileStore } from '~/stores/profile.modals.store';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import ProfileDesktop from '~/components/views/desktop/users/ProfileDesktop.vue';
import ProfileMobile from '~/components/views/mobile/users/ProfileMobile.vue';
import PrivateDocumentsModals from '~/components/modals/PrivateDocumentsModals.vue';
import type { PrivateDocumentMetadata } from '~/types/files.type';
import { useGetPrivateDocumentUrlMutation } from '~/queries/files.mutation';

/* --- PAGE CONFIGURATION --- */
definePageMeta({ layout: 'general', middleware: ['auth'] });

/* --- COMPOSABLES & STORES --- */
useProtectedPage();
const { isMobile } = useScreenSize();
const profileStore = useProfileStore();
const documentsStore = useDocumentsStore();

/* --- MUTATIONS --- */
const getUrlMutation = useGetPrivateDocumentUrlMutation();

/* --- DOCUMENT TYPES --- */
const privateDocumentTypes = [
  { label: 'Personal ID', value: 'ID' },
  { label: 'Passport', value: 'PASSPORT' },
  { label: 'Driving License', value: 'DRIVING_LICENSE' },
  { label: 'Other', value: 'OTHER' },
];

/* --- API QUERIES --- */
const { data: currentUser, isLoading, error } = useCurrentUserQuery();
const { data: privateDocumentsData, isLoading: isLoadingDocuments } = usePrivateDocumentsQuery();

const privateDocuments = computed<PrivateDocumentMetadata[]>(
  () => privateDocumentsData.value ?? [],
);

/* --- HANDLERS --- */
const handleEdit = (doc: PrivateDocumentMetadata) => {
  documentsStore.openPrivateUpdateModal({
    fileId: doc.file_id,
    fileName: doc.file_name,
    documentType: doc.documents?.document_type,
    issueDate: doc.documents?.issue_date
      ? new Date(doc.documents.issue_date).toISOString().split('T')[0]
      : undefined,
    expiryDate: doc.documents?.expiry_date
      ? new Date(doc.documents.expiry_date).toISOString().split('T')[0]
      : undefined,
  });
};

const handleDelete = (doc: PrivateDocumentMetadata) => {
  documentsStore.openPrivateDeleteModal({
    fileId: doc.file_id,
    fileName: doc.file_name,
  });
};

const handleView = async (doc: PrivateDocumentMetadata) => {
  try {
    const response = await getUrlMutation.mutateAsync(doc.file_id);
    const realUrl = response.data?.url;
    if (realUrl) {
      window.open(realUrl, '_blank');
    }
  } catch (err) {
    console.error('Failed to fetch document view URL:', err);
  }
};

const handleDownload = async (doc: PrivateDocumentMetadata) => {
  try {
    const response = await getUrlMutation.mutateAsync(doc.file_id);
    const realUrl = response.data?.url;
    if (!realUrl) return;

    const fileRes = await fetch(realUrl);
    const blob = await fileRes.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = doc.file_name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error('Download failed:', err);
  }
};
</script>
