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
    <div class="metric-card__body">
      <div class="stack-sm">
        <p class="metric-card__label">{{ title }}</p>
        <p class="metric-card__value">{{ value }}</p>
        <p class="metric-card__description">{{ description }}</p>
      </div>

      <div class="metric-card__icon">
        <UIcon :name="icon" class="metric-card__symbol" />
      </div>
    </div>
  </UCard>
</template>
