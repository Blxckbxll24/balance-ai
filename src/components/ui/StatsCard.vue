<template>
  <div class="card p-6">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div
          :class="[
            'flex items-center justify-center h-12 w-12 rounded-lg',
            iconBgColor
          ]"
        >
          <component
            v-if="icon"
            :is="getIcon(icon)"
            :class="['h-6 w-6', iconColor]"
          />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ formattedValue }}
            </div>
            <div
              v-if="change"
              :class="[
                'ml-2 flex items-baseline text-sm font-semibold',
                changeColor
              ]"
            >
              <component
                :is="changeIcon"
                class="h-4 w-4 flex-shrink-0 self-center"
              />
              <span class="sr-only">
                {{ changeType === 'increase' ? 'Increased' : changeType === 'decrease' ? 'Decreased' : 'No change' }}
              </span>
              {{ change }}
            </div>
          </dd>
          <dd v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ subtitle }}
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from '@heroicons/vue/24/solid'
import {
  ChartBarIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/vue/24/outline'
import type { StatCardData } from '@/types'
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters'

interface Props extends StatCardData {
  type?: 'currency' | 'number' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'number',
  changeType: 'neutral'
})

const iconComponents = {
  ChartBarIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
}

const getIcon = (iconName: string) => {
  return iconComponents[iconName as keyof typeof iconComponents] || ChartBarIcon
}

const formattedValue = computed(() => {
  const value = typeof props.value === 'string' ? parseFloat(props.value) : props.value
  
  if (isNaN(value)) return props.value
  
  switch (props.type) {
    case 'currency':
      return formatCurrency(value)
    case 'percentage':
      return formatPercentage(value)
    default:
      return formatNumber(value)
  }
})

const changeIcon = computed(() => {
  switch (props.changeType) {
    case 'increase':
      return ArrowUpIcon
    case 'decrease':
      return ArrowDownIcon
    default:
      return MinusIcon
  }
})

const changeColor = computed(() => {
  switch (props.changeType) {
    case 'increase':
      return 'text-green-600 dark:text-green-400'
    case 'decrease':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
})

const iconColor = computed(() => {
  switch (props.changeType) {
    case 'increase':
      return 'text-green-600 dark:text-green-400'
    case 'decrease':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-blue-600 dark:text-blue-400'
  }
})

const iconBgColor = computed(() => {
  switch (props.changeType) {
    case 'increase':
      return 'bg-green-100 dark:bg-green-900'
    case 'decrease':
      return 'bg-red-100 dark:bg-red-900'
    default:
      return 'bg-blue-100 dark:bg-blue-900'
  }
})
</script>