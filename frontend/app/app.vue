<script setup lang="ts">
const auth = useAuthStore()

onMounted(async () => {
  await auth.init()
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#0f766e" />

    <div class="app-shell">
      <div class="app-shell__glow app-shell__glow--left" />
      <div class="app-shell__glow app-shell__glow--right" />

      <NavBar />

      <main class="pb-14">
        <UContainer class="px-4 py-6 md:px-6 md:py-10">
          <NuxtPage />
        </UContainer>
      </main>
    </div>
  </UApp>
</template>
