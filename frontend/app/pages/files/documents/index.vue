<!-- frontend/app/pages/files/documents/index.vue -->
<template>
  <div>
    <DocumentsDesktop
      v-if="!isMobile"
      v-model:selected-group="selectedGroupUuid"
      :documents="groupDocuments"
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
      :documents="groupDocuments"
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
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const isMobile = useMediaQuery('(max-width: 768px)');
const documentsStore = useDocumentsStore();
const groupsStore = useGroupsStore();
const toast = useToast();

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

const { data: filesData, isLoading: isLoadingFiles } = useGroupFilesQuery(
  () => selectedGroupUuid.value || '',
  () => 15,
  () => undefined,
  () => 'document',
);

const groupDocuments = computed<GroupFile[]>(() => filesData.value?.items || []);

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
