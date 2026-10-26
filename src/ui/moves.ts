/**
 * Flechas y textos de "Cómo moverte" encima de cada imagen 3D (public/ejercicios).
 * Coordenadas sobre la imagen de 720x480. Cada marca puede tener una flecha (d),
 * un texto (t) centrado en x,y, o ambos.
 * both: punta en los dos extremos (ida y vuelta). line: sin punta, punteada (una guía).
 * Evita la esquina de abajo a la izquierda (x<320, y>390): ahí va el botón.
 */
export type Mark = { d?: string; both?: boolean; line?: boolean; t?: string; x?: number; y?: number }

export const moves: Record<string, Mark[]> = {
  // ---------- De pie ----------
  'pie-plancha': [
    { d: 'M110 190 L660 290', line: true, t: 'Cuerpo recto', x: 400, y: 180 },
    { d: 'M450 420 L450 362', t: 'Abdomen firme', x: 590, y: 430 },
  ],
  'pie-sprints': [
    { d: 'M530 330 L695 330', t: 'Arranca rápido', x: 590, y: 270 },
    { t: 'Brazos activos', x: 110, y: 170 },
  ],
  'pie-desplazamientos': [
    { d: 'M330 466 L700 466', both: true, t: 'Pasos laterales', x: 590, y: 150 },
    { d: 'M205 255 L205 330', t: 'Cadera abajo', x: 110, y: 290 },
  ],
  'pie-trabajo-continuo': [
    { d: 'M470 420 Q570 300 470 180', t: 'Ritmo suave', x: 610, y: 120 },
    { d: 'M250 170 Q150 260 215 370', t: 'Sin parar', x: 100, y: 120 },
  ],
  'pie-estiramientos': [
    { d: 'M560 180 L420 180', t: 'Jala suave', x: 560, y: 235 },
    { d: 'M270 40 L270 95', t: 'Hombro abajo', x: 150, y: 60 },
  ],
  'pie-calentamiento': [
    { t: 'Círculos', x: 110, y: 300 },
    { t: 'Círculos', x: 610, y: 300 },
  ],
  'pie-rotacion-externa-banda': [
    { d: 'M300 150 Q240 110 180 150', t: 'Gira hacia afuera', x: 160, y: 90 },
    { d: 'M205 290 L262 250', t: 'Codo pegado', x: 140, y: 320 },
  ],
  'pie-remo-banda': [
    { d: 'M470 145 L350 145', t: 'Jala hacia ti', x: 540, y: 100 },
    { t: 'Junta la espalda', x: 560, y: 300 },
  ],
  'pie-y-t-w': [
    { d: 'M245 215 L135 105' },
    { d: 'M475 215 L585 105' },
    { t: 'Brazos en Y', x: 590, y: 260 },
    { t: 'Luego T y W', x: 590, y: 320 },
  ],
  'pie-lenador': [
    { t: 'Corta en diagonal', x: 160, y: 150 },
    { t: 'Gira el tronco', x: 590, y: 380 },
  ],
  'pie-balon-medicinal': [
    { d: 'M460 180 L540 166', t: 'Lanza', x: 520, y: 225 },
    { d: 'M150 385 Q155 335 192 305', t: 'Empuja', x: 85, y: 320 },
  ],
  'pie-rotaciones-balon': [
    { t: 'Gira a los lados', x: 580, y: 215 },
    { t: 'Pies quietos', x: 590, y: 420 },
  ],
  'pie-sombra-golpes': [
    { d: 'M150 255 Q360 395 610 295', t: 'Golpe completo', x: 600, y: 100 },
    { t: 'Mira al frente', x: 600, y: 240 },
  ],
  'pie-saltar-cuerda': [
    { d: 'M430 455 L430 385', both: true, t: 'Saltos pequeños', x: 590, y: 420 },
    { t: 'Muñecas giran', x: 590, y: 200 },
  ],
  'pie-skipping': [
    { d: 'M475 330 L475 235', t: 'Rodilla arriba', x: 590, y: 280 },
    { d: 'M290 300 L290 380', t: 'Alterna', x: 190, y: 330 },
  ],
  'pie-zancadas': [
    { d: 'M560 150 L560 265', t: 'Baja recto', x: 600, y: 100 },
    { t: 'Rodilla a 90°', x: 610, y: 330 },
  ],
  'pie-sentadillas': [
    { d: 'M565 250 L565 385', both: true, t: 'Baja y sube', x: 600, y: 205 },
    { t: 'Peso en talones', x: 590, y: 440 },
  ],
  'pie-saque': [
    { d: 'M565 150 L565 45', t: 'Lanza arriba', x: 600, y: 200 },
    { d: 'M205 270 Q150 170 230 100', t: 'Raqueta atrás', x: 115, y: 55 },
  ],
  'pie-remate': [
    { d: 'M320 70 Q450 120 420 270', t: 'Golpea hacia abajo', x: 570, y: 300 },
    { t: 'Señala la pelota', x: 570, y: 70 },
  ],
  'pie-volea': [
    { d: 'M300 240 L170 240', t: 'Golpe corto', x: 170, y: 290 },
    { t: 'Raqueta arriba', x: 160, y: 40 },
  ],
  'pie-voleas-pared': [
    { d: 'M420 80 L560 80', both: true, t: 'Ida y vuelta', x: 490, y: 35 },
    { t: 'Rodillas flexionadas', x: 530, y: 430 },
  ],
  'pie-peloteo': [
    { d: 'M610 220 Q470 225 410 160', t: 'Termina arriba', x: 160, y: 190 },
    { t: 'Gira los hombros', x: 570, y: 300 },
  ],
  'pie-reves': [
    { d: 'M130 290 Q330 340 470 240', t: 'Gira y golpea', x: 130, y: 200 },
    { t: 'Dos manos', x: 560, y: 320 },
  ],
  'pie-split-step': [
    { d: 'M150 300 L150 390', both: true, t: 'Saltito', x: 150, y: 255 },
    { t: 'Cae listo', x: 600, y: 410 },
  ],

  // ---------- En silla ----------
  'silla-arrancadas': [
    { d: 'M560 300 L700 300', t: 'Arranca fuerte', x: 600, y: 210 },
    { d: 'M85 305 Q125 230 205 232', t: 'Empuja', x: 70, y: 200 },
  ],
  'silla-balon-medicinal': [{ t: 'Lanza arriba', x: 600, y: 270 }],
  'silla-calentamiento': [
    { t: 'Círculos', x: 90, y: 300 },
    { t: 'Círculos', x: 620, y: 330 },
  ],
  'silla-core-sentado': [
    { d: 'M215 235 Q360 300 505 235', both: true, t: 'Gira a los lados', x: 590, y: 160 },
    { t: 'Espalda recta', x: 590, y: 420 },
  ],
  'silla-desplazamientos': [
    { d: 'M330 462 L700 462', both: true, t: 'Desplázate', x: 600, y: 300 },
  ],
  'silla-empuje-continuo': [
    { d: 'M90 330 Q100 250 200 232', t: 'Empuja y suelta', x: 120, y: 110 },
    { d: 'M650 340 Q630 250 545 240', t: 'Ritmo constante', x: 590, y: 160 },
  ],
  'silla-empujon-activacion': [
    { d: 'M480 340 L680 340', t: 'Arranca', x: 580, y: 395 },
    { d: 'M30 300 Q55 225 135 218', t: 'Empuja', x: 70, y: 180 },
  ],
  'silla-estiramientos': [
    { d: 'M170 200 L270 200', t: 'Jala suave', x: 160, y: 250 },
    { d: 'M520 80 L520 140', t: 'Hombro abajo', x: 600, y: 50 },
  ],
  'silla-giros-y-frenadas': [
    { t: 'Gira', x: 85, y: 180 },
    { t: 'Frena', x: 610, y: 240 },
  ],
  'silla-lenador': [
    { t: 'Diagonal', x: 150, y: 190 },
    { t: 'Gira el tronco', x: 600, y: 300 },
  ],
  'silla-ochos': [{ t: 'Ochos entre conos', x: 360, y: 40 }],
  'silla-peloteo': [
    { d: 'M300 290 Q520 330 650 250', t: 'Golpea adelante', x: 560, y: 60 },
  ],
  'silla-remate': [
    { d: 'M330 70 Q480 140 440 280', t: 'Golpea hacia abajo', x: 570, y: 230 },
  ],
  'silla-remo-banda': [
    { d: 'M210 160 L315 160', t: 'Jala hacia ti', x: 235, y: 110 },
    { t: 'Junta la espalda', x: 590, y: 330 },
  ],
  'silla-reves': [{ t: 'Gira y golpea', x: 190, y: 45 }],
  'silla-rotacion-externa-banda': [
    { t: 'Gira hacia afuera', x: 240, y: 260 },
    { t: 'Codo pegado', x: 240, y: 320 },
  ],
  'silla-saque': [{ t: 'Lanza arriba', x: 250, y: 40 }],
  'silla-sombra-golpes': [
    { d: 'M60 260 Q300 340 560 230', t: 'Golpe completo', x: 600, y: 40 },
  ],
  'silla-volea': [
    { d: 'M470 295 L570 255', t: 'Golpe corto', x: 560, y: 330 },
  ],
  'silla-voleas-pared': [
    { d: 'M430 70 L560 70', both: true, t: 'Ida y vuelta', x: 610, y: 290 },
  ],
  'silla-y-t-w': [{ t: 'Movimiento lento', x: 520, y: 450 }],
}
