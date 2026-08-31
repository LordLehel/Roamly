// frontend/app/stores/events.modals.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DayOutDto, EventOutDto } from '~/types/events.type'; // <-- Típusok betöltése

export const useEventsStore = defineStore('events', () => {
  const isAddDayModalOpen = ref(false);
  const isDeleteDayModalOpen = ref(false);
  const isAddEventModalOpen = ref(false);
  const isDeleteEventModalOpen = ref(false);

  // 'any' cserélve DTO-ra
  const selectedDayToDelete = ref<DayOutDto | null>(null);
  const selectedEventToDelete = ref<EventOutDto | null>(null);

  const openAddDayModal = () => (isAddDayModalOpen.value = true);
  const closeAddDayModal = () => (isAddDayModalOpen.value = false);

  const openDeleteDayModal = (day: DayOutDto) => {
    selectedDayToDelete.value = day;
    isDeleteDayModalOpen.value = true;
  };
  const closeDeleteDayModal = () => {
    isDeleteDayModalOpen.value = false;
    selectedDayToDelete.value = null;
  };

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

  return {
    isAddDayModalOpen,
    isDeleteDayModalOpen,
    isAddEventModalOpen,
    isDeleteEventModalOpen,
    selectedDayToDelete,
    selectedEventToDelete,
    openAddDayModal,
    closeAddDayModal,
    openDeleteDayModal,
    closeDeleteDayModal,
    openAddEventModal,
    closeAddEventModal,
    openDeleteEventModal,
    closeDeleteEventModal,
  };
});
