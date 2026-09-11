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
      <template #header><h3 class="text-xl font-bold text-dark-text">Add Event</h3></template>
      <template #body>
        <div
          :class="[
            appConfig.calendar.previewWrapper,
            'p-2! pr-3! gap-4! md:overflow-visible md:max-h-none overflow-y-auto max-h-[70vh] overscroll-contain custom-scrollbar flex flex-col',
          ]"
        >
          <UForm
            :schema="createEventSchema"
            :state="formState"
            :class="appConfig.layout.modalForm"
            @submit="onSubmit"
          >
            <UFormField name="title" label="Event Title"
              ><template #default="{ error }"
                ><UInput
                  v-model="formState.title"
                  placeholder="e.g., Morning Standup"
                  :variant="error ? 'glassError' : 'glass'" /></template
            ></UFormField>
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <UFormField name="start_time" label="Start Date & Time">
                <template #default="{ error }">
                  <div class="flex gap-2 w-full">
                    <UInput
                      v-model="formState.startDate"
                      type="date"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                    <UInput
                      v-model="formState.startTime"
                      type="time"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                  </div>
                </template>
              </UFormField>
            </div>
            <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <UFormField name="end_time" label="End Date & Time">
                <template #default="{ error }">
                  <div class="flex gap-2 w-full">
                    <UInput
                      v-model="formState.endDate"
                      type="date"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                    <UInput
                      v-model="formState.endTime"
                      type="time"
                      class="w-full"
                      :variant="error ? 'glassError' : 'glass'"
                    />
                  </div>
                </template>
              </UFormField>
            </div>
            <UFormField name="description" label="Description">
              <template #default="{ error }">
                <UTextarea
                  v-model="formState.description"
                  placeholder="Event details..."
                  :variant="error ? 'glassError' : 'glass'"
                />
              </template>
            </UFormField>

            <!-- location selector button -->
            <div class="mt-4 flex flex-col gap-2">
              <span class="text-sm font-medium text-dark-text">Location (optional)</span>
              <UButton
                icon="i-heroicons-map"
                label="Choose Location on map"
                variant="glassOutlineButton"
                @click="isMapSelectorOpen = true"
              />
              <div
                v-if="formState.address"
                class="flex items-start justify-between gap-2 p-2 bg-surface-50 border border-surface-200 rounded-md w-full overflow-hidden box-border"
              >
                <span
                  class="text-sm text-dark-text/80 break-words whitespace-normal min-w-0 flex-1"
                  >{{ formState.address }}</span
                >
                <UButton
                  icon="i-heroicons-x-mark"
                  variant="ghostDangerIconButton"
                  size="xs"
                  class="p-0 shrink-0 self-center"
                  @click="clearLocation"
                />
              </div>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <UCheckbox
                v-model="formState.is_private"
                variant="glass"
                :label="CONTS_MARK_EVENT_AS_PRIVATE"
                :ui="{ base: 'w-5 h-5 cursor-pointer border-2 border-dark-text/30' }"
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
        </div>
      </template>
    </UModal>

    <!-- map selector modal -->
    <UModal v-model:open="isMapSelectorOpen" :ui="{ content: appConfig.layout.modalSizeLg }">
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <div class="flex justify-between items-center w-full">
          <h3 class="text-xl font-bold text-dark-text">Select Location</h3>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            class="hover:bg-error-50 hover:text-error-500 rounded-full transition-all duration-200"
            @click="isMapSelectorOpen = false"
          />
        </div>
      </template>
      <template #body>
        <div class="max-h-[70vh] overflow-y-auto custom-scrollbar flex flex-col gap-4 p-1">
          <div class="h-[45vh] w-full shrink-0">
            <ClientOnly>
              <MapEventMapSelector
                :is-open="isMapSelectorOpen"
                :initial-location="
                  formState.latitude !== null &&
                  formState.longitude !== null &&
                  formState.address !== null
                    ? {
                        latitude: formState.latitude,
                        longitude: formState.longitude,
                        address: formState.address,
                      }
                    : null
                "
                @confirm-location="handleLocationSelected"
              />
            </ClientOnly>
          </div>
        </div>
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
      <template #header><h3 class="text-xl font-bold text-dark-text">Delete Event</h3></template>
      <template #body
        ><p :class="appConfig.typography.modalText">
          Are you sure you want to delete "{{ eventsStore.selectedEventToDelete?.title }}"?
        </p></template
      >
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
      <template #header
        ><h3 class="text-xl font-bold text-dark-text">Event Participants</h3></template
      >
      <template #body>
        <div :class="appConfig.calendar.participantModalScroll">
          <div
            v-for="user in eventsStore.currentEventParticipants"
            :key="user.uuid"
            :class="appConfig.calendar.participantCard"
            @click="handleOpenUserProfile(user)"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-5 cursor-pointer">
                <UAvatar
                  :alt="user.username"
                  :src="user.profile_image_url || undefined"
                  icon="i-heroicons-user"
                  size="xl"
                  :class="appConfig.calendar.participantCardAvatar"
                />

                <div :class="appConfig.calendar.participantCardInfo">
                  <div class="flex items-center gap-1.5">
                    <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>

                    <!-- ITT a user.email helyett simán a usert adjuk át -->
                    <UTooltip v-if="isGroupLeader(user)" text="Group Leader">
                      <UIcon name="i-heroicons-star" class="w-4 h-4 text-amber-500" />
                    </UTooltip>
                  </div>

                  <!-- ITT IS a teljes usert adjuk át -->
                  <span :class="appConfig.calendar.participantCardRole">
                    {{ isEventCreator(user) ? 'Creator' : 'Participant' }}
                  </span>
                  <p :class="appConfig.calendar.participantCardEmail">{{ user.email }}</p>
                </div>
              </div>
              <UTooltip
                v-if="hasPermissionToDelete && user.email !== currentUserEmail"
                :text="CONST_REMOVE_PARTICIPANT"
                :ui="{ content: 'z-[9999]' }"
                :popper="{ placement: 'top', strategy: 'fixed' }"
              >
                <UButton
                  icon="i-heroicons-user-minus"
                  variant="ghostDangerIconButton"
                  :loading="removeParticipantMutation.isLoading.value"
                  @click="eventsStore.openRemoveParticipantModal(user)"
                />
              </UTooltip>
            </div>
          </div>
          <div
            v-if="eventsStore.currentEventParticipants.length === 0"
            class="text-sm font-medium text-dark-text/50 p-4"
          >
            {{ CONST_NO_PARTICIPANTS_FOUND }}
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

    <!-- REMOVE PARTICIPANT MODAL -->
    <UModal
      v-model:open="eventsStore.isRemoveParticipantModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header
        ><h3 class="text-xl font-bold text-dark-text">Remove Participant</h3></template
      >
      <template #body>
        <p :class="appConfig.typography.modalText">
          Are you sure you want to remove "{{ eventsStore.participantToRemove?.username }}" from
          this event?
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            label="Cancel"
            variant="actionCancelButton"
            @click="eventsStore.closeRemoveParticipantModal()"
          />
          <UButton
            label="Remove"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :loading="removeParticipantMutation.isLoading.value"
            @click="confirmRemoveParticipant"
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
      <template #header><h3 class="text-xl font-bold text-dark-text">Event Details</h3></template>
      <template #body>
        <div
          v-if="eventsStore.previewEvent"
          :class="[
            appConfig.calendar.previewWrapper,
            eventsStore.previewEvent.isExpired ? 'opacity-70' : '',
            'p-2! gap-4! overflow-y-auto max-h-[65vh] overscroll-contain custom-scrollbar',
          ]"
        >
          <div :class="appConfig.calendar.previewTitleRow" class="mb-2 justify-between">
            <div :class="appConfig.calendar.previewTypeWrapper">
              <UIcon
                :name="
                  eventsStore.previewEvent.is_private
                    ? 'i-heroicons-user'
                    : 'i-heroicons-user-group'
                "
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">{{
                eventsStore.previewEvent.is_private ? 'Private Event' : 'Group Event'
              }}</span>
            </div>
            <div class="flex items-center gap-1">
              <UTooltip
                v-if="
                  eventsStore.previewEvent.creator?.email === currentUserEmail &&
                  eventsStore.previewEvent.is_private
                "
                text="Invite Members"
              >
                <UButton
                  icon="i-heroicons-user-plus"
                  variant="ghostBrandIconButton"
                  class="text-dark-text/70"
                  @click="eventsStore.openAddMembersModal(eventsStore.previewEvent!)"
                />
              </UTooltip>
              <UTooltip v-if="hasPermissionToDelete" text="Delete Event">
                <UButton
                  icon="i-heroicons-trash"
                  variant="ghostDangerIconButton"
                  @click="eventsStore.openDeleteEventModal(eventsStore.previewEvent!)"
                />
              </UTooltip>
              <UTooltip v-else-if="canLeaveEvent" text="Leave Event">
                <UButton
                  icon="i-heroicons-arrow-right-on-rectangle"
                  variant="ghostDangerIconButton"
                  @click="eventsStore.openLeaveEventModal(eventsStore.previewEvent!)"
                />
              </UTooltip>
            </div>
          </div>
          <h2 :class="appConfig.calendar.previewMainTitle">
            {{ eventsStore.previewEvent.title }}
            <span
              v-if="eventsStore.previewEvent.isExpired"
              :class="appConfig.calendar.previewExpiredBadge"
              >Expired</span
            >
          </h2>

          <div :class="appConfig.calendar.previewMetaRow">
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Creator:</span
              ><span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewEvent.creator?.username
              }}</span>
            </div>

            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Date:</span>
              <span
                v-if="
                  new Date(eventsStore.previewEvent.start_time).toLocaleDateString() ===
                  new Date(eventsStore.previewEvent.end_time).toLocaleDateString()
                "
                :class="appConfig.calendar.metaValue"
              >
                {{ new Date(eventsStore.previewEvent.start_time).toLocaleDateString() }}
              </span>
              <span v-else :class="appConfig.calendar.metaValue">
                {{ new Date(eventsStore.previewEvent.start_time).toLocaleDateString() }} -
                {{ new Date(eventsStore.previewEvent.end_time).toLocaleDateString() }}
              </span>
            </div>

            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">Time:</span>
              <span
                v-if="
                  eventsStore.previewEvent.timeStartFormatted ===
                  eventsStore.previewEvent.timeEndFormatted
                "
                :class="appConfig.calendar.metaValue"
              >
                {{ eventsStore.previewEvent.timeStartFormatted }}
              </span>
              <span v-else :class="appConfig.calendar.metaValue">
                {{ eventsStore.previewEvent.timeStartFormatted }} -
                {{ eventsStore.previewEvent.timeEndFormatted }}
              </span>
            </div>

            <div :class="appConfig.calendar.metaRowItemCenter">
              <span :class="appConfig.calendar.metaLabel">Members:</span>
              <div :class="appConfig.calendar.participantsGroup">
                <template v-if="eventsStore.previewEvent.is_private">
                  <div
                    :class="[
                      appConfig.calendar.participantsAvatars,
                      (eventsStore.previewEvent.members?.length || 0) > 5
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
                        :class="appConfig.calendar.participantAvatar"
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
                  <UButton
                    variant="link"
                    class="p-0 text-sm h-auto font-medium"
                    @click="openAllParticipantsModal"
                    >Show participants</UButton
                  >
                </template>
                <template v-else>
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-bold text-dark-text">Everyone</span>
                  </div>
                </template>
              </div>
            </div>
            <div :class="[appConfig.calendar.metaRowItem, 'mt-2 flex-col gap-1!']">
              <span :class="appConfig.calendar.metaLabel">Description:</span>
              <span :class="appConfig.calendar.metaValue">{{
                eventsStore.previewEvent.description
              }}</span>
            </div>

            <!-- map -->
            <div
              v-if="eventsStore.previewEvent.address || eventsStore.previewEvent.latitude !== null"
              :class="[appConfig.calendar.metaRowItem, 'mt-4 flex-col gap-2! items-start']"
            >
              <span :class="appConfig.calendar.metaLabel">Location:</span>
              <span v-if="eventsStore.previewEvent.address" :class="appConfig.calendar.metaValue">
                {{ eventsStore.previewEvent.address }}
              </span>
              <div
                v-if="
                  eventsStore.previewEvent.latitude !== null &&
                  eventsStore.previewEvent.latitude !== undefined &&
                  eventsStore.previewEvent.longitude !== null &&
                  eventsStore.previewEvent.longitude !== undefined
                "
                class="w-full h-48 rounded-lg overflow-hidden border border-gray-200 mt-1 relative z-0 shrink-0"
              >
                <ClientOnly>
                  <MapEventMapPreview
                    :latitude="eventsStore.previewEvent.latitude"
                    :longitude="eventsStore.previewEvent.longitude"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
        <div v-else :class="appConfig.calendar.emptyPreview">Select an event to view details.</div>
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

    <!-- ADD MEMBERS MODAL -->
    <UModal
      v-model:open="eventsStore.isAddMembersModalOpen"
      :ui="{ content: appConfig.layout.modalSizeMd }"
      :close="false"
      :dismissible="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header><h3 class="text-xl font-bold text-dark-text">Add Members</h3></template>
      <template #body>
        <div class="flex flex-col gap-4">
          <p class="text-sm text-dark-text/70">Select members to invite to this private event:</p>
          <div
            :class="appConfig.calendar.participantModalScroll"
            class="flex flex-wrap gap-4 max-h-60 overflow-y-auto p-1"
          >
            <div
              v-for="user in availableGroupMembers"
              :key="user.email"
              :class="[
                appConfig.calendar.participantCard,
                'cursor-pointer transition-colors',
                selectedEmailsToAdd.includes(user.email)
                  ? 'ring-2 ring-brand-500 bg-brand-50'
                  : 'hover:bg-surface-100',
              ]"
              @click="toggleMemberSelection(user.email)"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-5">
                  <UAvatar
                    :alt="user.username"
                    :src="user.profile_image_url || undefined"
                    icon="i-heroicons-user"
                    size="xl"
                    :class="appConfig.calendar.participantCardAvatar"
                  />
                  <div :class="appConfig.calendar.participantCardInfo">
                    <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>
                    <p :class="appConfig.calendar.participantCardEmail">{{ user.email }}</p>
                  </div>
                </div>
                <UIcon
                  v-if="selectedEmailsToAdd.includes(user.email)"
                  name="i-heroicons-check-circle"
                  class="w-7 h-7 text-brand-500 shrink-0"
                />
                <div
                  v-else
                  class="w-6 h-6 rounded-full border-2 border-dark-text/20 shrink-0"
                ></div>
              </div>
            </div>
            <div
              v-if="availableGroupMembers.length === 0"
              class="text-sm font-medium text-dark-text/50 p-4"
            >
              All members are already added or no members available.
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between w-full gap-3">
          <UButton
            label="Cancel"
            variant="actionCancelButton"
            :disabled="addParticipantsMutation.isLoading.value"
            @click="closeAddMembersModal"
          />
          <UButton
            label="Add Selected"
            variant="actionOkButton"
            :loading="addParticipantsMutation.isLoading.value"
            :disabled="selectedEmailsToAdd.length === 0"
            @click="submitNewMembers"
          />
        </div>
      </template>
    </UModal>

    <!-- LEAVE EVENT MODAL -->
    <UModal
      v-model:open="eventsStore.isLeaveEventModalOpen"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header><h3 class="text-xl font-bold text-dark-text">Leave Event</h3></template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          Are you sure you want to leave "{{ eventsStore.selectedEventToLeave?.title }}"?
        </p>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            label="Cancel"
            variant="actionCancelButton"
            @click="eventsStore.closeLeaveEventModal()"
          />
          <UButton
            label="Leave"
            variant="actionOkButton"
            class="bg-error-500 hover:bg-error-600 text-white"
            :loading="leaveEventMutation.isLoading.value"
            @click="handleConfirmLeave"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAppConfig, useToast } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import { useGroupsQuery, useGroupInfosQuery } from '~/queries/groups.query';
