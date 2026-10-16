// Recibe los avisos de Hotmart (Webhook 2.0).
// Compra aprobada -> crea un código único y lo envía por correo al comprador.
// Reembolso, contracargo o cancelación -> desactiva el código.
//
// Variables de entorno en Netlify:
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY  (la service role key solo vive aquí, nunca en la app)
//   HOTMART_HOTTOK                           (Hotmart > Herramientas > Webhook)
//   ALLOWED_OFFERS                           (opcional, códigos de oferta separados por coma; p. ej. O107951429N)
//   RESEND_API_KEY, EMAIL_FROM               (opcional; sin ellos el código se crea pero no se envía)
import { createClient } from '@supabase/supabase-js'
import { randomInt } from 'node:crypto'

const GRANT = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE'])
const REVOKE = new Set(['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_CANCELED'])
// Sin 0/O ni 1/I para que no se confundan al escribirlo.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function newCode() {
  const part = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return `TP-${part()}-${part()}`
}

const env = (k: string) => process.env[k] ?? ''

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  if (!env('HOTMART_HOTTOK') || req.headers.get('x-hotmart-hottok') !== env('HOTMART_HOTTOK')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const event: string = body?.event ?? ''
  const data = body?.data ?? {}
  const transaction: string | undefined = data.purchase?.transaction
  if (!transaction) return new Response('Ignored: no transaction', { status: 200 })

  const db = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })

  if (REVOKE.has(event)) {
    await db.from('access_codes').update({ revoked_at: new Date().toISOString() }).eq('transaction', transaction)
    return new Response('Revoked', { status: 200 })
  }
  if (!GRANT.has(event)) return new Response(`Ignored: ${event}`, { status: 200 })

  const offer: string | undefined = data.purchase?.offer?.code
  const allowed = env('ALLOWED_OFFERS').split(',').map((s) => s.trim()).filter(Boolean)
  if (allowed.length && (!offer || !allowed.includes(offer))) {
    return new Response('Ignored: offer without app', { status: 200 })
  }

  // Hotmart reintenta y envía APPROVED y COMPLETE: si ya existe código para la compra, se reutiliza.
  const existing = await db.from('access_codes').select('code').eq('transaction', transaction).maybeSingle()
  let code = existing.data?.code as string | undefined
  if (!code) {
    for (let i = 0; i < 5 && !code; i++) {
      const candidate = newCode()
      const { error } = await db.from('access_codes').insert({
        code: candidate,
        transaction,
        buyer_email: data.buyer?.email ?? '',
        buyer_name: data.buyer?.name ?? null,
        offer_code: offer ?? null,
      })
      if (!error) code = candidate
      else if (error.code !== '23505') return new Response(`DB error: ${error.message}`, { status: 500 })
      else {
        // Choque: o el código ya existía, o otra entrega del aviso creó el de esta compra.
        const again = await db.from('access_codes').select('code').eq('transaction', transaction).maybeSingle()
        code = again.data?.code
      }
    }
    if (!code) return new Response('Could not create code', { status: 500 })
    if (data.buyer?.email) await sendEmail(data.buyer.email, data.buyer.name, code)
  }

  return new Response('OK', { status: 200 })
}

async function sendEmail(to: string, name: string | undefined, code: string) {
  if (!env('RESEND_API_KEY') || !env('EMAIL_FROM')) return
  const first = (name ?? '').split(' ')[0].replace(/[<>&"']/g, '')
  const appUrl = env('APP_URL') || 'https://tenispro-luigy.netlify.app'
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env('EMAIL_FROM'),
      to,
      subject: 'Tu código para la app Tenis Pro',
      html: `<p>Hola${first ? ` ${first}` : ''}, gracias por comprar Tenis Pro en 8 Semanas.</p>
<p>Tu código de acceso es: <strong style="font-size:20px">${code}</strong></p>
<p>Abre la app aquí y escríbelo: <a href="${appUrl}">${appUrl}</a></p>
<p>Nos vemos en la cancha,<br>Luigy</p>`,
    }),
  }).catch(() => undefined)
}
