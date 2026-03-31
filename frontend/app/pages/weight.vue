<script setup lang="ts">
import type { BodyWeightEntry } from '~/types/api'

const { formatLongDate, formatShortDate } = useFormatters()
const toast = useToast()
const { $api } = useNuxtApp()

const editorOpen = ref(false)
const editingEntry = ref<BodyWeightEntry | null>(null)

const { data: entriesData, refresh: refreshEntries, status } = await useApiFetch<BodyWeightEntry[]>('/training/body-weights/', {
  default: () => []
})

const entries = computed(() => entriesData.value ?? [])

const chartPoints = computed(() => [...entries.value]
  .reverse()
  .map((entry) => ({
    label: formatShortDate(entry.entry_date),
    value: Number(entry.weight_kg)
  })))

const tableRows = computed(() => {
  return entries.value.map((entry, index) => {
    const previousEntry = entries.value[index + 1]
    const delta = previousEntry ? Number(entry.weight_kg) - Number(previousEntry.weight_kg) : null

    return {
      ...entry,
      delta
    }
  })
})

const columns = [
  { accessorKey: 'entry_date', header: 'Date' },
  { accessorKey: 'weight_kg', header: 'Weight' },
  { accessorKey: 'delta', header: 'Delta' },
  { accessorKey: 'notes', header: 'Notes' },
  { id: 'actions', header: '' }
]

function openCreate() {
  editingEntry.value = null
  editorOpen.value = true
}

function openEdit(entry: BodyWeightEntry) {
  editingEntry.value = entry
  editorOpen.value = true
}

async function deleteEntry(entry: BodyWeightEntry) {
  if (!confirm('Delete this body weight entry?')) {
    return
  }

  try {
    await $api(`/training/body-weights/${entry.id}/`, {
      method: 'DELETE'
    })

    toast.add({
      title: 'Entry deleted',
      description: 'The weight log has been updated.',
      color: 'success'
    })

    await refreshEntries()
  } catch (error) {
    toast.add({
      title: 'Could not delete entry',
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
          <UBadge color="warning" variant="soft" class="pill-badge">Body weight tracker</UBadge>
          <h1 class="page-title">Keep a clean scale log next to your workout history.</h1>
          <p class="page-description">
            Frequent entries make the dashboard graph more useful and help separate trend from noise.
          </p>
        </div>

        <UButton color="primary" icon="i-lucide-plus" @click="openCreate">
          Log weight
        </UButton>
      </div>
    </UCard>

    <TrendChart
      eyebrow="90-day trend"
      title="Body weight progression"
      :points="chartPoints"
      suffix="kg"
      :decimals="1"
      accent="#d97706"
    />

    <UCard class="page-card">
      <UTable :data="tableRows" :columns="columns" :loading="status === 'pending'">
        <template #entry_date-cell="{ row }">
          <div class="table-cell__title">{{ formatLongDate(row.original.entry_date) }}</div>
        </template>

        <template #weight_kg-cell="{ row }">
          <div class="table-cell__title">{{ row.original.weight_kg }} kg</div>
        </template>

        <template #delta-cell="{ row }">
          <div
            :class="[
              'weight-delta',
              row.original.delta === null
                ? 'weight-delta--empty'
                : row.original.delta >= 0
                  ? 'weight-delta--up'
                  : 'weight-delta--down'
            ]"
          >
            {{ row.original.delta === null ? '--' : `${row.original.delta > 0 ? '+' : ''}${row.original.delta.toFixed(1)} kg` }}
          </div>
        </template>

        <template #notes-cell="{ row }">
          <div class="table-cell__note">{{ row.original.notes || 'No notes.' }}</div>
        </template>

        <template #actions-cell="{ row }">
          <div class="row-actions">
            <UButton color="neutral" variant="ghost" icon="i-lucide-pencil" @click="openEdit(row.original)" />
            <UButton color="error" variant="ghost" icon="i-lucide-trash-2" @click="deleteEntry(row.original)" />
          </div>
        </template>
      </UTable>
    </UCard>

    <WeightEntryModal
      v-model:open="editorOpen"
      :entry-date="new Date().toISOString().slice(0, 10)"
      :entry="editingEntry"
      @saved="refreshEntries"
    />
  </div>
</template>
