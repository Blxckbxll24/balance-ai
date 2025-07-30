<template>
  <div class="flex items-center">
    <ArrowTrendingUpIcon 
      v-if="trend === 'up'" 
      class="w-4 h-4 text-green-500" 
    />
    <ArrowTrendingDownIcon 
      v-else-if="trend === 'down'" 
      class="w-4 h-4 text-red-500" 
    />
    <MinusIcon 
      v-else 
      class="w-4 h-4 text-gray-500" 
    />
    <span 
      :class="[
        'text-xs ml-1',
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
      ]"
    >
      {{ percentage }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ArrowTrendingUpIcon, 
  MinusIcon 
} from '@heroicons/vue/24/outline'
import { ArrowTrendingDownIcon } from '@heroicons/vue/24/solid'

interface Props {
  value: number
  previous: number
}

const props = defineProps<Props>()

const trend = computed(() => {
  const diff = props.value - props.previous
  if (diff > 0) return 'up'
  if (diff < 0) return 'down'
  return 'neutral'
})

const percentage = computed(() => {
  if (props.previous === 0) return '0.0'
  const change = ((props.value - props.previous) / props.previous) * 100
  return Math.abs(change).toFixed(1)
})
</script>