'use server'

import { createClient } from '@/utils/supabase/server'
import { applySM2, dueDateFrom, initialSM2, type RatingLabel } from '@/utils/sm2'

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