import {
  useDeleteEventMutation,
  useCreateEventMutation,
  useAddParticipantsMutation,
  useLeaveEventMutation,
  useRemoveParticipantMutation,
} from '~/queries/events.mutation';
import type { EventCreatorDto } from '~/types/events.type';
import { createEventSchema } from '~/utils/schemas/events.schema';
import { getErrorMessage } from '~/utils/error.utils';

const appConfig = useAppConfig();
const toast = useToast();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();

// map
const isMapSelectorOpen = ref(false);

const { data: currentUser } = useCurrentUserQuery();
const { data: groupsData } = useGroupsQuery();
const { data: groupInfosData } = useGroupInfosQuery(
  computed(() => eventsStore.selectedGroupUuid || ''),
);
const currentUserEmail = computed(() => currentUser.value?.email);

/* --- MUTATIONS --- */
const deleteEventMutation = useDeleteEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeDeleteEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: 'Success', description: 'Event deleted successfully!' });
    },
    onError: (err: Error) => toast.add({ title: 'Error', description: getErrorMessage(err) }),
  },
);

const createEventMutation = useCreateEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      closeAndResetForm();
      toast.add({ title: 'Success', description: 'Event created successfully!' });
    },
    onError: (err: Error) => toast.add({ title: 'Error', description: getErrorMessage(err) }),
  },
);

