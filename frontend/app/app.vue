<!-- app.vue -->
<template>
  <UApp>
    <!-- Main layout container -->
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <!-- Header -->
      <AppNav />

      <!-- Page Content -->
      <main class="flex-1 container mx-auto p-6">
        <NuxtPage />
      </main>

      <!-- Footer -->
      <!-- <footer class="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {{ new Date().getFullYear() }} Sluvik Developments. All rights reserved.
      </footer> -->
    </div>
  </UApp>
</template>


