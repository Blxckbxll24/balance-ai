<template>
  <div id="app" :class="themeClasses">
    <AppLayout>
      <router-view />
    </AppLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppLayout from './components/layout/AppLayout.vue'
import { useTheme } from './composables/useTheme'
import { useApi } from './composables/useApi'

const { themeClasses } = useTheme()
const { checkConnection } = useApi()

onMounted(async () => {
  console.log('🚀 Balance AI Frontend Started')
  
  // Check API connection on startup
  const isConnected = await checkConnection()
  if (isConnected) {
    console.log('✅ API connection established')
  } else {
    console.warn('⚠️ API connection failed')
  }
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>