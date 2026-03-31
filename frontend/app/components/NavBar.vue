<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const mobileOpen = ref(false)

const navItems = computed(() => [
  { label: 'Dashboard', to: '/', icon: 'i-lucide-chart-column' },
  { label: 'Workouts', to: '/workouts', icon: 'i-lucide-calendar-days' },
  { label: 'Exercises', to: '/exercises', icon: 'i-lucide-dumbbell' },
  { label: 'Weight', to: '/weight', icon: 'i-lucide-scale' },
  { label: 'Profile', to: '/profile', icon: 'i-lucide-user-round' }
])

async function handleLogout() {
  mobileOpen.value = false
  await auth.logout()
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
    <UContainer class="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
          <UIcon name="i-lucide-activity" class="size-5" />
        </div>

        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700">
            Workout Tracker
          </p>
          <p class="text-sm text-slate-500">
            Calendar planning and strength trends
          </p>
        </div>
      </NuxtLink>

      <div class="hidden items-center gap-2 md:flex" v-if="auth.isAuthenticated">
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          color="neutral"
          :variant="route.path === item.to ? 'soft' : 'ghost'"
          :icon="item.icon"
        >
          {{ item.label }}
        </UButton>
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <UBadge
          v-if="auth.user"
          color="neutral"
          variant="subtle"
          class="rounded-full px-3 py-1.5"
        >
          {{ auth.user.first_name || auth.user.username }}
        </UBadge>

        <UButton
          v-if="auth.isAuthenticated"
          color="neutral"
          variant="outline"
          icon="i-lucide-log-out"
          @click="handleLogout"
        >
          Log out
        </UButton>

        <UButton v-else to="/login" color="primary" trailing-icon="i-lucide-arrow-right">
          Sign in
        </UButton>
      </div>

      <UButton
        class="md:hidden"
        color="neutral"
        variant="ghost"
        icon="i-lucide-menu"
        @click="mobileOpen = true"
      />
    </UContainer>

    <USlideover v-model:open="mobileOpen" title="Navigation">
      <template #body>
        <div class="space-y-3">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            block
            color="neutral"
            :variant="route.path === item.to ? 'soft' : 'ghost'"
            :icon="item.icon"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </UButton>

          <USeparator />

          <UButton
            v-if="auth.isAuthenticated"
            block
            color="error"
            variant="soft"
            icon="i-lucide-log-out"
            @click="handleLogout"
          >
            Log out
          </UButton>

          <UButton
            v-else
            to="/login"
            block
            color="primary"
            trailing-icon="i-lucide-arrow-right"
            @click="mobileOpen = false"
          >
            Sign in
          </UButton>
        </div>
      </template>
    </USlideover>
  </header>
</template>
