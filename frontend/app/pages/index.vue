<script setup lang="ts">
import type { DashboardResponse } from '~/types/api'

const { formatLongDate, formatShortDate, formatVolume, formatWeight } = useFormatters()

function emptyDashboard(): DashboardResponse {
  return {
    summary: {
      total_workouts: 0,
      workouts_this_month: 0,
      upcoming_workouts: 0,
      total_sets_last_30_days: 0,
      latest_body_weight: null
    },
    recent_workouts: [],
    body_weight_series: [],
    exercise_options: [],
    exercise_progress: {
      selected_exercise_id: null,
      selected_exercise_name: null,
      series: []
    }
  }
}

const selectedExerciseId = ref<number | null>(null)

const { data, status } = await useApiFetch<DashboardResponse>('/training/dashboard/', {
  default: emptyDashboard,
  query: computed(() => selectedExerciseId.value ? { exercise_id: selectedExerciseId.value } : {})
})

watch(
  () => data.value?.exercise_progress.selected_exercise_id,
  (value) => {
    if (!selectedExerciseId.value && value) {
      selectedExerciseId.value = value
    }
  },
  { immediate: true }
)

const dashboard = computed(() => data.value ?? emptyDashboard())

const bodyWeightPoints = computed(() => dashboard.value.body_weight_series.map((point) => ({
  label: formatShortDate(point.date),
  value: Number(point.weight_kg ?? 0)
})))

const exerciseWeightPoints = computed(() => dashboard.value.exercise_progress.series.map((point) => ({
  label: formatShortDate(point.date),
  value: Number(point.max_weight ?? 0)
})))

const exerciseRepsPoints = computed(() => dashboard.value.exercise_progress.series.map((point) => ({
  label: formatShortDate(point.date),
  value: Number(point.max_reps ?? 0)
})))

const exerciseVolumePoints = computed(() => dashboard.value.exercise_progress.series.map((point) => ({
  label: formatShortDate(point.date),
  value: Number(point.volume ?? 0)
})))
</script>

