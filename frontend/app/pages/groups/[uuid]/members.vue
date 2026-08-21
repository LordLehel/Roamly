<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8 relative">
    <div class="flex flex-col md:flex-row justify-between items-center w-full gap-6">
      <div class="flex items-center gap-4">
        <UButton icon="i-heroicons-funnel" :label="CONST_FILTER_LABEL" variant="glassButton" />

        <UButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-user-plus"
          variant="glassIconButton"
          @click="groupsStore.openInviteModal"
        />

        <UButton
          v-if="isCurrentUserLeader"
          icon="i-heroicons-trash"
          variant="glassIconButtonDanger"
          @click="handleDeleteCurrentGroup"
        />

        <UButton
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="glassIconButtonDanger"
          @click="handleLeaveCurrentGroup"
        />
      </div>

      <div class="flex flex-col items-center justify-center">
        <div class="flex items-center gap-2">
          <h1 :class="appConfig.typography.pageTitle">
            {{ groupInfos?.name || 'Loading...' }}
          </h1>
          <!-- Csak a leader tud nevet módosítani -->
          <UButton
            v-if="isCurrentUserLeader"
            icon="i-heroicons-pencil"
            variant="ghostBrandIconButton"
            @click="openUpdateModal"
          />
        </div>
        <p :class="appConfig.typography.pageSubtitle">
          {{ currentViewName }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <UButton icon="i-heroicons-users" variant="glassIconButtonBrand" to="/" />
        <UButton icon="i-heroicons-calendar" variant="glassIconButton" to="/" />
        <UButton icon="i-heroicons-photo" variant="glassIconButton" to="/" />
        <UButton icon="i-heroicons-document-text" variant="glassIconButton" to="/" />
      </div>
    </div>

    <ClientOnly>
      <div v-if="isLoading" class="text-center py-10 text-dark-text/70">
        {{ CONST_LOADING_TEXT }}
      </div>
      <div v-else-if="error" class="text-center py-10 text-error-500">
        {{ CONST_FETCH_ERROR_TEXT }}
      </div>

      <div
        v-else-if="groupInfos?.group_profiles?.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4"
      >
        <UCard
          v-for="profile in groupInfos.group_profiles"
          :key="profile.users.email"
          variant="interactiveGlass"
          class="relative"
        >
          <div class="flex items-start gap-4 w-full h-full">
            <div class="shrink-0 pt-1">
              <UAvatar
                :alt="profile.users.username"
                size="profileLg"
                icon="i-heroicons-user"
                class="w-16 h-16"
              />
            </div>

            <div class="flex-1 flex flex-col justify-between h-full min-h-16">
              <div class="flex justify-between items-start w-full">
                <div>
                  <h3 :class="appConfig.typography.cardTitle">
                    {{ profile.users.username }}
                  </h3>
                  <p
                    v-if="profile.users.email === currentUser?.email"
                    class="text-sm text-left font-bold text-brand-500 mt-0.5"
                  >
                    {{ CONST_YOU_LABEL }}
                  </p>
                </div>
                <div class="text-xs text-right text-dark-text/70 shrink-0">
                  <p class="opacity-70">{{ CONST_JOINED_LABEL }}</p>
                  <p class="font-semibold">
                    {{
                      groupInfos.created_at
                        ? new Date(groupInfos.created_at).toLocaleDateString()
                        : 'N/A'
                    }}
                  </p>
                </div>
              </div>

              <div class="flex justify-between items-end mt-4 w-full">
                <p class="text-sm font-medium text-dark-text/80">
                  {{ CONST_ROLE_LABEL }}
                  <span class="font-bold capitalize">{{ profile.roles.type }}</span>
                </p>
                <!-- JAVÍTÁS: Csak a leader tud eltávolítani ÉS saját magát nem törölheti -->
                <UButton
                  v-if="isCurrentUserLeader && profile.users.email !== currentUser?.email"
                  icon="i-heroicons-user-minus"
                  variant="ghostDangerIconButton"
                  @click="groupsStore.openRemoveUserModal(profile.users.email)"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- UPDATE MODAL -->
      <UModal
        v-model:open="groupsStore.isUpdateModalOpen"
        :title="CONST_EDIT_GROUP_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default><div class="hidden"></div></template>
        <template #body>
          <form
            id="update-group-form"
            class="flex flex-col gap-4 py-2"
            @submit.prevent="handleUpdateGroup"
          >
            <div>
              <label class="block text-sm font-medium text-dark-text mb-1">{{
                CONST_GROUP_NAME_LABEL
              }}</label>
              <UInput
                v-model="updateGroupName"
                :placeholder="CONST_GROUP_NAME_PLACEHOLDER"
                class="w-full"
              />
              <p v-if="updateError" class="text-xs text-error-500 mt-1">{{ updateError }}</p>
            </div>
          </form>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeUpdateModal"
            />
            <UButton
              :label="CONST_EDIT_BTN"
              variant="actionOkButton"
              type="submit"
              form="update-group-form"
              :loading="isUpdating"
            />
          </div>
        </template>
      </UModal>

      <!-- INVITE MODAL -->
      <UModal
        v-model:open="groupsStore.isInviteModalOpen"
        :title="CONST_INVITE_USER_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default><div class="hidden"></div></template>
        <template #body>
          <form
            id="invite-user-form"
            class="flex flex-col gap-4 py-2"
            @submit.prevent="handleInviteUser"
          >
            <div>
              <label class="block text-sm font-medium text-dark-text mb-1">{{
                CONST_USER_EMAIL_LABEL
              }}</label>
              <UInput
                v-model="inviteEmail"
                :placeholder="CONST_USER_EMAIL_PLACEHOLDER"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-dark-text mb-1">{{
                CONST_ROLE_SELECTION_LABEL
              }}</label>
              <USelect
                v-model="inviteRole"
                :items="roleOptions"
                label-key="label"
                value-key="value"
                class="min-w-40"
              />
            </div>

            <p
              v-if="inviteError"
              class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
            >
              {{ inviteError }}
            </p>
            <p
              v-if="inviteSuccess"
              class="text-xs font-semibold text-brand-500 mt-2 bg-brand-500/10 p-2 rounded border border-brand-500/20"
            >
              {{ inviteSuccess }}
            </p>
          </form>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              :disabled="!!inviteSuccess"
              @click="closeInviteModal"
            />
            <UButton
              :label="CONST_INVITE_BTN"
              variant="actionOkButton"
              type="submit"
              form="invite-user-form"
              :loading="isInviting"
              :disabled="!!inviteSuccess"
            />
          </div>
        </template>
      </UModal>

      <!-- REMOVE USER MODAL -->
      <UModal
        v-model:open="groupsStore.isRemoveUserModalOpen"
        :title="CONST_REMOVE_USER_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default><div class="hidden"></div></template>
        <template #body>
          <p class="text-sm text-dark-text/80 py-2">
            {{ CONST_REMOVE_USER_CONFIRM }}
            <span class="block font-semibold mt-1 text-brand-500"
              >„{{ groupsStore.selectedUserEmailToRemove }}”</span
            >
          </p>
          <p v-if="removeError" class="text-xs text-error-500 mt-1">{{ removeError }}</p>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeRemoveModal"
            />
            <UButton
              :label="CONST_REMOVE_BTN"
              variant="actionOkButton"
              :loading="isRemoving"
              @click="handleRemoveUser"
            />
          </div>
        </template>
      </UModal>

      <!-- LEAVE GROUP MODAL -->
      <UModal
        v-model:open="groupsStore.isLeaveModalOpen"
        :title="CONST_LEAVE_GROUP_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default><div class="hidden"></div></template>
        <template #body>
          <div class="flex flex-col gap-2 py-2">
            <p class="text-sm text-dark-text/80">
              {{ CONST_LEAVE_GROUP_CONFIRM }}
              <span
                v-if="groupsStore.selectedGroupToLeave"
                class="block font-semibold mt-1 text-brand-500"
              >
                „{{ groupsStore.selectedGroupToLeave.name }}”
              </span>
            </p>

            <p
              v-if="
                groupsStore.selectedGroupToLeave?.current_size === 1 &&
                groupsStore.selectedGroupToLeave?.role?.toLowerCase() === 'leader'
              "
              class="text-xs font-semibold text-error-500 mt-2 bg-error-500/10 p-2 rounded border border-error-500/20"
            >
              {{ CONST_LEAVE_GROUP_WARNING }}
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeLeaveModal"
            />
            <UButton
              :label="CONST_LEAVE_BTN"
              variant="actionOkButton"
              :loading="isLeaving"
              @click="confirmLeave"
            />
          </div>
        </template>
      </UModal>

      <!-- DELETE GROUP MODAL -->
      <UModal
        v-model:open="groupsStore.isDeleteModalOpen"
        :title="CONST_DELETE_GROUP_TITLE"
        :dismissible="false"
        :close="false"
      >
        <template #default><div class="hidden"></div></template>
        <template #body>
          <p class="text-sm text-dark-text/80 py-2">
            {{ CONST_DELETE_GROUP_CONFIRM }}
            <span class="block font-semibold mt-1 text-brand-500">
              „{{ groupsStore.selectedGroupToDelete?.name }}”
            </span>
          </p>
        </template>
        <template #footer>
          <div class="flex items-center justify-between w-full">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT"
              variant="actionCancelButton"
              @click="closeDeleteModal"
            />
            <UButton
              :label="CONST_DELETE_BTN"
              variant="actionOkButton"
              :loading="isDeleting"
              @click="confirmDelete"
            />
          </div>
        </template>
      </UModal>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useGroupInfosQuery } from '~/queries/groups.query';
