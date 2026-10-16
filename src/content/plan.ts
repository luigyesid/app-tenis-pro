import type { MindTool, Stroke, Week } from './types'

// PROVISIONAL: estructura de ejemplo para poder construir y probar la app.
// Se reemplaza por el plan real de la app actual o del e-book "Tenis Pro en 8 Semanas".

const weekTitles = [
  ['Bases y técnica', 'Construir una base técnica estable en los golpes de fondo.'],
  ['Consistencia', 'Sostener peloteos largos sin errores no forzados.'],
  ['Saque', 'Un saque repetible con primer y segundo servicio.'],
  ['Devolución', 'Devolver con profundidad y recuperar posición.'],
  ['Red y volea', 'Subir a la red con seguridad y cerrar el punto.'],
  ['Movilidad en cancha', 'Moverse antes y mejor hacia cada pelota.'],
  ['Juego de puntos', 'Aplicar patrones simples en puntos reales.'],
  ['Partido', 'Juntar todo en partido y medir el avance.'],
]

export const weeks: Week[] = weekTitles.map(([title, goal], i) => {
  const n = i + 1
  return {
    number: n,
    title,
    goal,
    sessions: [
      {
        id: `s${n}-1`,
        title: 'Técnica',
        focus: title,
        exercises: [
          {
            id: `s${n}-1-a`,
            name: 'Peloteo cruzado',
            how: 'Peloteo cruzado a media cancha buscando altura sobre la red.',
            silla: 'Empuja dos veces antes de cada golpe y vuelve al centro.',
            sets: 4,
            seconds: 180,
          },
          { id: `s${n}-1-b`, name: 'Derecha a objetivo', how: 'Golpea al cono profundo; cuenta aciertos.', sets: 3, reps: 15 },
        ],
      },
      {
        id: `s${n}-2`,
        title: 'Físico',
        focus: 'Fuerza y movilidad',
        exercises: [
          {
            id: `s${n}-2-a`,
            name: 'Desplazamientos',
            how: 'Desplazamientos laterales entre dos conos.',
            pie: 'Paso cruzado y recuperación en split-step.',
            silla: 'Giros cortos de silla a cada cono, empuje fuerte al salir.',
            sets: 5,
            seconds: 30,
          },
          {
            id: `s${n}-2-b`,
            name: 'Core',
            how: 'Rotaciones de tronco controladas.',
            pie: 'Plancha con rotación.',
            silla: 'Rotaciones sentado con banda elástica.',
            sets: 3,
            reps: 12,
          },
        ],
      },
      {
        id: `s${n}-3`,
        title: 'Juego',
        focus: 'Puntos con objetivo',
        exercises: [
          { id: `s${n}-3-a`, name: 'Puntos con regla', how: 'Juega puntos donde solo vale ganar con golpe profundo.', sets: 3, seconds: 300 },
        ],
      },
    ],
  }
})

export const strokes: Stroke[] = [
  { id: 'derecha', name: 'Derecha' },
  { id: 'reves', name: 'Revés' },
  { id: 'saque', name: 'Saque' },
  { id: 'devolucion', name: 'Devolución' },
  { id: 'volea', name: 'Volea' },
]

export const mindTools: MindTool[] = [
  { id: 'respira', title: 'Respiración 4-4', body: 'Entre puntos: inhala 4 segundos, exhala 4 segundos. Repite dos veces antes de sacar.' },
  { id: 'rutina', title: 'Rutina entre puntos', body: 'Gira, mira las cuerdas, decide la siguiente jugada y recién entonces vuelve a la línea.' },
  { id: 'error', title: 'Soltar el error', body: 'Nombra el error en una palabra, haz el gesto correcto en el aire y déjalo atrás.' },
]
