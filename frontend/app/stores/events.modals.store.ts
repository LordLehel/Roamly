// frontend/app/stores/events.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UiEvent, EventCreatorDto } from '~/types/events.type';

export const useEventsStore = defineStore('events', () => {
  const selectedGroupUuid = ref<string | undefined>(undefined);

  const isAddDayModalOpen = ref(false);
  const isDeleteDayModalOpen = ref(false);
  const isAddEventModalOpen = ref(false);
  const isDeleteEventModalOpen = ref(false);
  const isParticipantsModalOpen = ref(false);
  const isPreviewModalOpen = ref(false);
  const isAddMembersModalOpen = ref(false);
  const isLeaveEventModalOpen = ref(false);
  const isRemoveParticipantModalOpen = ref(false);

  const selectedEventToDelete = ref<UiEvent | null>(null);
  const selectedEventToLeave = ref<UiEvent | null>(null);
  const currentEventParticipants = ref<EventCreatorDto[]>([]);
  const previewEvent = ref<UiEvent | null>(null);
  const previewDate = ref<string | undefined>(undefined);
  const participantToRemove = ref<EventCreatorDto | null>(null);

  const openAddEventModal = () => (isAddEventModalOpen.value = true);
  const closeAddEventModal = () => (isAddEventModalOpen.value = false);

  const openDeleteEventModal = (event: UiEvent) => {
    selectedEventToDelete.value = event;
    isDeleteEventModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  const closeDeleteEventModal = () => {
    isDeleteEventModalOpen.value = false;
    selectedEventToDelete.value = null;
  };

  const openParticipantsModal = (event: UiEvent) => {
    previewEvent.value = event;
    currentEventParticipants.value = event.members || [];
    isParticipantsModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  const closeParticipantsModal = () => {
    isParticipantsModalOpen.value = false;
    currentEventParticipants.value = [];
  };

  const openPreviewModal = (event: UiEvent, date?: string) => {
    previewEvent.value = event;
    previewDate.value = date;
    isPreviewModalOpen.value = true;
  };

  const closePreviewModal = () => {
    isPreviewModalOpen.value = false;
    previewEvent.value = null;
    previewDate.value = undefined;
  };

  const openAddMembersModal = (event: UiEvent) => {
    previewEvent.value = event;
    isAddMembersModalOpen.value = true;
    isPreviewModalOpen.value = false;
    isParticipantsModalOpen.value = false;
  };

  const closeAddMembersModal = () => {
    isAddMembersModalOpen.value = false;
  };

  const openLeaveEventModal = (event: UiEvent) => {
    selectedEventToLeave.value = event;
    isLeaveEventModalOpen.value = true;
    isPreviewModalOpen.value = false;
  };

  const closeLeaveEventModal = () => {
    isLeaveEventModalOpen.value = false;
    selectedEventToLeave.value = null;
  };

  const openRemoveParticipantModal = (user: EventCreatorDto) => {
    participantToRemove.value = user;
    isRemoveParticipantModalOpen.value = true;
  };

  const closeRemoveParticipantModal = () => {
    isRemoveParticipantModalOpen.value = false;
    participantToRemove.value = null;
  };

  return {
    selectedGroupUuid,
    isAddDayModalOpen,
    isDeleteDayModalOpen,
    isAddEventModalOpen,
    isDeleteEventModalOpen,
    isParticipantsModalOpen,
    isPreviewModalOpen,
    isAddMembersModalOpen,
    isLeaveEventModalOpen,
    isRemoveParticipantModalOpen,
    selectedEventToDelete,
    selectedEventToLeave,
    currentEventParticipants,
    previewEvent,
    previewDate,
    participantToRemove,
    openAddEventModal,
    closeAddEventModal,
    openDeleteEventModal,
    closeDeleteEventModal,
    openParticipantsModal,
    closeParticipantsModal,
    openPreviewModal,
    closePreviewModal,
    openAddMembersModal,
    closeAddMembersModal,
    openLeaveEventModal,
    closeLeaveEventModal,
    openRemoveParticipantModal,
    closeRemoveParticipantModal,
  };
});
