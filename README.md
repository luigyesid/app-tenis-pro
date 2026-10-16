# Tenis Pro en 8 Semanas · App

App web instalable (PWA) del pack de Luigy Nieves. React + Vite, Supabase y Netlify.

## Qué hace

- **Acceso:** cada comprador entra con su propio código (`TP-XXXX-XXXX`). El código se crea solo cuando Hotmart avisa del pago y se desactiva si hay reembolso o contracargo. Solo hace falta internet la primera vez.
- **Perfil:** la primera vez pregunta "¿De pie o en silla?" y el nivel (principiante o intermedio). Los ejercicios cambian según el modo y el volumen según el nivel (`src/content/volume.ts`).
- **Hoy toca:** la próxima sesión del plan, el avance de la semana y la racha de días seguidos.
- **Plan, Golpes, Físico y Mente:** plan de 8 semanas, medición de golpes con historial, rutina con temporizador y zona mental.
- **Testimonios:** al completar las semanas 4 y 8 pide una calificación de 1 a 5, un comentario y permiso para publicarlo. Se guardan en Supabase.
- El progreso se guarda en el celular y la app funciona sin internet.

## Contenido

Todo el contenido está en `src/content/plan.ts`. **El que hay ahora es provisional** y se reemplaza por el de la app anterior y el e-book.

## Puesta en marcha

1. **Supabase:** crea un proyecto y ejecuta `supabase/migrations/001_codes_and_testimonials.sql` en el SQL Editor.
2. **Netlify:** conecta este repositorio. Variables de entorno:
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (para la app)
   - `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (solo para la función; nunca en la app)
   - `HOTMART_HOTTOK` (Hotmart › Herramientas › Webhook)
   - `ALLOWED_OFFERS=O107951429N` para que solo el Pack con app genere código
   - `RESEND_API_KEY`, `EMAIL_FROM` y `APP_URL` para enviar el código por correo
3. **Hotmart:** en Webhook (versión 2.0), apunta a `https://<tu-sitio>/.netlify/functions/hotmart-webhook` con los eventos de compra aprobada, completa, reembolsada, contracargo y cancelada.

Para probar sin comprar, inserta un código a mano en la tabla `access_codes`.

## Desarrollo

```bash
npm install
cp .env.example .env   # y completa los valores
npm run dev
```