const addParticipantsMutation = useAddParticipantsMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      toast.add({ title: 'Success', description: 'Members added successfully!' });
      closeAddMembersModal();
    },
    onError: (err: Error) => toast.add({ title: 'Error', description: getErrorMessage(err) }),
  },
);

const leaveEventMutation = useLeaveEventMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      eventsStore.closeLeaveEventModal();
      eventsStore.closePreviewModal();
      toast.add({ title: 'Success', description: 'You have successfully left the event.' });
    },
    onError: (err: Error) => toast.add({ title: 'Error', description: getErrorMessage(err) }),
  },
);

const removeParticipantMutation = useRemoveParticipantMutation(
  computed(() => eventsStore.selectedGroupUuid),
  {
    onSuccess: () => {
      toast.add({ title: 'Success', description: 'Participant removed.' });
      if (eventsStore.participantToRemove) {
        eventsStore.currentEventParticipants = eventsStore.currentEventParticipants.filter(
          (p) => p.uuid !== eventsStore.participantToRemove!.uuid,
        );
      }
      eventsStore.closeRemoveParticipantModal();
    },
    onError: (err: Error) => toast.add({ title: 'Error', description: getErrorMessage(err) }),
  },
);

/* --- ADD EVENT FORM STATE --- */
const formState = reactive({
  title: '',
  is_private: false,
  start_time: '',
  end_time: '',
  description: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',

  // map
  latitude: null as number | null,
  longitude: null as number | null,
  address: null as string | null,
});
type FormSchemaType = z.output<typeof createEventSchema>;