import { useCurrentUserQuery } from '~/queries/user.query';
import {
  useUpdateGroupMutation,
  useInviteUserMutation,
  useRemoveUserMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
} from '~/queries/groups.mutation';
import { updateGroupSchema, inviteUserSchema } from '~/utils/groups.schema';
import { useGroupsStore } from '~/stores/groups.store';
import type { GroupOutDto } from '~/types/groups.type';
import type { ApiError } from '~/types/apiError.type';
import {
  CONST_FILTER_LABEL,
  CONST_ROLE_LABEL,
  CONST_CANCEL_BTN_TEXT,
  CONST_LOADING_TEXT,
  CONST_FETCH_ERROR_TEXT,
  CONST_INVALID_DATA_ERROR,
  CONST_EDIT_GROUP_TITLE,
  CONST_EDIT_BTN,
  CONST_GROUP_NAME_LABEL,
  CONST_GROUP_NAME_PLACEHOLDER,
  CONST_INVITE_USER_TITLE,
  CONST_USER_EMAIL_LABEL,
  CONST_USER_EMAIL_PLACEHOLDER,
  CONST_ROLE_SELECTION_LABEL,
  CONST_INVITE_BTN,
  CONST_INVITE_SUCCESS_MSG,
  CONST_REMOVE_USER_TITLE,
  CONST_REMOVE_USER_CONFIRM,
  CONST_REMOVE_BTN,
  CONST_JOINED_LABEL,
  CONST_LEAVE_GROUP_TITLE,
  CONST_LEAVE_GROUP_CONFIRM,
  CONST_LEAVE_GROUP_WARNING,
  CONST_LEAVE_BTN,
  CONST_YOU_LABEL,
  CONST_DELETE_GROUP_TITLE,
  CONST_DELETE_GROUP_CONFIRM,
  CONST_DELETE_BTN,
} from '~/utils/constants';

