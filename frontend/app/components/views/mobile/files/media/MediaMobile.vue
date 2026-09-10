<!-- frontend/app/components/views/mobile/files/media/MediaMobile.vue -->
<template>
  <div class="flex flex-col flex-1 gap-4 w-full p-4 pb-20">
    <!-- TOP NAV BUTTONS -->
    <div :class="appConfig.calendar.mobileTopActions">
      <UTooltip text="Members">
        <UButton icon="i-heroicons-users" variant="glassIconButton" :to="membersRoute" />
      </UTooltip>
      <UTooltip text="Calendar">
        <UButton icon="i-heroicons-calendar" variant="glassIconButton" :to="eventsRoute" />
      </UTooltip>
      <UTooltip text="Photos">
        <UButton
          icon="i-heroicons-photo"
          variant="glassIconButton"
          class="text-brand-500"
          :to="mediaRoute"
        />
      </UTooltip>
      <UTooltip text="Documents">
        <UButton icon="i-heroicons-document-text" variant="glassIconButton" :to="documentsRoute" />
      </UTooltip>
    </div>

    <div :class="appConfig.calendar.mobileMainWrapper">
      <!-- GROUP DROPDOWN HEADER -->
      <div :class="appConfig.calendar.mobileHeader" class="mb-4">
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
            <p :class="appConfig.typography.pageSubtitle" class="mt-0">Group Photos</p>
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

      <!-- TOOLBAR: search + upload -->
      <div :class="appConfig.calendar.mobileToolbar">
        <UInput
          v-model="searchQuery"
          placeholder="Search photos..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
          variant="search"
          :ui="{ leading: 'pl-3' }"
        />
        <UTooltip text="Upload Photo">
          <UButton icon="i-heroicons-plus" variant="glassIconButton" @click="emit('upload')" />
        </UTooltip>
      </div>

      <!-- MEDIA LIST -->
      <div class="px-2 pt-2">
        <div v-if="isLoading" :class="appConfig.typography.statusLoading" class="py-4 text-center">
          Loading photos...
        </div>

        <div v-else-if="filteredMedia.length > 0" class="flex flex-col gap-4 w-full">
          <UCard
            v-for="mediaItem in filteredMedia"
            :key="mediaItem.file_id"
            variant="documentGlass"
            class="relative w-full"
          >
            <!-- Title + delete -->
            <div :class="appConfig.layout.documentCardHeader">
              <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ mediaItem.file_name }}</p>
              <div class="flex items-center gap-1 shrink-0">
                <UTooltip v-if="isCurrentUserLeader" text="Delete">
                  <UButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    class="text-surface-500 hover:text-error-500 w-6! h-6! p-0"
                    @click="emit('delete', mediaItem)"
                  />
                </UTooltip>
              </div>
            </div>

            <!-- Image preview -->
            <div :class="appConfig.layout.documentCardImage" class="h-48! overflow-hidden">
              <img
                v-if="isImage(mediaItem.mime_type)"
                :src="mediaItem.download_url || mediaItem.file_url"
                :alt="mediaItem.file_name"
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center justify-center gap-2">
                <UIcon name="i-heroicons-film" class="w-12 h-12 text-surface-500/50" />
                <span class="text-xs text-surface-400">{{ mediaItem.mime_type }}</span>
              </div>

              <div class="absolute bottom-2 px-4 w-full flex justify-between">
                <UTooltip text="View">
                  <UButton
                    icon="i-heroicons-eye"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    :href="mediaItem.download_url || mediaItem.file_url"
                    target="_blank"
                  />
                </UTooltip>
                <UTooltip text="Download">
                  <UButton
                    icon="i-heroicons-arrow-down-tray"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    @click.prevent="
                      emit(
                        'download',
                        mediaItem.download_url || mediaItem.file_url,
                        mediaItem.file_name,
                      )
                    "
                  />
                </UTooltip>
              </div>
            </div>

            <!-- Metadata -->
            <div :class="appConfig.layout.documentCardMeta">
              <p>
                Uploaded by:
                <span class="font-bold text-dark-text">{{
                  mediaItem.creator?.username || 'Unknown'
                }}</span>
              </p>
              <p>
                Uploaded at:
                <span class="font-bold text-dark-text">{{
                  new Date(mediaItem.created_at).toLocaleDateString()
                }}</span>
              </p>
              <div v-if="mediaItem.media_files?.description">
                <div :class="appConfig.layout.divider"></div>
                <p>
                  Description:
                  <span class="font-bold text-dark-text">{{
                    mediaItem.media_files.description
                  }}</span>
                </p>
              </div>
              <div :class="appConfig.layout.divider"></div>
              <div :class="appConfig.layout.flexBetween">
                <p>
                  Type:
                  <span class="font-bold text-dark-text">{{
                    mediaItem.mime_type?.split('/')[1] || 'Unknown'
                  }}</span>
                </p>
                <p>
                  Size:
                  <span class="font-bold text-dark-text"
                    >{{ (mediaItem.file_size / (1024 * 1024)).toFixed(2) }} MB</span
                  >
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <div v-else :class="appConfig.typography.statusLoading" class="py-4 text-center">
          {{
            searchQuery
              ? 'No photos match your search.'
              : 'No photos yet. Upload one to get started.'
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

const selectedGroup = defineModel<string | undefined>('selectedGroup');
const searchQuery = defineModel<string>('searchQuery', { default: '' });

const props = defineProps<{
  media: GroupFile[];
  groups: GroupOutDto[];
  isLoading: boolean;
  isCurrentUserLeader: boolean;
}>();

const emit = defineEmits<{
  delete: [file: GroupFile];
  upload: [];
  'delete-group': [];
  'leave-group': [];
  download: [url: string | undefined, filename: string];
}>();

const isGroupDropdownOpen = ref(false);

const currentGroupDetails = computed(() =>
  props.groups.find((g) => g.uuid === selectedGroup.value),
);

const selectGroup = (uuid: string) => {
  selectedGroup.value = uuid;
  isGroupDropdownOpen.value = false;
};

// Contextual nav routes
const membersRoute = computed(() =>
  selectedGroup.value ? `/groups/${selectedGroup.value}/members` : '/groups',
);
const eventsRoute = computed(() =>
  selectedGroup.value ? `/events?groupId=${selectedGroup.value}` : '/events',
);
const mediaRoute = computed(() =>
  selectedGroup.value ? `/files/media?groupId=${selectedGroup.value}` : '/files/media',
);
const documentsRoute = computed(() =>
  selectedGroup.value ? `/files/documents?groupId=${selectedGroup.value}` : '/files/documents',
);

const isImage = (mimeType: string) => mimeType?.startsWith('image/');

const filteredMedia = computed<GroupFile[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return props.media;
  return props.media.filter((m) => m.file_name.toLowerCase().includes(q));
});
</script>
