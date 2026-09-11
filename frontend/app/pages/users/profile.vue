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
      @share="handleShare"
      @access="handleAccess"
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
      @share="handleShare"
      @access="handleAccess"
    />

    <!-- Private Document Modals (rendered once at page level) -->
    <PrivateDocumentsModals
      :private-document-types="privateDocumentTypes"
      :shared-groups="sharedWithGroups"
      :unshared-groups="notSharedWithGroups"
      :all-groups="groupsList"
    />
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed } from 'vue';
import { useScreenSize } from '~/composables/useScreenSize';
import { useProtectedPage } from '~/composables/useProtectedPage';
import { useCurrentUserQuery } from '~/queries/user.query';
import { usePrivateDocumentsQuery, useDocumentSharesQuery } from '~/queries/files.query';
import { useGroupsQuery } from '~/queries/groups.query';
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
const { data: groupsData } = useGroupsQuery();

const privateDocuments = computed<PrivateDocumentMetadata[]>(
  () => privateDocumentsData.value ?? [],
);

/* --- SHARING LOGIC --- */
// Reactively track the file ID currently selected for sharing
const shareTargetFileId = computed(
  () =>
    documentsStore.privateFileToShare?.fileId ??
    documentsStore.privateFileToViewAccess?.fileId ??
    null,
);

// Fetch the existing shares for the targeted file
const { data: documentSharesData } = useDocumentSharesQuery(() => shareTargetFileId.value);

// Computed: Returns the list of groups the file IS currently shared with
const sharedWithGroups = computed(() => documentSharesData.value ?? []);

const groupsList = computed(() => groupsData.value?.items || []);
// Composable: Returns the list of user groups the file IS NOT YET shared with
const useUnsharedGroups = () => {
  return computed(() => {
    const allGroups = groupsList.value;
    const sharedGroupNames = sharedWithGroups.value.map((share) => share.groups.name);
    return allGroups.filter((group) => !sharedGroupNames.includes(group.name));
  });
};

const notSharedWithGroups = useUnsharedGroups();

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

const handleShare = (doc: PrivateDocumentMetadata) => {
  documentsStore.openPrivateShareModal({
    fileId: doc.file_id,
    fileName: doc.file_name,
  });
};

const handleAccess = (doc: PrivateDocumentMetadata) => {
  documentsStore.openPrivateAccessModal({
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
