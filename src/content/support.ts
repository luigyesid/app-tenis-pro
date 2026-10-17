import type { DiaryEntry } from '../lib/store'

/**
 * Mensajes de apoyo según lo que la persona escribió en el diario.
 * Funciona sin internet: busca palabras clave y elige consejos del enfoque mental del e-book.
 */
interface Rule {
  /** Raíces de palabras (sin tildes, en minúscula). */
  words: string[]
  title: string
  tip: string
}

const rules: Rule[] = [
  {
    words: ['nervio', 'ansied', 'ansios', 'miedo', 'presion', 'temblor', 'bloque', 'tens'],
    title: 'Los nervios son normales',
    tip: 'Antes del punto importante usa la rutina: respira inhalando en 4 tiempos y exhalando en 6, y decide una sola cosa simple, como "cruzado y profundo". Los nervios no se eliminan, se manejan.',
  },
  {
    words: ['frustr', 'rabia', 'enoj', 'bronca', 'molest', 'grite', 'raqueta al piso', 'me desespere'],
    title: 'Suelta el error rápido',
    tip: 'Tienes 3 segundos para reaccionar y soltarlo con un gesto corto. Después date la vuelta, acomoda las cuerdas o la silla, y piensa solo en el siguiente punto. El anterior ya no existe.',
  },
  {
    words: ['perdi', 'derrota', 'mal partido', 'jugue mal', 'horrible', 'malisimo', 'pesimo', 'no gane'],
    title: 'Perder también entrena',
    tip: 'Pregúntate qué te mostró este partido que te falta para el siguiente nivel. Escribe una sola cosa concreta para trabajar esta semana, no una lista larga.',
  },
  {
    words: ['doble falta', 'saque', 'servicio', 'lanzamiento'],
    title: 'Para tu saque',
    tip: 'Revisa el lanzamiento: si sale mal, agárralo y empieza de nuevo. En el segundo saque busca más efecto y altura sobre la red, no más fuerza. Repite "Lanzamiento al aro" esta semana.',
  },
  {
    words: ['reves'],
    title: 'Para tu revés',
    tip: 'Prepara temprano y pega adelante del cuerpo. Haz sombra frente al espejo pensando en una sola fase a la vez, y en el peloteo busca cruzado y con margen sobre la red.',
  },
  {
    words: ['derecha', 'drive'],
    title: 'Para tu derecha',
    tip: 'Cuida las 4 fases: preparación temprana, llegar bien a la bola, impacto adelante y terminación con recuperación. Usa la regla de la altura para ganar margen.',
  },
  {
    words: ['volea', 'subir a la red', 'en la red', 'remate', 'globo'],
    title: 'Para tu juego en la red',
    tip: 'Golpe corto, como un bloqueo, y split step (o frenar con el tronco en silla) justo cuando el rival va a pegar. Primero meter y colocar, después la fuerza.',
  },
  {
    words: ['error', 'falle', 'fallo', 'afuera', 'a la red', 'errores', 'regal'],
    title: 'Menos errores, más margen',
    tip: 'Un error es un dato, no un juicio. "Fallé a la red" se arregla con más altura. Juega cruzado y con margen sobre la red hasta que el rival te dé una bola corta.',
  },
  {
    words: ['cansad', 'agotad', 'fisico', 'aire', 'piernas', 'brazos', 'sin energia'],
    title: 'Cuida tu energía',
    tip: 'No te saltes las sesiones de físico: velocidad, resistencia y core sostienen tu tenis al final del partido. Duerme bien y lleva agua y algo de comer a la cancha.',
  },
  {
    words: ['dolor', 'duele', 'lesion', 'molestia en'],
    title: 'Escucha a tu cuerpo',
    tip: 'Si algo duele, para. Baja la intensidad unos días y, si sigue, consulta a un profesional de la salud antes de volver a entrenar fuerte.',
  },
  {
    words: ['concentr', 'distraj', 'distrai', 'me fui', 'desconcentr', 'pensaba en'],
    title: 'Vuelve al presente',
    tip: 'Entre puntos haz siempre la misma rutina: reacciona, recupera, planea, ejecuta. Rebota la bola el mismo número de veces antes de sacar. La rutina te trae de vuelta.',
  },
  {
    words: ['confianza', 'insegur', 'no creo', 'duda', 'dude'],
    title: 'La confianza se construye',
    tip: 'Fíjate objetivos de proceso, no de resultado: "meter el 60% de primeros saques" sí depende de ti. Cada vez que lo cumples, la confianza sube.',
  },
  {
    words: ['zurdo', 'slice', 'cortad', 'globe', 'paciente', 'pegaba fuerte', 'saca fuerte', 'devolvia todo'],
    title: 'Sobre tu rival',
    tip: 'Anota un plan simple para la próxima vez contra ese estilo, por ejemplo "saque al revés en los puntos importantes" o "bola alta al revés". Llévalo en tu hoja de 3 ideas tácticas.',
  },
]

const praise = [
  'Lo que hiciste bien también se entrena: repítelo en la próxima sesión para que salga solo en el partido.',
  'Escribir después de jugar ya te pone por delante. Así se arma el mapa de tu juego.',
  'Buen trabajo. Quédate con una sola cosa para mejorar y enfócate en ella esta semana.',
]

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/** Hasta 2 consejos según lo escrito, más un refuerzo positivo si anotó algo bueno. */
export function supportFor(entry: DiaryEntry): { title: string; tip: string }[] {
  const all = normalize(`${entry.good} ${entry.improve} ${entry.rival}`)
  // Cada raíz tiene que empezar una palabra, para que "red" no coincida dentro de otra palabra.
  const has = (w: string) => new RegExp(`(^|[^a-zñ])${w}`).test(all)
  const hits = rules.filter((r) => r.words.some(has)).slice(0, 2)
  const out = hits.map(({ title, tip }) => ({ title, tip }))
  if (out.length === 0 || (entry.good && out.length < 2)) {
    const i = (entry.good.length + entry.improve.length) % praise.length
    out.push({ title: entry.good ? 'Bien hecho' : 'Sigue así', tip: praise[i] })
  }
  return out
}
