<template>
    <header class="bg-white border-b border-gray-200 shadow-sm">
        <nav class="container mx-auto flex items-center justify-between py-4 px-6">
          <h1 class="text-xl font-bold">🏋️ Workout Tracker</h1>
          <div class="flex gap-4" v-if="auth.isAuthenticated">
            <NuxtLink
              v-for="link in links"
              :key="link.url"
              :to="link.url"
              class="flex items-center gap-2 text-gray-700 hover:underline transition-colors"
            >
              {{ link.title }}
            </NuxtLink>        
            <button @click="auth.logout" class="text-gray-700 hover:underline">
              Выйти
            </button>
          </div>
          <div class="flex gap-4" v-else>
            <NuxtLink to="/login" class="text-gray-700 hover:underline">Войти</NuxtLink>
          </div>
        </nav>
      </header>
</template>

<script setup>

const auth = useAuthStore()

const links = [
    { title: 'Главная', url: '/' },
    { title: 'Тренировки', url: '/workouts' },
    { title: 'Упражнения', url: '/exercises' },
    { title: 'Профиль', url: '/profile' },

]

</script>