<!-- frontend/app/pages/users/profile.vue -->
<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-10 relative">
    <!-- Profile Heading -->
    <div>
      <h1 :class="appConfig.typography.pageTitle">{{ CONST_PROFILE_HEADING }}</h1>
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div v-else-if="currentUser" class="w-full relative">
        <!-- PROFILE Card -->
        <div
          class="w-full bg-surface-500/70 backdrop-blur-xl rounded-[25px] shadow-[0_15px_40px_rgba(47,62,50,0.15)] ring-1 ring-surface-500/50 p-8 flex flex-col md:flex-row gap-10 relative"
        >
          <!-- Delete Button -->
          <div class="absolute top-4 right-4 z-10">
            <UButton
              icon="i-heroicons-trash"
              variant="glassIconButtonDanger"
              @click="profileStore.openDeleteModal(currentUser)"
            />
          </div>

          <!-- Profile picture -->
          <div class="relative w-40 h-40 shrink-0 mx-auto md:mx-0 md:ml-12 mt-8 md:mt-0">
            <div
              class="w-full h-full bg-brand-500 rounded-2xl overflow-hidden shadow-lg border border-surface-500/50 flex items-center justify-center relative"
            >
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

              <UButton
                icon="i-heroicons-eye"
                variant="ghostDangerIconButton"
                class="absolute bottom-2 left-2 text-surface-500"
                @click="profileStore.openViewPictureModal(currentUser)"
              />
              <UButton
                icon="i-heroicons-arrow-up-tray"
                variant="ghostDangerIconButton"
                class="absolute bottom-2 right-2 text-surface-500"
                @click="profileStore.openUploadPictureModal()"
              />
            </div>
          </div>

          <!-- Right side: user details -->
          <div class="flex-1 flex flex-col justify-center gap-3 text-dark-text pt-2">
            <!-- Username -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_USERNAME_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold text-lg">{{ currentUser.username }}</p>
                <UButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  @click="profileStore.openEditUsernameModal(currentUser)"
                />
              </div>
            </div>
            <!-- Email -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_EMAIL_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold">{{ currentUser.email }}</p>
                <UButton
                  icon="i-heroicons-pencil"
                  variant="ghostDangerIconButton"
                  @click="profileStore.openEditEmailModal(currentUser)"
                />
              </div>
            </div>
            <!-- Password -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_PASSWORD_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold text-xl leading-none">************</p>
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    @click="profileStore.openChangePasswordModal()"
                  />
                </div>
              </div>
            </div>
            <!-- Registered -->
            <div class="flex items-center gap-4">
              <p class="w-28 font-medium opacity-80 shrink-0">{{ CONST_REGISTERED_LABEL }}</p>
              <div class="flex items-center gap-2">
                <p class="font-bold">
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
        <div class="mt-12 flex flex-col gap-6">
          <div class="flex flex-col md:flex-row justify-between items-center w-full gap-6">
            <div class="flex items-center gap-4">
              <UButton
                icon="i-heroicons-funnel"
                :label="CONST_FILTER_LABEL"
                variant="glassButton"
              />
              <UButton
                icon="i-heroicons-plus"
                variant="glassIconButton"
                @click="profileStore.openUploadDocumentModal()"
              />
            </div>
            <h2 class="text-2xl font-bold text-surface-500 tracking-wide text-center flex-1">
              {{ CONST_DOCUMENTS_HEADING }}
            </h2>
            <div class="w-30 hidden md:block"></div>
          </div>

          <!-- Dummy Document List -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
            <UCard
              v-for="doc in dummyDocuments"
              :key="doc.id"
              variant="documentGlass"
              class="relative"
            >
              <!-- Title and action buttons -->
              <div
                class="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 bg-linear-to-b from-black/50 to-transparent text-white"
              >
                <p class="font-bold truncate pr-2 shadow-sm">{{ doc.title }}</p>
                <div class="flex items-center gap-1">
                  <UButton
                    icon="i-heroicons-pencil"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    variant="ghostDangerIconButton"
                    class="text-surface-500"
                  />
                </div>
              </div>

              <!-- File Preview (Proxy) -->
              <div
                class="w-full h-40 bg-surface-600/30 flex flex-col items-center justify-center relative"
              >
                <UIcon name="i-heroicons-photo" class="w-16 h-16 text-surface-500/50" />

                <div class="absolute bottom-2 px-4 w-full flex justify-between">
                  <UButton icon="i-heroicons-eye" variant="ghostDangerIconButton" />
                  <UButton icon="i-heroicons-arrow-down-tray" variant="ghostDangerIconButton" />
                </div>
              </div>

              <!-- Metadata -->
              <div class="p-4 flex flex-col gap-1.5 text-xs text-dark-text/80">
                <p>
                  Uploaded at: <span class="font-bold text-dark-text">{{ doc.uploadedAt }}</span>
                </p>
                <p>
                  Document type: <span class="font-bold text-dark-text">{{ doc.type }}</span>
                </p>
                <div class="my-1 border-t border-dark-text/10 w-full"></div>
                <div class="flex justify-between w-full">
                  <p>
                    File type: <span class="font-bold text-dark-text">{{ doc.fileType }}</span>
                  </p>
                  <p>
                    File size: <span class="font-bold text-dark-text">{{ doc.fileSize }}</span>
                  </p>
                </div>
                <div class="my-1 border-t border-dark-text/10 w-full"></div>
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
