<!-- frontend/app/pages/users/profile.vue -->
<template>
  <div :class="appConfig.layout.pageWrapper">
    <div>
      <h1 :class="appConfig.typography.pageTitle">{{ CONST_PROFILE_HEADING }}</h1>
    </div>

    <ClientOnly>
      <div v-if="isLoading" :class="appConfig.typography.statusLoading">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" :class="appConfig.typography.statusError">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="currentUser" class="w-full relative">
        <!-- PROFILE Card -->
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
            <h2 :class="appConfig.typography.sectionTitleTransparent">
              {{ CONST_DOCUMENTS_HEADING }}
            </h2>
            <div class="w-30 hidden md:block"></div>
          </div>

          <!-- Dummy Document List -->
          <div :class="appConfig.layout.documentGrid">
            <UCard
              v-for="doc in dummyDocuments"
              :key="doc.id"
              variant="documentGlass"
              class="relative"
            >
              <!-- Title and action buttons -->
              <div :class="appConfig.layout.documentCardHeader">
                <p class="font-bold truncate pr-2 shadow-sm">{{ doc.title }}</p>
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
              <div :class="appConfig.layout.documentCardImage">
                <UIcon name="i-heroicons-photo" class="w-16 h-16 text-surface-500/50" />
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
import { useAppConfig } from '#imports';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useProfileStore } from '~/stores/profile.modals.store';

definePageMeta({ layout: 'general', middleware: ['auth'] });

const appConfig = useAppConfig();
const router = useRouter();
const { isAuthenticated } = useAuth();
const profileStore = useProfileStore();

watch(
  isAuthenticated,
  (isAuth) => {
    if (!isAuth) router.push('/login');
  },
  { immediate: true },
);

const { data: currentUser, isLoading, error } = useCurrentUserQuery();

// Dummy Data
const dummyDocuments = ref([
  {
    id: 1,
    title: 'Summer Vacation Passport',
    uploadedAt: '2026.08.21',
    type: 'Passport',
    fileType: 'PDF',
    fileSize: '4.23 MB',
    issued: '2023.05.10',
    ends: '2033.05.10',
  },
  {
    id: 2,
    title: 'Driver License Front',
    uploadedAt: '2026.08.20',
    type: 'ID Card',
    fileType: 'PNG',
    fileSize: '2.89 MB',
    issued: '2020.11.15',
    ends: '2030.11.15',
  },
  {
    id: 3,
    title: 'Gym Membership',
    uploadedAt: '2026.08.19',
    type: 'Membership card',
    fileType: 'PDF',
    fileSize: '7.45 MB',
    issued: '2026.01.01',
    ends: '2027.01.01',
  },
  {
    id: 4,
    title: 'Student ID',
    uploadedAt: '2026.08.15',
    type: 'ID Card',
    fileType: 'PDF',
    fileSize: '3.22 MB',
    issued: '2025.10.01',
    ends: '2026.10.01',
  },
]);
</script>
