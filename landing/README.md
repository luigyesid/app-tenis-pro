# Landing de ventas (prueba)

Página de ventas de "Tenis Pro en 8 Semanas" hecha a mano, sin depender de Lovable.
Se publica junto con la app en `/landing/` (ver `scripts/copy-landing.mjs`).

- `index.html`: la página completa (estilos y script adentro).
- `plan-data.js`: el plan real de la app para el selector de semanas. Se regenera con
  `node --experimental-strip-types landing/scripts/build-plan-data.mts` cuando cambie `src/content`.
- `img/`: capturas reales de la app (`app-*`), fotos de "Mi camino" (`journey-*`) y la imagen para compartir (`og.jpg`, 1200x630).
