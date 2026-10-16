import type { ControlTest, Exercise, MindTool, Session, Week } from './types'

// Contenido tomado del e-book "Tenis Pro en 8 Semanas" de Luigy Nieves (capítulos 1 a 8).
// Semana tipo del capítulo 8: lunes tenis, martes físico, miércoles tenis + puntos,
// viernes físico, sábado partido o puntos.

const MIN = 60

// ── Capítulos ──────────────────────────────────────────────────────────────

const ch = {
  fondo: {
    number: 1,
    title: 'Golpes de fondo: derecha y revés',
    keys: [
      'Gira el tronco antes de mover el brazo.',
      'Impacta adelante del cuerpo.',
      'Pasa la bola 1–2 metros sobre la red.',
      'Pega y recupera tu posición de inmediato.',
    ],
  },
  saque: {
    number: 2,
    title: 'El saque',
    keys: [
      'Saca con empuñadura continental.',
      'Si el lanzamiento sale mal, agárralo y empieza de nuevo.',
      'Primer saque al 80% que entre, no al 100% que falle.',
      'El segundo saque se gana con efecto y altura.',
    ],
  },
  red: {
    number: 3,
    title: 'Volea y juego en la red',
    keys: [
      'La volea es un bloqueo, no un swing.',
      'Raqueta adelante y empuñadura continental.',
      'Nunca te quedes en tierra de nadie.',
      'Sube a la red después de una bola que deja al rival en problemas.',
    ],
  },
  desplazamiento: {
    number: 4,
    title: 'Desplazamiento: de pie y en silla',
    keys: [
      'Cuando el rival pega, tú estás activo.',
      'De pie: split step en cada bola. En silla: empujón de activación.',
      'En silla, muévete en curvas y empuja con la raqueta en la mano.',
      'Después de cada golpe, recupera.',
    ],
  },
  tactica: {
    number: 6,
    title: 'Táctica de partido',
    keys: [
      'El partido se gana fallando menos.',
      'Cruzado y profundo para construir.',
      'Encuentra y ataca la debilidad del rival.',
      'Si vas perdiendo, cambia algo.',
    ],
  },
  mente: {
    number: 7,
    title: 'Mentalidad competitiva',
    keys: [
      'Usa la rutina de 4 pasos entre puntos.',
      'Ponte objetivos de proceso, no de resultado.',
      'Un error es un dato, no un juicio.',
      'Perder también entrena, si te preguntas qué aprendiste.',
    ],
  },
}

// ── Ejercicios ─────────────────────────────────────────────────────────────

type Ex = Omit<Exercise, 'id'>

const warmup: Ex = {
  name: 'Calentamiento',
  how: 'Círculos de brazos (20 adelante y 20 atrás), rotaciones de tronco con la raqueta sobre los hombros (15 a cada lado) y rotación externa e interna con banda (15 por brazo). Termina con peloteo suave en la mitad de la cancha.',
  pie: 'Suma trote suave, desplazamientos laterales y skipping.',
  silla: 'Suma 2–3 minutos de empuje suave con cambios de dirección.',
  seconds: 10 * MIN,
  fixed: true,
}

const shadow: Ex = {
  name: 'Sombra frente al espejo',
  how: '10 repeticiones lentas de cada golpe pensando en una sola fase (giro, impacto adelante, terminación). Luego 10 a velocidad normal.',
  reps: 10,
  per: 'lentas y 10 normales por golpe',
}

const play = (name: string, how: string, minutes = 15, extra: Partial<Ex> = {}): Ex => ({
  name,
  how,
  seconds: minutes * MIN,
  ...extra,
})

