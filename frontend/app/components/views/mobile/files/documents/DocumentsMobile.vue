<!-- frontend/app/components/views/mobile/files/documents/DocumentsMobile.vue -->
<template>
  <div class="flex flex-col flex-1 gap-4 w-full p-4 pb-20">
    <div :class="appConfig.calendar.mobileTopActions">
      <UTooltip text="Members">
        <UButton icon="i-heroicons-users" variant="glassIconButton" to="/groups" />
      </UTooltip>
      <UTooltip text="Calendar">
        <UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/events" />
      </UTooltip>
      <UTooltip text="Photos">
        <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/files/media" />
      </UTooltip>
      <UTooltip text="Documents">
        <UButton
          icon="i-heroicons-document-text"
          variant="glassIconButton"
          class="text-brand-500"
          to="/files/documents"
        />
      </UTooltip>
    </div>

    <div :class="appConfig.calendar.mobileMainWrapper">
      <div :class="appConfig.calendar.mobileHeader">
        <UPopover v-model:open="isGroupDropdownOpen" class="w-full" :popper="{ strategy: 'fixed' }">
          <UButton block variant="ghost" :class="appConfig.calendar.mobileHeaderButton">
            <div :class="appConfig.calendar.mobileHeaderTitleRow">
              <h1 :class="appConfig.typography.pageTitle" class="text-2xl! truncate">
                <ClientOnly fallback="Loading...">
                  {{ isLoading ? 'Loading...' : currentGroupDetails?.name || 'Select a Group' }}
                </ClientOnly>
              </h1>
              <UIcon
                name="i-heroicons-chevron-down"
                class="w-5 h-5 text-surface-500 transition-transform duration-200"
                :class="{ 'rotate-180': isGroupDropdownOpen }"
              />
            </div>
            <p :class="appConfig.typography.pageSubtitle" class="mt-0">Group Documents</p>
          </UButton>
          <template #content>
            <div
              :class="[
                appConfig.ui.wideDropdownMenu.slots.content,
                'max-h-[50vh] overflow-y-auto custom-scrollbar',
              ]"
            >
              <button
                v-for="group in groups"
                :key="group.uuid"
                :class="appConfig.ui.wideDropdownMenu.slots.item"
                @click="selectGroup(group.uuid)"
              >
                <UIcon
                  :name="
                    group.uuid === selectedGroup ? 'i-heroicons-check' : 'i-heroicons-user-group'
                  "
                  :class="appConfig.ui.wideDropdownMenu.slots.itemLeadingIcon"
                />
                <span>{{ group.name }}</span>
              </button>
            </div>
          </template>
        </UPopover>
      </div>

      <div :class="appConfig.calendar.mobileToolbar">
        <UTooltip text="Filter">
          <UPopover>
            <UButton icon="i-heroicons-funnel" variant="glassIconButton" />
            <template #content="{ close }">
              <div :class="appConfig.ui.dropdownMenu.slots.content + 'w-fit'">
                <button
                  v-for="type in documentTypes"
                  :key="type.value"
                  :class="appConfig.ui.dropdownMenu.slots.item"
                  @click="
                    filterType = type.value;
                    close();
                  "
                >
                  <UIcon
                    :name="filterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'"
                    :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                  />
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </template>
          </UPopover>
        </UTooltip>

        <UInput
          v-model="searchQuery"
          placeholder="Search..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
          variant="search"
        />

        <UTooltip text="Upload Document">
          <UButton icon="i-heroicons-plus" variant="glassIconButton" @click="emit('upload')" />
        </UTooltip>
      </div>

      <div class="px-2 pt-2">
        <div v-if="isLoading" :class="appConfig.typography.statusLoading" class="py-4 text-center">
          Loading documents...
        </div>

        <div v-else-if="documents.length > 0" class="flex flex-col gap-4 w-full">
          <UCard
            v-for="doc in documents"
            :key="doc.file_id"
            variant="documentGlass"
            class="relative w-full"
          >
            <div :class="appConfig.layout.documentCardHeader">
              <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
              <div class="flex items-center gap-1 shrink-0">
                <UTooltip text="Edit">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="text-surface-500 w-6! h-6! p-0"
                  />
                </UTooltip>
                <UTooltip v-if="isCurrentUserLeader" text="Delete">
                  <UButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    class="text-surface-500 hover:text-error-500 w-6! h-6! p-0"
                    @click="emit('delete', doc)"
                  />
                </UTooltip>
              </div>
            </div>

            <div :class="appConfig.layout.documentCardImage" class="h-40!">
              <UIcon name="i-heroicons-document" class="w-12 h-12 text-surface-500/50" />
              <div class="absolute bottom-2 px-4 w-full flex justify-between">
                <UTooltip text="View">
                  <UButton
                    icon="i-heroicons-eye"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                  />
                </UTooltip>
                <UTooltip text="Download">
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    :href="doc.download_url"
                    target="_blank"
                  />
                </UTooltip>
              </div>
            </div>

            <div :class="appConfig.layout.documentCardMeta">
              <p>
                Uploaded by:
                <span class="font-bold text-dark-text">{{
                  doc.creator?.username || 'Unknown'
                }}</span>
              </p>
              <p>
                Uploaded at:
                <span class="font-bold text-dark-text">{{
                  new Date(doc.created_at).toLocaleDateString()
                }}</span>
              </p>
              <p>
                Document type:
                <span class="font-bold text-dark-text">{{
                  doc.documents?.document_type.toLocaleLowerCase() || 'N/A'
                }}</span>
              </p>
              <div :class="appConfig.layout.divider"></div>
              <div :class="appConfig.layout.flexBetween">
                <p>
                  File type:
                  <span class="font-bold text-dark-text">{{
                    doc.mime_type.split('/')[1] || 'Unknown'
                  }}</span>
                </p>
                <p>
                  File size:
                  <span class="font-bold text-dark-text"
                    >{{ (doc.file_size / (1024 * 1024)).toFixed(2) }} MB</span
                  >
                </p>
              </div>
              <div :class="appConfig.layout.divider"></div>
              <p>
                Issued:
                <span class="font-bold text-dark-text">{{
                  doc.documents?.issue_date
                    ? new Date(doc.documents.issue_date).toLocaleDateString()
                    : 'N/A'
                }}</span>
              </p>
              <p>
                Ends:
                <span class="font-bold text-dark-text">{{
                  doc.documents?.expiry_date
                    ? new Date(doc.documents.expiry_date).toLocaleDateString()
                    : 'N/A'
                }}</span>
              </p>
            </div>
          </UCard>
        </div>

        <div v-else :class="appConfig.typography.statusLoading" class="py-4 text-center">
          {{
            searchQuery || filterType !== 'ALL'
              ? 'No matching documents found.'
              : 'No documents found for this group.'
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupFile } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

const appConfig = useAppConfig();

const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterType = defineModel<string>('filterType', { default: 'ALL' });

const props = defineProps<{
  documents: GroupFile[];
  groups: GroupOutDto[];
  selectedGroup: string | undefined;
  isLoading: boolean;
  isCurrentUserLeader: boolean;
  documentTypes: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (e: 'update:selectedGroup', value: string | undefined): void;
  (e: 'delete', file: GroupFile): void;
  (e: 'upload' | 'delete-group' | 'leave-group'): void;
}>();

const isGroupDropdownOpen = ref(false);

const currentGroupDetails = computed(() =>
  props.groups.find((g) => g.uuid === props.selectedGroup),
);

const selectGroup = (uuid: string) => {
  emit('update:selectedGroup', uuid);
  isGroupDropdownOpen.value = false;
};
</script>
