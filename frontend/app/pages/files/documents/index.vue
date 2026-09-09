<!-- frontend/app/pages/files/documents/index.vue -->
<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="min-h-screen flex items-center justify-center">
          <span class="opacity-50 font-medium">{{ CONST_LOADING_TEXT ?? 'Loading...' }}</span>
        </div>
      </template>

      <DocumentsDesktop
        v-if="!isMobile"
        v-model:selected-group="selectedGroupUuid"
        v-model:search-query="searchQuery"
        v-model:filter-type="filterType"
        v-model:member-search-query="memberSearchQuery"
        v-model:member-filter-type="memberFilterType"
        :documents="filteredDocuments"
        :member-documents="memberDocuments"
        :is-loading-member-documents="isLoadingMemberDocuments"
        :document-types="documentTypes"
        :private-document-types="privateDocumentTypes"
        :groups="groupsList"
        :is-loading="isLoadingFiles"
        :is-current-user-leader="isCurrentUserLeader"
        @delete="handleDelete"
        @upload="openUploadModal"
        @delete-group="handleDeleteGroup"
        @leave-group="handleLeaveGroup"
        @download="handleDownload"
      />
      <DocumentsMobile
        v-else
        v-model:selected-group="selectedGroupUuid"
        v-model:search-query="searchQuery"
        v-model:filter-type="filterType"
        v-model:member-search-query="memberSearchQuery"
        v-model:member-filter-type="memberFilterType"
        :documents="filteredDocuments"
        :member-documents="memberDocuments"
        :is-loading-member-documents="isLoadingMemberDocuments"
        :document-types="documentTypes"
        :private-document-types="privateDocumentTypes"
        :groups="groupsList"
        :is-loading="isLoadingFiles"
        :is-current-user-leader="isCurrentUserLeader"
        @delete="handleDelete"
        @upload="openUploadModal"
        @delete-group="handleDeleteGroup"
        @leave-group="handleLeaveGroup"
        @download="handleDownload"
      />
    </ClientOnly>

    <!-- Group document modals -->
    <GroupDocumentsModals :document-types="documentTypes" />

    <!-- Private document modals (used for the member documents section) -->
    <PrivateDocumentsModals :private-document-types="privateDocumentTypes" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useToast } from '#imports';
import DocumentsDesktop from '~/components/views/desktop/files/documents/DocumentsDesktop.vue';
import DocumentsMobile from '~/components/views/mobile/files/documents/DocumentsMobile.vue';
import GroupDocumentsModals from '~/components/modals/GroupDocumentsModals.vue';
import PrivateDocumentsModals from '~/components/modals/PrivateDocumentsModals.vue';
import { useGroupFilesQuery, useGroupMemberDocumentsQuery } from '~/queries/files.query';
import { useGroupsQuery } from '~/queries/groups.query';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { filterGroupDocuments } from '~/utils/filter.utils';
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const isMobile = useMediaQuery('(max-width: 768px)');
const documentsStore = useDocumentsStore();
const groupsStore = useGroupsStore();
const toast = useToast();

const searchQuery = ref('');
const filterType = ref('ALL');

const memberSearchQuery = ref('');
const memberFilterType = ref('ALL');

const documentTypes = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Ticket', value: 'TICKET' },
  { label: 'Booking Confirmation', value: 'BOOKING_CONFIRMATION' },
  { label: 'Hotel Voucher', value: 'HOTEL_VOUCHER' },
  { label: 'Guest Registration Card', value: 'GUEST_REGISTRATION_CARD' },
  { label: 'Other', value: 'OTHER' },
];

const privateDocumentTypes = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Personal Id', value: 'ID' },
  { label: 'Passport', value: 'PASSPORT' },
  { label: 'Driving License', value: 'DRIVING_LICENSE' },
  { label: 'Other', value: 'OTHER' },
];

const { data: groupsData } = useGroupsQuery();
const groupsList = computed<GroupOutDto[]>(() => groupsData.value?.items || []);
const selectedGroupUuid = ref<string | undefined>(undefined);

watch(
  groupsList,
  (newGroups) => {
    if (newGroups.length > 0 && !selectedGroupUuid.value) {
      selectedGroupUuid.value = newGroups[0]?.uuid;
    }
  },
  { immediate: true },
);

const currentGroup = computed(() =>
  groupsList.value.find((g) => g.uuid === selectedGroupUuid.value),
);

const isCurrentUserLeader = computed(() => {
  if (!currentGroup.value) return false;
  const role = currentGroup.value.role;
  return role === 'LEADER' || role === 'leader';
});

// Group documents
const { data: filesData, isLoading: isLoadingFiles } = useGroupFilesQuery(
  () => selectedGroupUuid.value || '',
  () => 15,
  () => undefined,
  () => 'document',
);

const filteredDocuments = computed<GroupFile[]>(() => {
  const docs = filesData.value?.items || [];
  return filterGroupDocuments(docs, searchQuery.value, filterType.value);
});

// Member private documents — only fetched when the current user is a leader
const { data: memberDocumentsData, isLoading: isLoadingMemberDocuments } =
  useGroupMemberDocumentsQuery(
    () => selectedGroupUuid.value || '',
    () => isCurrentUserLeader.value,
  );

const memberDocuments = computed<PrivateDocumentMetadata[]>(() => memberDocumentsData.value ?? []);

// Handlers
const handleDelete = (file: GroupFile) => {
  if (!selectedGroupUuid.value) return;
  documentsStore.openDeleteModal({
    fileId: file.file_id,
    groupUuid: selectedGroupUuid.value,
    fileName: file.file_name,
  });
};

const openUploadModal = () => {
  if (selectedGroupUuid.value) {
    documentsStore.openUploadModal(selectedGroupUuid.value);
  } else {
    toast.add({ title: 'Warning', description: 'Please select a group first.' });
  }
};

const handleDeleteGroup = () => {
  if (currentGroup.value) {
    groupsStore.openDeleteModal(currentGroup.value);
  }
};

const handleLeaveGroup = () => {
  if (currentGroup.value) {
    groupsStore.openLeaveModal(currentGroup.value);
  }
};

const handleDownload = async (url: string | undefined, filename: string) => {
  if (!url) return;
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download trigger failed:', error);
  }
};
</script>
