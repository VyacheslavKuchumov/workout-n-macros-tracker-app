<script setup lang="ts">
import type { Exercise, Workout } from '~/types/api'

const { addMonths, buildCalendarDays, startOfMonth, toIsoDate, toMonthQuery } = useCalendar()
const { formatLongDate, formatMonth, formatShortDate, formatVolume } = useFormatters()
const toast = useToast()
const { $api } = useNuxtApp()

const currentMonth = ref(startOfMonth(new Date()))
const selectedDate = ref(toIsoDate(new Date()))
const editorOpen = ref(false)
const editingWorkout = ref<Workout | null>(null)

const monthQuery = computed(() => toMonthQuery(currentMonth.value))

const { data: workoutsData, refresh: refreshWorkouts, status: workoutsStatus } = await useApiFetch<Workout[]>('/training/workouts/', {
  default: () => [],
  query: computed(() => ({ month: monthQuery.value }))
})

const { data: exercisesData } = await useApiFetch<Exercise[]>('/training/exercises/', {
  default: () => []
})

const workouts = computed(() => workoutsData.value ?? [])
const exercises = computed(() => exercisesData.value ?? [])

const workoutsByDate = computed<Record<string, Workout>>(() => {
  return workouts.value.reduce((accumulator, workout) => {
    accumulator[workout.workout_date] = workout
    return accumulator
  }, {} as Record<string, Workout>)
})

const calendarDays = computed(() => {
  return buildCalendarDays(currentMonth.value).map((day) => ({
    ...day,
    workout: workoutsByDate.value[day.iso] ?? null
  }))
})

const selectedWorkout = computed(() => workoutsByDate.value[selectedDate.value] ?? null)

watch(monthQuery, () => {
  if (!selectedDate.value.startsWith(monthQuery.value)) {
    selectedDate.value = `${monthQuery.value}-01`
  }
}, { immediate: true })

function openCreateWorkout(date = selectedDate.value) {
  selectedDate.value = date
  editingWorkout.value = null
  editorOpen.value = true
}

function openEditWorkout(workout: Workout) {
  selectedDate.value = workout.workout_date
  editingWorkout.value = workout
  editorOpen.value = true
}

