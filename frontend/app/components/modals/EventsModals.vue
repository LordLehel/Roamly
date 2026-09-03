<!-- frontend/app/components/modals/EventsModals.vue -->
<template>
  <div>
    <!-- ADD EVENT MODAL (Placeholder) -->
    <UModal
      v-model:open="eventsStore.isAddEventModalOpen"
      title="Add Event"
      :dismissible="false"
      :close="false"
      :ui="{ content: appConfig.layout.modalSizeMd }"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <div :class="appConfig.layout.modalForm">
          <p :class="appConfig.typography.modalText">Event creation form will be here...</p>
        </div>
      </template>
      <template #footer>
        <div :class="appConfig.layout.flexBetween">
          <UButton
            label="Cancel"
            variant="actionCancelButton"
            @click="eventsStore.closeAddEventModal()"
          />
          <UButton
            label="Save"
            variant="actionOkButton"
            @click="eventsStore.closeAddEventModal()"
          />
        </div>
      </template>
    </UModal>

    <!-- DELETE EVENT MODAL -->
    <UModal
      v-model:open="eventsStore.isDeleteEventModalOpen"
      title="Delete Event"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p :class="appConfig.typography.modalText">Are you sure you want to delete this event?</p>
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
            @click="eventsStore.closeDeleteEventModal()"
          />
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="eventsStore.isParticipantsModalOpen"
      title="Event Participants"
      :ui="{ content: appConfig.layout.modalSizeMd }"
      :close="false"
      :dismissible="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <div :class="appConfig.calendar.participantModalScroll">
          <div
            v-for="user in eventsStore.currentEventParticipants"
            :key="user.id"
            :class="appConfig.calendar.participantCard"
            @click="handleOpenUserProfile(user)"
          >
            <div class="flex items-center gap-5 w-full">
              <UAvatar
                :alt="user.username"
                :src="user.avatar || undefined"
                icon="i-heroicons-user"
                size="xl"
                :class="appConfig.calendar.participantCardAvatar"
              />
              <div :class="appConfig.calendar.participantCardInfo">
                <div :class="appConfig.calendar.participantCardHeader">
                  <h4 :class="appConfig.calendar.participantCardName">{{ user.username }}</h4>
                  <span :class="appConfig.calendar.participantCardRole">
                    {{ user.role || 'Participant' }}
                  </span>
                </div>
                <p :class="appConfig.calendar.participantCardEmail">{{ user.email }}</p>
                <p :class="appConfig.calendar.participantCardPhone">
                  Phone: {{ user.phone_number || 'N/A' }}
                </p>
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
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import type { MockUser } from '~/utils/apiMock.utils';

const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();

const handleOpenUserProfile = (user: MockUser) => {
  eventsStore.closeParticipantsModal();

  groupsStore.selectedUserProfile = {
    username: user.username,
    email: user.email,
    role: user.role || 'Participant',
    joinedAt: user.joinedAt || 'Unknown',
    canViewDocuments: user.canViewDocuments ?? false,
  };

  groupsStore.isUserProfileModalOpen = true;
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
