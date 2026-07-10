import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const isoDay = (d: Date) => d.toISOString().slice(0, 10)

function computeStreak(reviewedDates: Set<string>): number {
  if (reviewedDates.size === 0) return 0
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  let cursor: Date
  if (reviewedDates.has(isoDay(today))) cursor = today
  else if (reviewedDates.has(isoDay(yesterday))) cursor = yesterday
  else return 0

  let streak = 0
  const walker = new Date(cursor)
  while (reviewedDates.has(isoDay(walker))) {
    streak += 1
    walker.setDate(walker.getDate() - 1)
  }
  return streak
}

function MetricCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-4 text-center">
      <p className="text-3xl font-medium tracking-tight tabular-nums">{value}</p>
      <p className="text-[11px] text-zinc-500 mt-1 leading-tight">{label}</p>
    </div>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = isoDay(new Date())

  const { data: userCards } = await supabase
    .from('user_cards')
    .select('due_date, last_reviewed')
    .eq('user_id', user.id)

  const cards = userCards ?? []
  const dueCount = cards.filter((c) => c.due_date <= today).length
  const studiedCount = cards.length
  const streak = computeStreak(
    new Set(
      cards
        .map((c) => c.last_reviewed)
        .filter((d): d is string => d != null)
        .map((d) => d.slice(0, 10))
    )
  )

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">germanflash</h1>
          <p className="text-sm text-zinc-500 mt-2">Signed in as {user.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MetricCard value={streak} label={streak === 1 ? 'day streak' : 'day streak'} />
          <MetricCard value={dueCount} label="due today" />
          <MetricCard value={studiedCount} label="words studied" />
        </div>

        <div className="space-y-3">
          <Link
            href="/review"
            className="block w-full rounded-md bg-black dark:bg-white text-white dark:text-black text-sm font-medium py-3 hover:opacity-90 transition-opacity"
          >
            Start review
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors py-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
