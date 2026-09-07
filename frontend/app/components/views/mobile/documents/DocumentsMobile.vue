<!-- frontend/app/components/views/mobile/documents/DocumentsMobile.vue -->
<template>
  <div :class="[appConfig.layout.pageWrapper, 'px-4 py-6']">
    <!-- NAV ACTIONS -->
    <div class="flex justify-between items-center w-full">
      <UTooltip text="Members">
        <UButton icon="i-heroicons-users" variant="glassIconButton" to="/groups" />
      </UTooltip>
      <UTooltip text="Calendar">
        <UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/events" />
      </UTooltip>
      <UTooltip text="Photos">
        <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/media" />
      </UTooltip>
      <UTooltip text="Documents">
        <UButton
          icon="i-heroicons-document-text"
          variant="glassIconButton"
          class="text-brand-500"
          to="/documents"
        />
      </UTooltip>
    </div>

    <!-- TITLE -->
    <div class="flex flex-col items-center gap-1 my-4">
      <h1 :class="appConfig.typography.pageTitle">Your Documents</h1>
    </div>

    <!-- ACTION BUTTONS -->
    <div class="flex items-center gap-3 w-full mb-6 justify-center">
      <UTooltip text="Filter">
        <UButton icon="i-heroicons-funnel" label="Filter" variant="glassButton" />
      </UTooltip>
      <UTooltip text="Upload Document">
        <UButton icon="i-heroicons-plus" variant="glassIconButton" />
      </UTooltip>
    </div>

    <!-- DOCUMENT LIST -->
    <div class="flex flex-col gap-4 w-full">
      <UCard v-for="doc in documents" :key="doc.id" variant="documentGlass" class="relative w-full">
        <div :class="appConfig.layout.documentCardHeader">
          <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.title }}</p>
          <div class="flex items-center gap-1">
            <UTooltip text="Edit">
              <UButton
                icon="i-heroicons-pencil"
                variant="ghostDangerIconButton"
                class="text-surface-500 w-6! h-6! p-0"
              />
            </UTooltip>
            <UTooltip text="Delete">
              <UButton
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                class="text-surface-500 w-6! h-6! p-0"
              />
            </UTooltip>
          </div>
        </div>

        <div :class="appConfig.layout.documentCardImage" class="h-40!">
          <UIcon name="i-heroicons-photo" class="w-12 h-12 text-surface-500/50" />
          <div class="absolute bottom-2 px-4 w-full flex justify-between">
            <UTooltip text="View">
              <UButton icon="i-heroicons-eye" variant="ghostDangerIconButton" />
            </UTooltip>
            <UTooltip text="Download">
              <UButton icon="i-heroicons-arrow-down-tray" variant="ghostDangerIconButton" />
            </UTooltip>
          </div>
        </div>

        <div :class="appConfig.layout.documentCardMeta">
          <p>
            Uploaded at: <span class="font-bold text-dark-text">{{ doc.uploadedAt }}</span>
          </p>
          <p>
            Document type: <span class="font-bold text-dark-text">{{ doc.type }}</span>
          </p>

          <div :class="appConfig.layout.divider"></div>

          <div :class="appConfig.layout.flexBetween">
            <p>
              File type: <span class="font-bold text-dark-text">{{ doc.fileType }}</span>
            </p>
            <p>
              File size: <span class="font-bold text-dark-text">{{ doc.fileSize }}</span>
            </p>
          </div>

          <div :class="appConfig.layout.divider"></div>

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
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import type { DummyDocument } from '~/pages/documents/index.vue';

const appConfig = useAppConfig();

defineProps<{
  documents: DummyDocument[];
}>();
</script>
