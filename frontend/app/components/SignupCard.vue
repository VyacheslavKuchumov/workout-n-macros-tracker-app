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
  <div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
    <UCard class="border-white/70 bg-teal-950 text-white shadow-2xl shadow-teal-950/20">
      <div class="space-y-6">
        <div class="space-y-2">
          <p class="text-sm uppercase tracking-[0.22em] text-teal-200">
            Personal training companion
          </p>
          <h1 class="text-3xl font-semibold">
            Build a training log that actually shows your improvement.
          </h1>
        </div>

        <div class="space-y-4 text-sm leading-6 text-teal-50/80">
          <p>Choose workout days on a calendar and save every exercise, set, rep, and load.</p>
          <p>Track body weight separately so strength trends and scale trends live in one place.</p>
          <p>Keep your profile up to date and adjust your goal weight whenever plans change.</p>
        </div>
      </div>
    </UCard>

    <UCard class="border-white/70 bg-white/95 shadow-2xl shadow-slate-900/5">
      <template #header>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold text-slate-900">Create account</h2>
          <p class="text-sm text-slate-500">
            Set up your profile and jump straight into the dashboard.
          </p>
        </div>
      </template>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="First name">
            <UInput v-model="state.first_name" class="w-full" placeholder="Alex" :disabled="loading" />
          </UFormField>

          <UFormField label="Last name">
            <UInput v-model="state.last_name" class="w-full" placeholder="Morgan" :disabled="loading" />
          </UFormField>
        </div>

        <UFormField label="Username" required>
          <UInput v-model="state.username" class="w-full" placeholder="Choose a username" :disabled="loading" />
        </UFormField>

        <UFormField label="Email">
          <UInput v-model="state.email" class="w-full" type="email" placeholder="you@example.com" :disabled="loading" />
        </UFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Password" required>
            <UInput
              v-model="state.password"
              class="w-full"
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
              class="w-full"
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
        <p class="text-sm text-slate-500">
          Already training with us?
          <NuxtLink to="/login" class="font-medium text-teal-700 hover:text-teal-600">
            Sign in instead
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
