import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">germanflash</h1>
          <p className="text-sm text-zinc-500 mt-2">Signed in as {user.email}</p>
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
