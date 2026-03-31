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
  <header class="topbar">
    <UContainer class="topbar__inner">
      <NuxtLink to="/" class="brand">
        <div class="brand__mark">
          <UIcon name="i-lucide-activity" class="brand__icon" />
        </div>

        <div>
          <p class="brand__eyebrow">Workout Tracker</p>
          <p class="brand__text">Calendar planning and strength trends</p>
        </div>
      </NuxtLink>

      <div v-if="auth.isAuthenticated" class="topbar__nav">
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

      <div class="topbar__actions">
        <UBadge
          v-if="auth.user"
          color="neutral"
          variant="subtle"
          class="pill-badge"
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
        class="topbar__menu"
        color="neutral"
        variant="ghost"
        icon="i-lucide-menu"
        @click="mobileOpen = true"
      />
    </UContainer>

    <USlideover v-model:open="mobileOpen" title="Navigation">
      <template #body>
        <div class="stack-md">
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
