/** Cada semana toma un color de la marca, como los "capítulos de color" de la landing. */
const accents = [
  // `text`: versión clara del color, legible sobre el fondo oscuro.
  { bg: '#2E7D32', fg: '#FFFFFF', text: '#7CCB80' },
  { bg: '#0B3D91', fg: '#FFFFFF', text: '#8FB3FF' },
  { bg: '#C8102E', fg: '#FFFFFF', text: '#FF8593' },
  { bg: '#D4E157', fg: '#171717', text: '#D4E157' },
]

export function weekAccent(n: number) {
  return accents[(n - 1) % accents.length]
}

export function accentStyle(n: number) {
  const a = weekAccent(n)
  return { '--accent': a.bg, '--on-accent': a.fg, '--accent-text': a.text } as React.CSSProperties
}

export function greeting(d = new Date()) {
  const h = d.getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function haptic(ms = 12) {
  try {
    navigator.vibrate?.(ms)
  } catch {
    // Sin vibración disponible.
  }
}
