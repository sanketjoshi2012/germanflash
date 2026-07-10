import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewFlow, type Word } from './review-client'

export default async function ReviewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: words } = await supabase
    .from('words')
    .select('id, german, english, gender, part_of_speech, example_de, example_en')
    .eq('cefr_level', 'A1')

  if (!words || words.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 bg-zinc-50 dark:bg-black">
        <p className="text-sm text-zinc-500">No vocabulary loaded yet.</p>
      </main>
    )
  }

  const shuffled: Word[] = [...words].sort(() => Math.random() - 0.5).slice(0, 20)

  return <ReviewFlow words={shuffled} />
}