definePageMeta({
  layout: 'profile',
  middleware: ['auth'],
});

const appConfig = useAppConfig();
const route = useRoute();
const router = useRouter();
const { isAuthenticated } = useAuth();
const groupsStore = useGroupsStore();

const groupUuid = computed(() => route.params.uuid as string);

const { data: currentUser } = useCurrentUserQuery();

const currentViewName = computed(() => {
  const parts = String(route.name).split('-');
  return parts.length > 1 ? parts[parts.length - 1] : 'members';
});

watch(
  isAuthenticated,
  (isAuth) => {
    if (!isAuth) router.push('/login');
  },
  { immediate: true },
);

const { data: groupInfos, isLoading, error } = useGroupInfosQuery(groupUuid);

const isCurrentUserLeader = computed(() => {
  const profile = groupInfos.value?.group_profiles?.find(
    (p) => p.users.email === currentUser.value?.email,
  );
  return profile?.roles.type.toLowerCase() === 'leader';
});

const { mutate: updateGroup, isLoading: isUpdating } = useUpdateGroupMutation();
const { mutate: inviteUser, isLoading: isInviting } = useInviteUserMutation();
const { mutate: removeUser, isLoading: isRemoving } = useRemoveUserMutation();
const { mutate: leaveGroup, isLoading: isLeaving } = useLeaveGroupMutation();
const { mutate: deleteGroup, isLoading: isDeleting } = useDeleteGroupMutation();

// Update Group Name Logic
const updateGroupName = ref('');
const updateError = ref('');

