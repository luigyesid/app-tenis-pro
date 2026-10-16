import { weeks } from '../content/plan'
import type { Session, Week } from '../content/types'
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

/** Días seguidos con al menos una sesión completada; sigue viva si la última fue hoy o ayer. */
export function streak(s: AppState) {
  const days = new Set(Object.values(s.done))
  const d = new Date()
  if (!days.has(today(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(today(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export function doneToday(s: AppState) {
  const t = today()
  return Object.values(s.done).some((d) => d === t)
}

/** Semana (4 u 8) cuyo testimonio toca pedir ahora, si hay alguna. */
export function testimonialDue(s: AppState) {
  return [8, 4].find((n) => isWeekComplete(s, n) && !s.testimonialAsked.includes(n)) ?? null
}
