<!-- frontend/app/components/views/mobile/users/ProfileMobile.vue -->
<template>
  <div :class="[appConfig.layout.pageWrapper, 'px-4 py-6']">
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

      <div v-else-if="currentUser" class="w-full relative flex flex-col">
        <!-- PROFILE CARD SECTION -->
        <div :class="[appConfig.layout.profileCard, 'p-4! gap-4! flex-row! items-center']">
          <!-- Delete Button (Marad a jobb felső sarokban) -->
          <div class="absolute top-2 left-2 z-10">
            <UTooltip :text="CONST_TOOLTIP_DELETE_PROFILE ?? 'Delete Profile'">
              <UButton
                icon="i-heroicons-trash"
                variant="glassIconButtonDanger"
                class="w-7! h-7!"
                @click="profileStore.openDeleteModal(currentUser)"
              />
            </UTooltip>
          </div>

          <!-- Profile picture -->
          <div
            :class="appConfig.layout.profilePictureWrapper"
            class="top-3 w-20! h-20! my-0! ml-0! shrink-0 relative"
          >
            <div :class="appConfig.layout.profilePictureInner">
              <img
                v-if="currentUser.profile_image_url"
                :src="currentUser.profile_image_url"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <UIcon v-else name="i-heroicons-user" class="w-10 h-10 text-surface-500" />

              <div
                class="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent pointer-events-none"
              ></div>

              <UTooltip
                :text="CONST_TOOLTIP_VIEW_PICTURE ?? 'View Picture'"
                class="absolute bottom-0.5 left-0.5"
              >
                <UButton
                  icon="i-heroicons-eye"
                  variant="ghostDangerIconButton"
                  class="text-surface-500 w-6! h-6! p-0"
                  @click="profileStore.openViewPictureModal(currentUser)"
                />
              </UTooltip>

              <UTooltip
                :text="CONST_TOOLTIP_UPLOAD_PICTURE ?? 'Upload Picture'"
                class="absolute bottom-0.5 right-0.5"
              >
                <UButton
                  icon="i-heroicons-arrow-up-tray"
                  variant="ghostDangerIconButton"
                  class="text-surface-500 w-6! h-6! p-0"
                  @click="profileStore.openUploadPictureModal()"
                />
              </UTooltip>
            </div>
          </div>

          <!-- User details -->
          <div
            :class="appConfig.layout.profileDetailsWrapper"
            class="gap-1! text-sm! flex-1 min-w-0"
          >
            <!-- Username -->
            <div :class="appConfig.layout.profileDetailRow" class="gap-2!">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ CONST_USERNAME_LABEL }}
              </p>
              <div
                :class="appConfig.layout.actionGroup"
                class="justify-between flex-1 min-w-0 gap-1!"
              >
                <p :class="appConfig.typography.profileValue" class="text-sm! truncate">
                  {{ currentUser.username }}
                </p>
                <UTooltip :text="CONST_TOOLTIP_EDIT_USERNAME ?? 'Edit Username'">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="w-6! h-6! p-0 shrink-0"
                    @click="profileStore.openEditUsernameModal(currentUser)"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Email -->
            <div :class="appConfig.layout.profileDetailRow" class="gap-2!">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ CONST_EMAIL_LABEL }}
              </p>
              <div
                :class="appConfig.layout.actionGroup"
                class="justify-between flex-1 min-w-0 gap-1!"
              >
                <p :class="appConfig.typography.profileValue" class="text-xs! truncate">
                  {{ currentUser.email }}
                </p>
                <UTooltip :text="CONST_TOOLTIP_EDIT_EMAIL ?? 'Edit Email'">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="w-6! h-6! p-0 shrink-0"
                    @click="profileStore.openEditEmailModal(currentUser)"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Password -->
            <div :class="appConfig.layout.profileDetailRow" class="gap-2!">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ CONST_PASSWORD_LABEL }}
              </p>
              <div
                :class="appConfig.layout.actionGroup"
                class="justify-between flex-1 min-w-0 gap-1!"
              >
                <p :class="appConfig.typography.profileValueLg" class="text-sm! mt-1">********</p>
                <UTooltip :text="CONST_TOOLTIP_EDIT_PASSWORD ?? 'Edit Password'">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="w-6! h-6! p-0 shrink-0"
                    @click="profileStore.openChangePasswordModal()"
                  />
                </UTooltip>
              </div>
            </div>
            <!-- Registered -->
            <div :class="appConfig.layout.profileDetailRow" class="gap-2!">
              <p :class="appConfig.typography.profileLabel" class="w-16! text-[10px]!">
                {{ CONST_REGISTERED_LABEL }}
              </p>
              <div
                :class="appConfig.layout.actionGroup"
                class="justify-between flex-1 min-w-0 gap-1!"
              >
                <p :class="appConfig.typography.profileValue" class="text-xs! truncate">
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
        <div :class="appConfig.layout.sectionWrapper" class="mt-6">
          <div :class="appConfig.layout.pageHeader" class="mb-4">
            <h2 :class="appConfig.typography.sectionTitleTransparent" class="text-xl">
              {{ CONST_DOCUMENTS_HEADING }}
            </h2>
            <div :class="appConfig.layout.actionGroup" class="justify-center mt-2">
              <UTooltip :text="CONST_TOOLTIP_FILTER_DOCS ?? 'Filter'">
                <UButton
                  icon="i-heroicons-funnel"
                  :label="CONST_FILTER_LABEL"
                  variant="glassButton"
                />
              </UTooltip>
              <UTooltip :text="CONST_TOOLTIP_UPLOAD_DOC ?? 'Upload Document'">
                <UButton
                  icon="i-heroicons-plus"
                  variant="glassIconButton"
                  @click="profileStore.openUploadDocumentModal()"
                />
              </UTooltip>
            </div>
          </div>

          <!-- Dummy Document List -->
          <div class="flex flex-col gap-4 w-full">
            <UCard
              v-for="doc in dummyDocuments"
              :key="doc.id"
              variant="documentGlass"
              class="relative w-full"
            >
              <!-- Title and action buttons -->
              <div :class="appConfig.layout.documentCardHeader">
                <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.title }}</p>
                <div class="flex items-center gap-1">
                  <UTooltip :text="CONST_TOOLTIP_EDIT_DOC ?? 'Edit'">
                    <UButton
                      icon="i-heroicons-pencil"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                    />
                  </UTooltip>
                  <UTooltip :text="CONST_TOOLTIP_DELETE_DOC ?? 'Delete'">
                    <UButton
                      icon="i-heroicons-trash"
                      variant="ghostDangerIconButton"
                      class="text-surface-500"
                    />
                  </UTooltip>
                </div>
              </div>

              <!-- File Preview (Proxy) -->
              <div :class="appConfig.layout.documentCardImage" class="h-32!">
                <UIcon name="i-heroicons-photo" class="w-12 h-12 text-surface-500/50" />
                <div class="absolute bottom-2 px-4 w-full flex justify-between">
                  <UTooltip :text="CONST_TOOLTIP_VIEW_DOC ?? 'View'">
                    <UButton icon="i-heroicons-eye" variant="ghostDangerIconButton" />
                  </UTooltip>
                  <UTooltip :text="CONST_TOOLTIP_DOWNLOAD_DOC ?? 'Download'">
                    <UButton icon="i-heroicons-arrow-down-tray" variant="ghostDangerIconButton" />
                  </UTooltip>
                </div>
              </div>

              <!-- Metadata -->
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
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
/* --- IMPORTS --- */
import { useAppConfig } from '#imports';
import type { useProfileStore } from '~/stores/profile.modals.store';
import type { UserOutDto } from '~/types/user.type';
import type { ApiError } from '~/types/apiError.type';

/* --- INTERFACES --- */
interface DummyDocument {
  id: number;
  title: string;
  uploadedAt: string;
  type: string;
  fileType: string;
  fileSize: string;
  issued: string;
  ends: string;
}

/* --- COMPOSABLES --- */
const appConfig = useAppConfig();

/* --- PROPS --- */
defineProps<{
  currentUser: UserOutDto | null | undefined;
  isLoading: boolean;
  error: ApiError | Error | null | undefined;
  dummyDocuments: DummyDocument[];
  profileStore: ReturnType<typeof useProfileStore>;
}>();
</script>
