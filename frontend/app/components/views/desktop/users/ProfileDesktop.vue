<!-- frontend/app/components/views/desktop/users/ProfileDesktop.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <!-- PAGE TITLE -->
    <div>
      <h1 :class="appConfig.typography.pageTitle">{{ CONST_PROFILE_HEADING }}</h1>
    </div>

    <!-- CONTENT SECTION -->
    <ClientOnly>
      <!-- LOADING / ERROR STATES -->
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="currentUser" class="w-full relative">
        <!-- PROFILE CARD SECTION -->
        <div :class="appConfig.layout.profileCard">
          <!-- Delete Button -->
          <div class="absolute top-4 right-4 z-10">
            <UTooltip :text="CONST_TOOLTIP_DELETE_PROFILE ?? 'Delete Profile'">
              <UButton
                icon="i-heroicons-trash"
                variant="glassIconButtonDanger"
                @click="profileStore.openDeleteModal(currentUser)"
              />
            </UTooltip>
          </div>

          <!-- Profile picture -->
          <div :class="appConfig.layout.profilePictureWrapper">
            <div :class="appConfig.layout.profilePictureInner">
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <UIcon v-else name="i-heroicons-user" class="w-20 h-20 text-surface-500" />

              <div
                class="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent pointer-events-none"
              ></div>

              <UTooltip
                :text="CONST_TOOLTIP_VIEW_PICTURE ?? 'View Picture'"
                class="absolute bottom-2 left-2"
              >
                <UButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                  @click="profileStore.openViewPictureModal(currentUser)"
                />
              </UTooltip>

              <UTooltip
                :text="CONST_TOOLTIP_UPLOAD_PICTURE ?? 'Upload Picture'"
                class="absolute bottom-2 right-2"
              >
                <UButton
                  icon="i-heroicons-arrow-up-tray"
                  variant="ghostDangerIconButton"
                  class="text-surface-500"
                  @click="profileStore.openUploadPictureModal()"
                />
              </UTooltip>
            </div>
          </div>

          <!-- Right side: user details -->
          <div :class="appConfig.layout.profileDetailsWrapper">
            <!-- Username -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ CONST_USERNAME_LABEL }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">{{ currentUser.username }}</p>
                <UTooltip :text="CONST_TOOLTIP_EDIT_USERNAME ?? 'Edit Username'">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openEditUsernameModal(currentUser)"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Email -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ CONST_EMAIL_LABEL }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">{{ currentUser.email }}</p>
                <UTooltip :text="CONST_TOOLTIP_EDIT_EMAIL ?? 'Edit Email'">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openEditEmailModal(currentUser)"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Password -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ CONST_PASSWORD_LABEL }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValueLg">************</p>
                <UTooltip :text="CONST_TOOLTIP_EDIT_PASSWORD ?? 'Edit Password'">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openChangePasswordModal()"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Registered -->
            <div :class="appConfig.layout.profileDetailRow">
              <p :class="appConfig.typography.profileLabel">{{ CONST_REGISTERED_LABEL }}</p>
              <div :class="appConfig.layout.actionGroup">
                <p :class="appConfig.typography.profileValue">
                  {{
                    currentUser.created_at
                      ? new Date(currentUser.created_at).toLocaleDateString()
                      : 'N/A'
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- DOCUMENT SECTION -->
        <div :class="appConfig.layout.sectionWrapper">
          <div :class="appConfig.layout.pageHeader">
            <div :class="appConfig.layout.actionGroup">
              <!-- Filter popover -->
              <UPopover>
                <UTooltip :text="CONST_TOOLTIP_FILTER_DOCS ?? 'Filter'">
                  <UButton
                    icon="i-heroicons-funnel"
                    :label="
                      filterType === 'ALL'
                        ? (CONST_FILTER_LABEL ?? 'Filter')
                        : privateDocumentTypes.find((d) => d.value === filterType)?.label
                    "
                    variant="glassButton"
                  />
                </UTooltip>
                <template #content="{ close }">
                  <div :class="[appConfig.ui.dropdownMenu.slots.content, 'w-fit']">
                    <button
                      :class="appConfig.ui.dropdownMenu.slots.item"
                      @click="
                        filterType = 'ALL';
                        close();
                      "
                    >
                      <UIcon
                        :name="filterType === 'ALL' ? 'i-heroicons-check' : 'i-heroicons-funnel'"
                        :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                      />
                      <span>All Types</span>
                    </button>
                    <button
                      v-for="type in privateDocumentTypes"
                      :key="type.value"
                      :class="appConfig.ui.dropdownMenu.slots.item"
                      @click="
                        filterType = type.value;
                        close();
                      "
                    >
                      <UIcon
                        :name="
                          filterType === type.value ? 'i-heroicons-check' : 'i-heroicons-funnel'
                        "
                        :class="appConfig.ui.dropdownMenu.slots.itemLeadingIcon"
                      />
                      <span>{{ type.label }}</span>
                    </button>
                  </div>
                </template>
              </UPopover>

              <!-- Upload button -->
              <UTooltip :text="CONST_TOOLTIP_UPLOAD_DOC ?? 'Upload Document'">
                <UButton
                  icon="i-heroicons-plus"
                  variant="glassIconButton"
                  @click="emit('upload')"
                />
              </UTooltip>
            </div>

            <h2 :class="appConfig.typography.sectionTitleTransparent">
              {{ CONST_DOCUMENTS_HEADING }}
            </h2>
            <div class="w-30 hidden md:block"></div>
          </div>

          <!-- Loading state -->
          <div v-if="isLoadingDocuments" :class="appConfig.typography.statusLoading">
            Loading documents...
          </div>

          <!-- Document Grid -->
          <div v-else-if="filteredDocuments.length > 0" :class="appConfig.layout.documentGrid">
            <UCard
              v-for="doc in filteredDocuments"
              :key="doc.file_id"
              variant="documentGlass"
              class="relative"
            >
              <!-- Title and action buttons -->
              <div :class="appConfig.layout.documentCardHeader">
                <p class="font-bold truncate pr-2 shadow-sm">{{ doc.file_name }}</p>
                <div class="flex items-center gap-1">
                  <UTooltip :text="CONST_TOOLTIP_EDIT_DOC ?? 'Edit'">
                    <UButton
                      icon="i-heroicons-pencil"
                      variant="ghostBrandIconButton"
                      class="text-surface-500"
                      @click="emit('edit', doc)"
                    />
                  </UTooltip>
                  <UTooltip :text="CONST_TOOLTIP_DELETE_DOC ?? 'Delete'">
                    <UButton
                      icon="i-heroicons-trash"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                      @click="emit('delete', doc)"
                    />
                  </UTooltip>
                </div>
              </div>

              <!-- File Preview -->
              <div :class="appConfig.layout.documentCardImage">
                <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-surface-500/50" />
                <div class="absolute bottom-2 px-4 w-full flex justify-between">
                  <UTooltip :text="CONST_TOOLTIP_VIEW_DOC ?? 'View'">
                    <UButton
                      icon="i-heroicons-eye"
                      variant="ghostBrandIconButton"
                      class="text-dark-text/70"
                      @click.prevent="emit('view', doc)"
                    />
                  </UTooltip>
                  <UTooltip :text="CONST_TOOLTIP_DOWNLOAD_DOC ?? 'Download'">
                    <UButton
                      icon="i-heroicons-arrow-down-tray"
                      variant="ghostBrandIconButton"
                      class="text-dark-text/70"
                      @click.prevent="emit('download', doc)"
                    />
                  </UTooltip>
                </div>
              </div>

              <!-- Metadata -->
              <div :class="appConfig.layout.documentCardMeta">
                <p>
                  Uploaded at:
                  <span class="font-bold text-dark-text">
                    {{ new Date(doc.created_at).toLocaleDateString() }}
                  </span>
                </p>
                <p>
                  Document type:
                  <span class="font-bold text-dark-text">
                    {{ doc.documents?.document_type ?? 'N/A' }}
                  </span>
                </p>

                <div :class="appConfig.layout.divider"></div>

                <div :class="appConfig.layout.flexBetween">
                  <p>
                    File type:
                    <span class="font-bold text-dark-text">
                      {{ doc.mime_type?.split('/')[1] ?? 'Unknown' }}
                    </span>
                  </p>
                  <p>
                    File size:
                    <span class="font-bold text-dark-text">
                      {{ (doc.file_size / (1024 * 1024)).toFixed(2) }} MB
                    </span>
                  </p>
                </div>

                <div :class="appConfig.layout.divider"></div>

                <p>
                  Issued:
                  <span class="font-bold text-dark-text">
                    {{
                      doc.documents?.issue_date
                        ? new Date(doc.documents.issue_date).toLocaleDateString()
                        : 'N/A'
                    }}
                  </span>
                </p>
                <p>
                  Ends:
                  <span class="font-bold text-dark-text">
                    {{
                      doc.documents?.expiry_date
                        ? new Date(doc.documents.expiry_date).toLocaleDateString()
                        : 'N/A'
                    }}
                  </span>
                </p>
              </div>
            </UCard>
          </div>

          <!-- Empty state -->
          <div v-else :class="appConfig.typography.statusLoading">
            {{
              filterType !== 'ALL'
                ? 'No documents match the selected filter.'
                : 'No private documents yet. Upload one to get started.'
            }}
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { computed, ref } from 'vue';
import { useAppConfig } from '#imports';
import type { useProfileStore } from '~/stores/profile.modals.store';
import type { useDocumentsStore } from '~/stores/documents.modals.store';
import type { UserOutDto } from '~/types/user.type';
import type { ApiError } from '~/types/apiError.type';
import type { PrivateDocumentMetadata } from '~/types/files.type';

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS --- */
const props = defineProps<{
  currentUser: UserOutDto | null | undefined;
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  privateDocuments: PrivateDocumentMetadata[];
  isLoadingDocuments: boolean;
  privateDocumentTypes: { label: string; value: string }[];
  profileStore: ReturnType<typeof useProfileStore>;
  documentsStore: ReturnType<typeof useDocumentsStore>;
}>();

/* --- EMITS --- */
const emit = defineEmits<{
  upload: [];
  edit: [doc: PrivateDocumentMetadata];
  delete: [doc: PrivateDocumentMetadata];
  view: [doc: PrivateDocumentMetadata];
  download: [doc: PrivateDocumentMetadata];
}>();

/* --- LOCAL STATE --- */
const filterType = ref('ALL');

/* --- COMPUTED --- */
const filteredDocuments = computed<PrivateDocumentMetadata[]>(() => {
  if (filterType.value === 'ALL') return props.privateDocuments;
  return props.privateDocuments.filter((doc) => doc.documents?.document_type === filterType.value);
});
</script>
