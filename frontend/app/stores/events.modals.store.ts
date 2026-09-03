// frontend/app/stores/events.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DayOutDto, EventOutDto } from '~/types/events.type'; // <-- Típusok betöltése

export const useEventsStore = defineStore('events', () => {
  const isAddDayModalOpen = ref(false);
  const isDeleteDayModalOpen = ref(false);
  const isAddEventModalOpen = ref(false);
  const isDeleteEventModalOpen = ref(false);
  const isParticipantsModalOpen = ref(false);

  const selectedDayToDelete = ref<DayOutDto | null>(null);
  const selectedEventToDelete = ref<EventOutDto | null>(null);
  const currentEventParticipants = ref<MockUser[]>([]);

  const openAddEventModal = () => (isAddEventModalOpen.value = true);
  const closeAddEventModal = () => (isAddEventModalOpen.value = false);

  const openDeleteEventModal = (event: EventOutDto) => {
    selectedEventToDelete.value = event;
    isDeleteEventModalOpen.value = true;
  };
  const closeDeleteEventModal = () => {
    isDeleteEventModalOpen.value = false;
    selectedEventToDelete.value = null;
  };

  const openParticipantsModal = (participants: MockUser[]) => {
    currentEventParticipants.value = participants;
    isParticipantsModalOpen.value = true;
  };

  const closeParticipantsModal = () => {
    isParticipantsModalOpen.value = false;
    setTimeout(() => {
      currentEventParticipants.value = [];
    }, 300);
  };

  return {
    isAddDayModalOpen,
    isDeleteDayModalOpen,
    isAddEventModalOpen,
    isDeleteEventModalOpen,
    isParticipantsModalOpen,
    selectedDayToDelete,
    selectedEventToDelete,
    currentEventParticipants,
    openAddEventModal,
    closeAddEventModal,
    openDeleteEventModal,
    closeDeleteEventModal,
    openParticipantsModal,
    closeParticipantsModal,
  };
});
