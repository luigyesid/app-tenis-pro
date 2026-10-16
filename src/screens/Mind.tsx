import { mindTools } from '../content/plan'

export function Mind() {
  return (
    <main className="screen">
      <p className="eyebrow">Mente</p>
      <h1 className="title">Zona mental</h1>
      {mindTools.map((t) => (
        <section key={t.id} className="card stack">
          <h3>{t.title}</h3>
          <p>{t.body}</p>
        </section>
      ))}
    </main>
  )
}
