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
  <div class="space-y-8">
    <UCard class="border-white/70 bg-white/90 shadow-2xl shadow-slate-900/5">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <UBadge color="primary" variant="soft" class="rounded-full px-3 py-1">
            Workout calendar
          </UBadge>
          <h1 class="text-3xl font-semibold text-slate-950">
            Choose a day, plan the exercises, and record every set.
          </h1>
          <p class="max-w-2xl text-sm leading-6 text-slate-600">
            One workout is stored for each day, so your calendar stays clean and your progress history stays readable.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
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

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <UCard class="border-white/70 bg-white/90 shadow-xl shadow-slate-900/5">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-2xl font-semibold text-slate-950">{{ formatMonth(currentMonth) }}</h2>
              <p class="text-sm text-slate-500">
                Click any day to inspect or plan the session.
              </p>
            </div>

            <UBadge color="neutral" variant="subtle" class="rounded-full px-3 py-1">
              {{ workouts.length }} scheduled
            </UBadge>
          </div>
        </template>

        <div class="grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.18em] text-slate-400">
          <div v-for="weekday in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="weekday" class="pb-2">
            {{ weekday }}
          </div>
        </div>

        <div class="mt-2 grid grid-cols-7 gap-2">
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

      <UCard class="border-white/70 bg-white/90 shadow-xl shadow-slate-900/5">
        <template #header>
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Selected day</p>
              <h2 class="text-2xl font-semibold text-slate-950">{{ formatLongDate(selectedDate) }}</h2>
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

        <div v-if="workoutsStatus === 'pending'" class="space-y-4">
          <USkeleton class="h-24 rounded-3xl" />
          <USkeleton class="h-24 rounded-3xl" />
        </div>

        <div v-else-if="selectedWorkout" class="space-y-5">
          <div class="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-slate-950">{{ selectedWorkout.name || 'Workout session' }}</h3>
                <p class="mt-1 text-sm text-slate-500">{{ selectedWorkout.focus || 'General training focus' }}</p>
              </div>

              <UBadge color="primary" variant="soft" class="rounded-full px-3 py-1">
                {{ selectedWorkout.total_sets }} sets
              </UBadge>
            </div>

            <p class="mt-4 text-sm leading-6 text-slate-600">
              {{ selectedWorkout.notes || 'No notes recorded for this workout.' }}
            </p>

            <p class="mt-4 text-sm font-medium text-slate-800">
              Total volume: {{ formatVolume(selectedWorkout.total_volume) }}
            </p>
          </div>

          <div
            v-for="exercise in selectedWorkout.exercises"
            :key="exercise.id"
            class="rounded-3xl border border-slate-200/80 bg-white p-5"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ exercise.exercise.muscle_group.name }}</p>
                <h4 class="mt-1 text-lg font-semibold text-slate-950">{{ exercise.exercise.name }}</h4>
              </div>

              <UBadge color="neutral" variant="outline" class="rounded-full px-3 py-1">
                {{ exercise.sets.length }} sets
              </UBadge>
            </div>

            <p class="mt-3 text-sm text-slate-500">{{ exercise.notes || 'No exercise notes.' }}</p>

            <div class="mt-4 grid gap-3">
              <div
                v-for="workoutSet in exercise.sets"
                :key="workoutSet.id"
                class="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              >
                <span class="font-medium text-slate-700">Set {{ workoutSet.order }}</span>
                <span class="text-slate-600">{{ workoutSet.reps }} reps</span>
                <span class="font-semibold text-slate-900">{{ workoutSet.weight_kg }} kg</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <UButton color="neutral" variant="outline" icon="i-lucide-pencil" @click="openEditWorkout(selectedWorkout)">
              Edit session
            </UButton>
            <UButton color="error" variant="soft" icon="i-lucide-trash-2" @click="deleteWorkout">
              Delete session
            </UButton>
          </div>
        </div>

        <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p class="text-lg font-semibold text-slate-900">Nothing planned for this day yet.</p>
          <p class="mt-2 text-sm text-slate-500">
            Choose your exercises, add sets, and drop the session onto the calendar.
          </p>
          <UButton class="mt-5" color="primary" icon="i-lucide-calendar-plus" @click="openCreateWorkout()">
            Create workout
          </UButton>
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
