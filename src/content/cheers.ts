/** Mensajes que salen al terminar una sesión o una semana. Se elige uno al azar. */
export const sessionCheers = [
  'Un día más cerca de tu mejor tenis.',
  'La constancia le gana al talento.',
  'Hoy elegiste entrenar. Eso ya es ganar.',
  'Cada bola cuenta. Hoy sumaste muchas.',
  'Tu yo de mañana te lo agradece.',
  'Pequeños pasos, grandes partidos.',
  'Lo hiciste aunque no tuvieras ganas. Eso es disciplina.',
  'Así se construye un jugador: sesión a sesión.',
]

export const weekCheers = [
  'Una semana más de trabajo en la cancha.',
  'Lo que entrenas hoy se nota en el próximo partido.',
  'Siete días que te hacen mejor jugador.',
  'Vas cumpliendo. Sigue así.',
  'El progreso es silencioso, pero se nota.',
  'Terminaste la semana. Ahora a por la siguiente.',
]

export function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)]
}
