<!-- frontend/app/pages/groups/index.vue -->
<template>
  <div class="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
    <!-- Cím -->
    <h1 class="text-3xl font-bold text-surface-500 tracking-wide text-center">
      {{ CONST_GROUPS_HEADING }}
    </h1>

    <!-- Action Bar: Filter, Plus, Invites -->
    <div class="flex items-center gap-4">
      <UButton
        icon="i-heroicons-funnel"
        :label="CONST_FILTER_LABEL"
        variant="glassButton"
        class="px-8 rounded-full font-semibold justify-center"
        @click="redirectToHome"
      />
      <UButton
        icon="i-heroicons-plus"
        variant="glassButton"
        class="w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0"
        @click="redirectToHome"
      />
      <UButton
        icon="i-heroicons-envelope"
        variant="glassButton"
        class="w-10 h-10 rounded-full font-semibold flex items-center justify-center p-0"
        @click="redirectToHome"
      />
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <UCard
        v-for="group in mockGroups"
        :key="group.uuid"
        variant="interactiveGlass"
        class="relative flex flex-col justify-between"
      >
        <!-- Delete button -->
        <div class="absolute top-4 right-4 z-10">
          <UButton
            icon="i-heroicons-trash"
            variant="ghost"
            class="text-dark-text/70 hover:text-error-500 transition-colors"
            @click="openDeleteModal(group)"
          />
        </div>

        <div class="flex flex-col gap-6 w-full pt-2">
          <!-- Csoport Neve -->
          <h3 class="text-xl font-bold text-center tracking-wide text-dark-text">
            {{ group.name }}
          </h3>

          <!-- User role -->
          <p class="text-sm text-center text-dark-text/80 font-medium">
            {{ CONST_ROLE_LABEL }} <span class="font-bold">{{ group.role }}</span>
          </p>

          <!-- Lower section -->
          <div
            class="flex items-end justify-between w-full pt-4 border-t border-dark-text/10 text-xs text-dark-text/70"
          >
            <div>
              <p class="opacity-70">{{ CONST_CREATED_AT_LABEL }}</p>
              <p class="font-semibold">{{ group.createdAt }}</p>
            </div>
            <div class="flex items-center gap-1.5 font-semibold">
              <span>{{ group.memberCount }}</span>
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-brand-500" />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Delete Window (Csak akkor aktív, ha az isDeleteModalOpen true) -->
    <UModal v-model:open="isDeleteModalOpen" :portal="false">
      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <UCard variant="glass" class="w-full max-w-md shadow-2xl ring-1 ring-white/20">
          <template #header>
            <h3 class="text-lg font-bold text-dark-text">{{ CONST_DELETE_GROUP_TITLE }}</h3>
          </template>

          <p class="text-sm text-dark-text/80 py-4">
            {{ CONST_DELETE_GROUP_CONFIRM }}
            <span v-if="selectedGroupToDelete" class="block font-semibold mt-1 text-brand-500">
              „{{ selectedGroupToDelete.name }}” (UUID: {{ selectedGroupToDelete.uuid }})
            </span>
          </p>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                :label="CONST_CANCEL_BTN_TEXT"
                variant="actionCancelButton"
                @click="closeDeleteModal"
              />
              <UButton 
                :label="CONST_DELETE_BTN" 
                variant="actionOkButton" 
                @click="confirmDelete" 
              />
            </div>
          </template>
        </UCard>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import {
  CONST_GROUPS_HEADING,
  CONST_FILTER_LABEL,
  CONST_CREATED_AT_LABEL,
  CONST_ROLE_LABEL,
  CONST_DELETE_GROUP_TITLE,
  CONST_DELETE_GROUP_CONFIRM,
  CONST_DELETE_BTN,
  CONST_CANCEL_BTN_TEXT,
} from '~/utils/constants';

interface GroupItem {
  uuid: string;
  name: string;
  role: string;
  createdAt: string;
  memberCount: number;
}

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
});

const router = useRouter();
const { isAuthenticated } = useAuth();

watch(
  isAuthenticated,
  (isAuth) => {
    if (!isAuth) {
      router.push('/login');
    }
  },
  { immediate: true }
);

// Állapotok a modális ablakhoz és a kiválasztott csoporthoz
const isDeleteModalOpen = ref<boolean>(false);
const selectedGroupToDelete = ref<GroupItem | null>(null);

const mockGroups = ref<GroupItem[]>([
  { uuid: '1', name: 'Alpha Group', role: 'Leader', createdAt: '2026-03-01', memberCount: 5 },
  { uuid: '2', name: 'Beta Squad', role: 'Member', createdAt: '2026-03-02', memberCount: 3 },
  { uuid: '3', name: 'Gamma Team', role: 'Member', createdAt: '2026-03-03', memberCount: 8 },
  { uuid: '4', name: 'Delta Crew', role: 'Member', createdAt: '2026-03-04', memberCount: 2 },
  { uuid: '5', name: 'Omega Unit', role: 'Member', createdAt: '2026-03-05', memberCount: 4 },
]);

const redirectToHome = () => {
  router.push('/');
};

// Megnyitja az ablakot, és eltárolja az adott csoport adatait
const openDeleteModal = (group: GroupItem) => {
  selectedGroupToDelete.value = group;
  isDeleteModalOpen.value = true;
};

// Bezárja és kitakarítja az adatot
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedGroupToDelete.value = null;
};

// Itt készítjük el a törlési hívást a kiválasztott csoport UUID-jával
const confirmDelete = () => {
  if (selectedGroupToDelete.value) {
    const targetUuid = selectedGroupToDelete.value.uuid;
    console.log(`Törlési kérés előkészítve a következő UUID-hoz: ${targetUuid}`);
    
    // Ide jöhet majd a valós API hívás (pl. await deleteGroup(targetUuid))
    // Jelenleg szűrjük a listát a lokális teszteléshez:
    mockGroups.value = mockGroups.value.filter(g => g.uuid !== targetUuid);
  }
  
  closeDeleteModal();
};
</script>