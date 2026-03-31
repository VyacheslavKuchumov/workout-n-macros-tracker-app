<script setup lang="ts">
import type { Exercise, MuscleGroup } from '~/types/api'

const props = defineProps<{
  open: boolean
  exercise?: Exercise | null
  muscleGroups: MuscleGroup[]
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
  notes: '',
  muscle_group_id: undefined as number | undefined,
  is_archived: false
})

const isEditing = computed(() => Boolean(props.exercise))
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

function resetForm() {
  state.name = props.exercise?.name ?? ''
  state.notes = props.exercise?.notes ?? ''
  state.muscle_group_id = props.exercise?.muscle_group.id
  state.is_archived = props.exercise?.is_archived ?? false
}

watch(
  () => [props.open, props.exercise],
  () => {
    resetForm()
  },
  { immediate: true }
)

async function saveExercise() {
  if (!state.name || !state.muscle_group_id) {
    return
  }

  isSaving.value = true

  try {
    const body = {
      name: state.name,
      notes: state.notes,
      muscle_group_id: state.muscle_group_id,
      is_archived: state.is_archived
    }

    if (props.exercise) {
      await $api(`/training/exercises/${props.exercise.id}/`, {
        method: 'PATCH',
        body
      })
    } else {
      await $api('/training/exercises/', {
        method: 'POST',
        body
      })
    }

    toast.add({
      title: props.exercise ? 'Exercise updated' : 'Exercise created',
      description: 'Your library is ready for the workout planner.',
      color: 'success'
    })

    emit('saved')
    isOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Could not save exercise',
      description: error instanceof Error ? error.message : 'Please review the form and try again.',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="isEditing ? 'Edit exercise' : 'Create exercise'">
    <template #body>
      <form class="space-y-4" @submit.prevent="saveExercise">
        <UFormField label="Exercise name" required>
          <UInput v-model="state.name" class="w-full" placeholder="Incline dumbbell press" />
        </UFormField>

        <UFormField label="Muscle group" required>
          <USelectMenu
            v-model="state.muscle_group_id"
            class="w-full"
            :items="muscleGroups"
            value-key="id"
            label-key="name"
            placeholder="Choose a muscle group"
          />
        </UFormField>

        <UFormField label="Notes">
          <UTextarea v-model="state.notes" class="w-full" :rows="4" placeholder="Any cues or setup reminders..." />
        </UFormField>

        <UCheckbox v-model="state.is_archived" label="Archive this exercise from quick selection" />
      </form>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton color="primary" :loading="isSaving" :disabled="!state.name || !state.muscle_group_id" @click="saveExercise">
          {{ isEditing ? 'Save changes' : 'Create exercise' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
