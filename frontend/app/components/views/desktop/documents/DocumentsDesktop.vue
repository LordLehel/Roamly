<!-- frontend/app/components/views/desktop/documents/DocumentsDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- HEADER -->
    <div :class="appConfig.layout.pageHeader">
      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-start">
        <UTooltip text="Filter">
          <UButton icon="i-heroicons-funnel" label="Filter" variant="glassButton" />
        </UTooltip>
        <UTooltip text="Upload Document">
          <UButton icon="i-heroicons-plus" variant="glassIconButton" />
        </UTooltip>
      </div>

      <div class="flex flex-col items-center justify-center shrink-0">
        <h1 :class="appConfig.typography.pageTitle">Your Documents</h1>
      </div>

      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-end">
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
    </div>

    <!-- DOCUMENT GRID -->
    <div :class="appConfig.layout.sectionWrapper" class="mt-4!">
      <div :class="appConfig.layout.documentGrid">
        <UCard v-for="doc in documents" :key="doc.id" variant="documentGlass" class="relative">
          <div :class="appConfig.layout.documentCardHeader">
            <p class="font-bold truncate pr-2 shadow-sm">{{ doc.title }}</p>
            <div class="flex items-center gap-1">
              <UTooltip text="Edit">
                <UButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                />
              </UTooltip>
              <UTooltip text="Delete">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                />
              </UTooltip>
            </div>
          </div>

          <div :class="appConfig.layout.documentCardImage">
            <UIcon name="i-heroicons-photo" class="w-16 h-16 text-surface-500/50" />
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
