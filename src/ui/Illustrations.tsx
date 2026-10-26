/**
 * Ilustraciones de cómo hacer cada ejercicio: una figura deportiva dibujada (de pie o en silla)
 * y diagramas de cancha vistos desde arriba. Todo en SVG, funciona sin internet.
 */
import type { Mode } from '../content/types'

type P = [number, number]

interface Pose {
  head: P
  neck: P
  hip: P
  elbows: [P, P]
  hands: [P, P]
  knees: [P, P]
  feet: [P, P]
}

const W = 200
const H = 140

function line(a: P, b: P) {
  return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`
}

const at = (a: P, b: P, k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]

/** Brazo o pierna: la primera parte con ropa (manga o short) y el resto piel. */
function Limb({ from, mid, to, cloth, clothTo, back }: { from: P; mid: P; to: P; cloth: string; clothTo: number; back: boolean }) {
  const k = back ? ' back' : ''
  const end = at(from, mid, clothTo)
  return (
    <g>
      <path className={`ill-skin${k}`} d={line(from, mid) + line(mid, to)} />
      <path className={`${cloth}${k}`} d={line(from, end)} />
    </g>
  )
}

/**
 * Figura deportiva ilustrada. Usa las mismas articulaciones de siempre pero dibuja un cuerpo con volumen:
 * camiseta en el color de la marca, short, piel, zapatillas y cabeza con pelo.
 * `front` dice qué brazo y qué pierna quedan delante del cuerpo (el de la raqueta suele ser el 0).
 */
function Figure({ pose, ghost = false, chair = false, front = 1 }: { pose: Pose; ghost?: boolean; chair?: boolean; front?: 0 | 1 }) {
  const { head, neck, hip, elbows, hands, knees, feet } = pose
  const backIdx = front === 1 ? 0 : 1
  const shoe = (i: number) => {
    // La zapatilla apunta hacia delante, en la dirección en que mira la figura.
    const dir = Math.sign(feet[i][0] - knees[i][0]) || 1
    const toe: P = [feet[i][0] + 7 * (chair ? 1 : dir), feet[i][1]]
    return <path className={`ill-shoe${i === backIdx ? ' back' : ''}`} d={line(feet[i], toe)} />
  }
  const arm = (i: number) => <Limb from={neck} mid={elbows[i]} to={hands[i]} cloth="ill-shirt" clothTo={0.45} back={i === backIdx} />
  const leg = (i: number) => (
    <g>
      <Limb from={hip} mid={knees[i]} to={feet[i]} cloth="ill-shorts" clothTo={0.55} back={i === backIdx} />
      {shoe(i)}
    </g>
  )
  // La cara mira hacia donde está la mano adelantada.
  const facing = hands[front][0] >= neck[0] ? 1 : -1
  return (
    <g className={ghost ? 'ill-fig ill-ghost' : 'ill-fig'}>
      {chair && <Chair hip={hip} />}
      {leg(backIdx)}
      {arm(backIdx)}
      <path className="ill-skin" d={line(neck, at(neck, head, 0.6))} />
      <path className="ill-torso" d={line(at(neck, hip, 0.08), at(neck, hip, 0.86))} />
      <path className="ill-shorts" d={line(at(neck, hip, 0.86), hip)} />
      {leg(front)}
      {arm(front)}
      <circle className="ill-hand" cx={hands[front][0]} cy={hands[front][1]} r={3.6} />
      <circle className="ill-face" cx={head[0]} cy={head[1]} r={9.5} />
      <path
        className="ill-hair"
        d={`M${head[0] + 6 * facing} ${head[1] - 7.4}A9.5 9.5 0 0 ${facing > 0 ? 0 : 1} ${head[0] - 9 * facing} ${head[1] + 3}L${head[0] - 3 * facing} ${head[1] - 1}Z`}
      />
      <path className="ill-visor" d={`M${head[0] - 6 * facing} ${head[1] - 6}L${head[0] + 12 * facing} ${head[1] - 4}`} />
    </g>
  )
}

/** Silla de tenis vista de lado: rueda grande con caída, asiento, reposapiés y ruedita antivuelco. */
function Chair({ hip }: { hip: P }) {
  const [x, y] = hip
  const cx = x + 2
  const cy = y + 22
  return (
    <g className="ill-chair">
      <path className="ill-chair-frame" d={`M${x - 16} ${y + 6}H${x + 26}L${x + 42} ${y + 34}M${x - 14} ${y + 6}L${x - 18} ${y - 18}M${x - 10} ${y + 10}L${x - 30} ${y + 40}`} />
      <circle className="ill-tire" cx={cx} cy={cy} r={25} />
      <circle className="ill-rim" cx={cx} cy={cy} r={19} />
      <path className="ill-spokes" d={`M${cx - 19} ${cy}H${cx + 19}M${cx} ${cy - 19}V${cy + 19}M${cx - 13} ${cy - 13}L${cx + 13} ${cy + 13}M${cx - 13} ${cy + 13}L${cx + 13} ${cy - 13}`} />
      <circle className="ill-hub" cx={cx} cy={cy} r={3} />
      <circle className="ill-caster" cx={x + 44} cy={y + 43} r={4} />
      <circle className="ill-caster" cx={x - 31} cy={y + 43} r={3.5} />
    </g>
  )
}

/** Piso de cancha: franja verde con la línea de fondo. */
function Ground() {
  return (
    <g>
      <rect className="ill-floor" x={0} y={H - 12} width={W} height={12} />
      <path className="ill-floor-line" d={`M0 ${H - 11}H${W}`} />
    </g>
  )
}

function Arrow({ d, both = false }: { d: string; both?: boolean }) {
  return <path className="ill-arrow" d={d} markerEnd="url(#ill-head)" markerStart={both ? 'url(#ill-head)' : undefined} />
}

/** Pelota de tenis con su costura. */
function Ball({ at: [x, y], r = 5 }: { at: P; r?: number }) {
  return (
    <g>
      <circle className="ill-ball" cx={x} cy={y} r={r} />
      <path className="ill-seam" d={`M${x - r * 0.75} ${y - r * 0.6}Q${x} ${y} ${x - r * 0.75} ${y + r * 0.6}M${x + r * 0.75} ${y - r * 0.6}Q${x} ${y} ${x + r * 0.75} ${y + r * 0.6}`} />
    </g>
  )
}

function Band({ from, to }: { from: P; to: P }) {
  return <path className="ill-band" d={line(from, to)} />
}

/** Raqueta con mango, marco y cuerdas. */
function Racket({ hand, angle = -45, len = 30 }: { hand: P; angle?: number; len?: number }) {
  const a = (angle * Math.PI) / 180
  const throat: P = [hand[0] + Math.cos(a) * len, hand[1] + Math.sin(a) * len]
  const c: P = [throat[0] + Math.cos(a) * 10, throat[1] + Math.sin(a) * 10]
  return (
    <g className="ill-racket">
      <path className="ill-grip" d={line(hand, at(hand, throat, 0.45))} />
      <path className="ill-shaft" d={line(at(hand, throat, 0.45), throat)} />
      <g transform={`rotate(${angle} ${c[0]} ${c[1]})`}>
        <ellipse className="ill-strings-bg" cx={c[0]} cy={c[1]} rx={11} ry={8} />
        <path className="ill-strings" d={`M${c[0] - 6} ${c[1] - 6.5}V${c[1] + 6.5}M${c[0]} ${c[1] - 8}V${c[1] + 8}M${c[0] + 6} ${c[1] - 6.5}V${c[1] + 6.5}M${c[0] - 10} ${c[1] - 3}H${c[0] + 10}M${c[0] - 10} ${c[1] + 3}H${c[0] + 10}`} />
        <ellipse className="ill-frame" cx={c[0]} cy={c[1]} rx={11} ry={8} />
      </g>
    </g>
  )
}

// ── Poses base ──────────────────────────────────────────────────────────

const stand = (x: number, over: Partial<Pose> = {}): Pose => ({
  head: [x, 30],
  neck: [x, 42],
  hip: [x, 82],
  elbows: [
    [x - 10, 60],
    [x + 10, 60],
  ],
  hands: [
    [x - 12, 80],
    [x + 12, 80],
  ],
  knees: [
    [x - 6, 105],
    [x + 6, 105],
  ],
  feet: [
    [x - 8, 128],
    [x + 8, 128],
  ],
  ...over,
})

/** Figura sentada en la silla (piernas recogidas sobre el reposapiés). */
const seated = (x: number, over: Partial<Pose> = {}): Pose => ({
  head: [x, 34],
  neck: [x, 46],
  hip: [x, 80],
  elbows: [
    [x + 10, 64],
    [x + 14, 64],
  ],
  hands: [
    [x + 22, 76],
    [x + 26, 74],
  ],
  knees: [
    [x + 28, 84],
    [x + 30, 84],
  ],
  feet: [
    [x + 38, 112],
    [x + 40, 112],
  ],
  ...over,
})

// ── Diagramas de cancha (vista desde arriba) ────────────────────────────

/** Media cancha vista desde arriba: x de 30 a 170, red arriba (y=14) y fondo abajo (y=128). */
function HalfCourt({ children }: { children?: React.ReactNode }) {
  return (
    <g>
      <rect className="ill-court" x={30} y={14} width={140} height={114} rx={2} />
      <path className="ill-court-line" d="M45 14V128M155 14V128M45 70H155M100 14V70" />
      <path className="ill-net" d="M24 14H176" />
      {children}
    </g>
  )
}

function Cone({ at }: { at: P }) {
  const [x, y] = at
  return <path className="ill-cone" d={`M${x} ${y - 7}L${x + 6} ${y + 5}H${x - 6}Z`} />
}

function Dot({ at, label }: { at: P; label?: string }) {
  return (
    <g>
      <circle className="ill-player" cx={at[0]} cy={at[1]} r={7} />
      {label && (
        <text className="ill-label" x={at[0]} y={at[1] > 100 ? at[1] - 12 : at[1] + 20} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

// ── Catálogo ────────────────────────────────────────────────────────────

type Drawing = (mode: Mode) => React.ReactNode

const drawings: Record<string, Drawing> = {
  plank: (mode) =>
    mode === 'pie' ? (
      <>
        <Ground />
        <Figure
          pose={{
            head: [40, 92],
            neck: [52, 98],
            hip: [110, 104],
            elbows: [
              [56, 126],
              [58, 126],
            ],
            hands: [
              [74, 127],
              [76, 127],
            ],
            knees: [
              [138, 112],
              [140, 112],
            ],
            feet: [
              [166, 124],
              [168, 124],
            ],
          }}
        />
        <Arrow d="M60 76H150" />
      </>
    ) : (
      <>
        <Figure chair pose={seated(80, { elbows: [[66, 60], [96, 60]], hands: [[80, 66], [84, 66]] })} />
        <Arrow d="M60 40C70 28 90 28 100 40" />
      </>
    ),
  sprint: (mode) =>
    mode === 'pie' ? (
      <>
        <Ground />
        <Figure
          ghost
          pose={stand(40, { head: [44, 32], neck: [42, 44], elbows: [[30, 58], [52, 56]], hands: [[36, 70], [56, 70]], knees: [[52, 100], [34, 108]], feet: [[48, 126], [24, 122]] })}
        />
        <Figure
          pose={stand(110, { head: [118, 32], neck: [114, 44], hip: [106, 82], elbows: [[100, 60], [128, 52]], hands: [[108, 72], [136, 40]], knees: [[124, 96], [96, 108]], feet: [[120, 120], [82, 120]] })}
        />
        <Arrow d="M140 70H186" />
      </>
    ) : (
      <>
        <Figure chair ghost pose={seated(36)} />
        <Figure chair pose={seated(110, { elbows: [[120, 70], [124, 70]], hands: [[118, 96], [122, 96]] })} />
        <Arrow d="M150 30H190" />
      </>
    ),
  lateral: (mode) =>
    mode === 'pie' ? (
      <>
        <Ground />
        <Figure ghost pose={stand(60, { hip: [60, 86], knees: [[48, 106], [72, 106]], feet: [[40, 128], [80, 128]] })} />
        <Figure pose={stand(130, { hip: [130, 86], knees: [[118, 106], [142, 106]], feet: [[110, 128], [150, 128]] })} />
        <Arrow both d="M78 20H122" />
      </>
    ) : (
      <>
        <Figure chair pose={seated(80)} />
        <Arrow d="M40 30C60 10 110 10 130 30" />
        <Arrow d="M150 120C130 140 60 140 40 120" />
      </>
    ),
  rope: () => (
    <>
      <Ground />
      <Figure pose={stand(100, { head: [100, 22], neck: [100, 34], hip: [100, 74], knees: [[94, 96], [106, 96]], feet: [[94, 118], [106, 118]], elbows: [[86, 56], [114, 56]], hands: [[78, 72], [122, 72]] })} />
      <path className="ill-band" d="M78 72C60 140 140 140 122 72" />
      <Arrow d="M150 110V80" />
    </>
  ),
  skipping: () => (
    <>
      <Ground />
      <Figure pose={stand(100, { elbows: [[90, 58], [114, 52]], hands: [[96, 44], [110, 70]], knees: [[110, 84], [98, 106]], feet: [[106, 106], [98, 128]] })} />
      <Arrow d="M130 110V60" />
    </>
  ),
  squat: () => (
    <>
      <Ground />
      <Figure ghost pose={stand(60)} />
      <Figure
        pose={{
          head: [134, 50],
          neck: [134, 62],
          hip: [118, 98],
          elbows: [
            [148, 72],
            [150, 74],
          ],
          hands: [
            [166, 72],
            [168, 74],
          ],
          knees: [
            [146, 104],
            [148, 106],
          ],
          feet: [
            [138, 128],
            [140, 128],
          ],
        }}
      />
      <Arrow d="M86 50V96" />
    </>
  ),
  lunge: () => (
    <>
      <Ground />
      <Figure
        pose={{
          head: [100, 36],
          neck: [100, 48],
          hip: [100, 88],
          elbows: [
            [94, 68],
            [106, 68],
          ],
          hands: [
            [96, 86],
            [104, 86],
          ],
          knees: [
            [126, 98],
            [80, 120],
          ],
          feet: [
            [128, 128],
            [56, 126],
          ],
        }}
      />
      <Arrow d="M140 60L170 60" />
    </>
  ),
  bandRotation: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(100, { elbows: [[90, 64], [112, 64]], hands: [[90, 82], [132, 66]] })
        : seated(90, { elbows: [[96, 62], [104, 64]], hands: [[94, 76], [126, 62]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} />
        <Band from={pose.hands[1]} to={[184, pose.hands[1][1]]} />
        <path className="ill-post" d={`M186 20V${H - 12}`} />
        <Arrow d={`M110 ${pose.hands[1][1] - 18}C120 ${pose.hands[1][1] - 26} 132 ${pose.hands[1][1] - 22} 136 ${pose.hands[1][1] - 12}`} />
      </>
    )
  },
  row: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(80, { elbows: [[66, 66], [68, 64]], hands: [[90, 64], [92, 62]] })
        : seated(70, { elbows: [[58, 64], [60, 62]], hands: [[82, 62], [84, 60]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} />
        <Band from={pose.hands[0]} to={[184, 64]} />
        <path className="ill-post" d={`M186 20V${H - 12}`} />
        <Arrow d="M150 46H110" />
      </>
    )
  },
  ytw: (mode) => {
    const x = mode === 'pie' ? 100 : 86
    const base = mode === 'pie' ? stand(x) : seated(x)
    const top = base.neck[1]
    const y = { ...base, elbows: [[x - 14, top - 14], [x + 14, top - 14]] as [P, P], hands: [[x - 24, top - 30], [x + 24, top - 30]] as [P, P] }
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={y} />
        <text className="ill-letter" x={W - 30} y={44} textAnchor="middle">
          Y T W
        </text>
      </>
    )
  },
  woodchop: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(100, { elbows: [[112, 46], [116, 48]], hands: [[124, 30], [126, 32]] })
        : seated(90, { elbows: [[100, 46], [104, 48]], hands: [[112, 30], [114, 32]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} />
        <Ball at={[128, 26]} r={8} />
        <Arrow d={mode === 'pie' ? 'M140 30C150 70 120 110 76 118' : 'M130 30C140 60 120 90 70 96'} />
      </>
    )
  },
  medBall: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(70, { elbows: [[84, 64], [86, 66]], hands: [[100, 70], [100, 74]] })
        : seated(60, { elbows: [[74, 62], [76, 64]], hands: [[92, 68], [92, 72]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} />
        <Ball at={[110, 72]} r={8} />
        <path className="ill-post" d={`M186 14V${H - 12}`} />
        <Arrow d="M124 70H178" />
      </>
    )
  },
  shadow: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(90, { elbows: [[104, 56], [76, 62]], hands: [[118, 50], [72, 76]], knees: [[84, 104], [98, 104]], feet: [[76, 128], [106, 128]] })
        : seated(80, { elbows: [[94, 54], [70, 64]], hands: [[108, 46], [66, 76]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} front={0} />
        <Racket hand={pose.hands[0]} angle={-40} />
        <Arrow d="M60 40C80 10 140 10 168 40" />
      </>
    )
  },
  continuous: (mode) =>
    mode === 'pie' ? (
      <>
        <Ground />
        <Figure pose={stand(100, { elbows: [[90, 62], [112, 58]], hands: [[96, 76], [118, 70]], knees: [[108, 102], [94, 106]], feet: [[114, 128], [84, 128]] })} />
        <Arrow d="M130 50H180" />
      </>
    ) : (
      <>
        <Figure chair pose={seated(90, { elbows: [[100, 72], [102, 72]], hands: [[98, 100], [100, 100]] })} />
        <Arrow d="M140 30H186" />
      </>
    ),
  stretch: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(100, { elbows: [[112, 56], [92, 50]], hands: [[90, 52], [100, 36]] })
        : seated(90, { elbows: [[102, 56], [82, 50]], hands: [[80, 52], [90, 36]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} />
      </>
    )
  },
  turns: () => (
    <>
      <Figure chair pose={seated(80)} />
      <Arrow d="M150 100C190 80 180 30 140 26" />
      <Arrow d="M40 26C10 40 10 90 40 110" />
    </>
  ),
  serve: (mode) => {
    const pose =
      mode === 'pie'
        ? stand(90, { elbows: [[100, 34], [80, 34]], hands: [[106, 18], [78, 16]] })
        : seated(80, { elbows: [[90, 36], [70, 34]], hands: [[96, 20], [68, 16]] })
    return (
      <>
        {mode === 'pie' && <Ground />}
        <Figure chair={mode === 'silla'} pose={pose} front={0} />
        <Racket hand={pose.hands[0]} angle={-70} len={22} />
        <Ball at={[pose.hands[1][0], 6]} />
      </>
    )
  },
  // ── Cancha ──
  fourCorners: () => (
    <HalfCourt>
      <Cone at={[45, 122]} />
      <Cone at={[155, 122]} />
      <Cone at={[45, 70]} />
      <Cone at={[155, 70]} />
      <Dot at={[100, 98]} />
      <Arrow d="M94 92L52 76" />
      <Arrow d="M106 104L148 118" />
    </HalfCourt>
  ),
  crossCone: () => (
    <HalfCourt>
      <Cone at={[52, 120]} />
      <rect className="ill-zone" x={45} y={96} width={55} height={32} />
      <Arrow d="M150 26C120 50 80 80 56 112" />
      <Ball at={[150, 24]} />
    </HalfCourt>
  ),
  threeZones: () => (
    <HalfCourt>
      <rect className="ill-zone" x={46} y={14} width={17} height={56} />
      <rect className="ill-zone alt" x={64} y={14} width={18} height={56} />
      <rect className="ill-zone" x={82} y={14} width={17} height={56} />
      <text className="ill-label" x={54} y={66} textAnchor="middle">
        1
      </text>
      <text className="ill-label" x={73} y={66} textAnchor="middle">
        2
      </text>
      <text className="ill-label" x={91} y={66} textAnchor="middle">
        3
      </text>
      <Dot at={[140, 124]} label="Tú" />
    </HalfCourt>
  ),
  rally: () => (
    <HalfCourt>
      <Dot at={[150, 118]} label="Tú" />
      <Arrow d="M144 110C120 70 90 40 56 18" />
      <Arrow d="M60 22C90 50 120 80 140 106" />
    </HalfCourt>
  ),
  recover: () => (
    <HalfCourt>
      <Dot at={[100, 120]} />
      <Cone at={[146, 118]} />
      <Arrow d="M106 118H138" />
      <Arrow d="M138 112H108" />
      <text className="ill-label" x={100} y={96} textAnchor="middle">
        centro
      </text>
    </HalfCourt>
  ),
  approach: () => (
    <HalfCourt>
      <Dot at={[100, 118]} />
      <Arrow d="M100 108V40" />
      <Dot at={[100, 30]} />
      <text className="ill-label" x={114} y={34}>
        volea
      </text>
    </HalfCourt>
  ),
  wall: (mode) => (
    <>
      <path className="ill-post" d={`M186 10V${H - 12}`} />
      {mode === 'pie' && <Ground />}
      <Figure chair={mode === 'silla'} front={0} pose={mode === 'pie' ? stand(110, { elbows: [[124, 56], [100, 62]], hands: [[134, 48], [100, 78]] }) : seated(100, { elbows: [[114, 54], [104, 66]], hands: [[124, 46], [110, 76]] })} />
      <Racket hand={mode === 'pie' ? [134, 48] : [124, 46]} angle={-25} len={14} />
      <Ball at={[170, 40]} />
      <Arrow d="M150 30L176 36" />
      <Arrow d="M176 46L150 48" />
    </>
  ),
  eights: () => (
    <>
      <Cone at={[60, 70]} />
      <Cone at={[140, 70]} />
      <path className="ill-arrow" d="M100 70C120 30 170 40 160 70C150 100 120 100 100 70C80 40 50 40 40 70C30 100 80 110 98 74" markerEnd="url(#ill-head)" />
    </>
  ),
}

/** Qué dibujo usar para cada ejercicio, por nombre (de pie o en silla) o por id de temporizador. */
const byName: Record<string, string> = {
  'Plancha frontal': 'plank',
  'Core sentado': 'plank',
  Plancha: 'plank',
  'Sprints cortos': 'sprint',
  Arrancadas: 'sprint',
  Desplazamientos: 'lateral',
  'Desplazamientos laterales': 'lateral',
  'Giros y frenadas': 'turns',
  'Trabajo continuo suave': 'continuous',
  'Empuje continuo': 'continuous',
  Estiramientos: 'stretch',
  Calentamiento: 'stretch',
  'Rotación externa con banda': 'bandRotation',
  'Remo con banda': 'row',
  'Y-T-W': 'ytw',
  Leñador: 'woodchop',
  'Lanzamientos de balón medicinal': 'medBall',
  'Rotaciones con balón medicinal': 'woodchop',
  'Sombra frente al espejo': 'shadow',
  'Sombra de golpes': 'shadow',
  'Saltar la cuerda': 'rope',
  Skipping: 'skipping',
  Sentadillas: 'squat',
  Zancadas: 'lunge',
  'Las 4 esquinas': 'fourCorners',
  'Cruzado al cono': 'crossCone',
  'Las 3 zonas': 'threeZones',
  'Lanzamiento al aro': 'serve',
  'Bloque de saques': 'serve',
  'Segundo saque bajo presión': 'serve',
  'Peloteos largos': 'rally',
  'Peloteo con las 4 fases': 'rally',
  'La regla de la altura': 'rally',
  'Peloteo con recuperación': 'recover',
  'Aproximación y volea': 'approach',
  'Voleas contra la pared': 'wall',
  Ochos: 'eights',
  Remates: 'serve',
}

/** Imágenes 3D del personaje en silla (public/ejercicios). Los ejercicios de cancha siguen con su diagrama. */
const sillaPhoto: Record<string, string> = {
  'Core sentado': 'core-sentado',
  'Plancha (o core equivalente)': 'core-sentado',
  Arrancadas: 'arrancadas',
  Desplazamientos: 'desplazamientos',
  'Giros y frenadas': 'giros-y-frenadas',
  'Empuje continuo': 'empuje-continuo',
  'Trabajo continuo suave': 'empuje-continuo',
  Ochos: 'ochos',
  Estiramientos: 'estiramientos',
  Calentamiento: 'calentamiento',
  'Rotación externa con banda': 'rotacion-externa-banda',
  'Remo con banda': 'remo-banda',
  'Y-T-W': 'y-t-w',
  Leñador: 'lenador',
  'Rotaciones con balón medicinal': 'lenador',
  'Lanzamientos de balón medicinal': 'balon-medicinal',
  'Sombra frente al espejo': 'sombra-golpes',
  'Sombra de golpes': 'sombra-golpes',
  'Lanzamiento al aro': 'saque',
  'Bloque de saques': 'saque',
  'Segundo saque bajo presión': 'saque',
  Remates: 'remate',
  'Voleas contra la pared': 'voleas-pared',
  'Voleas seguidas contra la pared': 'voleas-pared',
  'Peloteos largos': 'peloteo',
  'Peloteo con las 4 fases': 'peloteo',
  'La regla de la altura': 'peloteo',
  'Peloteo cruzado de derecha': 'peloteo',
  'Peloteo cruzado de revés': 'reves',
  'Empujón de activación con señal': 'empujon-activacion',
  'Split step con señal': 'empujon-activacion',
}

export function ExerciseIllustration({ name, mode }: { name: string; mode: Mode }) {
  const photo = mode === 'silla' ? sillaPhoto[name] : undefined
  if (photo) {
    return (
      <div className="ill-photo">
        <img src={`/ejercicios/silla-${photo}.webp`} alt={`Cómo hacer: ${name}`} width={720} height={480} loading="lazy" decoding="async" />
      </div>
    )
  }
  const key = byName[name]
  if (!key) return null
  return (
    <svg className="ill" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Cómo hacer: ${name}`}>
      <defs>
        <marker id="ill-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10Z" className="ill-head" />
        </marker>
      </defs>
      {drawings[key](mode)}
    </svg>
  )
}
