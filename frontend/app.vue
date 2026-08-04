<script setup lang="ts">
  // You can add any global logic or imports here if needed
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <!-- Header -->
    <header class="bg-white shadow-sm px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="logo text-xl font-bold text-gray-900">Roamly</NuxtLink>
        <nav class="flex gap-6">
          <NuxtLink to="/" class="text-gray-700 hover:text-gray-900">Home</NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-gray-900">About</NuxtLink>
          <NuxtLink to="/dashboard" class="text-gray-700 hover:text-gray-900">Dashboard</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <NuxtPage />
    </main>

  </div>
</template>
