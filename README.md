# Balance AI Frontend

Una aplicación frontend moderna en Vue.js que consume todos los endpoints de la API BackMachine para predicciones financieras con inteligencia artificial.

![Balance AI Frontend](https://github.com/user-attachments/assets/564de9bd-78bf-4376-bacd-bd0369d642ba)

## 🚀 Características Principales

### 📊 Dashboard Principal
- Resumen ejecutivo con métricas clave
- Gráficas interactivas de tendencias histórico vs predicciones
- Cards con estadísticas de total histórico, predicho y crecimiento
- Layout responsive con sidebar colapsable

### 🔮 Predicciones
- **2025 Completo**: Visualización anual completa
- **Mes Específico**: Selector año/mes con detalles semanales
- **Año Específico**: Análisis completo anual con métricas
- **Rango Personalizado**: Selector de fechas con contexto de mercado

### 🤖 Análisis IA
- Formulario para contexto de mercado personalizado
- Análisis inteligente generado por IA
- Insights de negocio automatizados
- Recomendaciones estratégicas
- Factores de riesgo identificados
- Tendencias de mercado relevantes

### 📈 Reportes
- Análisis comparativo histórico vs predicho
- Exportación de datos (CSV)
- Visualización de tendencias y estacionalidad
- Historial de exportaciones

## 🛠 Stack Tecnológico

- **Vue 3** con Composition API y TypeScript
- **Vite** como bundler para desarrollo rápido
- **Vue Router** para navegación SPA
- **Pinia** para gestión de estado
- **Tailwind CSS** para estilos responsive
- **Chart.js** con vue-chartjs para gráficas interactivas
- **Heroicons** para iconografía
- **Axios** para llamadas API
- **Vue Toastification** para notificaciones

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/          # Componentes de layout
│   │   ├── AppLayout.vue
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   └── AppFooter.vue
│   ├── charts/          # Componentes de gráficas
│   │   └── LineChart.vue
│   └── ui/              # Componentes UI reutilizables
│       ├── StatsCard.vue
│       └── LoadingSpinner.vue
├── views/               # Vistas principales
│   ├── Dashboard.vue
│   ├── Predicciones.vue
│   ├── Analisis.vue
│   └── Reportes.vue
├── stores/              # Stores de Pinia
│   ├── dashboard.ts
│   ├── predictions.ts
│   ├── analysis.ts
│   └── theme.ts
├── services/            # Servicios API
│   └── api.ts
├── composables/         # Composables Vue
│   ├── useApi.ts
│   ├── useChart.ts
│   └── useTheme.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── utils/               # Utilidades
│   ├── constants.ts
│   ├── formatters.ts
│   └── helpers.ts
└── assets/              # Assets estáticos
    └── css/
        └── main.css
```

## 🔌 API Endpoints Consumidos

- `GET /predict/2025` - Predicciones completas para 2025
- `GET /predict/month/<year>/<month>` - Predicción mes específico
- `GET /predict/year/<year>` - Predicción año completo
- `POST /predict/range` - Predicción rango personalizado
- `POST /analyze/ai` - Análisis inteligente con IA
- `GET /dashboard` - Datos completos para dashboard
- `GET /api/info` - Información de la API

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Balance AI
VITE_ENABLE_MOCK=false
```

### Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Vista previa del build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🎨 Características UX/UI

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sidebar colapsable en móviles
- Gráficas adaptables

### Dark Mode
- Toggle en header
- Variables CSS personalizadas
- Persistencia en localStorage
- Transiciones suaves

### Estados de Carga
- Skeleton loaders para gráficas
- Spinners para acciones
- Estados de error con retry
- Toasts para notificaciones

### Animaciones
- Vue transitions para rutas
- CSS transitions para hovers
- Loading animations
- Fade-in para contenido

## 📊 Funcionalidades Avanzadas

### Gestión de Estado
- **Dashboard Store**: Datos principales y métricas
- **Predictions Store**: Todas las predicciones con caché
- **Analysis Store**: Análisis IA con historial
- **Theme Store**: Gestión de tema oscuro/claro

### Exportación de Datos
- CSV para tablas y métricas
- Exportación masiva de todos los datos
- Historial de exportaciones
- Nombres de archivo con timestamp

### Error Handling
- Error boundaries en componentes
- Retry automático para fallos de API
- Fallbacks para datos faltantes
- Estados de conexión API

### Charts Interactivos
- Gráficas de líneas para tendencias
- Tooltips informativos
- Responsive design
- Colores adaptativos al tema
- Exportación de gráficas como PNG

## 🔧 Desarrollo

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Vista previa del build
- `npm run lint` - Linting con ESLint
- `npm run lint:check` - Check sin auto-fix
- `npm run type-check` - Verificación de tipos

### Estructura de Tipos

Los tipos TypeScript están completamente definidos en `src/types/index.ts`, incluyendo:

- Tipos de respuesta API
- Estados de la aplicación
- Configuraciones de gráficas
- Props de componentes

### Mejores Prácticas Implementadas

- **TypeScript**: Tipado estricto en toda la aplicación
- **Composition API**: Uso de Vue 3 Composition API
- **Stores Modulares**: Separación clara de responsabilidades
- **Error Boundaries**: Manejo elegante de errores
- **Performance**: Lazy loading y optimizaciones
- **SEO**: Meta tags y estructura semántica

## 🌐 Despliegue

### Build de Producción

```bash
npm run build
```

El build genera archivos optimizados en la carpeta `dist/` listos para despliegue.

### Consideraciones de Despliegue

- Configurar variables de entorno para producción
- Asegurar que la API esté accesible desde el frontend
- Configurar CORS en el backend si es necesario
- Considerar CDN para assets estáticos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.