watch([() => formState.startDate, () => formState.startTime], ([date, time]) => {
  if (date && time) formState.start_time = `${date}T${time}`;
});

watch([() => formState.endDate, () => formState.endTime], ([date, time]) => {
  if (date && time) formState.end_time = `${date}T${time}`;
});

const closeAndResetForm = () => {
  eventsStore.closeAddEventModal();
  Object.assign(formState, {
    title: '',
    is_private: false,
    start_time: '',
    end_time: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    // map
    latitude: null,
    longitude: null,
    address: null,
  });
};

const selectedEmailsToAdd = ref<string[]>([]);

const onSubmit = (event: FormSubmitEvent<FormSchemaType>) => {
  const payload = {
    title: event.data.title,
    description: event.data.description || undefined,
    start_time: new Date(event.data.start_time).toISOString(),
    end_time: event.data.end_time
      ? new Date(event.data.end_time).toISOString()
      : new Date(event.data.start_time).toISOString(),
    visibility: formState.is_private ? 'private' : 'public',
    participant_emails: [],
    // map
    latitude: formState.latitude ?? null,
    longitude: formState.longitude ?? null,
    address: formState.address ?? null,
  };
  createEventMutation.mutate(payload);
};

/* --- HANDLERS & COMPUTEDS --- */
const handleConfirmDelete = () => {
  const eventToDelete = eventsStore.selectedEventToDelete;
  if (eventToDelete) deleteEventMutation.mutate(eventToDelete.uuid);
};

