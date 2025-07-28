import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import './assets/css/main.css'

// Import views
import Dashboard from './views/Dashboard.vue'
import Predicciones from './views/Predicciones.vue'
import Analisis from './views/Analisis.vue'
import Reportes from './views/Reportes.vue'

// Router configuration
const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/predicciones', name: 'Predicciones', component: Predicciones },
  { path: '/analisis', name: 'Analisis', component: Analisis },
  { path: '/reportes', name: 'Reportes', component: Reportes },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Toast configuration
const toastOptions: PluginOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

// Mount app
app.mount('#app')