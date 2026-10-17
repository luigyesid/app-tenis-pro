// Genera landing/plan-data.js con el plan real de la app (src/content), para el selector de semanas.
// Uso: node --experimental-strip-types landing/scripts/build-plan-data.mts
import { writeFileSync } from 'node:fs'
import { weeks } from '../../src/content/plan.ts'
import { describeVolume, estimateMinutes, scaleVolume } from '../../src/content/volume.ts'
import type { Level, Mode } from '../../src/content/types.ts'

const modes: Mode[] = ['pie', 'silla']
const levels: Level[] = ['principiante', 'intermedio']

const data = weeks.map((w) => ({
  n: w.number,
  title: w.title,
  goal: w.goal,
  chapter: w.chapter ? `Capítulo ${w.chapter.number}: ${w.chapter.title}` : null,
  sessions: w.sessions.map((s) => {
    const out: Record<string, unknown> = { title: s.title, focus: s.focus, kind: s.kind }
    for (const m of modes) {
      const list = s.exercises.filter((e) => !e.only || e.only === m)
      for (const l of levels) {
        out[`${m}-${l}`] = {
          min: estimateMinutes(list, l),
          ex: list.map((e) => [m === 'silla' && e.nameSilla ? e.nameSilla : e.name, describeVolume(scaleVolume(e, l))]),
        }
      }
    }
    return out
  }),
}))

writeFileSync(new URL('../plan-data.js', import.meta.url), `// Generado por scripts/build-plan-data.mts. No editar a mano.\nwindow.PLAN = ${JSON.stringify(data)};\n`)
console.log('plan-data.js', data.length, 'semanas')
