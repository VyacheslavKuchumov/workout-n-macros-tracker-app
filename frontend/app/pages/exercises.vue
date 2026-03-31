<script setup lang="ts">
import type { Exercise, MuscleGroup } from '~/types/api'

const search = ref('')
const editorOpen = ref(false)
const editingExercise = ref<Exercise | null>(null)
const toast = useToast()
const { $api } = useNuxtApp()

const { data: exerciseData, refresh: refreshExercises, status } = await useApiFetch<Exercise[]>('/training/exercises/', {
  default: () => []
})

const { data: muscleGroupsData } = await useApiFetch<MuscleGroup[]>('/training/muscle-groups/', {
  default: () => []
})

const exercises = computed(() => exerciseData.value ?? [])
const muscleGroups = computed(() => muscleGroupsData.value ?? [])

const filteredExercises = computed(() => {
  if (!search.value) {
    return exercises.value
  }

  return exercises.value.filter((exercise) => {
    const haystack = `${exercise.name} ${exercise.muscle_group.name} ${exercise.notes}`.toLowerCase()
    return haystack.includes(search.value.toLowerCase())
  })
})

const columns = [
  { accessorKey: 'name', header: 'Exercise' },
  { accessorKey: 'muscle_group', header: 'Muscle group' },
  { accessorKey: 'status', header: 'Status' },
  { id: 'actions', header: '' }
]

function openCreate() {
  editingExercise.value = null
  editorOpen.value = true
}

function openEdit(exercise: Exercise) {
  editingExercise.value = exercise
  editorOpen.value = true
}

async function toggleArchive(exercise: Exercise) {
  try {
    await $api(`/training/exercises/${exercise.id}/`, {
      method: 'PATCH',
      body: {
        is_archived: !exercise.is_archived,
        name: exercise.name,
        notes: exercise.notes,
        muscle_group_id: exercise.muscle_group.id
      }
    })

    toast.add({
      title: exercise.is_archived ? 'Exercise restored' : 'Exercise archived',
      description: exercise.is_archived
        ? 'It is available again in workout planning.'
        : 'It will stay in history but leave quick selection.',
      color: 'success'
    })

    await refreshExercises()
  } catch (error) {
    toast.add({
      title: 'Could not update exercise',
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
          <UBadge color="primary" variant="soft" class="pill-badge">Exercise library</UBadge>
          <h1 class="page-title">Build the movements you want available in the workout planner.</h1>
          <p class="page-description">
            Keep the library tidy by archiving exercises you no longer use while preserving old workout history.
          </p>
        </div>

        <div class="button-row">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            class="toolbar-search"
            placeholder="Search exercises"
          />
          <UButton color="primary" icon="i-lucide-plus" @click="openCreate">
            Add exercise
          </UButton>
        </div>
      </div>
    </UCard>

    <UCard class="page-card">
      <UTable :data="filteredExercises" :columns="columns" :loading="status === 'pending'">
        <template #name-cell="{ row }">
          <div class="table-cell">
            <p class="table-cell__title">{{ row.original.name }}</p>
            <p class="table-cell__note">{{ row.original.notes || 'No notes saved for this exercise yet.' }}</p>
          </div>
        </template>

        <template #muscle_group-cell="{ row }">
          <UBadge color="neutral" variant="outline" class="pill-badge">
            {{ row.original.muscle_group.name }}
          </UBadge>
        </template>

        <template #status-cell="{ row }">
          <UBadge :color="row.original.is_archived ? 'warning' : 'success'" variant="soft" class="pill-badge">
            {{ row.original.is_archived ? 'Archived' : 'Active' }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="row-actions">
            <UButton color="neutral" variant="ghost" icon="i-lucide-pencil" @click="openEdit(row.original)" />
            <UButton
              color="neutral"
              variant="ghost"
              :icon="row.original.is_archived ? 'i-lucide-archive-restore' : 'i-lucide-archive'"
              @click="toggleArchive(row.original)"
            />
          </div>
        </template>

        <template #empty>
          <div class="empty-state">
            <p class="empty-state__title">Your exercise library is empty.</p>
            <p class="note-text">Add a few lifts so the calendar planner has something to work with.</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <ExerciseFormModal
      v-model:open="editorOpen"
      :exercise="editingExercise"
      :muscle-groups="muscleGroups"
      @saved="refreshExercises"
    />
  </div>
</template>
