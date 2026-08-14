<template>
  <div
    class="min-h-screen flex flex-col text-white font-sans bg-[url('/register/register-background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
  >
    <!-- Header -->
    <AuthHeader />

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="py-3 text-center text-xs text-green-500 border-t border-green-900/50 bg-black/30 backdrop-blur-md"
    >
      Copyright - Roamly idk.
    </footer>
  </div>
</template>
