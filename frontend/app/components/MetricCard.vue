<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  description: string
  icon: string
  tone?: 'teal' | 'amber' | 'sky' | 'rose'
}>()
</script>

<template>
  <UCard :class="['metric-card', tone ? `metric-card--${tone}` : 'metric-card--teal']">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">{{ title }}</p>
        <p class="text-3xl font-semibold text-slate-950">{{ value }}</p>
        <p class="text-sm text-slate-600">{{ description }}</p>
      </div>

      <div class="metric-card__icon">
        <UIcon :name="icon" class="size-5" />
      </div>
    </div>
  </UCard>
</template>
