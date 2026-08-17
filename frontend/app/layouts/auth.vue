<!-- frontend/app/layouts/auth.vue -->
<template>
  <div
    class="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2F3E32] font-sans bg-cover bg-center bg-no-repeat bg-fixed"
    style="background-image: url('/register/register-background.jpg')"
  >
    <!-- Header -->
    <AuthHeader />

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="py-5 px-6 flex items-center justify-between text-xs text-[#2F3E32] bg-[#EDF1EE]/70 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.02)] relative z-10"
    >
      <div class="font-medium opacity-80">Copyright - Roamly Co. 2026</div>
    </footer>
  </div>
</template>