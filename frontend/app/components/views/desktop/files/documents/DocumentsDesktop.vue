<!-- frontend/app/components/views/desktop/files/documents/DocumentsDesktop.vue -->
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
      <div class="flex flex-col items-start justify-center shrink-0">
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
        <p :class="appConfig.typography.pageSubtitle" class="mt-0">Group Documents</p>
      </div>

      <div :class="appConfig.layout.actionGroup" class="flex-1 justify-end">
        <UTooltip text="Members">
          <UButton icon="i-heroicons-users" variant="glassIconButton" :to="membersRoute" />
        </UTooltip>
        <UTooltip text="Calendar">
          <UButton icon="i-heroicons-calendar" variant="glassIconButton" :to="eventsRoute" />
        </UTooltip>
        <UTooltip text="Photos">
          <UButton icon="i-heroicons-photo" variant="glassIconButton" :to="mediaRoute" />
        </UTooltip>
        <UTooltip text="Documents">
          <UButton
            icon="i-heroicons-document-text"
            variant="glassIconButton"
            class="text-brand-500"
            :to="documentsRoute"
          />
        </UTooltip>
      </div>
    </div>

    <!-- ==================== -->
    <!-- GROUP DOCUMENT SECTION -->
    <!-- ==================== -->
    <div :class="appConfig.layout.sectionWrapper" class="mt-8!">
      <div class="flex items-center justify-between w-full mb-6 relative">
        <div class="flex items-center gap-3 flex-1 justify-start">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search documents..."
            variant="search"
            class="w-1/2! max-w-none!"
            :ui="{ leading: 'pl-3' }"
          />
          <UPopover>
            <UButton
              icon="i-heroicons-funnel"
              :label="
                filterType === 'ALL'
                  ? 'Filter'
                  : documentTypes.find((d) => d.value === filterType)?.label
              "
              variant="glassButton"
            />
            <template #content="{ close }">
              <div :class="[appConfig.ui.dropdownMenu.slots.content, 'w-fit']">
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
        </div>

        <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">
          {{ CONST_GROUP_DOCUMENTS_HEADER }}
        </div>

        <div class="flex items-center gap-2 flex-1 justify-end shrink-0">
          <UTooltip v-if="isCurrentUserLeader" text="Upload Document">
            <UButton
              icon="i-heroicons-plus"
              variant="glassIconButtonHighlight"
              @click="emit('upload')"
            />
          </UTooltip>
        </div>
      </div>

      <!-- DOCUMENT GRID -->
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">Loading documents...</div>

      <div v-else-if="documents.length > 0" :class="appConfig.layout.documentGrid">
        <UCard v-for="doc in documents" :key="doc.file_id" variant="documentGlass" class="relative">
          <div :class="appConfig.layout.documentCardHeader">
            <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
            <div class="flex items-center gap-1 shrink-0">
              <UTooltip v-if="isCurrentUserLeader" text="Delete">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  class="text-surface-500 hover:text-error-500"
                  @click="emit('delete', doc)"
                />
              </UTooltip>
            </div>
          </div>

          <div :class="appConfig.layout.documentCardImage">
            <UIcon name="i-heroicons-document" class="w-16 h-16 text-surface-500/50" />
            <div class="absolute bottom-2 px-4 w-full flex justify-between">
              <UTooltip text="View">
                <UButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                  :href="doc.download_url"
                  target="_blank"
                />
              </UTooltip>
              <UTooltip text="Download">
                <UButton
                  icon="i-heroicons-arrow-down-tray"
                  variant="ghostDangerIconButton"
                  class="text-surface-500 hover:text-brand-500"
                  @click.prevent="emit('download', doc.download_url, doc.file_name)"
                />
              </UTooltip>
            </div>
          </div>

          <div :class="appConfig.layout.documentCardMeta">
            <p>
              Uploaded by:
              <span class="font-bold text-dark-text">{{ doc.creator?.username || 'Unknown' }}</span>
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
      <div v-else :class="appConfig.typography.statusLoading">
        {{
          searchQuery || filterType !== 'ALL'
            ? 'No matching documents found.'
            : 'No documents found for this group.'
        }}
      </div>
    </div>
  </div>

  <!-- ========================= -->
  <!-- MEMBER DOCUMENTS (leader) -->
  <!-- ========================= -->
  <div v-if="isCurrentUserLeader" :class="appConfig.layout.pageWrapper">
    <div class="flex items-center justify-between w-full mb-6 relative">
      <div class="flex items-center gap-3 flex-1 justify-start">
        <UInput
          v-model="memberSearchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search private documents..."
          variant="search"
          class="w-1/2! max-w-none!"
          :ui="{ leading: 'pl-3' }"
        />
        <UPopover>
          <UButton
            icon="i-heroicons-funnel"
            :label="
              memberFilterType === 'ALL'
                ? 'Filter'
                : privateDocumentTypes.find((d) => d.value === memberFilterType)?.label
            "
            variant="glassButton"
          />
          <template #content="{ close }">
            <div :class="[appConfig.ui.dropdownMenu.slots.content, 'w-fit']">
              <button
                v-for="type in privateDocumentTypes"
                :key="type.value"
                :class="appConfig.ui.dropdownMenu.slots.item"
                @click="
                  memberFilterType = type.value;
                  close();
                "
              >
                <UIcon
                  :name="
                    memberFilterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'
                  "
                  :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                />
                <span>{{ type.label }}</span>
              </button>
            </div>
          </template>
        </UPopover>
      </div>

      <div :class="appConfig.typography.pageTitle" class="text-2xl font-bold">
        {{ CONST_MEMBER_DOCUMENTS_HEADER }}
      </div>

      <div class="flex items-center gap-2 flex-1 justify-end shrink-0">
        <!-- intentionally empty — leaders cannot upload on behalf of members -->
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoadingMemberDocuments" :class="appConfig.typography.statusLoading">
      Loading member documents...
    </div>

    <template v-else>
      <div
        v-for="type in privateDocumentTypes.filter(
          (t) => t.value !== 'ALL' && (memberFilterType === 'ALL' || memberFilterType === t.value),
        )"
        :key="type.value"
        class="flex flex-col gap-4 mb-8"
      >
        <h2 :class="appConfig.typography.pageTitle" class="text-xl font-bold">
          {{ type.label }}
        </h2>

        <!-- Documents of this type -->
        <div
          v-if="filteredMemberDocuments(type.value).length > 0"
          :class="appConfig.layout.documentGrid"
        >
          <UCard
            v-for="doc in filteredMemberDocuments(type.value)"
            :key="doc.file_id"
            variant="documentGlass"
            class="relative"
          >
            <div :class="appConfig.layout.documentCardHeader">
              <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
            </div>

            <div :class="appConfig.layout.documentCardImage">
              <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-surface-500/50" />
              <div class="absolute bottom-2 px-4 w-full flex justify-end">
                <UTooltip text="View">
                  <UButton
                    icon="i-heroicons-eye"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                    :href="doc.file_url"
                    target="_blank"
                  />
                </UTooltip>
              </div>
            </div>

            <div :class="appConfig.layout.documentCardMeta">
              <p>
                Uploaded at:
                <span class="font-bold text-dark-text">{{
                  new Date(doc.created_at).toLocaleDateString()
                }}</span>
              </p>
              <p>
                Document type:
                <span class="font-bold text-dark-text">{{
                  doc.documents?.document_type ?? 'N/A'
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

        <!-- Empty per-type state -->
        <UCard v-else variant="documentGlass" class="relative">
          <div class="py-6 text-center">
            <UIcon
              name="i-heroicons-document-text"
              class="w-12 h-12 text-surface-500/40 mx-auto mb-2"
            />
            <p class="text-surface-400 italic text-sm">
              No {{ type.label.toLowerCase() }} documents found
              <template v-if="memberSearchQuery"> matching "{{ memberSearchQuery }}"</template>.
            </p>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { GroupFile, PrivateDocumentMetadata } from '~/types/files.type';
import type { GroupOutDto } from '~/types/groups.type';

const appConfig = useAppConfig();

const selectedGroup = defineModel<string | undefined>('selectedGroup');
const searchQuery = defineModel<string>('searchQuery', { default: '' });
const filterType = defineModel<string>('filterType', { default: 'ALL' });
const memberSearchQuery = defineModel<string>('memberSearchQuery', { default: '' });
const memberFilterType = defineModel<string>('memberFilterType', { default: 'ALL' });

const props = defineProps<{
  documents: GroupFile[];
  memberDocuments: PrivateDocumentMetadata[];
  isLoadingMemberDocuments: boolean;
  groups: GroupOutDto[];
  isLoading: boolean;
  isCurrentUserLeader: boolean;
  documentTypes: { label: string; value: string }[];
  privateDocumentTypes: { label: string; value: string }[];
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

// Contextual nav — route to the currently selected group
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

/**
 * Returns member documents filtered by type and optional search query.
 */
const filteredMemberDocuments = (typeValue: string): PrivateDocumentMetadata[] => {
  const query = memberSearchQuery.value.toLowerCase().trim();
  return props.memberDocuments.filter((doc) => {
    const matchesType = doc.documents?.document_type === typeValue;
    const matchesSearch = !query || doc.file_name.toLowerCase().includes(query);
    return matchesType && matchesSearch;
  });
};
</script>
