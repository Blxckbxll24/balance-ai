import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES').format(value)
}

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100)
}

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return 'Fecha inválida'
    return format(dateObj, formatStr, { locale: es })
  } catch {
    return 'Fecha inválida'
  }
}

export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, 'MMM yyyy')
}

export const formatDateLong = (date: string | Date): string => {
  return formatDate(date, 'dd \'de\' MMMM \'de\' yyyy')
}

export const formatChange = (current: number, previous: number): string => {
  if (previous === 0) return '+∞%'
  const change = ((current - previous) / Math.abs(previous)) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}%`
}

export const getChangeType = (current: number, previous: number): 'increase' | 'decrease' | 'neutral' => {
  if (current > previous) return 'increase'
  if (current < previous) return 'decrease'
  return 'neutral'
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const normalizeText = (text: string): string => {
  if (!text) return ''
  
  // Convertir a string si no lo es
  const textStr = String(text)
  
  // Caso especial: texto con cada carácter separado por espacio
  if (textStr.includes(' ') && textStr.length > 100) {
    const spaceRatio = (textStr.match(/ /g) || []).length / textStr.length
    
    // Si más del 30% son espacios, probablemente cada carácter está separado
    if (spaceRatio > 0.3) {
      // Remover espacios entre caracteres individuales
      let cleaned = textStr.replace(/([a-zA-ZáéíóúÁÉÍÓÚñÑ])\s+([a-zA-ZáéíóúÁÉÍÓÚñÑ])/g, '$1$2')
      
      // Mantener espacios después de puntuación
      cleaned = cleaned.replace(/([.!?,:;])\s*/g, '$1 ')
      
      // Agregar espacios entre palabras (mayúscula después de minúscula)
      cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2')
      
      return cleaned.trim()
    }
  }
  
  // Limpieza normal
  return textStr
    .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
    .trim()
}

export const formatAnalysisText = (text: string): string => {
  if (!text) return 'No disponible'
  
  const normalized = normalizeText(text)
  
  // Si el texto sigue siendo muy largo y parece tener el formato extraño
  if (normalized.length > 200 && !normalized.includes('.') && !normalized.includes(',')) {
    // Intentar agregar puntuación basada en longitud
    const words = normalized.split(' ')
    let result = ''
    let currentSentence = ''
    
    for (let i = 0; i < words.length; i++) {
      currentSentence += words[i] + ' '
      
      // Agregar punto cada 15-20 palabras aproximadamente
      if (currentSentence.split(' ').length > 15 && 
          (words[i].length > 3 || i === words.length - 1)) {
        result += currentSentence.trim() + '. '
        currentSentence = ''
      }
    }
    
    if (currentSentence.trim()) {
      result += currentSentence.trim() + '.'
    }
    
    return result.trim()
  }
  
  return normalized
}