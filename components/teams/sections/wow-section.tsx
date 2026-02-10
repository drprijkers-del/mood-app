'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import type { WowSessionWithStats, WowLevel } from '@/domain/wow/types'

interface WowSectionProps {
  teamId: string
  teamPlan: string
  wowStats: { total_sessions: number; active_sessions: number; average_score: number | null; level: string } | null
  wowSessions: WowSessionWithStats[]
  angleLabels: Record<string, string>
}

export function WowSection({ teamId, teamPlan, wowStats, wowSessions, angleLabels }: WowSectionProps) {
  const t = useTranslation()
  const [sessionsLevelTab, setSessionsLevelTab] = useState<WowLevel>('shu')

  const currentTeamLevel = (wowStats?.level as WowLevel) || 'shu'
  const levelOrder: WowLevel[] = ['shu', 'ha', 'ri']
  const currentLevelIndex = levelOrder.indexOf(currentTeamLevel)

  const filteredSessions = wowSessions.filter(s => (s.level || 'shu') === sessionsLevelTab)

  const levelTabs: { id: WowLevel; kanji: string; label: string; locked: boolean; color: string; proLocked?: boolean }[] = [
    { id: 'shu', kanji: '守', label: 'Shu', locked: false, color: 'amber' },
    { id: 'ha', kanji: '破', label: 'Ha', locked: currentLevelIndex < 1 || teamPlan !== 'pro', color: 'cyan', proLocked: teamPlan !== 'pro' && currentLevelIndex >= 1 },
    { id: 'ri', kanji: '離', label: 'Ri', locked: currentLevelIndex < 2 || teamPlan !== 'pro', color: 'purple', proLocked: teamPlan !== 'pro' && currentLevelIndex >= 2 },
  ]

  return (
    <div className="space-y-6 pt-3">
      {/* Sessions with Level Tabs */}
      <div className="bg-stone-50 dark:bg-stone-700/30 rounded-xl overflow-hidden">
        {/* Level Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-700">
          {levelTabs.map(tab => {
            const isActive = sessionsLevelTab === tab.id
            const colorClasses = {
              amber: isActive ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' : '',
              cyan: isActive ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' : '',
              purple: isActive ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' : '',
            }
            return (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setSessionsLevelTab(tab.id)}
                disabled={tab.locked}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? colorClasses[tab.color as keyof typeof colorClasses]
                    : tab.locked
                      ? 'border-transparent text-stone-300 dark:text-stone-600 cursor-not-allowed'
                      : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                <span className="font-bold">{tab.kanji}</span>
                <span>{tab.label}</span>
                {tab.locked && (tab.proLocked
                  ? <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">Pro</span>
                  : <span className="text-xs">🔒</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Sessions for selected level */}
        <div className="divide-y divide-stone-100 dark:divide-stone-700">
          {filteredSessions.map(session => (
            <Link
              key={session.id}
              href={`/wow/session/${session.id}`}
              className="flex items-center justify-between p-4 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  session.status === 'active' ? 'bg-cyan-500' : 'bg-stone-400 dark:bg-stone-500'
                }`}>
                  {(angleLabels[session.angle] || session.angle).charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-stone-900 dark:text-stone-100">
                    {angleLabels[session.angle] || session.angle}
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    {session.response_count} {t('responses')} · {session.status === 'active' ? t('active') : t('sessionsCompleted')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {session.overall_score && (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    session.overall_score >= 4 ? 'bg-green-500' :
                    session.overall_score >= 3 ? 'bg-cyan-500' :
                    session.overall_score >= 2 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}>
                    {session.overall_score.toFixed(1)}
                  </div>
                )}
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-400 dark:text-stone-500 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/30 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {t('open')}
                </span>
              </div>
            </Link>
          ))}

          {/* Ghost "new session" tile */}
          <Link
            href={`/teams/${teamId}/wow/new`}
            className="flex items-center gap-3 p-4 group hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg border-2 border-dashed border-stone-200 dark:border-stone-600 group-hover:border-cyan-400 dark:group-hover:border-cyan-600 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-stone-400 dark:text-stone-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {t('newSession')}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
