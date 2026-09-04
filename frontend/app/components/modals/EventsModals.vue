<!-- frontend/app/components/modals/EventsModals.vue -->
<template>
  <div>
    <!-- ADD EVENT MODAL -->
    <UModal
      v-model:open="eventsStore.isAddEventModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Add Event</h3>
      </template>
      <template #body>
        <!-- A validációt és beküldést az UForm intézi automatikusan -->
        <UForm
          :schema="createEventSchema"
          :state="formState"
          :class="appConfig.layout.modalForm"
          @submit="onSubmit"
        >
          <UFormField name="title" label="Event Title">
            <template #default="{ error: fieldError }">
              <UInput
                v-model="formState.title"
                placeholder="e.g., Morning Standup"
                :variant="fieldError ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField name="start_time" label="Start Time">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="formState.start_time"
                  type="datetime-local"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <UFormField name="end_time" label="End Time">
              <template #default="{ error: fieldError }">
                <UInput
                  v-model="formState.end_time"
                  type="datetime-local"
                  :variant="fieldError ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>
          </div>

          <UFormField name="description" label="Description">
            <template #default="{ error: fieldError }">
              <UTextarea
                v-model="formState.description"
                placeholder="Event details..."
                :variant="fieldError ? 'glassError' : 'glass'"
              />
            </template>
          </UFormField>

          <div class="mt-2 flex items-center justify-between">
            <UCheckbox
              v-model="formState.is_private"
              variant="glass"
              :label="CONTS_MARK_EVENTS_AS_PRIVATE"
            />
          </div>

          <div :class="[appConfig.layout.flexBetween, 'mt-4']">
            <UButton
              :label="CONST_CANCEL_BTN_TEXT ?? 'Cancel'"
              variant="actionCancelButton"
              @click="closeAndResetForm"
            />
            <UButton
              type="submit"
              :label="CONST_ADD_BTN ?? 'Save'"
              variant="actionOkButton"
              :loading="createEventMutation.isLoading.value"
            />
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- DELETE EVENT MODAL -->
    <UModal
      v-model:open="eventsStore.isDeleteEventModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">
          {{ CONST_DELETE_EVENT_TITLE ?? 'Delete Event' }}
        </h3>
      </template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ CONST_DELETE_EVENT_CONFIRM ?? 'Are you sure you want to delete' }} "{{
            eventsStore.selectedEventToDelete?.title
          }}"?
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT ?? 'Cancel'"
            variant="actionCancelButton"
            @click="eventsStore.closeDeleteEventModal()"
          />
          <UButton
            :label="CONST_DELETE_BTN ?? 'Delete'"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :loading="deleteEventMutation.isLoading.value"
            @click="handleConfirmDelete"
          />
        </div>
      </template>
    </UModal>

    <!-- PARTICIPANTS MODAL -->
    <UModal
      v-model:open="eventsStore.isParticipantsModalOpen"
      :ui="{ content: appConfig.layout.modalSizeMd }"
      :close="false"
      :dismissible="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Event Participants</h3>
      </template>
      <template #body>
        <div :class="appConfig.calendar.participantModalScroll">
          <div
            v-for="user in eventsStore.currentEventParticipants"
            :key="user.uuid"
            :class="appConfig.calendar.participantCard"
            @click="handleOpenUserProfile(user)"
          >
            <div class="flex items-center gap-5 w-full">
              <UAvatar
                :alt="user.username"
                :src="user.profile_image_url || undefined"
                icon="i-heroicons-user"
                size="xl"
                :class="appConfig.calendar.participantCardAvatar"
              />
              <div :class="appConfig.calendar.participantCardInfo">
                <div :class="appConfig.calendar.participantCardHeader">
                  <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>
                  <span :class="appConfig.calendar.participantCardRole"> Participant </span>
                </div>
                <p :class="appConfig.calendar.participantCardEmail">N/A</p>
                <p :class="appConfig.calendar.participantCardPhone">Phone: N/A</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT ?? 'Close'"
            variant="actionCancelButton"
            @click="eventsStore.closeParticipantsModal()"
          />
        </div>
      </template>
    </UModal>

    <!-- EVENT PREVIEW MODAL (MOBILE ONLY) -->
    <UModal
      v-model:open="eventsStore.isPreviewModalOpen"
      :ui="{ content: appConfig.layout.modalSizeMd }"
      :close="false"
      :dismissible="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Event Details</h3>
      </template>
      <template #body>
        <div
          v-if="eventsStore.previewEvent"
          :class="[
            appConfig.calendar.previewWrapper,
            eventsStore.previewEvent.isExpired ? 'opacity-70' : '',
            'p-2! gap-4!',
          ]"
        >
          <div :class="appConfig.calendar.previewTitleRow" class="mb-2">
            <div :class="appConfig.calendar.previewTypeWrapper">
              <UIcon
                :name="
                  eventsStore.previewEvent.is_private ? 'i-heroicons-user' : 'i-heroicons-users'
                "
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">{{
                eventsStore.previewEvent.is_private ? CONST_PRIVATE_LBL : CONST_GROUP_EVENT_LBL
              }}</span>
            </div>

            <UTooltip v-if="hasPermissionToDelete" :text="CONST_DELETE_EVENT_TITLE">
              <UButton
                icon="i-heroicons-trash"
                variant="ghostDangerIconButton"
                @click="eventsStore.openDeleteEventModal(eventsStore.previewEvent)"
              />
            </UTooltip>
            <div v-else class="w-8"></div>
          </div>

          <h2 :class="appConfig.calendar.previewMainTitle" class="text-left! mb-2!">
            {{ eventsStore.previewEvent.title }}
            <span
              v-if="eventsStore.previewEvent.isExpired"
              :class="appConfig.calendar.previewExpiredBadge"
              >Expired</span
            >
          </h2>

          <div :class="appConfig.calendar.previewMetaRow">
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_CREATOR_LBL }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewEvent.creator?.username
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_DATE_LBL }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewDate || 'N/A'
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_TIME_LBL }}</span>
              <span :class="appConfig.calendar.metaValue"
                >{{ eventsStore.previewEvent.timeStartFormatted }} -
                {{ eventsStore.previewEvent.timeEndFormatted }}</span
              >
            </div>

            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_MEMBERS_LBL }}</span>
              <div :class="appConfig.calendar.participantsGroup">
                <div
                  :class="[
                    appConfig.calendar.participantsAvatars,
                    extraParticipantsCount > 0
                      ? appConfig.calendar.participantsOverlap
                      : appConfig.calendar.participantsGap,
                  ]"
                >
                  <UTooltip v-for="p in displayParticipants" :key="p.uuid" :text="p.username">
                    <UAvatar
                      :alt="p.username"
                      :src="p.profile_image_url || undefined"
                      icon="i-heroicons-user"
                      size="sm"
                      :class="[appConfig.calendar.participantAvatar]"
                      @click="handleOpenUserProfile(p)"
                    />
                  </UTooltip>
                  <UTooltip
                    v-if="extraParticipantsCount > 0"
                    :text="'+' + extraParticipantsCount.toString() + ' more participants'"
                  >
                    <div
                      :class="appConfig.calendar.participantMoreBadge"
                      @click="openAllParticipantsModal"
                    >
                      +{{ extraParticipantsCount }}
                    </div>
                  </UTooltip>
                </div>
                <span
                  v-if="extraParticipantsCount > 0"
                  :class="appConfig.calendar.participantViewAll"
                  @click="openAllParticipantsModal"
                  >View all</span
                >
              </div>
            </div>

            <div :class="[appConfig.calendar.metaRowItem, 'mt-2 flex-col gap-1!']">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_DESC_LBL }}</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewEvent.description
              }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT ?? 'Close'"
            variant="actionCancelButton"
            @click="eventsStore.closePreviewModal()"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAppConfig, useToast } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useDeleteEventMutation, useCreateEventMutation } from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';
