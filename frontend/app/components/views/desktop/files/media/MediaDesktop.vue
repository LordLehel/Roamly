<!-- frontend/app/components/views/desktop/files/media/MediaDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- HEADER -->
    <div :class="appConfig.layout.pageHeader">
      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-start">
        <UTooltip v-if="isCurrentUserLeader" text="Delete Group">
          <UButton
            icon="i-heroicons-trash"
            variant="glassIconButtonDanger"
            @click="emit('delete-group')"
          />
        </UTooltip>
        <UTooltip text="Leave Group">
          <UButton
            icon="i-heroicons-arrow-right-on-rectangle"
            variant="glassIconButtonDanger"
            @click="emit('leave-group')"
          />
        </UTooltip>
      </div>

      <!-- DROPDOWN HEADER -->
      <div class="flex flex-col items-center justify-center shrink-0">
        <UPopover v-model:open="isGroupDropdownOpen">
          <UButton
            variant="ghost"
            class="group flex items-center gap-2 p-0 hover:bg-transparent cursor-pointer outline-none"
          >
            <h1 :class="appConfig.typography.pageTitle">
              <ClientOnly fallback="Loading...">
                {{ isLoading ? 'Loading...' : currentGroupDetails?.name || 'Select a Group' }}
              </ClientOnly>
            </h1>
            <UIcon
              name="i-heroicons-chevron-down"
              class="w-5 h-5 text-surface-500 transition-transform duration-200"
              :class="{ 'rotate-180': isGroupDropdownOpen }"
            />
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
        <p :class="appConfig.typography.pageSubtitle" class="mt-0">Group Photos</p>
      </div>

      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-end">
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
            to="/files/media"
          />
        </UTooltip>
        <UTooltip text="Documents">
          <UButton
            icon="i-heroicons-document-text"
            variant="glassIconButton"
            :to="documentsRoute"
          />
        </UTooltip>
      </div>
    </div>

    <!-- MEDIA SECTION -->
    <div :class="appConfig.layout.sectionWrapper" class="mt-8!">
      <div class="flex items-center justify-between w-full mb-6 relative">
        <div class="flex items-center gap-3 flex-1 justify-start">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search photos..."
            variant="search"
            class="w-1/3! max-w-none!"
          />
        </div>

        <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">Group Photos</div>

        <div class="flex items-center gap-2 flex-1 justify-end shrink-0">
          <UTooltip text="Upload Photo">
            <UButton
              icon="i-heroicons-plus"
              variant="glassIconButtonHighlight"
              @click="emit('upload')"
            />
          </UTooltip>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">Loading photos...</div>

      <!-- Media Grid -->
      <div v-else-if="filteredMedia.length > 0" :class="appConfig.layout.documentGrid">
        <UCard
          v-for="media in filteredMedia"
          :key="media.file_id"
          variant="documentGlass"
          class="relative"
        >
          <!-- Title + delete -->
          <div :class="appConfig.layout.documentCardHeader">
            <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ media.file_name }}</p>
            <div class="flex items-center gap-1 shrink-0">
              <UTooltip v-if="isCurrentUserLeader" text="Delete">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  class="text-surface-500 hover:text-error-500"
                  @click="emit('delete', media)"
                />
              </UTooltip>
            </div>
          </div>

          <!-- Image preview -->
          <div :class="appConfig.layout.documentCardImage" class="overflow-hidden">
            <img
              v-if="isImage(media.mime_type)"
              :src="media.download_url || media.file_url"
              :alt="media.file_name"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex flex-col items-center justify-center gap-2">
              <UIcon name="i-heroicons-film" class="w-16 h-16 text-surface-500/50" />
              <span class="text-xs text-surface-400">{{ media.mime_type }}</span>
            </div>

            <div class="absolute bottom-2 px-4 w-full flex justify-between">
              <UTooltip text="View">
                <UButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                  :href="media.download_url || media.file_url"
                  target="_blank"
                />
              </UTooltip>
              <UTooltip text="Download">
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  variant="ghostDangerIconButton"
                  class="text-surface-500 hover:text-brand-500"
                  @click.prevent="
                    emit('download', media.download_url || media.file_url, media.file_name)
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
                media.creator?.username || 'Unknown'
              }}</span>
            </p>
            <p>
              Uploaded at:
              <span class="font-bold text-dark-text">{{
                new Date(media.created_at).toLocaleDateString()
              }}</span>
            </p>
            <div v-if="media.media_files?.description">
              <div :class="appConfig.layout.divider"></div>
              <p>
                Description:
                <span class="font-bold text-dark-text">{{ media.media_files.description }}</span>
              </p>
            </div>
            <div :class="appConfig.layout.divider"></div>
            <div :class="appConfig.layout.flexBetween">
              <p>
                Type:
                <span class="font-bold text-dark-text">{{
                  media.mime_type?.split('/')[1] || 'Unknown'
                }}</span>
              </p>
              <p>
                Size:
                <span class="font-bold text-dark-text"
                  >{{ (media.file_size / (1024 * 1024)).toFixed(2) }} MB</span
                >
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty state -->
      <div v-else :class="appConfig.typography.statusLoading">
        {{
          searchQuery ? 'No photos match your search.' : 'No photos yet. Upload one to get started.'
        }}
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

// Contextual nav routes — route to the currently selected group
const membersRoute = computed(() =>
  selectedGroup.value ? `/groups/${selectedGroup.value}/members` : '/groups',
);
const eventsRoute = computed(() => '/events');
const documentsRoute = computed(() => '/files/documents');

const isImage = (mimeType: string) => mimeType?.startsWith('image/');

const filteredMedia = computed<GroupFile[]>(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return props.media;
  return props.media.filter((m) => m.file_name.toLowerCase().includes(q));
});
</script>
