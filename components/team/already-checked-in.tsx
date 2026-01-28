'use client'

import { useEffect, useState } from 'react'
import { getTeamMoodStats, getParticipantStreak, MoodStats } from '@/domain/moods/actions'
import { getMoodEmoji } from '@/lib/utils'

interface AlreadyCheckedInProps {
  teamName: string
}

export function AlreadyCheckedIn({ teamName }: AlreadyCheckedInProps) {
  const [stats, setStats] = useState<MoodStats | null>(null)
  const [streak, setStreak] = useState<number>(0)

  useEffect(() => {
    async function loadData() {
      const [moodStats, participantStreak] = await Promise.all([
        getTeamMoodStats(),
        getParticipantStreak(),
      ])
      setStats(moodStats)
      setStreak(participantStreak)
    }
    loadData()
  }, [])

  const avgMoodEmoji = stats?.average_mood
    ? getMoodEmoji(Math.round(stats.average_mood))
    : '🙂'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Already checked in */}
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Al ingecheckt vandaag!
        </h1>
        <p className="text-gray-500 mb-8">
          Kom morgen terug voor je volgende check-in.
        </p>

        {/* Streak */}
        {streak > 1 && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full mb-8">
            <span className="text-lg">🔥</span>
            <span className="font-medium">{streak} dagen streak!</span>
          </div>
        )}

        {/* Team stats */}
        {stats && stats.total_entries > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6">
            <p className="text-sm text-gray-500 mb-3">Team gemiddeld vandaag</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">{avgMoodEmoji}</span>
              <span className="text-2xl font-bold text-gray-900">
                {stats.average_mood.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {stats.total_entries} {stats.total_entries === 1 ? 'check-in' : 'check-ins'} vandaag
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-xs text-gray-400">
        {teamName} • Pink Pollos Lab
      </footer>
    </div>
  )
}
