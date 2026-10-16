import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null

export function normalizeCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

export type RedeemResult = 'ok' | 'invalid' | 'offline' | 'unconfigured'

export async function redeemCode(code: string): Promise<RedeemResult> {
  if (!supabase) return 'unconfigured'
  const { data, error } = await supabase.rpc('redeem_code', { p_code: normalizeCode(code) })
  if (error) return navigator.onLine ? 'invalid' : 'offline'
  return data === true ? 'ok' : 'invalid'
}

export async function submitTestimonial(input: {
  code: string
  week: number
  rating: number
  comment: string
  displayName: string
  canPublish: boolean
}) {
  if (!supabase) throw new Error('Supabase no está configurado')
  const { error } = await supabase.rpc('submit_testimonial', {
    p_code: input.code,
    p_week: input.week,
    p_rating: input.rating,
    p_comment: input.comment,
    p_display_name: input.displayName,
    p_can_publish: input.canPublish,
  })
  if (error) throw error
}
