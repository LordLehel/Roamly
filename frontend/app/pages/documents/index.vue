<!-- frontend/app/pages/documents/index.vue -->
<template>
  <DocumentsDesktop v-if="!isMobile" :documents="dummyDocuments" />
  <DocumentsMobile v-else :documents="dummyDocuments" />
</template>

<script setup lang="ts">
import { useScreenSize } from '~/composables/useScreenSize';
import DocumentsDesktop from '~/components/views/desktop/documents/DocumentsDesktop.vue';
import DocumentsMobile from '~/components/views/mobile/documents/DocumentsMobile.vue';

export interface DummyDocument {
  id: number;
  title: string;
  uploadedAt: string;
  type: string;
  fileType: string;
  fileSize: string;
  issued: string;
  ends: string;
}

const isMobile = useScreenSize();

const dummyDocuments: DummyDocument[] = [
  {
    id: 1,
    title: 'Passport',
    uploadedAt: '12.05.2026',
    type: 'Passport',
    fileType: 'PDF',
    fileSize: '4.23 MB',
    issued: '01.01.2020',
    ends: '01.01.2030',
  },
  {
    id: 2,
    title: 'Id Card',
    uploadedAt: '15.05.2026',
    type: 'Id Card',
    fileType: 'PNG',
    fileSize: '2.89 MB',
    issued: '05.06.2018',
    ends: '05.06.2028',
  },
  {
    id: 3,
    title: 'Membership card',
    uploadedAt: '20.05.2026',
    type: 'Membership',
    fileType: 'PDF',
    fileSize: '7.45 MB',
    issued: '10.01.2026',
    ends: '10.01.2027',
  },
  {
    id: 4,
    title: 'Id Card',
    uploadedAt: '22.05.2026',
    type: 'Id Card',
    fileType: 'PDF',
    fileSize: '3.22 MB',
    issued: '15.05.2026',
    ends: '25.05.2026',
  },
];
</script>