import { createEventSchema } from '~/utils/schemas/events.schema';
import { getErrorMessage } from '~/utils/error.utils';

const appConfig = useAppConfig();
const toast = useToast();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

/* --- MUTATIONS WITH PINIA COLADA ERROR HANDLING --- */
const deleteEventMutation = useDeleteEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      console.log('[Delete Mutation] Success!');
      eventsStore.closeDeleteEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: 'Success', description: 'Event deleted successfully!' });
    },
    onError: (err) => {
      console.log('[Delete Mutation] Error:', err);
      toast.add({ title: 'Error', description: getErrorMessage(err) });
    },
  },
);

const createEventMutation = useCreateEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      console.log('[Create Mutation] Success!');
      closeAndResetForm();
      toast.add({ title: 'Success', description: 'Event created successfully!' });
    },
    onError: (err) => {
      console.log('[Create Mutation] Error:', err);
      toast.add({ title: 'Error', description: getErrorMessage(err) });
    },
  },
);

type FormSchemaType = z.output<typeof createEventSchema>;

/* --- ADD EVENT FORM STATE --- */
const formState = reactive({
  title: '',
  is_private: false,
  start_time: '',
  end_time: '',
  description: '',
});

const closeAndResetForm = () => {
  eventsStore.closeAddEventModal();
  Object.assign(formState, {
    title: '',
    is_private: false,
    start_time: '',
    end_time: '',
    description: '',
  });
};

