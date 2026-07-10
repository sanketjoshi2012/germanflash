import { sendMagicLink } from './actions'

type Props = {
  searchParams: Promise<{ sent?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { sent, error } = await searchParams

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">germanflash</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Learn German A1 with spaced repetition.
          </p>
        </div>

        {sent ? (
          <div className="rounded-md border border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900 px-4 py-3 text-sm">
            Check your inbox — we sent you a login link. Click it and you&apos;ll be signed in.
          </div>
        ) : (
          <form action={sendMagicLink} className="space-y-4">
            <label className="block text-sm">
              <span className="text-zinc-700 dark:text-zinc-300">Email</span>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md bg-black dark:bg-white text-white dark:text-black text-sm font-medium py-2 hover:opacity-90 transition-opacity"
            >
              Send me a login link
            </button>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </form>
        )}

        <p className="text-xs text-zinc-500">
          We use a one-time link instead of passwords. No spam.
        </p>
      </div>
    </main>
  )
}
