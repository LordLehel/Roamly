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
        <UForm
          :schema="schema"
          :state="formState"
          :class="appConfig.layout.modalForm"
          @submit="onSubmit"
        >
          <UFormGroup label="Event Title" name="title">
            <UInput v-model="formState.title" placeholder="e.g., Morning Standup" variant="glass" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Start Time" name="start_time">
              <UInput v-model="formState.start_time" type="datetime-local" variant="glass" />
            </UFormGroup>
            <UFormGroup label="End Time" name="end_time">
              <UInput v-model="formState.end_time" type="datetime-local" variant="glass" />
            </UFormGroup>
          </div>

          <UFormGroup label="Location" name="location">
            <UInput
              v-model="formState.location"
              placeholder="e.g., Conference Room A"
              variant="glass"
            />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UTextarea
              v-model="formState.description"
              placeholder="Event details..."
              variant="glass"
            />
          </UFormGroup>

          <UFormGroup name="is_private">
            <UCheckbox v-model="formState.is_private" label="Mark as Private Event" />
          </UFormGroup>

          <div :class="[appConfig.layout.flexBetween, 'mt-4']">
            <UButton label="Cancel" variant="actionCancelButton" @click="closeAndResetForm" />
            <UButton
              type="submit"
              label="Save Event"
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
        <h3 class="text-xl font-bold text-dark-text">Delete Event</h3>
      </template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          Are you sure you want to delete "{{ eventsStore.selectedEventToDelete?.title }}"?
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            label="Cancel"
            variant="actionCancelButton"
            @click="eventsStore.closeDeleteEventModal()"
          />
          <UButton
            label="Delete"
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
            label="Close"
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
                eventsStore.previewEvent.is_private ? 'Private' : 'Group'
              }}</span>
            </div>

            <UTooltip v-if="hasPermissionToDelete" text="Delete Event">
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
              <span :class="appConfig.calendar.metaLabel">Creator:</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewEvent.creator?.username
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Date:</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewDate || 'N/A'
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Time:</span>
              <span :class="appConfig.calendar.metaValue"
                >{{ eventsStore.previewEvent.timeStartFormatted }} -
                {{ eventsStore.previewEvent.timeEndFormatted }}</span
              >
            </div>

            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">Members:</span>
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
              <span :class="appConfig.calendar.metaLabel">Description:</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewEvent.description
              }}</span>
            </div>
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Location:</span>
              <span :class="[appConfig.calendar.metaValue, appConfig.calendar.metaValueLink]">{{
                eventsStore.previewEvent.location
              }}</span>
            </div>
          </div>

          <div :class="appConfig.calendar.previewMapPlaceholder" class="h-48!">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2756.295222740354!2d25.294699376865182!3d46.30397407701674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474b172fd7417c99%3A0xfcc71cd3e524ef71!2sWebGurus!5e0!3m2!1shu!2sro!4v1788172972596!5m2!1shu!2sro"
              width="100%"
              height="100%"
              style="border: 0"
              allowfullscreen="false"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full">
          <UButton
            label="Close"
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
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAppConfig } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useDeleteEventMutation, useCreateEventMutation } from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';

const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

/* --- MUTATIONS --- */
const deleteEventMutation = useDeleteEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeDeleteEventModal();
      eventsStore.closePreviewModal();
    },
  },
);

const createEventMutation = useCreateEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      closeAndResetForm();
    },
  },
);

/* --- ADD EVENT FORM STATE & VALIDATION --- */
const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    is_private: z.boolean(),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    description: z.string(),
    location: z.string(),
  })
  .refine((data) => new Date(data.start_time) < new Date(data.end_time), {
    message: 'End time must be after start time',
    path: ['end_time'],
  });

type FormSchemaType = z.output<typeof schema>;

const formState = reactive({
  title: '',
  is_private: false,
  start_time: '',
  end_time: '',
  description: '',
  location: '',
});

const closeAndResetForm = () => {
  eventsStore.closeAddEventModal();
  Object.assign(formState, {
    title: '',
    is_private: false,
    start_time: '',
    end_time: '',
    description: '',
    location: '',
  });
};

const onSubmit = async (_event: FormSubmitEvent<FormSchemaType>) => {
  try {
    const payload = {
      ...formState,
      start_time: new Date(formState.start_time).toISOString(),
      end_time: new Date(formState.end_time).toISOString(),
    };
    await createEventMutation.mutateAsync(payload);
  } catch (error) {
    console.error('Failed to create event:', error);
  }
};

/* --- HANDLERS --- */
const handleConfirmDelete = async () => {
  const eventToDelete = eventsStore.selectedEventToDelete;
  if (!eventToDelete) return;

  try {
    await deleteEventMutation.mutateAsync(eventToDelete.uuid);
  } catch (error) {
    console.error('Failed to delete event:', error);
  }
};

const handleOpenUserProfile = (user: EventCreatorDto) => {
  eventsStore.closeParticipantsModal();
  eventsStore.closePreviewModal();

  groupsStore.selectedUserProfile = {
    username: user.username,
    email: 'N/A',
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
