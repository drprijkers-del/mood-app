'use client'

import { useState } from 'react'
import { submitMoodCheckin, CheckinResult } from '@/domain/moods/actions'
import { getMoodEmoji, getMoodLabel, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckinSuccess } from './checkin-success'

interface TeamCheckinProps {
  teamName: string
}

export function TeamCheckin({ teamName }: TeamCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [nickname, setNickname] = useState('')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckinResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!selectedMood) return

    setLoading(true)
    setError(null)

    const checkinResult = await submitMoodCheckin(
      selectedMood,
      comment || undefined,
      nickname || undefined
    )

    setLoading(false)

    if (!checkinResult.success) {
      if (checkinResult.alreadyCheckedIn) {
        setResult(checkinResult)
      } else {
        setError(checkinResult.error || 'Er is iets misgegaan')
      }
      return
    }

    setResult(checkinResult)
  }

  if (result?.success) {
    return (
      <CheckinSuccess
        mood={selectedMood!}
        streak={result.streak || 1}
        teamStats={result.teamStats}
        teamName={teamName}
      />
    )
  }

  if (result?.alreadyCheckedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Al ingecheckt!
          </h1>
          <p className="text-gray-500">
            Je hebt vandaag al een mood check-in gedaan. Kom morgen terug!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <p className="text-gray-500 mb-1">{formatDate(new Date())}</p>
        <h1 className="text-2xl font-bold text-gray-900">{teamName}</h1>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Question */}
          <h2 className="text-3xl font-bold text-center mb-12">
            Hoe voel je je <span className="gradient-text">vandaag</span>?
          </h2>

          {/* Mood selector */}
          <div className="flex justify-center gap-4 mb-12">
            {[1, 2, 3, 4, 5].map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`
                  mood-button w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                  ${selectedMood === mood
                    ? 'selected bg-pink-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                  }
                `}
              >
                {getMoodEmoji(mood)}
              </button>
            ))}
          </div>

          {/* Selected mood label */}
          {selectedMood && (
            <p className="text-center text-lg font-medium text-gray-700 mb-8 animate-fade-in">
              {getMoodLabel(selectedMood)}
            </p>
          )}

          {/* Optional fields */}
          <div className="space-y-4 mb-8">
            <Input
              placeholder="Je naam of nickname (optioneel)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />

            <textarea
              placeholder="Wil je er iets over kwijt? (optioneel)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="block w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit button */}
          <Button
            size="lg"
            className="w-full"
            disabled={!selectedMood}
            loading={loading}
            onClick={handleSubmit}
          >
            Check-in
          </Button>

          {/* Anonymous note */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Je check-in is anoniem. Alleen geaggregeerde data wordt gedeeld.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        Pink Pollos Lab
      </footer>
    </div>
  )
}
