import { useSyncExternalStore } from 'react'

// El service worker se instala solo con cada versión nueva (skipWaiting + clientsClaim).
// Cuando toma el control, avisamos con un aviso en vez de recargar, para no cortar un entrenamiento.
let ready = false
const listeners = new Set<() => void>()

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return
  const hadController = !!navigator.serviceWorker.controller
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return
    ready = true
    listeners.forEach((l) => l())
  })
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Revisa si hay versión nueva cada vez que la app vuelve al frente.
      document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && reg.update())
    })
  })
}

export function useUpdateReady() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => ready,
  )
}