const ex = {
  fourPhases: play(
    'Peloteo con las 4 fases',
    'Peloteo de fondo cuidando las 4 fases en cada bola: preparación temprana, llegar a la bola con pasos cortos, impacto adelante y terminación con recuperación.',
    20,
    {
      silla: 'Llega con la silla un poco de lado, gira el tronco y termina empujando de inmediato. Si la bola llega baja por el segundo bote, pega de abajo hacia arriba.',
    },
  ),
  heightRule: play(
    'La regla de la altura',
    'Peloteo donde solo cuenta como buena la bola que pasa por encima de la altura de la raqueta puesta vertical sobre la red. Te obliga a usar efecto y margen.',
    15,
  ),
  crossCone: {
    name: 'Cruzado al cono',
    how: 'Cono o botella en la esquina cruzada, a 1 metro de la línea de fondo y de la lateral. Peloteo cruzado con un compañero; cuenta cuántas caen en la mitad del fondo.',
    reps: 50,
    per: 'derechas y 50 revés',
    goal: 'Meta: 7 de cada 10.',
  } satisfies Ex,
  longRally: play('Peloteos largos', 'Peloteo cruzado y con margen sobre la red, sin buscar ganadores.', 15, {
    goal: 'Meta: 15 bolas seguidas sin error.',
  }),
  tossRing: {
    name: 'Lanzamiento al aro',
    how: 'Raqueta en el piso delante y al lado de tu pie. Lanza la bola sin pegarle y déjala caer: debe caer sobre las cuerdas. Apunta cuántos aciertas.',
    silla: 'Pon la raqueta delante y al lado de tu rueda, y lanza un poco más adelante para que el impacto no te tire hacia atrás.',
    reps: 20,
  } satisfies Ex,
  threeZones: {
    name: 'Las 3 zonas',
    how: 'Divide el cuadro de saque en 3 zonas: abierta, al cuerpo y a la T. Saca con empuñadura continental y anota los aciertos.',
    silla: 'Silla de lado para rotar el tronco, quieto detrás de la línea (se permite un empujón antes de pegar). Prioriza efecto y colocación sobre potencia.',
    sets: 3,
    reps: 10,
    per: 'por zona',
  } satisfies Ex,
  serveVolume: {
    name: 'Bloque de saques',
    how: 'Primeros saques al 80% buscando dirección; segundos saques con más efecto y altura sobre la red. Si el lanzamiento sale mal, agárralo y empieza de nuevo.',
    reps: 60,
    goal: 'Meta: 60% de primeros saques adentro.',
  } satisfies Ex,
  secondServe: play(
    'Segundo saque bajo presión',
    'Juega puntos donde solo tienes segundo saque. Si haces doble falta: 5 flexiones o 5 abdominales.',
    15,
  ),
  fourCorners: {
    name: 'Las 4 esquinas',
    how: '4 conos: dos en las esquinas del fondo y dos en las de la línea de saque. Desde el centro, ve a tocar el cono que te diga tu compañero y vuelve.',
    silla: 'Toca el cono con la mano o la raqueta, moviéndote en curvas.',
    sets: 6,
    seconds: 30,
    rest: 30,
  } satisfies Ex,
  splitSignal: {
    name: 'Split step con señal',
    how: 'Un compañero en la red te lanza bolas con la mano. Haces split step cuando suelta la bola, sales y pegas.',
    only: 'pie',
    seconds: 10 * MIN,
  } satisfies Ex,
  chairSignal: {
    name: 'Empujón de activación con señal',
    how: 'Un compañero en la red te lanza bolas con la mano. Haces el empujón de activación cuando suelta la bola, sales y pegas.',
    only: 'silla',
    seconds: 10 * MIN,
  } satisfies Ex,
  eights: {
    name: 'Ochos',
    how: 'Dos conos a 4 metros. Recorridos en forma de 8 con la raqueta en la mano: giros cerrados y empuje con raqueta.',
    only: 'silla',
    sets: 4,
    seconds: MIN,
    rest: 30,
  } satisfies Ex,
  recoverRally: play(
    'Peloteo con recuperación',
    'Después de cada golpe, vuelve al centro (o un poco hacia el lado al que mandaste la bola). Pega y piensa: "¿dónde me ubico ahora?".',
    15,
    { silla: 'Termina el golpe y vuelve a empujar de inmediato. La silla quieta es la silla que llega tarde.' },
  ),
  wallVolleys: {
    name: 'Voleas contra la pared',
    how: 'A 2–3 metros de una pared, volea sin dejar caer la bola: 20 seguidas de derecha, 20 de revés y luego alternando. Golpe corto, como un bloqueo.',
    sets: 3,
    reps: 20,
  } satisfies Ex,
  approachVolley: {
    name: 'Aproximación y volea',
    how: 'Tu compañero te manda una bola corta: atacas, subes, te mandan una pasada y voleas. Split step justo cuando el rival va a pegar.',
    silla: 'Llega a la red con la silla en movimiento y frena con el tronco justo cuando el rival va a pegar.',
    reps: 10,
    per: 'a cada lado',
  } satisfies Ex,
  smash: {
    name: 'Remates',
    how: 'Te tiran globos: gira de lado, señala la bola con la mano libre y prepárate como en el saque. Primero meterlo y colocarlo, después la fuerza.',
    pie: 'Retrocede con pasos laterales, no de espaldas.',
    silla: 'Cuando puedas, deja botar la bola una vez y remata con más tiempo.',
    reps: 15,
  } satisfies Ex,
  netPoints: play('Puntos subiendo a la red', 'Juega puntos donde subes cada vez que llega una bola corta. Nunca te quedes en tierra de nadie.', 20),
  ruleRally: play(
    'Puntos con regla',
    'Solo puedes cambiar a paralelo si estás dentro de la cancha. Si cambias desde atrás, pierdes el punto.',
    20,
  ),
  servePlusOne: play(
    'Saque + primer golpe',
    'Piensa el saque junto con la siguiente bola. Ejemplo: saco abierto y mi primer golpe va al lado contrario.',
    15,
  ),
  zones: play(
    'Zonas de la cancha',
    'Muy atrás: defiende con bola alta, profunda y al centro. En la línea de fondo: construye cruzado y profundo. Adentro con bola cómoda: ataca.',
    15,
    { silla: 'Prueba bolas cortas con ángulo, liftados altos al revés y la dejada contra rivales que esperan lejos.' },
  ),
  tacticSheet: {
    name: 'Tu hoja de 3 ideas tácticas',
    how: 'Escribe 2 o 3 ideas simples para el partido, por ejemplo "cruzado y profundo" o "saque al revés en los puntos importantes". Léela en los cambios de lado.',
  } satisfies Ex,
  routinePoints: play(
    'Puntos con rutina',
    'En cada punto: reacciona (3 s), recupera respirando 4 tiempos y exhalando 6, planea una sola cosa (3 s) y ejecuta.',
    20,
    { silla: 'En la recuperación ajusta tu posición en la silla, las correas y las manos.' },
  ),
  tiebreaks: play('Tie-breaks desde 4-6', 'Juega tie-breaks de práctica empezando 4-6 abajo. Te acostumbras a jugar los puntos importantes con calma.', 20),
  diary: {
    name: 'Diario del partido',
    how: 'Al terminar responde en la pestaña Mente: ¿qué hice bien?, ¿qué voy a mejorar? y ¿qué aprendí del rival?',
  } satisfies Ex,
  match: play('Partido completo', 'Juega un partido completo aplicando todo: rutina entre puntos, cruzado y profundo, y tu hoja de ideas tácticas.', 60, {
    fixed: true,
  }),
  baseline: {
    name: 'Mide tu punto de partida',
    how: 'Haz las pruebas de la tabla de control en la pestaña Medir. Las repites en la semana 8 para comparar.',
  } satisfies Ex,
  remeasure: {
    name: 'Repite la medición',
    how: 'Vuelve a hacer las pruebas de la pestaña Medir y compara con la semana 1.',
  } satisfies Ex,
}

