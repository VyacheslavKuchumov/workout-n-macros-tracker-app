<script setup lang="ts">
import type { Exercise, Workout, WorkoutPayload } from '~/types/api'

interface WorkoutSetState {
  order: number
  reps: number
  weight_kg: number
}

interface WorkoutExerciseState {
  exercise_id?: number
  order: number
  notes: string
  sets: WorkoutSetState[]
}

const props = defineProps<{
  open: boolean
  date: string
  workout?: Workout | null
  exercises: Exercise[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const toast = useToast()
const { $api } = useNuxtApp()

const isSaving = ref(false)
const state = reactive({
  name: '',
  focus: '',
  notes: '',
  exercises: [] as WorkoutExerciseState[]
})

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const activeExercises = computed(() => props.exercises.filter((exercise) => !exercise.is_archived))

function createSet(order: number): WorkoutSetState {
  return {
    order,
    reps: 8,
    weight_kg: 0
  }
}

function createExercise(order: number): WorkoutExerciseState {
  return {
    order,
    notes: '',
    sets: [createSet(1)]
  }
}

function normalizeOrders() {
  state.exercises = state.exercises.map((exercise, exerciseIndex) => ({
    ...exercise,
    order: exerciseIndex + 1,
    sets: exercise.sets.map((workoutSet, setIndex) => ({
      ...workoutSet,
      order: setIndex + 1
    }))
  }))
}

function resetForm() {
  state.name = props.workout?.name ?? ''
  state.focus = props.workout?.focus ?? ''
  state.notes = props.workout?.notes ?? ''
  state.exercises = props.workout
    ? props.workout.exercises.map((exercise, index) => ({
        exercise_id: exercise.exercise.id,
        order: index + 1,
        notes: exercise.notes,
        sets: exercise.sets.map((workoutSet, setIndex) => ({
          order: setIndex + 1,
          reps: workoutSet.reps,
          weight_kg: Number(workoutSet.weight_kg)
        }))
      }))
    : [createExercise(1)]
}

watch(
  () => [props.open, props.workout, props.date],
  () => {
    resetForm()
  },
  { immediate: true }
)

const canSave = computed(() => {
  return state.exercises.length > 0 && state.exercises.every((exercise) => {
    return exercise.exercise_id && exercise.sets.length > 0 && exercise.sets.every((workoutSet) => workoutSet.reps > 0)
  })
})

function addExerciseRow() {
  state.exercises.push(createExercise(state.exercises.length + 1))
}

function removeExerciseRow(index: number) {
  state.exercises.splice(index, 1)

  if (!state.exercises.length) {
    state.exercises.push(createExercise(1))
  }

  normalizeOrders()
}

function addSet(exerciseIndex: number) {
  state.exercises[exerciseIndex]?.sets.push(createSet(state.exercises[exerciseIndex].sets.length + 1))
}

function removeSet(exerciseIndex: number, setIndex: number) {
  state.exercises[exerciseIndex]?.sets.splice(setIndex, 1)

  if (!state.exercises[exerciseIndex]?.sets.length) {
    state.exercises[exerciseIndex]?.sets.push(createSet(1))
  }

  normalizeOrders()
}

async function saveWorkout() {
  if (!canSave.value) {
    return
  }

  isSaving.value = true

  try {
    const payload: WorkoutPayload = {
      name: state.name,
      workout_date: props.workout?.workout_date ?? props.date,
      focus: state.focus,
      notes: state.notes,
      exercises: state.exercises.map((exercise, index) => ({
        exercise_id: Number(exercise.exercise_id),
        order: index + 1,
        notes: exercise.notes,
        sets: exercise.sets.map((workoutSet, setIndex) => ({
          order: setIndex + 1,
          reps: Number(workoutSet.reps),
          weight_kg: Number(workoutSet.weight_kg)
        }))
      }))
    }

    if (props.workout) {
      await $api(`/training/workouts/${props.workout.id}/`, {
        method: 'PATCH',
        body: payload
      })
    } else {
      await $api('/training/workouts/', {
        method: 'POST',
        body: payload
      })
    }

    toast.add({
      title: props.workout ? 'Workout updated' : 'Workout saved',
      description: 'Your calendar and dashboard have been refreshed.',
      color: 'success'
    })

    emit('saved')
    isOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Could not save workout',
      description: error instanceof Error ? error.message : 'Please review the workout and try again.',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="workout ? 'Edit workout' : 'Plan workout'"
    :description="date"
    :content="{ class: 'max-w-4xl' }"
  >
    <template #body>
      <div class="space-y-5">
        <div v-if="!activeExercises.length" class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          Create at least one exercise in your library before building a workout.
          <NuxtLink to="/exercises" class="font-semibold underline decoration-2 underline-offset-4">
            Open exercise library
          </NuxtLink>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Workout title">
            <UInput v-model="state.name" class="w-full" placeholder="Upper strength" />
          </UFormField>

          <UFormField label="Focus">
            <UInput v-model="state.focus" class="w-full" placeholder="Heavy bench + rows" />
          </UFormField>
        </div>

        <UFormField label="Notes">
          <UTextarea v-model="state.notes" class="w-full" :rows="3" placeholder="Warm-up notes, equipment, how the session felt..." />
        </UFormField>

        <div class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-semibold text-slate-900">Exercises and sets</h3>
              <p class="text-sm text-slate-500">Log the order, reps, and weight for each movement.</p>
            </div>

            <UButton color="neutral" variant="outline" icon="i-lucide-plus" @click="addExerciseRow">
              Add exercise
            </UButton>
          </div>

          <div v-for="(exercise, exerciseIndex) in state.exercises" :key="exerciseIndex" class="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
            <div class="mb-4 flex items-center justify-between gap-3">
              <div class="flex-1">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Exercise {{ exerciseIndex + 1 }}</p>
                <USelectMenu
                  v-model="exercise.exercise_id"
                  class="mt-2 w-full"
                  :items="activeExercises"
                  value-key="id"
                  label-key="name"
                  placeholder="Choose exercise"
                />
              </div>

              <UButton color="error" variant="ghost" icon="i-lucide-trash-2" @click="removeExerciseRow(exerciseIndex)" />
            </div>

            <UFormField label="Exercise notes">
              <UInput v-model="exercise.notes" class="w-full" placeholder="Tempo, pause, grip, setup..." />
            </UFormField>

            <div class="mt-4 space-y-3">
              <div v-for="(workoutSet, setIndex) in exercise.sets" :key="setIndex" class="grid gap-3 rounded-2xl border border-white bg-white p-3 sm:grid-cols-[0.8fr_1fr_1fr_auto]">
                <UFormField label="Set">
                  <UInput :model-value="setIndex + 1" class="w-full" disabled />
                </UFormField>

                <UFormField label="Reps">
                  <UInput v-model="workoutSet.reps" class="w-full" type="number" min="1" step="1" />
                </UFormField>

                <UFormField label="Weight (kg)">
                  <UInput v-model="workoutSet.weight_kg" class="w-full" type="number" min="0" step="0.5" />
                </UFormField>

                <div class="flex items-end">
                  <UButton color="error" variant="ghost" icon="i-lucide-x" @click="removeSet(exerciseIndex, setIndex)" />
                </div>
              </div>

              <UButton color="neutral" variant="soft" icon="i-lucide-plus" @click="addSet(exerciseIndex)">
                Add set
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton color="primary" :loading="isSaving" :disabled="!activeExercises.length || !canSave" @click="saveWorkout">
          {{ workout ? 'Save workout' : 'Add to calendar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
