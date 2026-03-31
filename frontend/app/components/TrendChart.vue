<script setup lang="ts">
interface ChartPoint {
  label: string
  value: number
}

const props = withDefaults(defineProps<{
  title: string
  eyebrow?: string
  points: ChartPoint[]
  suffix?: string
  decimals?: number
  accent?: string
}>(), {
  eyebrow: '',
  suffix: '',
  decimals: 1,
  accent: '#0f766e'
})

const normalizedPoints = computed(() => props.points.filter((point) => Number.isFinite(point.value)))

const values = computed(() => normalizedPoints.value.map((point) => point.value))
const minValue = computed(() => Math.min(...values.value, 0))
const maxValue = computed(() => Math.max(...values.value, 0))
const latestValue = computed(() => values.value.at(-1) ?? null)

function getX(index: number) {
  if (normalizedPoints.value.length <= 1) {
    return 160
  }

  return 24 + (index * 272) / (normalizedPoints.value.length - 1)
}

function getY(value: number) {
  if (maxValue.value === minValue.value) {
    return 86
  }

  return 148 - ((value - minValue.value) / (maxValue.value - minValue.value)) * 108
}

const polyline = computed(() => normalizedPoints.value.map((point, index) => `${getX(index)},${getY(point.value)}`).join(' '))
const area = computed(() => {
  if (!normalizedPoints.value.length) {
    return ''
  }

  const firstX = getX(0)
  const lastX = getX(normalizedPoints.value.length - 1)

  return `${polyline.value} ${lastX},160 ${firstX},160`
})

function formatValue(value: number | null) {
  if (value === null) {
    return '--'
  }

  return `${value.toFixed(props.decimals)}${props.suffix ? ` ${props.suffix}` : ''}`
}
</script>

<template>
  <UCard class="border-white/70 bg-white/90 shadow-xl shadow-slate-900/5">
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p v-if="eyebrow" class="text-xs uppercase tracking-[0.18em] text-slate-500">{{ eyebrow }}</p>
          <h3 class="text-xl font-semibold text-slate-950">{{ title }}</h3>
        </div>

        <div class="text-right">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Latest</p>
          <p class="text-2xl font-semibold text-slate-950">{{ formatValue(latestValue) }}</p>
        </div>
      </div>

      <div v-if="normalizedPoints.length" class="space-y-4">
        <svg viewBox="0 0 320 180" class="h-52 w-full">
          <defs>
            <linearGradient id="chartArea" x1="0" x2="0" y1="0" y2="1">
              <stop :stop-color="accent" stop-opacity="0.32" offset="0%" />
              <stop :stop-color="accent" stop-opacity="0.03" offset="100%" />
            </linearGradient>
          </defs>

          <line x1="24" y1="160" x2="296" y2="160" stroke="#cbd5e1" stroke-dasharray="4 6" />
          <line x1="24" y1="106" x2="296" y2="106" stroke="#e2e8f0" stroke-dasharray="4 8" />
          <line x1="24" y1="52" x2="296" y2="52" stroke="#e2e8f0" stroke-dasharray="4 8" />

          <polygon :points="area" fill="url(#chartArea)" />
          <polyline
            :points="polyline"
            fill="none"
            :stroke="accent"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="4"
          />

          <circle
            v-for="(point, index) in normalizedPoints"
            :key="`${point.label}-${index}`"
            :cx="getX(index)"
            :cy="getY(point.value)"
            r="5"
            :fill="accent"
            stroke="white"
            stroke-width="3"
          />
        </svg>

        <div class="grid gap-2 text-xs text-slate-500 sm:grid-cols-4">
          <div
            v-for="point in normalizedPoints.slice(-4)"
            :key="point.label"
            class="rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-2"
          >
            <p>{{ point.label }}</p>
            <p class="mt-1 font-semibold text-slate-900">{{ formatValue(point.value) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        No data yet. Start logging entries and this chart will come to life.
      </div>
    </div>
  </UCard>
</template>
