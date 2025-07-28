<template>
  <div class="flex items-center justify-center">
    <div
      :class="[
        'spinner',
        sizeClasses,
        colorClasses
      ]"
    ></div>
    <span v-if="text" :class="textClasses" class="ml-3">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4'
    case 'lg':
      return 'h-8 w-8'
    default:
      return 'h-6 w-6'
  }
})

const colorClasses = computed(() => {
  switch (props.color) {
    case 'secondary':
      return 'border-gray-300 border-t-purple-600'
    case 'white':
      return 'border-gray-300 border-t-white'
    default:
      return 'border-gray-300 border-t-blue-600'
  }
})

const textClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm'
    case 'lg':
      return 'text-lg'
    default:
      return 'text-base'
  }
})
</script>