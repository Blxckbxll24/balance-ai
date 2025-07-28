import { computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

export function useTheme() {
  const themeStore = useThemeStore()

  const isDark = computed(() => themeStore.darkMode)
  const theme = computed(() => themeStore.currentTheme)
  const themeClasses = computed(() => themeStore.themeClasses)

  const toggleTheme = () => {
    themeStore.toggleTheme()
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    themeStore.setTheme(newTheme)
  }

  const getThemeBasedColor = (lightColor: string, darkColor: string) => {
    return computed(() => isDark.value ? darkColor : lightColor)
  }

  const getThemeBasedValue = <T>(lightValue: T, darkValue: T) => {
    return computed(() => isDark.value ? darkValue : lightValue)
  }

  // Theme-aware chart colors
  const chartColors = computed(() => ({
    primary: isDark.value ? '#60a5fa' : '#3b82f6',
    secondary: isDark.value ? '#a78bfa' : '#8b5cf6',
    success: isDark.value ? '#34d399' : '#10b981',
    warning: isDark.value ? '#fbbf24' : '#f59e0b',
    danger: isDark.value ? '#f87171' : '#ef4444',
    info: isDark.value ? '#22d3ee' : '#06b6d4',
    background: isDark.value ? '#1e293b' : '#ffffff',
    text: isDark.value ? '#f8fafc' : '#0f172a',
    textMuted: isDark.value ? '#94a3b8' : '#64748b',
    border: isDark.value ? '#334155' : '#e2e8f0',
  }))

  // Theme-aware styles
  const themeStyles = computed(() => ({
    card: isDark.value 
      ? 'bg-gray-800 border-gray-700 text-gray-100' 
      : 'bg-white border-gray-200 text-gray-900',
    button: isDark.value
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    input: isDark.value
      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    text: {
      primary: isDark.value ? 'text-gray-100' : 'text-gray-900',
      secondary: isDark.value ? 'text-gray-300' : 'text-gray-600',
      muted: isDark.value ? 'text-gray-400' : 'text-gray-500',
    },
    background: {
      primary: isDark.value ? 'bg-gray-900' : 'bg-white',
      secondary: isDark.value ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDark.value ? 'bg-gray-700' : 'bg-gray-100',
    },
  }))

  let systemThemeCleanup: (() => void) | null = null

  onMounted(() => {
    themeStore.initializeTheme()
    systemThemeCleanup = themeStore.setupSystemThemeListener()
  })

  onUnmounted(() => {
    if (systemThemeCleanup) {
      systemThemeCleanup()
    }
  })

  return {
    isDark,
    theme,
    themeClasses,
    chartColors,
    themeStyles,
    toggleTheme,
    setTheme,
    getThemeBasedColor,
    getThemeBasedValue,
  }
}