const openUpdateModal = () => {
  updateGroupName.value = groupInfos.value?.name || '';
  updateError.value = '';
  groupsStore.openUpdateModal();
};

const closeUpdateModal = () => {
  groupsStore.closeUpdateModal();
  updateError.value = '';
};

const handleUpdateGroup = async () => {
  updateError.value = '';
  const validationResult = updateGroupSchema.safeParse({ groupName: updateGroupName.value });
  if (!validationResult.success) {
    updateError.value = validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }
  try {
    await updateGroup({ groupUuid: groupUuid.value, name: validationResult.data.groupName });
    closeUpdateModal();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    updateError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'Error updating group.';
  }
};

// Invite User Logic
const inviteEmail = ref('');
const inviteRole = ref('invitedMember');
const inviteError = ref('');
const inviteSuccess = ref('');

const roleOptions = [
  { label: 'Member', value: 'invitedMember' },
  { label: 'Leader', value: 'invitedLeader' },
];

const closeInviteModal = () => {
  groupsStore.closeInviteModal();
  inviteEmail.value = '';
  inviteError.value = '';
  inviteSuccess.value = '';
};

const handleInviteUser = async () => {
  inviteError.value = '';
  inviteSuccess.value = '';

  const validationResult = inviteUserSchema.safeParse({
    email: inviteEmail.value,
    role: inviteRole.value,
  });
  if (!validationResult.success) {
    inviteError.value = validationResult.error.issues[0]?.message ?? CONST_INVALID_DATA_ERROR;
    return;
  }

  try {
    await inviteUser({
      groupUuid: groupUuid.value,
      data: {
        invitedUserEmail: validationResult.data.email,
        inviteWithRole: validationResult.data.role,
      },
    });

    inviteSuccess.value = CONST_INVITE_SUCCESS_MSG;

    setTimeout(() => {
      closeInviteModal();
    }, 2000);
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    inviteError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'User not found or error sending invite.';
  }
};

// Remove User Logic
const removeError = ref('');

const closeRemoveModal = () => {
  groupsStore.closeRemoveUserModal();
  removeError.value = '';
};

const handleRemoveUser = async () => {
  removeError.value = '';
  if (!groupsStore.selectedUserEmailToRemove) return;

  try {
    await removeUser({ groupUuid: groupUuid.value, email: groupsStore.selectedUserEmailToRemove });
    closeRemoveModal();
  } catch (err: unknown) {
    const apiErr = err as ApiError;
    removeError.value =
      typeof apiErr.response?._data?.message === 'string'
        ? apiErr.response._data.message
        : 'Error removing user.';
  }
};

// Leave Group Logic
const closeLeaveModal = () => {
  groupsStore.closeLeaveModal();
};

const confirmLeave = async () => {
  if (!groupsStore.selectedGroupToLeave) return;

  try {
    await leaveGroup(groupsStore.selectedGroupToLeave.uuid);
    closeLeaveModal();
    router.push('/groups');
  } catch (err: unknown) {
    console.error('Error during leaving group:', err);
  }
};

const handleLeaveCurrentGroup = () => {
  const currentUserProfile = groupInfos.value?.group_profiles?.find(
    (p) => p.users.email === currentUser.value?.email,
  );

  const dummyGroupToLeave: GroupOutDto = {
    uuid: groupUuid.value,
    name: groupInfos.value?.name || '',
    role: currentUserProfile?.roles.type || '',
    current_size: groupInfos.value?.current_size || 0,
    created_at: groupInfos.value?.created_at || '',
  };

  groupsStore.openLeaveModal(dummyGroupToLeave);
};

// Delete Group Logic
const closeDeleteModal = () => {
  groupsStore.closeDeleteModal();
};

const confirmDelete = async () => {
  if (!groupsStore.selectedGroupToDelete) return;

  try {
    await deleteGroup(groupsStore.selectedGroupToDelete.uuid);
    closeDeleteModal();
    router.push('/groups');
  } catch (err: unknown) {
    console.error('Error during deletion:', err);
  }
};

const handleDeleteCurrentGroup = () => {
  const dummyGroupToDelete: GroupOutDto = {
    uuid: groupUuid.value,
    name: groupInfos.value?.name || '',
    role: 'leader',
    current_size: groupInfos.value?.current_size || 0,
    created_at: groupInfos.value?.created_at || '',
  };
  groupsStore.openDeleteModal(dummyGroupToDelete);
};
</script>
