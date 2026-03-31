<script setup lang="ts">
import type { BodyWeightEntry } from '~/types/api'

const props = defineProps<{
  open: boolean
  entryDate: string
  entry?: BodyWeightEntry | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  saved: []
}>()

const toast = useToast()
const { $api } = useNuxtApp()

const isSaving = ref(false)
const state = reactive({
  entry_date: '',
  weight_kg: 0,
  notes: ''
})

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

watch(
  () => [props.open, props.entry, props.entryDate],
  () => {
    state.entry_date = props.entry?.entry_date ?? props.entryDate
    state.weight_kg = Number(props.entry?.weight_kg ?? 0)
    state.notes = props.entry?.notes ?? ''
  },
  { immediate: true }
)

async function saveEntry() {
  if (!state.entry_date || state.weight_kg <= 0) {
    return
  }

  isSaving.value = true

  try {
    const body = {
      entry_date: state.entry_date,
      weight_kg: Number(state.weight_kg).toFixed(2),
      notes: state.notes
    }

    if (props.entry) {
      await $api(`/training/body-weights/${props.entry.id}/`, {
        method: 'PATCH',
        body
      })
    } else {
      await $api('/training/body-weights/', {
        method: 'POST',
        body
      })
    }

    toast.add({
      title: props.entry ? 'Entry updated' : 'Weight logged',
      description: 'The dashboard graph has your latest data.',
      color: 'success'
    })

    emit('saved')
    isOpen.value = false
  } catch (error) {
    toast.add({
      title: 'Could not save entry',
      description: error instanceof Error ? error.message : 'Please try again.',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="entry ? 'Edit weight entry' : 'Log body weight'">
    <template #body>
      <form class="space-y-4" @submit.prevent="saveEntry">
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Date" required>
            <UInput v-model="state.entry_date" class="w-full" type="date" />
          </UFormField>

          <UFormField label="Weight (kg)" required>
            <UInput v-model="state.weight_kg" class="w-full" type="number" min="1" step="0.1" />
          </UFormField>
        </div>

        <UFormField label="Notes">
          <UTextarea v-model="state.notes" class="w-full" :rows="4" placeholder="How did you feel, time of day, hydration, etc." />
        </UFormField>
      </form>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton color="primary" :loading="isSaving" :disabled="!state.entry_date || state.weight_kg <= 0" @click="saveEntry">
          {{ entry ? 'Save changes' : 'Log entry' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