const handleConfirmLeave = () => {
  const eventToLeave = eventsStore.selectedEventToLeave;
  if (!eventToLeave) return;
  const myRecord = eventToLeave.members.find((m) => m.email === currentUserEmail.value);
  if (myRecord) {
    leaveEventMutation.mutate({ eventUuid: eventToLeave.uuid, targetUuid: myRecord.uuid });
  }
};

const confirmRemoveParticipant = () => {
  if (!eventsStore.previewEvent || !eventsStore.participantToRemove) return;
  removeParticipantMutation.mutate({
    eventUuid: eventsStore.previewEvent.uuid,
    targetUuid: eventsStore.participantToRemove.uuid,
  });
};

const handleOpenUserProfile = (user: EventCreatorDto) => {
  eventsStore.closeParticipantsModal();
  eventsStore.closePreviewModal();

  groupsStore.selectedUserProfile = {
    userUuid: user.uuid || '',
    username: user.username,
    email: user.email || 'N/A',
    role: getGroupRole(user),
    joinedAt: 'Unknown',
    canViewDocuments: false,
  };
  groupsStore.isUserProfileModalOpen = true;
};

const openAllParticipantsModal = () => {
  if (eventsStore.previewEvent) {
    eventsStore.openParticipantsModal(eventsStore.previewEvent);
  }
};

