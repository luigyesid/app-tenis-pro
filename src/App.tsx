import { useState } from 'react'
import type { Session, Week } from './content/types'
import { testimonialDue } from './lib/progress'
import { useAppState } from './lib/store'
import { Access } from './screens/Access'
import { Fitness } from './screens/Fitness'
import { Measure } from './screens/Measure'
import { Mind } from './screens/Mind'
import { Onboarding } from './screens/Onboarding'
import { Plan } from './screens/Plan'
import { SessionView } from './screens/SessionView'
import { Settings } from './screens/Settings'
import { TestimonialPrompt } from './screens/TestimonialPrompt'
import { Today } from './screens/Today'
import { Celebrate } from './ui/Celebrate'
import { IconFitness, IconHome, IconMeasure, IconMind, IconPlan } from './ui/icons'
import { haptic } from './ui/theme'

const tabs = [
  { id: 'hoy', label: 'Hoy', Icon: IconHome },
  { id: 'plan', label: 'Plan', Icon: IconPlan },
  { id: 'medir', label: 'Medir', Icon: IconMeasure },
  { id: 'fisico', label: 'Físico', Icon: IconFitness },
  { id: 'mente', label: 'Mente', Icon: IconMind },
] as const
type Tab = (typeof tabs)[number]['id']

export default function App() {
  const s = useAppState()
  const [tab, setTab] = useState<Tab>('hoy')
  const [open, setOpen] = useState<{ week: Week; session: Session } | null>(null)
  const [settings, setSettings] = useState(false)
  const [party, setParty] = useState<{ title: string; subtitle?: string } | null>(null)

  if (!s.access) return <Access />
  if (!s.profile) return <Onboarding />

  const openSession = (week: Week, session: Session) => {
    setOpen({ week, session })
    window.scrollTo(0, 0)
  }
  const due = testimonialDue(s)

  let body
  let key: string = tab
  if (settings) {
    key = 'settings'
    body = <Settings onClose={() => setSettings(false)} />
  } else if (open) {
    key = open.session.id
    body = (
      <SessionView
        {...open}
        onClose={() => setOpen(null)}
        onComplete={(weekDone) => {
          setOpen(null)
          setTab('hoy')
          window.scrollTo(0, 0)
          setParty(
            weekDone
              ? { title: `¡Semana ${open.week.number} completa!`, subtitle: 'Así se construye un top 3.' }
              : { title: '¡Sesión lista!', subtitle: 'Un día más cerca de tu mejor tenis.' },
          )
        }}
      />
    )
  } else if (tab === 'hoy') body = <Today open={openSession} />
  else if (tab === 'plan') body = <Plan open={openSession} />
  else if (tab === 'medir') body = <Measure />
  else if (tab === 'fisico') body = <Fitness />
  else body = <Mind />

  const activeIndex = open || settings ? -1 : tabs.findIndex((t) => t.id === tab)

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
      <div key={key} className="screen-enter">
        {body}
      </div>
      <nav className="tabbar" style={{ '--i': activeIndex } as React.CSSProperties}>
        {activeIndex >= 0 && <span className="tab-indicator" aria-hidden />}
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={tab === id && activeIndex >= 0 ? 'on' : ''}
            aria-current={tab === id && activeIndex >= 0 ? 'page' : undefined}
            onClick={() => {
              haptic(8)
              setTab(id)
              setOpen(null)
              setSettings(false)
              window.scrollTo(0, 0)
            }}
          >
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {party && <Celebrate {...party} onDone={() => setParty(null)} />}
      {due && !open && !party && <TestimonialPrompt week={due} />}
    </>
  )
}
