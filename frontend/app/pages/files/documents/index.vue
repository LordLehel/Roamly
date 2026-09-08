<!-- frontend/app/pages/files/documents/index.vue -->
<template>
  <div>
    <DocumentsDesktop
      v-if="!isMobile"
      v-model:selected-group="selectedGroupUuid"
      v-model:search-query="searchQuery"
      v-model:filter-type="filterType"
      :documents="filteredDocuments"
      :document-types="documentTypes"
      :groups="groupsList"
      :is-loading="isLoadingFiles"
      :is-current-user-leader="isCurrentUserLeader"
      @delete="handleDelete"
      @upload="openUploadModal"
      @delete-group="handleDeleteGroup"
      @leave-group="handleLeaveGroup"
    />
    <DocumentsMobile
      v-else
      v-model:selected-group="selectedGroupUuid"
      v-model:search-query="searchQuery"
      v-model:filter-type="filterType"
      :documents="filteredDocuments"
      :document-types="documentTypes"
      :groups="groupsList"
      :is-loading="isLoadingFiles"
      :is-current-user-leader="isCurrentUserLeader"
      @delete="handleDelete"
      @upload="openUploadModal"
      @delete-group="handleDeleteGroup"
      @leave-group="handleLeaveGroup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useToast } from '#imports';
import DocumentsDesktop from '~/components/views/desktop/files/documents/DocumentsDesktop.vue';
import DocumentsMobile from '~/components/views/mobile/files/documents/DocumentsMobile.vue';
import { useGroupFilesQuery } from '~/queries/files.query';
import { useGroupsQuery } from '~/queries/groups.query';
import { useDocumentsStore } from '~/stores/documents.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { filterGroupDocuments } from '~/utils/filter.utils';
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const isMobile = useMediaQuery('(max-width: 768px)');
const documentsStore = useDocumentsStore();
const groupsStore = useGroupsStore();
const toast = useToast();

const searchQuery = ref('');
const filterType = ref('ALL');

const documentTypes = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Ticket', value: 'TICKET' },
  { label: 'Booking Confirmation', value: 'BOOKING_CONFIRMATION' },
  { label: 'Hotel Voucher', value: 'HOTEL_VOUCHER' },
  { label: 'Guest Registration Card', value: 'GUEST_REGISTRATION_CARD' },
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
  return currentGroup.value?.role?.toLowerCase() === 'leader';
});

// A query-ben a típus pontosan egyezzen a backend által várt értékkel
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
</script>
