<!-- frontend/app/components/modals/UserProfileModal.vue -->
<template>
  <UModal
    v-model:open="groupsStore.isUserProfileModalOpen"
    :dismissible="true"
    :ui="{ content: 'sm:max-w-lg w-full max-h-[85vh] flex flex-col' }"
  >
    <template #default><div class="hidden"></div></template>
    <template #header>
      <div class="flex items-center gap-4">
        <UAvatar
          :src="undefined"
          :alt="userProfile?.username"
          icon="i-heroicons-user"
          size="lg"
          class="shrink-0"
        />
        <div class="min-w-0">
          <h3 class="text-lg font-bold text-dark-text truncate">
            {{ userProfile?.username ?? '—' }}
          </h3>
          <p class="text-sm text-surface-400 capitalize">
            {{ userProfile?.role ?? '' }}
          </p>
        </div>
      </div>
    </template>

    <!-- Scrollable body -->
    <template #body>
      <div class="flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-1">
        <!-- BASIC INFO -->
        <div class="flex flex-col gap-2">
          <div :class="appConfig.layout.profileDetailRow">
            <p :class="appConfig.typography.profileLabel">Email</p>
            <p :class="appConfig.typography.profileValue">{{ userProfile?.email ?? '—' }}</p>
          </div>
          <div :class="appConfig.layout.profileDetailRow">
            <p :class="appConfig.typography.profileLabel">Role</p>
            <p :class="[appConfig.typography.profileValue, 'capitalize']">
              {{ userProfile?.role ?? '—' }}
            </p>
          </div>
          <div :class="appConfig.layout.profileDetailRow">
            <p :class="appConfig.typography.profileLabel">Joined</p>
            <p :class="appConfig.typography.profileValue">{{ userProfile?.joinedAt ?? '—' }}</p>
          </div>
        </div>

        <!-- PRIVATE DOCUMENTS — leaders only -->
        <template v-if="userProfile?.canViewDocuments">
          <div :class="appConfig.layout.divider" />

          <div class="flex flex-col gap-3">
            <h4 class="text-sm font-bold text-dark-text/70 uppercase tracking-wider">
              Member Documents
            </h4>

            <!-- Loading -->
            <div
              v-if="isLoadingDocs"
              :class="appConfig.typography.statusLoading"
              class="text-sm py-2"
            >
              Loading documents...
            </div>

            <!-- No docs -->
            <div
              v-else-if="!memberDocuments || memberDocuments.length === 0"
              class="text-sm text-surface-400 italic py-2"
            >
              No private documents found.
            </div>

            <!-- Doc cards -->
            <div v-else class="flex flex-col gap-3">
              <UCard
                v-for="doc in memberDocuments"
                :key="doc.file_id"
                variant="documentGlass"
                class="relative"
              >
                <div :class="appConfig.layout.documentCardHeader">
                  <p class="font-bold truncate pr-2 shadow-sm text-sm">{{ doc.file_name }}</p>
                  <UTooltip text="View">
                    <UButton
                      icon="i-heroicons-eye"
                      variant="ghostDangerIconButton"
                      class="text-surface-500 shrink-0"
                      :href="doc.file_url"
                      target="_blank"
                    />
                  </UTooltip>
                </div>

                <div class="flex flex-col gap-1.5 px-3 pb-3 text-sm text-dark-text/80">
                  <p>
                    Type:
                    <span class="font-bold text-dark-text">
                      {{ doc.documents?.document_type ?? 'N/A' }}
                    </span>
                  </p>
                  <p>
                    Uploaded:
                    <span class="font-bold text-dark-text">
                      {{ new Date(doc.created_at).toLocaleDateString() }}
                    </span>
                  </p>
                  <div
                    v-if="doc.documents?.issue_date || doc.documents?.expiry_date"
                    class="flex gap-4"
                  >
                    <p v-if="doc.documents?.issue_date">
                      Issued:
                      <span class="font-bold text-dark-text">
                        {{ new Date(doc.documents.issue_date).toLocaleDateString() }}
                      </span>
                    </p>
                    <p v-if="doc.documents?.expiry_date">
                      Expires:
                      <span class="font-bold text-dark-text">
                        {{ new Date(doc.documents.expiry_date).toLocaleDateString() }}
                      </span>
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton
          label="Close"
          variant="actionCancelButton"
          @click="groupsStore.closeUserProfileModal()"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppConfig } from '#imports';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useGroupMemberDocumentsQuery } from '~/queries/files.query';
import type { PrivateDocumentMetadata } from '~/types/files.type';

const appConfig = useAppConfig();
const groupsStore = useGroupsStore();

const props = defineProps<{
  groupUuid?: string;
}>();

const userProfile = computed(() => groupsStore.selectedUserProfile);

// Fetch member documents when leader opens the modal — only runs when groupUuid is provided
const { data: memberDocsData, isLoading: isLoadingDocs } = useGroupMemberDocumentsQuery(
  () => props.groupUuid || '',
  () => !!(props.groupUuid && userProfile.value?.canViewDocuments),
);

const memberDocuments = computed<PrivateDocumentMetadata[]>(() => memberDocsData.value ?? []);
</script>
