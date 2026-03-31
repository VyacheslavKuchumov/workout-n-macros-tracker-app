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
  <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
    <UCard class="border-white/70 bg-white/85 shadow-2xl shadow-slate-900/5">
      <template #header>
        <div class="space-y-3">
          <UBadge color="primary" variant="soft" class="rounded-full px-3 py-1">
            Track each session with intention
          </UBadge>
          <div class="space-y-2">
            <h1 class="text-3xl font-semibold text-slate-900">
              Log workouts, body weight, and real strength progress.
            </h1>
            <p class="max-w-xl text-sm leading-6 text-slate-600">
              Plan training on a calendar, save every set, and watch reps and load climb over time.
            </p>
          </div>
        </div>
      </template>

      <div class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-emerald-700">Consistency</p>
          <p class="mt-3 text-2xl font-semibold text-emerald-950">Calendar view</p>
        </div>
        <div class="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-sky-700">Performance</p>
          <p class="mt-3 text-2xl font-semibold text-sky-950">Set-by-set history</p>
        </div>
        <div class="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-amber-700">Bodyweight</p>
          <p class="mt-3 text-2xl font-semibold text-amber-950">Trend snapshots</p>
        </div>
      </div>
    </UCard>

    <UCard class="border-white/70 bg-white/95 shadow-2xl shadow-slate-900/5">
      <template #header>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold text-slate-900">Sign in</h2>
          <p class="text-sm text-slate-500">
            Pick up where your last workout ended.
          </p>
        </div>
      </template>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <UFormField label="Username" required>
          <UInput
            v-model="state.username"
            class="w-full"
            size="lg"
            placeholder="Your username"
            :disabled="loading"
          />
        </UFormField>

        <UFormField label="Password" required>
          <UInput
            v-model="state.password"
            class="w-full"
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
        <p class="text-sm text-slate-500">
          New here?
          <NuxtLink to="/signup" class="font-medium text-teal-700 hover:text-teal-600">
            Create your account
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
