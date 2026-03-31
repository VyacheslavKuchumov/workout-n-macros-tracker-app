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

      <main class="app-main">
        <UContainer class="app-container">
          <NuxtPage />
        </UContainer>
      </main>
    </div>
  </UApp>
</template>