const pointsWithFocus = (focus: string) =>
  play('Puntos aplicando el enfoque', `Juega puntos o un set de práctica cuidando el enfoque de la semana: ${focus}.`, 20)

// ── Físico (capítulo 5) ───────────────────────────────────────────────────

const stretches: Ex = {
  name: 'Estiramientos',
  how: 'Suaves: hombros, pecho, antebrazos y espalda. Luego hidrátate.',
  seconds: 5 * MIN,
  fixed: true,
}

const shouldersCore: Ex[] = [
  { name: 'Rotación externa con banda', how: 'Codo pegado al cuerpo, rota el antebrazo hacia afuera.', sets: 3, reps: 15 },
  { name: 'Remo con banda', how: 'Jala la banda hacia el pecho juntando las escápulas.', sets: 3, reps: 15 },
  { name: 'Y-T-W', how: 'Con banda o sin peso, dibuja cada letra con los brazos.', sets: 2, reps: 10, per: 'de cada letra' },
  {
    name: 'Plancha frontal',
    how: 'Cuerpo recto y abdomen firme.',
    silla: 'Contracciones abdominales sentado y rotaciones con balón medicinal liviano.',
    sets: 3,
    seconds: 40,
    rest: 30,
  },
  { name: 'Leñador', how: 'Rotaciones con banda o balón, de arriba a abajo cruzando el cuerpo.', sets: 3, reps: 12, per: 'a cada lado' },
  {
    name: 'Lanzamientos de balón medicinal',
    how: 'Balón liviano (2–3 kg) contra la pared, imitando la derecha y el revés.',
    sets: 3,
    reps: 10,
    per: 'a cada lado',
  },
  stretches,
]