async function deleteWorkout() {
  if (!selectedWorkout.value || !confirm('Delete this workout from the calendar?')) {
    return
  }

  try {
    await $api(`/training/workouts/${selectedWorkout.value.id}/`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Workout removed',
      description: 'The selected day is now clear.',
      color: 'success'
    })

    await refreshWorkouts()
  } catch (error) {
    toast.add({
      title: 'Could not delete workout',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="page-stack">
    <UCard class="page-card">
      <div class="section-header">
        <div class="page-header">
          <UBadge color="primary" variant="soft" class="pill-badge">Workout calendar</UBadge>
          <h1 class="page-title">Choose a day, plan the exercises, and record every set.</h1>
          <p class="page-description">
            One workout is stored for each day, so your calendar stays clean and your progress history stays readable.
          </p>
        </div>

        <div class="calendar-actions">
          <UButton color="neutral" variant="outline" icon="i-lucide-chevron-left" @click="currentMonth = addMonths(currentMonth, -1)">
            Previous
          </UButton>
          <UButton color="neutral" variant="outline" @click="currentMonth = startOfMonth(new Date())">
            Today
          </UButton>
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-chevron-right" @click="currentMonth = addMonths(currentMonth, 1)">
            Next
          </UButton>
        </div>
      </div>
    </UCard>

    <div class="dashboard-grid dashboard-grid--sidebar">
      <UCard class="page-card">
        <template #header>
          <div class="section-header">
            <div class="page-header">
              <h2 class="section-title">{{ formatMonth(currentMonth) }}</h2>
              <p class="note-text">Click any day to inspect or plan the session.</p>
            </div>

            <UBadge color="neutral" variant="subtle" class="pill-badge">
              {{ workouts.length }} scheduled
            </UBadge>
          </div>
        </template>

        <div class="calendar-weekdays">
          <div v-for="weekday in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="weekday" class="calendar-weekdays__label">
            {{ weekday }}
          </div>
        </div>

        <div class="calendar-grid">
          <button
            v-for="day in calendarDays"
            :key="day.iso"
            type="button"
            :class="[
              'calendar-cell',
              day.inMonth ? 'calendar-cell--in-month' : 'calendar-cell--out-month',
              day.iso === selectedDate ? 'calendar-cell--selected' : '',
              day.workout ? 'calendar-cell--planned' : '',
              day.isToday ? 'calendar-cell--today' : ''
            ]"
            @click="selectedDate = day.iso"
          >
            <span class="calendar-cell__day">{{ day.day }}</span>
            <span v-if="day.workout" class="calendar-cell__label">
              {{ day.workout.focus || day.workout.name || 'Workout' }}
            </span>
            <span v-else class="calendar-cell__empty">Free day</span>
          </button>
        </div>
      </UCard>

      <UCard class="page-card">
        <template #header>
          <div class="section-header">
            <div class="page-header">
              <p class="page-eyebrow">Selected day</p>
              <h2 class="section-title">{{ formatLongDate(selectedDate) }}</h2>
            </div>

            <UButton
              color="primary"
              icon="i-lucide-plus"
              @click="selectedWorkout ? openEditWorkout(selectedWorkout) : openCreateWorkout()"
            >
              {{ selectedWorkout ? 'Edit workout' : 'Plan workout' }}
            </UButton>
          </div>
        </template>

        <div v-if="workoutsStatus === 'pending'" class="stack-md">
          <USkeleton class="skeleton-card skeleton-card--compact" />
          <USkeleton class="skeleton-card skeleton-card--compact" />
        </div>

        <div v-else-if="selectedWorkout" class="stack-lg">
          <div class="summary-card">
            <div class="session-header">
              <div class="stack-sm">
                <h3 class="section-title">{{ selectedWorkout.name || 'Workout session' }}</h3>
                <p class="note-text">{{ selectedWorkout.focus || 'General training focus' }}</p>
              </div>

              <UBadge color="primary" variant="soft" class="pill-badge">
                {{ selectedWorkout.total_sets }} sets
              </UBadge>
            </div>

            <p class="section-description">{{ selectedWorkout.notes || 'No notes recorded for this workout.' }}</p>

            <p class="table-cell__title">Total volume: {{ formatVolume(selectedWorkout.total_volume) }}</p>
          </div>

          <div v-for="exercise in selectedWorkout.exercises" :key="exercise.id" class="exercise-card">
            <div class="exercise-header">
              <div class="stack-sm">
                <p class="muted-label">{{ exercise.exercise.muscle_group.name }}</p>
                <h4 class="section-title">{{ exercise.exercise.name }}</h4>
              </div>

              <UBadge color="neutral" variant="outline" class="pill-badge">
                {{ exercise.sets.length }} sets
              </UBadge>
            </div>

            <p class="note-text">{{ exercise.notes || 'No exercise notes.' }}</p>

            <div class="set-list">
              <div v-for="workoutSet in exercise.sets" :key="workoutSet.id" class="set-row">
                <span class="table-cell__title">Set {{ workoutSet.order }}</span>
                <span class="table-cell__note">{{ workoutSet.reps }} reps</span>
                <span class="set-row__weight">{{ workoutSet.weight_kg }} kg</span>
              </div>
            </div>
          </div>

          <div class="button-row">
            <UButton color="neutral" variant="outline" icon="i-lucide-pencil" @click="openEditWorkout(selectedWorkout)">
              Edit session
            </UButton>
            <UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="deleteWorkout">
              Delete session
            </UButton>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="stack-md">
            <div class="stack-sm">
              <p class="empty-state__title">Nothing planned for this day yet.</p>
              <p class="note-text">Choose your exercises, add sets, and drop the session onto the calendar.</p>
            </div>
            <div class="button-row button-row--center">
              <UButton color="primary" icon="i-lucide-calendar-plus" @click="openCreateWorkout()">
                Create workout
              </UButton>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <WorkoutFormModal
      v-model:open="editorOpen"
      :date="selectedDate"
      :workout="editingWorkout"
      :exercises="exercises"
      @saved="refreshWorkouts"
    />
  </div>
</template>