const onSubmit = (event: FormSubmitEvent<FormSchemaType>) => {
  console.log('[Form] Sikeres Zod validáció. Nyers adatok:', event.data);

  const payload = {
    title: event.data.title,
    description: event.data.description || undefined,
    start_time: new Date(event.data.start_time).toISOString(),
    end_time: event.data.end_time
      ? new Date(event.data.end_time).toISOString()
      : new Date(event.data.start_time).toISOString(),
    visibility: formState.is_private ? 'private' : 'public',
    participant_emails: [],
  };

  console.log('[Form] Payload:', payload);
  createEventMutation.mutate(payload);
};

/* --- HANDLERS --- */
const handleConfirmDelete = () => {
  const eventToDelete = eventsStore.selectedEventToDelete;
  console.log('[Delete] Event to delete:', eventToDelete);

  if (!eventToDelete) {
    console.error('[Delete] No event to delete!');
    return;
  }

  console.log('[Delete] Event to delete:', eventToDelete);
  deleteEventMutation.mutate(eventToDelete.uuid);
};

const handleOpenUserProfile = (user: EventCreatorDto) => {
  eventsStore.closeParticipantsModal();
  eventsStore.closePreviewModal();

  groupsStore.selectedUserProfile = {
    username: user.username,
    email: user.email || 'N/A',
    role: 'Participant',
    joinedAt: 'Unknown',
    canViewDocuments: false,
  };

  groupsStore.isUserProfileModalOpen = true;
};

const openAllParticipantsModal = () => {
  if (eventsStore.previewEvent?.members) {
    const membersList = [...eventsStore.previewEvent.members];
    eventsStore.closePreviewModal();
    eventsStore.openParticipantsModal(membersList);
  }
};

/* --- COMPUTEDS --- */
const displayParticipants = computed(() => eventsStore.previewEvent?.members?.slice(0, 5) || []);
const extraParticipantsCount = computed(() =>
  Math.max(0, (eventsStore.previewEvent?.members?.length || 0) - 5),
);

const hasPermissionToDelete = computed(() => {
  const creatorName = eventsStore.previewEvent?.creator?.username;
  const currentUserName = currentUser.value?.username;
  return !!creatorName && !!currentUserName && creatorName === currentUserName;
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
</style>