const speedEndurance: Ex[] = [
  {
    name: 'Sprints cortos',
    how: 'Sprints de 10–15 metros con 30 segundos de pausa.',
    silla: 'Arrancadas explosivas de 10 metros con 30 segundos de pausa.',
    sets: 10,
    seconds: 5,
    rest: 30,
    fixed: true,
  },
  {
    name: 'Desplazamientos',
    how: 'Desplazamientos laterales con recuperación al centro.',
    silla: 'Series de giros y frenadas: empuje adelante con una mano y atrás con la otra.',
    sets: 4,
    seconds: 30,
    rest: 30,
  },
  {
    name: 'Trabajo continuo suave',
    how: 'Caminar rápido o bicicleta.',
    silla: 'Empuje continuo en silla o handbike.',
    seconds: 20 * MIN,
  },
  stretches,
]

// ── Semanas (capítulo 8) ──────────────────────────────────────────────────

interface WeekDef {
  title: string
  goal: string
  chapter?: Week['chapter']
  day1: Ex[]
  day3: Ex[]
  day5: Ex[]
}

const defs: WeekDef[] = [
  {
    title: 'Base de fondo',
    goal: 'Las 4 fases del golpe y la regla de la altura. Mide tu punto de partida.',
    chapter: ch.fondo,
    day1: [warmup, ex.baseline, ex.fourPhases, shadow],
    day3: [warmup, ex.heightRule, ex.fourPhases, pointsWithFocus('bola alta sobre la red')],
    day5: [warmup, ex.heightRule, pointsWithFocus('gira el tronco e impacta adelante')],
  },
  {
    title: 'Consistencia',
    goal: 'Cruzado al cono y peloteos largos: 15 bolas seguidas sin error. Sombra 3 veces.',
    chapter: ch.fondo,
    day1: [warmup, ex.crossCone, ex.longRally, shadow],
    day3: [warmup, ex.longRally, ex.crossCone, pointsWithFocus('cruzado y con margen'), shadow],
    day5: [warmup, ex.longRally, pointsWithFocus('una bola más que el rival'), shadow],
  },
  {
    title: 'Saque',
    goal: 'Lanzamiento al aro, las 3 zonas y empuñadura continental. 50–80 saques por sesión.',
    chapter: ch.saque,
    day1: [warmup, ex.tossRing, ex.threeZones, ex.serveVolume],
    day3: [warmup, ex.tossRing, ex.serveVolume, ex.secondServe],
    day5: [warmup, ex.threeZones, ex.secondServe, pointsWithFocus('60% de primeros saques adentro')],
  },
  {
    title: 'Desplazamiento',
    goal: 'Las 4 esquinas, split step (de pie) u ochos con empuje con raqueta (en silla). Recupera al centro.',
    chapter: ch.desplazamiento,
    day1: [warmup, ex.fourCorners, ex.splitSignal, ex.chairSignal, ex.eights, ex.recoverRally],
    day3: [warmup, ex.eights, ex.splitSignal, ex.chairSignal, ex.recoverRally, pointsWithFocus('activo cuando el rival pega')],
    day5: [warmup, ex.fourCorners, pointsWithFocus('recupera después de cada golpe')],
  },
  {
    title: 'Red y transición',
    goal: 'Voleas contra la pared, aproximación + volea y remates. Sube con cada bola corta.',
    chapter: ch.red,
    day1: [warmup, ex.wallVolleys, ex.approachVolley, ex.smash],
    day3: [warmup, ex.approachVolley, ex.smash, ex.netPoints],
    day5: [warmup, ex.wallVolleys, ex.netPoints],
  },
  {
    title: 'Táctica',
    goal: 'Puntos con regla, saque + primer golpe y zonas de la cancha. Prepara tu hoja de 3 ideas.',
    chapter: ch.tactica,
    day1: [warmup, ex.zones, ex.servePlusOne, ex.tacticSheet],
    day3: [warmup, ex.servePlusOne, ex.ruleRally],
    day5: [warmup, ex.tacticSheet, ex.ruleRally, pointsWithFocus('ataca la debilidad del rival')],
  },
  {
    title: 'Mentalidad',
    goal: 'Rutina entre puntos en todos los puntos. Tie-breaks desde 4-6. Diario del partido.',
    chapter: ch.mente,
    day1: [warmup, ex.routinePoints, ex.diary],
    day3: [warmup, ex.tiebreaks, ex.routinePoints, ex.diary],
    day5: [warmup, ex.tiebreaks, ex.match, ex.diary],
  },
  {
    title: 'Competencia',
    goal: 'Juega al menos 2 partidos completos aplicando todo. Repite la medición y compara.',
    day1: [warmup, ex.remeasure],
    day3: [warmup, ex.tacticSheet, ex.match, ex.diary],
    day5: [warmup, ex.tacticSheet, ex.match, ex.diary],
  },
]

