import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ReviewFlow, type Word } from './review-client'

const SESSION_SIZE = 20

export default async function ReviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().slice(0, 10)

  const { data: dueRows } = await supabase
    .from('user_cards')
    .select('word_id')
    .eq('user_id', user.id)
    .lte('due_date', today)
    .limit(SESSION_SIZE)

  const dueIds = new Set((dueRows ?? []).map((r) => r.word_id))

  const { data: allSeenRows } = await supabase
    .from('user_cards')
    .select('word_id')
    .eq('user_id', user.id)

  const seenIds = new Set((allSeenRows ?? []).map((r) => r.word_id))

  const { data: allWords } = await supabase
    .from('words')
    .select('id, german, english, gender, part_of_speech, example_de, example_en')
    .eq('cefr_level', 'A1')

  const words: Word[] = allWords ?? []
  const dueWords = words.filter((w) => dueIds.has(w.id))
  const newWords = words
    .filter((w) => !seenIds.has(w.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, SESSION_SIZE - dueWords.length)

  const session: Word[] = [...dueWords, ...newWords]

  if (session.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-sm text-center space-y-6">
          <div>
            <h1 className="text-2xl font-medium">All caught up</h1>
            <p className="text-sm text-zinc-500 mt-2">
              Nothing due today and no new words left. Come back tomorrow — cards you&apos;ve seen will resurface on their SM-2 schedule.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block w-full rounded-md bg-black dark:bg-white text-white dark:text-black text-sm font-medium py-3 hover:opacity-90 transition-opacity"
          >
            Back home
          </Link>
        </div>
      </main>
    )
  }

  return <ReviewFlow words={session} />
}
