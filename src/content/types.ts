export type Mode = 'pie' | 'silla'
export type Level = 'principiante' | 'intermedio'

/** Volumen del e-book = nivel intermedio; el principiante se escala con `scaleVolume`. */
export interface Exercise {
  id: string
  name: string
  /** Texto común; `pie`/`silla` lo reemplazan cuando la ejecución cambia. */
  how: string
  pie?: string
  silla?: string
  /** Solo se muestra a quien juega de esta forma. */
  only?: Mode
  sets?: number
  reps?: number
  /** Complemento de las repeticiones, p. ej. "por lado". */
  per?: string
  /** Duración por serie, en segundos. Con duración, la app muestra temporizador. */
  seconds?: number
  rest?: number
  goal?: string
  /** No se ajusta por nivel (calentamiento, estiramientos, partido, sprints). */
  fixed?: boolean
}

export interface Session {
  id: string
  kind: 'tenis' | 'fisico'
  title: string
  focus: string
  exercises: Exercise[]
}

export interface Week {
  number: number
  title: string
  goal: string
  /** Capítulo del e-book que hay que releer esa semana. */
  chapter?: { number: number; title: string; keys: string[] }
  sessions: Session[]
}

export interface ControlTest {
  id: string
  name: string
  /** Si tiene `outOf`, se mide con contador Dentro/Fuera hasta ese número. */
  outOf?: number
  unit: string
}

export interface MindTool {
  id: string
  title: string
  body: string[]
}
