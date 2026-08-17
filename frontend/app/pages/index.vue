<!-- frontend/app/pages/index.vue -->
<template>
  <div class="flex-1 flex flex-col items-center px-6 py-12 gap-16 relative z-10 w-full">
    
    <section class="flex flex-col items-center text-center mt-10 max-w-3xl">
      <UButton
        label="Get Started"
        to="/groups"
        variant="action_ok"
        class="w-56 h-14 text-xl hover:-translate-y-1"
      />

      <p class="mt-10 text-lg text-green-50 font-medium opacity-90 leading-relaxed">
        Welcome to Roamly, your ultimate companion for seamless travel planning and unforgettable group adventures. 
        Organize your documents, coordinate schedules, and share your journey's best moments all in one harmonious space.
      </p>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-24">
      <UCard 
        variant="glass" 
        :ui="{ body: 'flex flex-col items-center justify-center h-full text-center' }" 
        class="transition-transform hover:-translate-y-1"
      >
        <div class="flex flex-col items-center flex-1">
          <h3 class="text-lg font-bold text-[#2F3E32] mb-4 tracking-wide">Document Management</h3>
          <UIcon name="i-heroicons-document-text" class="w-14 h-14 text-[#7A9A82] mb-4 opacity-80" />
          <p class="text-sm opacity-80 mb-6 leading-relaxed">
            Easily organize, store, and access all your travel documents and itineraries in one secure place.
          </p>
        </div>
        <NuxtLink
          to="#"
          class="text-[#7A9A82] font-bold tracking-wide hover:underline underline-offset-4 transition-all"
        >
          Learn more
        </NuxtLink>
      </UCard>

      <UCard 
        variant="glass" 
        :ui="{ body: 'flex flex-col items-center justify-center h-full text-center' }" 
        class="transition-transform hover:-translate-y-1"
      >
        <div class="flex flex-col items-center flex-1">
          <h3 class="text-lg font-bold text-[#2F3E32] mb-4 tracking-wide">Event Calendar</h3>
          <UIcon name="i-heroicons-calendar-days" class="w-14 h-14 text-[#7A9A82] mb-4 opacity-80" />
          <p class="text-sm opacity-80 mb-6 leading-relaxed">
            Keep track of your upcoming trips, group meetups, and schedules without missing a single beat.
          </p>
        </div>
        <NuxtLink
          to="#"
          class="text-[#7A9A82] font-bold tracking-wide hover:underline underline-offset-4 transition-all"
        >
          Learn more
        </NuxtLink>
      </UCard>

      <UCard 
        variant="glass" 
        :ui="{ body: 'flex flex-col items-center justify-center h-full text-center' }" 
        class="transition-transform hover:-translate-y-1"
      >
        <div class="flex flex-col items-center flex-1">
          <h3 class="text-lg font-bold text-[#2F3E32] mb-4 tracking-wide">Group Gallery</h3>
          <UIcon name="i-heroicons-photo" class="w-14 h-14 text-[#7A9A82] mb-4 opacity-80" />
          <p class="text-sm opacity-80 mb-6 leading-relaxed">
            Share memorable moments and browse through community photo collections from past adventures.
          </p>
        </div>
        <NuxtLink
          to="#"
          class="text-[#7A9A82] font-bold tracking-wide hover:underline underline-offset-4 transition-all"
        >
          Learn more
        </NuxtLink>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta } from '#imports';

definePageMeta({
  layout: 'default'
});
</script>