<template>
  <div class="space-y-8">
    <UCard class="overflow-hidden border-white/70 bg-white/90 shadow-2xl shadow-slate-900/5">
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-5">
          <div class="space-y-3">
            <UBadge color="primary" variant="soft" class="rounded-full px-3 py-1">
              Performance dashboard
            </UBadge>
            <h1 class="text-4xl font-semibold text-slate-950">
              See training consistency, body weight, and load progression in one place.
            </h1>
            <p class="max-w-2xl text-sm leading-6 text-slate-600">
              The dashboard highlights recent sessions, movement-specific progress, and how your scale trend is moving alongside your lifting.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton to="/workouts" color="primary" icon="i-lucide-calendar-plus">
              Plan next workout
            </UButton>
            <UButton to="/weight" color="neutral" variant="outline" icon="i-lucide-scale">
              Log body weight
            </UButton>
          </div>
        </div>

        <div class="rounded-[2rem] bg-slate-950 p-6 text-white">
          <p class="text-xs uppercase tracking-[0.22em] text-teal-200">Current focus</p>
          <h2 class="mt-3 text-3xl font-semibold">
            {{ dashboard.exercise_progress.selected_exercise_name || 'Pick an exercise to inspect progress' }}
          </h2>
          <p class="mt-3 text-sm leading-6 text-slate-300">
            Use the selector below to compare how your reps and top set load are trending over time.
          </p>

          <USelectMenu
            v-if="dashboard.exercise_options.length"
            v-model="selectedExerciseId"
            class="mt-5 w-full"
            color="neutral"
            variant="subtle"
            :items="dashboard.exercise_options"
            value-key="id"
            label-key="name"
            placeholder="Choose an exercise"
          />
        </div>
      </div>
    </UCard>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Total workouts"
        :value="dashboard.summary.total_workouts"
        description="All sessions currently logged in your timeline."
        icon="i-lucide-dumbbell"
        tone="teal"
      />
      <MetricCard
        title="This month"
        :value="dashboard.summary.workouts_this_month"
        description="Completed sessions in the current month."
        icon="i-lucide-calendar-range"
        tone="sky"
      />
      <MetricCard
        title="Upcoming"
        :value="dashboard.summary.upcoming_workouts"
        description="Planned workout days in the coming 90 days."
        icon="i-lucide-calendar-plus-2"
        tone="amber"
      />
      <MetricCard
        title="Latest body weight"
        :value="formatWeight(dashboard.summary.latest_body_weight)"
        description="Your most recent scale entry."
        icon="i-lucide-scale"
        tone="rose"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <TrendChart
        eyebrow="Body weight"
        title="Scale trend over the last 90 days"
        :points="bodyWeightPoints"
        suffix="kg"
        :decimals="1"
        accent="#d97706"
      />

      <TrendChart
        eyebrow="Exercise progress"
        :title="dashboard.exercise_progress.selected_exercise_name ? `${dashboard.exercise_progress.selected_exercise_name} max weight` : 'Max weight trend'"
        :points="exerciseWeightPoints"
        suffix="kg"
        :decimals="1"
        accent="#0f766e"
      />
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <TrendChart
        eyebrow="Rep performance"
        :title="dashboard.exercise_progress.selected_exercise_name ? `${dashboard.exercise_progress.selected_exercise_name} best reps` : 'Best reps trend'"
        :points="exerciseRepsPoints"
        :decimals="0"
        accent="#0284c7"
      />

      <TrendChart
        eyebrow="Session output"
        :title="dashboard.exercise_progress.selected_exercise_name ? `${dashboard.exercise_progress.selected_exercise_name} volume` : 'Exercise volume trend'"
        :points="exerciseVolumePoints"
        suffix="kg"
        :decimals="0"
        accent="#be123c"
      />
    </div>

    <UCard class="border-white/70 bg-white/90 shadow-xl shadow-slate-900/5">
      <template #header>
        <div class="flex items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl font-semibold text-slate-950">Recent workouts</h2>
            <p class="text-sm text-slate-500">
              The last few sessions on your calendar.
            </p>
          </div>

          <UButton to="/workouts" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
            Open calendar
          </UButton>
        </div>
      </template>

      <div v-if="status === 'pending'" class="grid gap-4 lg:grid-cols-2">
        <USkeleton v-for="index in 4" :key="index" class="h-32 rounded-3xl" />
      </div>

      <div v-else-if="dashboard.recent_workouts.length" class="grid gap-4 lg:grid-cols-2">
        <div
          v-for="workout in dashboard.recent_workouts"
          :key="workout.id"
          class="rounded-3xl border border-slate-200/80 bg-slate-50/90 p-5"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ formatLongDate(workout.workout_date) }}</p>
              <h3 class="mt-2 text-xl font-semibold text-slate-950">{{ workout.name || 'Workout session' }}</h3>
              <p class="mt-1 text-sm text-slate-500">{{ workout.focus || 'General strength work' }}</p>
            </div>

            <UBadge color="primary" variant="soft" class="rounded-full px-3 py-1">
              {{ workout.total_sets }} sets
            </UBadge>
          </div>

          <p class="mt-4 text-sm leading-6 text-slate-600">
            {{ workout.notes || 'No extra notes for this session.' }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <UBadge
              v-for="exercise in workout.exercises"
              :key="exercise.id"
              color="neutral"
              variant="outline"
              class="rounded-full px-3 py-1"
            >
              {{ exercise.exercise.name }}
            </UBadge>
          </div>

          <div class="mt-4 text-sm font-medium text-slate-700">
            Total volume: {{ formatVolume(workout.total_volume) }}
          </div>
        </div>
      </div>

      <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
        <p class="text-lg font-semibold text-slate-900">No workouts logged yet.</p>
        <p class="mt-2 text-sm text-slate-500">
          Open the calendar and plan your first session to unlock the dashboard trends.
        </p>
      </div>
    </UCard>
  </div>
</template>
