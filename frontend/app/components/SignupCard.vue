<script setup lang="ts">
const auth = useAuthStore()
const toast = useToast()

const loading = ref(false)
const state = reactive({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  confirmPassword: ''
})

const passwordsMatch = computed(() => state.password === state.confirmPassword)

async function onSubmit() {
  if (!passwordsMatch.value) {
    return
  }

  loading.value = true

  try {
    await auth.signup({
      username: state.username,
      email: state.email,
      first_name: state.first_name,
      last_name: state.last_name,
      password: state.password
    })

    toast.add({
      title: 'Account created',
      description: 'You can start planning workouts right away.',
      color: 'success'
    })

    await navigateTo('/')
  } catch (error) {
    toast.add({
      title: 'Could not create account',
      description: error instanceof Error ? error.message : 'Please review the form and try again.',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-grid auth-grid--reversed">
    <UCard class="page-card feature-panel">
      <div class="stack-lg">
        <div class="page-header">
          <p class="page-eyebrow">Personal training companion</p>
          <h1 class="page-title">Build a training log that actually shows your improvement.</h1>
        </div>

        <div class="stack-md">
          <p class="section-description">Choose workout days on a calendar and save every exercise, set, rep, and load.</p>
          <p class="section-description">Track body weight separately so strength trends and scale trends live in one place.</p>
          <p class="section-description">Keep your profile up to date and adjust your goal weight whenever plans change.</p>
        </div>
      </div>
    </UCard>

    <UCard class="page-card">
      <template #header>
        <div class="page-header">
          <h2 class="section-title">Create account</h2>
          <p class="note-text">Set up your profile and jump straight into the dashboard.</p>
        </div>
      </template>

      <form class="form-stack" @submit.prevent="onSubmit">
        <div class="form-grid">
          <UFormField label="First name">
            <UInput v-model="state.first_name" class="field-control" placeholder="Alex" :disabled="loading" />
          </UFormField>

          <UFormField label="Last name">
            <UInput v-model="state.last_name" class="field-control" placeholder="Morgan" :disabled="loading" />
          </UFormField>
        </div>

        <UFormField label="Username" required>
          <UInput v-model="state.username" class="field-control" placeholder="Choose a username" :disabled="loading" />
        </UFormField>

        <UFormField label="Email">
          <UInput v-model="state.email" class="field-control" type="email" placeholder="you@example.com" :disabled="loading" />
        </UFormField>

        <div class="form-grid">
          <UFormField label="Password" required>
            <UInput
              v-model="state.password"
              class="field-control"
              type="password"
              placeholder="At least 8 characters"
              :disabled="loading"
            />
          </UFormField>

          <UFormField
            label="Confirm password"
            required
            :error="state.confirmPassword && !passwordsMatch ? 'Passwords do not match.' : undefined"
          >
            <UInput
              v-model="state.confirmPassword"
              class="field-control"
              type="password"
              placeholder="Repeat password"
              :disabled="loading"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          block
          size="lg"
          color="primary"
          :loading="loading"
          :disabled="!state.username || state.password.length < 8 || !passwordsMatch"
        >
          Create my account
        </UButton>
      </form>

      <template #footer>
        <p class="note-text">
          Already training with us?
          <NuxtLink to="/login" class="auth-link">Sign in instead</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