const displayParticipants = computed<EventCreatorDto[]>(
  () => eventsStore.previewEvent?.members?.slice(0, 5) || [],
);
const extraParticipantsCount = computed<number>(() =>
  Math.max(0, (eventsStore.previewEvent?.members?.length || 0) - 5),
);

const selectedGroupDetails = computed(() =>
  groupsData.value?.items?.find((g) => g.uuid === eventsStore.selectedGroupUuid),
);
const isCurrentUserLeader = computed(
  () => selectedGroupDetails.value?.role?.toLowerCase() === 'leader',
);

const hasPermissionToDelete = computed<boolean>(() => {
  const creatorEmail = eventsStore.previewEvent?.creator?.email;
  return (
    isCurrentUserLeader.value ||
    (!!creatorEmail && !!currentUserEmail.value && creatorEmail === currentUserEmail.value)
  );
});

const canLeaveEvent = computed<boolean>(() => {
  const event = eventsStore.previewEvent;
  if (!event || hasPermissionToDelete.value) return false;
  return event.members?.some((m) => m.email === currentUserEmail.value) ?? false;
});

const availableGroupMembers = computed<EventCreatorDto[]>(() => {
  const rawProfiles = groupInfosData.value?.group_profiles || [];

  const allGroupMembers: EventCreatorDto[] = rawProfiles.map(
    (profile: {
      users: { uuid?: string; username: string; email: string; profile_image_url?: string | null };
    }) => ({
      uuid: profile.users.uuid || '',
      username: profile.users.username,
      email: profile.users.email,
      profile_image_url: profile.users.profile_image_url || null,
    }),
  );

  const currentEventEmails =
    eventsStore.previewEvent?.members?.map((m: EventCreatorDto) => m.email) || [];

  return allGroupMembers.filter(
    (m: EventCreatorDto) =>
      m.email && !currentEventEmails.includes(m.email) && m.email !== currentUserEmail.value,
  );
});

const getGroupRole = (user?: EventCreatorDto | null): string => {
  if (!user || !groupInfosData.value?.group_profiles) return 'Member';

  const profile = groupInfosData.value.group_profiles.find((p) => {
    const matchEmail =
      user.email &&
      p.users?.email &&
      user.email.trim().toLowerCase() === p.users.email.trim().toLowerCase();

    const matchUsername =
      user.username &&
      p.users?.username &&
      user.username.trim().toLowerCase() === p.users.username.trim().toLowerCase();

    return matchEmail || matchUsername;
  });

  const roleType = profile?.roles?.type?.toLowerCase();
  return roleType === 'leader' ? 'Leader' : 'Member';
};

const isGroupLeader = (user: EventCreatorDto): boolean => {
  return getGroupRole(user) === 'Leader';
};
const isEventCreator = (user: EventCreatorDto): boolean => {
  const creator = eventsStore.previewEvent?.creator;
  if (!creator) return false;

  const matchEmail = !!(
    user.email &&
    creator.email &&
    user.email.trim().toLowerCase() === creator.email.trim().toLowerCase()
  );

  const matchUsername = !!(
    user.username &&
    creator.username &&
    user.username.trim().toLowerCase() === creator.username.trim().toLowerCase()
  );

  return matchEmail || matchUsername;
};

const toggleMemberSelection = (email: string) => {
  const index = selectedEmailsToAdd.value.indexOf(email);
  if (index === -1) selectedEmailsToAdd.value.push(email);
  else selectedEmailsToAdd.value.splice(index, 1);
};

const closeAddMembersModal = () => {
  selectedEmailsToAdd.value = [];
  eventsStore.closeAddMembersModal();
};

const submitNewMembers = () => {
  if (selectedEmailsToAdd.value.length === 0 || !eventsStore.previewEvent) return;
  addParticipantsMutation.mutate({
    eventUuid: eventsStore.previewEvent.uuid,
    participant_emails: selectedEmailsToAdd.value,
  });
};

// map
const handleLocationSelected = (location: {
  latitude: number;
  longitude: number;
  address: string;
}) => {
  formState.latitude = location.latitude;
  formState.longitude = location.longitude;
  formState.address = location.address;
  isMapSelectorOpen.value = false;
};

const clearLocation = () => {
  formState.latitude = null;
  formState.longitude = null;
  formState.address = null;
};
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
