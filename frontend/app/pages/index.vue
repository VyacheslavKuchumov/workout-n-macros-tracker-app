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
  <div class="page-stack">
    <UCard class="page-card page-card--hero">
      <div class="intro-grid">
        <div class="stack-lg">
          <div class="page-header">
            <UBadge color="primary" variant="soft" class="pill-badge">Performance dashboard</UBadge>
            <h1 class="page-title">See training consistency, body weight, and load progression in one place.</h1>
            <p class="page-description">
              The dashboard highlights recent sessions, movement-specific progress, and how your scale trend is moving alongside your lifting.
            </p>
          </div>

          <div class="button-row">
            <UButton to="/workouts" color="primary" icon="i-lucide-calendar-plus">
              Plan next workout
            </UButton>
            <UButton to="/weight" color="neutral" variant="outline" icon="i-lucide-scale">
              Log body weight
            </UButton>
          </div>
        </div>

        <div class="feature-panel stack-md">
          <p class="page-eyebrow">Current focus</p>
          <h2 class="section-title">{{ dashboard.exercise_progress.selected_exercise_name || 'Pick an exercise to inspect progress' }}</h2>
          <p class="section-description">
            Use the selector below to compare how your reps and top set load are trending over time.
          </p>

          <USelectMenu
            v-if="dashboard.exercise_options.length"
            v-model="selectedExerciseId"
            class="field-control"
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

    <div class="stats-grid">
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

    <div class="dashboard-grid">
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

    <div class="dashboard-grid">
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

    <UCard class="page-card">
      <template #header>
        <div class="section-header">
          <div class="page-header">
            <h2 class="section-title">Recent workouts</h2>
            <p class="note-text">The last few sessions on your calendar.</p>
          </div>

          <UButton to="/workouts" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
            Open calendar
          </UButton>
        </div>
      </template>

      <div v-if="status === 'pending'" class="dashboard-grid">
        <USkeleton v-for="index in 4" :key="index" class="skeleton-card" />
      </div>

      <div v-else-if="dashboard.recent_workouts.length" class="dashboard-grid">
        <div v-for="workout in dashboard.recent_workouts" :key="workout.id" class="session-card">
          <div class="session-header">
            <div class="stack-sm">
              <p class="muted-label">{{ formatLongDate(workout.workout_date) }}</p>
              <h3 class="section-title">{{ workout.name || 'Workout session' }}</h3>
              <p class="note-text">{{ workout.focus || 'General strength work' }}</p>
            </div>

            <UBadge color="primary" variant="soft" class="pill-badge">
              {{ workout.total_sets }} sets
            </UBadge>
          </div>

          <p class="section-description">{{ workout.notes || 'No extra notes for this session.' }}</p>

          <div class="button-row">
            <UBadge
              v-for="exercise in workout.exercises"
              :key="exercise.id"
              color="neutral"
              variant="outline"
              class="pill-badge"
            >
              {{ exercise.exercise.name }}
            </UBadge>
          </div>

          <p class="table-cell__title">Total volume: {{ formatVolume(workout.total_volume) }}</p>
        </div>
      </div>

      <div v-else class="empty-state">
        <p class="empty-state__title">No workouts logged yet.</p>
        <p class="note-text">Open the calendar and plan your first session to unlock the dashboard trends.</p>
      </div>
    </UCard>
  </div>
</template>
