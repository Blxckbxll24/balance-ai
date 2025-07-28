import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const darkMode = ref<boolean>(false)
  
  // Getters
  const currentTheme = computed(() => darkMode.value ? 'dark' : 'light')
  const themeClasses = computed(() => ({
    'dark': darkMode.value,
    'light': !darkMode.value,
  }))
  
  // Actions
  const initializeTheme = () => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('balance-ai-theme')
    if (savedTheme) {
      darkMode.value = savedTheme === 'dark'
    } else {
      // Use system preference
      darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    applyTheme()
    console.log('🎨 Theme initialized:', currentTheme.value)
  }
  
  const toggleTheme = () => {
    darkMode.value = !darkMode.value
    console.log('🎨 Theme toggled to:', currentTheme.value)
  }
  
  const setTheme = (theme: 'light' | 'dark') => {
    darkMode.value = theme === 'dark'
    console.log('🎨 Theme set to:', theme)
  }
  
  const applyTheme = () => {
    const html = document.documentElement
    if (darkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }
  
  const saveThemePreference = () => {
    localStorage.setItem('balance-ai-theme', currentTheme.value)
  }
  
  // Watch for theme changes and apply them
  watch(darkMode, () => {
    applyTheme()
    saveThemePreference()
  })
  
  // Listen for system theme changes
  const setupSystemThemeListener = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a manual preference
      const hasManualPreference = localStorage.getItem('balance-ai-theme')
      if (!hasManualPreference) {
        darkMode.value = e.matches
        console.log('🎨 System theme changed to:', e.matches ? 'dark' : 'light')
      }
    }
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleSystemThemeChange)
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      } else {
        mediaQuery.removeListener(handleSystemThemeChange)
      }
    }
  }
  
  return {
    // State
    darkMode,
    
    // Getters
    currentTheme,
    themeClasses,
    
    // Actions
    initializeTheme,
    toggleTheme,
    setTheme,
    setupSystemThemeListener,
  }
})