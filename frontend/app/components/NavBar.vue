<template>
  <header class="border-b border-gray-200 shadow-sm :dark:border-gray-700">
    <nav class="container mx-auto flex items-center justify-between py-4 px-6">
      <h1 class="text-xl font-bold">🏋️ Workout Tracker</h1>

      <!-- Slideover Menu -->
      <USlideover title="Меню" close-icon="i-lucide-arrow-right">
        <UButton
          icon="i-lucide-menu"
          color="primary"
          variant="ghost"
        />
        <template #body>
          <UNavigationMenu
            orientation="vertical"
            :items="items"
            class="data-[orientation=vertical]:w-56"
          />
        </template>
      </USlideover>
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const auth = useAuthStore()

// Build navigation items dynamically depending on authentication
const items = computed<NavigationMenuItem[][]>(() => {
  if (auth.isAuthenticated) {
    return [[
      { label: 'Главная', icon: 'i-lucide-home', to: '/' },
      { label: 'Тренировки', icon: 'i-lucide-dumbbell', to: '/workouts' },
      { label: 'Упражнения', icon: 'i-lucide-list', to: '/exercises' },
      { label: 'Профиль', icon: 'i-lucide-user', to: '/profile' },
      {
        label: 'Выйти',
        icon: 'i-lucide-log-out',
        click: () => auth.logout()
      }
    ]]
  } else {
    return [[
      { label: 'Войти', icon: 'i-lucide-log-in', to: '/login' }
    ]]
  }
})
</script>