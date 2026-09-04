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

  const selectedEventToDelete = ref<UiEvent | null>(null);
  const currentEventParticipants = ref<EventCreatorDto[]>([]);
  const previewEvent = ref<UiEvent | null>(null);
  const previewDate = ref<string | undefined>(undefined);

  const openAddEventModal = () => (isAddEventModalOpen.value = true);
  const closeAddEventModal = () => (isAddEventModalOpen.value = false);

  const openDeleteEventModal = (event: UiEvent) => {
    selectedEventToDelete.value = event;
    isDeleteEventModalOpen.value = true;
  };

  const closeDeleteEventModal = () => {
    isDeleteEventModalOpen.value = false;
    selectedEventToDelete.value = null;
  };

  const openParticipantsModal = (participants: EventCreatorDto[]) => {
    currentEventParticipants.value = participants;
    isParticipantsModalOpen.value = true;
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

  return {
    selectedGroupUuid,
    isAddDayModalOpen,
    isDeleteDayModalOpen,
    isAddEventModalOpen,
    isDeleteEventModalOpen,
    isParticipantsModalOpen,
    isPreviewModalOpen,
    selectedEventToDelete,
    currentEventParticipants,
    previewEvent,
    previewDate,
    openAddEventModal,
    closeAddEventModal,
    openDeleteEventModal,
    closeDeleteEventModal,
    openParticipantsModal,
    closeParticipantsModal,
    openPreviewModal,
    closePreviewModal,
  };
});
