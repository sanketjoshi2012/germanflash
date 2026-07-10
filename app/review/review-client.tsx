'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export type Word = {
  id: number
  german: string
  english: string
  gender: string | null
  part_of_speech: string
  example_de: string | null
  example_en: string | null
}

const genderColor = (gender: string | null) => {
  switch (gender) {
    case 'der':
      return 'text-blue-600 dark:text-blue-400'
    case 'die':
      return 'text-pink-600 dark:text-pink-400'
    case 'das':
      return 'text-green-600 dark:text-green-400'
    default:
      return ''
  }
}

const ratings = [
  {
    label: 'Again',
    className:
      'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900 dark:hover:bg-red-950/50',
  },
  {
    label: 'Hard',
    className:
      'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900 dark:hover:bg-amber-950/50',
  },
  {
    label: 'Good',
    className:
      'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900 dark:hover:bg-blue-950/50',
  },
  {
    label: 'Easy',
    className:
      'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900 dark:hover:bg-green-950/50',
  },
]

function pickGermanVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  const preferredNames = [
    'Anna',
    'Google Deutsch',
    'Microsoft Katja',
    'Microsoft Hedda',
    'Petra',
    'Markus',
  ]
  for (const name of preferredNames) {
    const v = voices.find((v) => v.name.includes(name))
    if (v) return v
  }
  return voices.find((v) => v.lang.toLowerCase().startsWith('de')) ?? null
}

function SpeakerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 5L6 9H2v6h4l5 4z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

export function ReviewFlow({ words }: { words: Word[] }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const germanVoice = useRef<SpeechSynthesisVoice | null>(null)
  const [voiceReady, setVoiceReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const load = () => {
      germanVoice.current = pickGermanVoice()
      setVoiceReady(!!germanVoice.current)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'de-DE'
    utter.rate = 0.85
    if (germanVoice.current) utter.voice = germanVoice.current
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const done = index >= words.length
  const currentWord = words[index]

  if (done) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-sm text-center space-y-8">
          <div>
            <h1 className="text-2xl font-medium">Done for now</h1>
            <p className="text-sm text-zinc-500 mt-2">
              You reviewed {words.length} cards. Come back tomorrow.
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

  const article = currentWord.gender
  const artColor = genderColor(article)

  const advance = () => {
    setFlipped(false)
    setIndex((i) => i + 1)
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-8 bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-xl space-y-4">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
            ← home
          </Link>
          <span>
            {index + 1} / {words.length}
          </span>
        </div>

        <div
          onClick={() => !flipped && setFlipped(true)}
          className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 min-h-[520px] flex flex-col ${
            !flipped
              ? 'cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700'
              : ''
          } transition-colors`}
        >
          {!flipped ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="flex items-baseline gap-4">
                {article && (
                  <span className={`text-4xl font-medium ${artColor}`}>{article}</span>
                )}
                <span className="text-6xl font-medium tracking-tight">
                  {currentWord.german}
                </span>
              </div>
              <span className="text-xs text-zinc-500 uppercase tracking-wider px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                {currentWord.part_of_speech}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  speak(currentWord.german)
                }}
                className="mt-4 w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Play German audio"
                disabled={!voiceReady}
              >
                <SpeakerIcon size={22} />
              </button>
              {!voiceReady && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  No German voice installed on this browser.
                </p>
              )}
              <p className="text-xs text-zinc-400 mt-auto">tap card to flip</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 justify-center">
                {article && (
                  <span className={`text-2xl font-medium ${artColor}`}>{article}</span>
                )}
                <span className="text-2xl font-medium">{currentWord.german}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    speak(currentWord.german)
                  }}
                  className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
                  aria-label="Play German audio"
                >
                  <SpeakerIcon size={14} />
                </button>
              </div>
              <div className="text-center my-8">
                <p className="text-5xl font-medium tracking-tight">{currentWord.english}</p>
              </div>
              {currentWord.example_de && (
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <p className="text-base flex-1">{currentWord.example_de}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        currentWord.example_de && speak(currentWord.example_de)
                      }}
                      className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 flex items-center justify-center flex-shrink-0 transition-colors"
                      aria-label="Play example sentence"
                    >
                      <SpeakerIcon size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500 mt-2">{currentWord.example_en}</p>
                </div>
              )}
              <div className="grid grid-cols-4 gap-3 mt-auto">
                {ratings.map((r) => (
                  <button
                    key={r.label}
                    onClick={advance}
                    className={`py-3 text-sm font-medium rounded-lg border transition-colors ${r.className}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