function withIds(prefix: string, list: Ex[]): Exercise[] {
  return list.map((e, i) => ({ ...e, id: `${prefix}-${i + 1}` }))
}

export const weeks: Week[] = defs.map((d, i) => {
  const n = i + 1
  const s = (k: number, kind: Session['kind'], title: string, focus: string, list: Ex[]): Session => ({
    id: `s${n}-${k}`,
    kind,
    title,
    focus,
    exercises: withIds(`s${n}-${k}`, list),
  })
  return {
    number: n,
    title: d.title,
    goal: d.goal,
    chapter: d.chapter,
    sessions: [
      s(1, 'tenis', 'Tenis', d.title, d.day1),
      s(2, 'fisico', 'Físico', 'Hombros y core', shouldersCore),
      s(3, 'tenis', 'Tenis + puntos', d.title, d.day3),
      s(4, 'fisico', 'Físico', 'Velocidad y resistencia', speedEndurance),
      s(5, 'tenis', n === 8 ? 'Partido' : 'Partido o puntos', d.title, d.day5),
    ],
  }
})

// ── Tabla de control (capítulo 8) ─────────────────────────────────────────

export const controlTests: ControlTest[] = [
  { id: 'rally-derecha', name: 'Peloteo cruzado de derecha', unit: 'bolas seguidas sin error' },
  { id: 'rally-reves', name: 'Peloteo cruzado de revés', unit: 'bolas seguidas sin error' },
  { id: 'cono-derecha', name: 'Cruzado al cono (derecha)', outOf: 20, unit: 'aciertos' },
  { id: 'cono-reves', name: 'Cruzado al cono (revés)', outOf: 20, unit: 'aciertos' },
  { id: 'primer-saque', name: 'Primeros saques adentro', outOf: 20, unit: 'adentro' },
  { id: 'segundo-saque', name: 'Segundos saques adentro', outOf: 20, unit: 'adentro' },
  { id: 'saque-zona', name: 'Saques a la zona elegida', outOf: 15, unit: 'aciertos' },
  { id: 'voleas', name: 'Voleas seguidas contra la pared', unit: 'voleas' },
  { id: 'esquinas', name: '4 esquinas en 30 segundos', unit: 'conos tocados' },
  { id: 'plancha', name: 'Plancha (o core equivalente)', unit: 'segundos' },
]

// ── Zona mental (capítulo 7) ──────────────────────────────────────────────

export const mindTools: MindTool[] = [
  {
    id: 'rutina',
    title: 'La rutina entre puntos',
    body: [
      'Reacciona (3 s): si fallaste, suelta la frustración con un gesto corto. Si ganaste, un "¡vamos!" también ayuda.',
      'Recupera (5–8 s): date la vuelta, acomoda las cuerdas o la silla y respira: inhala en 4 tiempos y exhala en 6.',
      'Planea (3 s): decide una sola cosa para el próximo punto. "Saque al cuerpo" o "cruzado profundo".',
      'Ejecuta: rebota la bola el mismo número de veces de siempre y juega.',
    ],
  },
  {
    id: 'nervios',
    title: 'Los nervios no son el enemigo',
    body: [
      'Todos sentimos nervios: yo los siento en un torneo local y los sentí jugando un Mundial. Significan que te importa.',
      'El objetivo no es eliminarlos, sino saber qué hacer con ellos.',
    ],
  },
  {
    id: 'proceso',
    title: 'Objetivos de proceso, no de resultado',
    body: [
      '"Ganar el partido" no depende solo de ti. "Meter el 60% de primeros saques" o "recuperar al centro después de cada golpe" sí.',
      'Cuando te enfocas en el proceso, el resultado llega más fácil y los nervios bajan.',
    ],
  },
  {
    id: 'errores',
    title: 'Cómo manejar los errores',
    body: [
      'Un error es un dato, no un juicio. "Fallé la derecha a la red" se arregla con "más altura". "Soy malísimo" no se arregla con nada.',
      'Habla contigo como le hablarías a un compañero.',
      'El punto que importa es el siguiente. El anterior ya no existe.',
    ],
  },
  {
    id: 'perder',
    title: 'Perder también entrena',
    body: [
      'En el Mundial de 2026 en Orlando, Colombia terminó en el puesto 11. Jugar contra los mejores del mundo me mostró exactamente lo que me falta para el siguiente nivel.',
      'Después de perder, pregúntate qué aprendiste.',
    ],
  },
]
