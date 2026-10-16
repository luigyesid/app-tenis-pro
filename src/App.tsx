import { useState } from 'react'
import type { Session, Week } from './content/types'
import { testimonialDue } from './lib/progress'
import { useAppState } from './lib/store'
import { Access } from './screens/Access'
import { Fitness } from './screens/Fitness'
import { Mind } from './screens/Mind'
import { Onboarding } from './screens/Onboarding'
import { Measure } from './screens/Measure'
import { Plan } from './screens/Plan'
import { SessionView } from './screens/SessionView'
import { Settings } from './screens/Settings'
import { TestimonialPrompt } from './screens/TestimonialPrompt'
import { Today } from './screens/Today'

const tabs = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'plan', label: 'Plan' },
  { id: 'medir', label: 'Medir' },
  { id: 'fisico', label: 'Físico' },
  { id: 'mente', label: 'Mente' },
] as const
type Tab = (typeof tabs)[number]['id']

export default function App() {
  const s = useAppState()
  const [tab, setTab] = useState<Tab>('hoy')
  const [open, setOpen] = useState<{ week: Week; session: Session } | null>(null)
  const [settings, setSettings] = useState(false)

  if (!s.access) return <Access />
  if (!s.profile) return <Onboarding />

  const openSession = (week: Week, session: Session) => {
    setOpen({ week, session })
    window.scrollTo(0, 0)
  }
  const due = testimonialDue(s)

  let body
  if (settings) body = <Settings onClose={() => setSettings(false)} />
  else if (open) body = <SessionView {...open} onClose={() => setOpen(null)} />
  else if (tab === 'hoy') body = <Today open={openSession} />
  else if (tab === 'plan') body = <Plan open={openSession} />
  else if (tab === 'medir') body = <Measure />
  else if (tab === 'fisico') body = <Fitness />
  else body = <Mind />

  return (
    <>
      <header className="topbar">
        <span className="logo">
          <span className="ball sm" aria-hidden /> TENIS PRO
        </span>
        <button className="chip" onClick={() => setSettings(true)}>
          {s.profile.mode === 'pie' ? 'De pie' : 'En silla'} · {s.profile.level}
        </button>
      </header>
      {body}
      <nav className="tabbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={tab === t.id && !open && !settings ? 'on' : ''}
            onClick={() => {
              setTab(t.id)
              setOpen(null)
              setSettings(false)
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {due && !open && <TestimonialPrompt week={due} />}
    </>
  )
}
