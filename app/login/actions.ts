'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) redirect('/login?error=Please+enter+an+email')

  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? ''

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)
  redirect('/login?sent=1')
}
