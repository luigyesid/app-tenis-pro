# Landing de ventas (prueba)

Página de ventas de "Tenis Pro en 8 Semanas" hecha a mano, sin depender de Lovable.
Se publica junto con la app en `/landing/` (ver `scripts/copy-landing.mjs`).

- `index.html`: la página completa (estilos y script adentro).
- `plan-data.js`: el plan real de la app para el selector de semanas. Se regenera con
  `node --experimental-strip-types landing/scripts/build-plan-data.mts` cuando cambie `src/content`.
- `img/`: capturas reales de la app.

Las fotos de "Mi camino" todavía se cargan desde la landing de Lovable. Antes de usar esta página
como la principal hay que copiarlas a `img/`.
