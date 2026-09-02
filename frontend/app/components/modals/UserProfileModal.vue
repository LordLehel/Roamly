<template>
  <UModal
    v-model:open="groupsStore.isUserProfileModalOpen"
    title="User Profile"
    :dismissible="false"
    :close="false"
    :ui="{ content: appConfig.layout.modalSizeLg }"
  >
    <template #default><div class="hidden"></div></template>

    <template #body>
      <div class="flex flex-col gap-6 py-2 max-h-[70vh] overflow-y-auto pr-2">
        <!-- User info -->
        <div
          class="flex items-center gap-5 p-4 bg-surface-500/40 rounded-2xl ring-1 ring-dark-text/10"
        >
          <!-- ... Avatar ... -->
          <div class="flex flex-col justify-center gap-1.5 overflow-hidden">
            <h3 :class="appConfig.typography.cardTitle">
              {{ groupsStore.selectedUserProfile?.username || 'Unknown' }}
            </h3>
            <p class="text-xs font-bold uppercase text-brand-500 tracking-wide">
              {{ groupsStore.selectedUserProfile?.role }}
            </p>
            <p class="text-sm text-dark-text/80 truncate flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-brand-500 shrink-0" />
              {{ groupsStore.selectedUserProfile?.email }}
            </p>
            <p class="text-xs text-dark-text/70 flex items-center gap-2">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-brand-500 shrink-0" />
              Joined: {{ groupsStore.selectedUserProfile?.joinedAt || 'N/A' }}
            </p>
          </div>
        </div>

        <!-- Images -->
        <div class="flex flex-col gap-3">
          <h4 class="text-sm font-bold text-dark-text tracking-wide flex items-center gap-2">
            <UIcon name="i-heroicons-photo" class="w-4 h-4 text-brand-500" />
            Photos
          </h4>
          <div class="grid grid-cols-3 gap-3">
            <div
              v-for="i in 3"
              :key="i"
              class="aspect-square bg-surface-600/30 rounded-xl overflow-hidden ring-1 ring-dark-text/10 flex items-center justify-center relative group"
            >
              <UIcon name="i-heroicons-photo" class="w-8 h-8 text-dark-text/30" />
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div v-if="groupsStore.selectedUserProfile?.canViewDocuments" class="flex flex-col gap-3">
          <h4 class="text-sm font-bold text-dark-text tracking-wide flex items-center gap-2">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-brand-500" />
            Documents
          </h4>
          <div class="flex flex-col gap-2">
            <div
              v-for="i in 2"
              :key="i"
              class="flex items-center justify-between p-3 bg-surface-500/40 rounded-xl ring-1 ring-dark-text/10 hover:bg-surface-500/60 transition-colors"
            >
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-document" class="w-5 h-5 text-brand-500" />
                <span class="text-sm font-medium text-dark-text">Document_Sample_{{ i }}.pdf</span>
              </div>
              <UButton
                icon="i-heroicons-arrow-down-tray"
                variant="ghostBrandIconButton"
                size="xs"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div :class="appConfig.layout.modalActions" class="justify-end">
        <UButton
          label="Close"
          variant="actionOkButton"
          @click="groupsStore.closeUserProfileModal()"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useAppConfig } from '#imports';

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();
</script>
