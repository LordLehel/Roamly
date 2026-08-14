<template>
  <div class="min-h-screen flex flex-col text-white font-sans bg-black">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="py-3 text-center text-xs text-green-500 border-t border-green-900/50 bg-black/30 backdrop-blur-md"
    >
      Copyright - Roamly.
    </footer>
  </div>
</template>
