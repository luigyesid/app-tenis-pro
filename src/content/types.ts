export type Mode = 'pie' | 'silla'
export type Level = 'principiante' | 'intermedio'

/** Volumen base pensado para nivel intermedio; el principiante se escala con `scaleVolume`. */
export interface Exercise {
  id: string
  name: string
  /** Texto común; `pie`/`silla` lo reemplazan cuando la ejecución cambia. */
  how: string
  pie?: string
  silla?: string
  sets?: number
  reps?: number
  /** Duración por serie, en segundos. */
  seconds?: number
}

export interface Session {
  id: string
  title: string
  focus: string
  exercises: Exercise[]
}

export interface Week {
  number: number
  title: string
  goal: string
  sessions: Session[]
}

export interface Stroke {
  id: string
  name: string
}

export interface MindTool {
  id: string
  title: string
  body: string
}
