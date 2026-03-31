<script setup lang="ts">
const auth = useAuthStore()
const toast = useToast()

const loading = ref(false)
const state = reactive({
  username: '',
  password: ''
})

async function onSubmit() {
  loading.value = true

  try {
    await auth.login({
      username: state.username,
      password: state.password
    })

    toast.add({
      title: 'Welcome back',
      description: 'Your training dashboard is ready.',
      color: 'success'
    })

    await navigateTo('/')
  } catch (error) {
    toast.add({
      title: 'Sign in failed',
      description: error instanceof Error ? error.message : 'Please check your credentials and try again.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-grid">
    <UCard class="page-card page-card--hero">
      <template #header>
        <div class="page-header">
          <UBadge color="primary" variant="soft" class="pill-badge">
            Track each session with intention
          </UBadge>
          <h1 class="page-title">Log workouts, body weight, and real strength progress.</h1>
          <p class="page-description">
            Plan training on a calendar, save every set, and watch reps and load climb over time.
          </p>
        </div>
      </template>

      <div class="feature-grid">
        <div class="feature-tile feature-tile--emerald">
          <p class="feature-tile__eyebrow">Consistency</p>
          <p class="feature-tile__title">Calendar view</p>
        </div>
        <div class="feature-tile feature-tile--sky">
          <p class="feature-tile__eyebrow">Performance</p>
          <p class="feature-tile__title">Set-by-set history</p>
        </div>
        <div class="feature-tile feature-tile--amber">
          <p class="feature-tile__eyebrow">Bodyweight</p>
          <p class="feature-tile__title">Trend snapshots</p>
        </div>
      </div>
    </UCard>

    <UCard class="page-card">
      <template #header>
        <div class="page-header">
          <h2 class="section-title">Sign in</h2>
          <p class="note-text">Pick up where your last workout ended.</p>
        </div>
      </template>

      <form class="form-stack" @submit.prevent="onSubmit">
        <UFormField label="Username" required>
          <UInput
            v-model="state.username"
            class="field-control"
            size="lg"
            placeholder="Your username"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Password" required>
          <UInput
            v-model="state.password"
            class="field-control"
            size="lg"
            type="password"
            placeholder="Your password"
            :disabled="loading"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          :loading="loading"
          :disabled="!state.username || !state.password"
        >
          Open dashboard
        </UButton>
      </form>

      <template #footer>
        <p class="note-text">
          New here?
          <NuxtLink to="/signup" class="auth-link">Create your account</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
