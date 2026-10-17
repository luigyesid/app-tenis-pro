import { weeks } from '../content/plan'
import type { Mode, Session, Week } from '../content/types'
import { today, type AppState } from './store'

export const allSessions = weeks.flatMap((w) => w.sessions.map((s) => ({ week: w, session: s })))

/** La próxima sesión sin completar, en orden; null cuando terminó el plan. */
export function nextSession(s: AppState): { week: Week; session: Session } | null {
  return allSessions.find(({ session }) => !s.done[session.id]) ?? null
}

export function weekProgress(s: AppState, week: Week) {
  const done = week.sessions.filter((x) => s.done[x.id]).length
  return { done, total: week.sessions.length }
}

export function isWeekComplete(s: AppState, n: number) {
  const w = weeks.find((x) => x.number === n)
  return !!w && w.sessions.every((x) => s.done[x.id])
}

/** Si hoy se completó al menos una sesión. */
export function doneToday(s: AppState) {
  const t = today()
  return Object.values(s.done).some((d) => d === t)
}

/** Semana (4 u 8) cuyo testimonio toca pedir ahora, si hay alguna. */
export function testimonialDue(s: AppState) {
  if (s.testimonialSnooze === today()) return null
  return [8, 4].find((n) => isWeekComplete(s, n) && !s.testimonialAsked.includes(n)) ?? null
}

/** Ejercicios que aplican a cómo juegas, con el nombre y el texto de silla cuando cambian. */
export function visibleExercises(session: Session, mode: Mode) {
  return session.exercises
    .filter((e) => !e.only || e.only === mode)
    .map((e) => (mode === 'silla' ? { ...e, name: e.nameSilla ?? e.name, how: e.howSilla ?? e.how } : e))
}
