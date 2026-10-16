# Tenis Pro en 8 Semanas · App

App web instalable (PWA) del pack de Luigy Nieves. React + Vite, Supabase y Netlify.

## Qué hace

- **Acceso:** cada comprador entra con su propio código (`TP-XXXX-XXXX`). El código se crea solo cuando Hotmart avisa del pago y se desactiva si hay reembolso o contracargo. Solo hace falta internet la primera vez.
- **Perfil:** la primera vez pregunta "¿De pie o en silla?" y el nivel (principiante o intermedio). Los ejercicios cambian según el modo y el volumen según el nivel (`src/content/volume.ts`).
- **Hoy toca:** la próxima sesión del plan, el avance de la semana y la racha de días seguidos.
- **Plan:** las 8 semanas del capítulo 8 del e-book, con 5 sesiones por semana (3 de tenis y 2 de físico) y los ejercicios de cada capítulo, con su versión de pie o en silla.
- **Medir:** la tabla de control (10 pruebas) para comparar la semana 1 con la semana 8.
- **Físico:** temporizador con los ejercicios del capítulo 5. **Mente:** rutina entre puntos y diario del partido.
- **Testimonios:** al completar las semanas 4 y 8 pide una calificación de 1 a 5, un comentario y permiso para publicarlo. Se guardan en Supabase.
- El progreso se guarda en el celular y la app funciona sin internet.

## Contenido

Todo el contenido está en `src/content/plan.ts` y sale del e-book "Tenis Pro en 8 Semanas". El volumen del e-book corresponde al nivel intermedio; el principiante hace cerca del 70%, salvo el calentamiento, los estiramientos, los sprints y los partidos.

## Puesta en marcha

1. **Supabase:** crea un proyecto y ejecuta `supabase/migrations/001_codes_and_testimonials.sql` en el SQL Editor.
2. **Netlify:** conecta este repositorio. Variables de entorno:
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (para la app)
   - `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (solo para la función; nunca en la app)
   - `HOTMART_HOTTOK` (Hotmart › Herramientas › Webhook)
   - `ALLOWED_OFFERS=O107951429N` para que solo el Pack con app genere código
   - `GMAIL_USER` y `GMAIL_APP_PASSWORD` (contraseña de aplicación de Google) para enviar el código por correo desde Gmail. Con dominio propio se puede usar `RESEND_API_KEY` y `EMAIL_FROM` en su lugar.
   - `APP_URL` (opcional) si la app vive en otra dirección que tenispro-app.netlify.app
3. **Hotmart:** en Webhook (versión 2.0), apunta a `https://<tu-sitio>/.netlify/functions/hotmart-webhook` con los eventos de compra aprobada, completa, reembolsada, contracargo y cancelada.

Para probar sin comprar, inserta un código a mano en la tabla `access_codes`.

## Desarrollo

```bash
npm install
cp .env.example .env   # y completa los valores
npm run dev
```
