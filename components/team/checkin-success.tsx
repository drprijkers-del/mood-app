'use client'

import { MoodStats } from '@/domain/moods/actions'
import { getMoodEmoji } from '@/lib/utils'

interface CheckinSuccessProps {
  mood: number
  streak: number
  teamStats?: MoodStats
  teamName: string
}

export function CheckinSuccess({ mood, streak, teamStats, teamName }: CheckinSuccessProps) {
  const avgMoodEmoji = teamStats?.average_mood
    ? getMoodEmoji(Math.round(teamStats.average_mood))
    : '🙂'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md animate-scale-in">
        {/* Success icon */}
        <div className="relative inline-block mb-8">
          <div className="text-8xl">{getMoodEmoji(mood)}</div>
          <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bedankt!
        </h1>
        <p className="text-gray-500 mb-8">
          Je check-in is opgeslagen.
        </p>

        {/* Streak */}
        {streak > 1 && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full mb-8">
            <span className="text-lg">🔥</span>
            <span className="font-medium">{streak} dagen streak!</span>
          </div>
        )}

        {/* Team stats */}
        {teamStats && teamStats.total_entries > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-3">Team gemiddeld vandaag</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{avgMoodEmoji}</span>
              <span className="text-2xl font-bold text-gray-900">
                {teamStats.average_mood.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {teamStats.total_entries} {teamStats.total_entries === 1 ? 'check-in' : 'check-ins'} vandaag
            </p>
          </div>
        )}

        {/* Return message */}
        <p className="text-gray-400 text-sm">
          Kom morgen terug voor je volgende check-in!
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-gray-400">
        {teamName} • Pink Pollos Lab
      </footer>
    </div>
  )
}
