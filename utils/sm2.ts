export type RatingLabel = 'again' | 'hard' | 'good' | 'easy'

export type SM2State = {
  interval: number
  ease_factor: number
  repetitions: number
}

const QUALITY: Record<RatingLabel, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
}

const INITIAL: SM2State = {
  interval: 1,
  ease_factor: 2.5,
  repetitions: 0,
}

export function initialSM2(): SM2State {
  return { ...INITIAL }
}

export function applySM2(state: SM2State, rating: RatingLabel): SM2State {
  const quality = QUALITY[rating]
  let { interval, ease_factor, repetitions } = state

  if (quality < 3) {
    repetitions = 0
    interval = 1
  } else {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * ease_factor)
    repetitions += 1
  }

  ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (ease_factor < 1.3) ease_factor = 1.3

  return { interval, ease_factor, repetitions }
}

export function dueDateFrom(intervalDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + intervalDays)
  return d.toISOString().slice(0, 10)
}
