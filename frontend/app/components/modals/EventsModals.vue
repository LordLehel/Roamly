<!-- frontend/app/components/modals/EventsModals.vue -->
<template>
  <div>
    <!-- ADD DAY MODAL -->
    <UModal
      v-model:open="eventsStore.isAddDayModalOpen"
      :title="CONST_ADD_DAY_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <div class="flex flex-col gap-4 py-2">
          <label class="block text-sm font-medium text-dark-text">{{
            CONST_SELECT_DATE_LABEL
          }}</label>
          <UInput type="date" class="w-full" />
        </div>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="eventsStore.closeAddDayModal()"
          />
          <UButton
            :label="CONST_ADD_BTN"
            variant="actionOkButton"
            @click="eventsStore.closeAddDayModal()"
          />
        </div>
      </template>
    </UModal>

    <!-- DELETE DAY MODAL -->
    <UModal
      v-model:open="eventsStore.isDeleteDayModalOpen"
      :title="CONST_DELETE_DAY_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p class="text-sm text-dark-text/80 py-2">{{ CONST_DELETE_DAY_CONFIRM }}</p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="eventsStore.closeDeleteDayModal()"
          />
          <UButton
            :label="CONST_DELETE_BTN"
            variant="actionOkButton"
            @click="eventsStore.closeDeleteDayModal()"
          />
        </div>
      </template>
    </UModal>

    <!-- DELETE EVENT MODAL -->
    <UModal
      v-model:open="eventsStore.isDeleteEventModalOpen"
      :title="CONST_DELETE_EVENT_TITLE"
      :dismissible="false"
      :close="false"
    >
      <template #default><div class="hidden"></div></template>
      <template #body>
        <p class="text-sm text-dark-text/80 py-2">{{ CONST_DELETE_EVENT_CONFIRM }}</p>
      </template>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <UButton
            :label="CONST_CANCEL_BTN_TEXT"
            variant="actionCancelButton"
            @click="eventsStore.closeDeleteEventModal()"
          />
          <UButton
            :label="CONST_DELETE_BTN"
            variant="actionOkButton"
            @click="eventsStore.closeDeleteEventModal()"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useEventsStore } from '~/stores/events.modals.store';
const eventsStore = useEventsStore();
</script>
