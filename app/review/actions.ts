'use server'

import { createClient } from '@/utils/supabase/server'
import { applySM2, dueDateFrom, initialSM2, type RatingLabel } from '@/utils/sm2'

export type ImageMeta = {
  image_url: string
  image_credit_name: string
  image_credit_url: string
}

export async function fetchAndCacheImage(
  word_id: number,
  query: string
): Promise<ImageMeta | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY
  if (!key) {
    console.error('UNSPLASH_ACCESS_KEY missing')
    return null
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=squarish&content_filter=high`,
    { headers: { Authorization: `Client-ID ${key}` } }
  )

  if (!res.ok) {
    console.error('Unsplash search failed:', res.status)
    return null
  }

  const data = await res.json()
  const photo = data.results?.[0]
  if (!photo) return null

  const meta: ImageMeta = {
    image_url: photo.urls.small,
    image_credit_name: photo.user.name,
    image_credit_url: `${photo.user.links.html}?utm_source=germanflash&utm_medium=referral`,
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('set_word_image', {
    p_word_id: word_id,
    p_image_url: meta.image_url,
    p_credit_name: meta.image_credit_name,
    p_credit_url: meta.image_credit_url,
  })

  if (error) {
    console.error('set_word_image failed:', error)
    return null
  }

  return meta
}

export async function rateCard(word_id: number, rating: RatingLabel) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existing } = await supabase
    .from('user_cards')
    .select('interval, ease_factor, repetitions')
    .eq('user_id', user.id)
    .eq('word_id', word_id)
    .maybeSingle()

  const state = existing
    ? {
        interval: existing.interval,
        ease_factor: existing.ease_factor,
        repetitions: existing.repetitions,
      }
    : initialSM2()

  const next = applySM2(state, rating)
  const due_date = dueDateFrom(next.interval)

  const { error } = await supabase.from('user_cards').upsert(
    {
      user_id: user.id,
      word_id,
      interval: next.interval,
      ease_factor: next.ease_factor,
      repetitions: next.repetitions,
      due_date,
      last_reviewed: new Date().toISOString(),
    },
    { onConflict: 'user_id,word_id' }
  )

  if (error) throw error
}
