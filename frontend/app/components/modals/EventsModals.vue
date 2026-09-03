<!-- frontend/app/components/modals/EventsModals.vue -->
<template>
  <div>
    <!-- ADD EVENT MODAL (Placeholder) -->
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
    <UModal v-model:open="eventsStore.isDeleteEventModalOpen" :dismissible="false" :close="false">
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
      <template #header>
        <h3 class="text-xl font-bold text-dark-text">Delete Event</h3>
      </template>
      <template #body>
        <p :class="appConfig.typography.modalText">
          {{ CONST_DELETE_EVENT_CONFIRM ?? 'Are you sure you want to delete this event?' }}
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
            @click="eventsStore.closeDeleteEventModal()"
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

    <!-- EVENT PREVIEW MODAL (MOBILE ONLY) -->
    <UModal
      v-model:open="eventsStore.isPreviewModalOpen"
      :ui="{ content: appConfig.layout.modalSizeMd }"
      :close="false"
      :dismissible="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #close><div class="hidden"></div></template>
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
                  eventsStore.previewEvent.isPrivate ? 'i-heroicons-user' : 'i-heroicons-users'
                "
                :class="appConfig.calendar.previewTypeIcon"
              />
              <span :class="appConfig.calendar.previewTypeText">{{
                eventsStore.previewEvent.isPrivate ? CONST_PRIVATE_LBL : CONST_GROUP_EVENT_LBL
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
                >{{ eventsStore.previewEvent.timeStart }} -
                {{ eventsStore.previewEvent.timeEnd }}</span
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
                  <UTooltip v-for="p in displayParticipants" :key="p.id" :text="p.username">
                    <UAvatar
                      :alt="p.username"
                      :src="p.avatar || undefined"
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
            <div :class="appConfig.calendar.metaRowItem">
              <span :class="appConfig.calendar.metaLabel">{{ CONST_LOC_LBL }}</span>
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
            :label="CONST_CANCEL_BTN_TEXT ?? 'Cancel'"
            variant="actionCancelButton"
            @click="eventsStore.closePreviewModal()"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
/* IMPORTS */
import { computed } from 'vue';
import { useAppConfig } from '#imports';
import { useEventsStore } from '~/stores/events.modals.store';
import { useGroupsStore } from '~/stores/groups.modals.store';
import { useCurrentUserQuery } from '~/queries/user.query';
import type { MockUser } from '~/utils/apiMock.utils';

/* CONSTANTS */
const appConfig = useAppConfig();
const eventsStore = useEventsStore();
const groupsStore = useGroupsStore();
const { data: currentUser } = useCurrentUserQuery();

/* HANDLERS */
const handleOpenUserProfile = (user: MockUser) => {
  const userCopy = { ...user };

  eventsStore.closeParticipantsModal();
  eventsStore.closePreviewModal();
  groupsStore.selectedUserProfile = {
    username: userCopy.username,
    email: userCopy.email,
    role: userCopy.role || 'Participant',
    joinedAt: userCopy.joinedAt || 'Unknown',
    canViewDocuments: userCopy.canViewDocuments ?? false,
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
