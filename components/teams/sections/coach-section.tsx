'use client'

import { useTranslation } from '@/lib/i18n/context'
import { CoachQuestions } from '@/components/teams/coach-questions'
import { ProGate } from '@/components/teams/pro-gate'
import { AiCoach } from '@/components/teams/ai-coach'
import type { WowSessionWithStats } from '@/domain/wow/types'
import type { SubscriptionTier } from '@/domain/billing/tiers'

interface CoachSectionProps {
  teamId: string
  teamName: string
  teamPlan: string
  subscriptionTier: SubscriptionTier
  vibeAverageScore: number | null
  vibeParticipation: number
  wowSessions: WowSessionWithStats[]
}

export function CoachSection({
  teamId,
  teamName,
  teamPlan,
  subscriptionTier,
  vibeAverageScore,
  vibeParticipation,
  wowSessions,
}: CoachSectionProps) {
  const t = useTranslation()

  const deltaTensions = wowSessions
    .filter(s => s.status === 'closed' && s.overall_score != null && s.overall_score < 3.5)
    .map(s => ({ area: s.angle, score: s.overall_score as number }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)

  return (
    <div className="pt-3">
      {/* Free: ProGate paywall */}
      {teamPlan === 'free' && (
        <ProGate teamId={teamId} isPro={false} feature="billingCoachFeature">
          <CoachQuestions
            pulseScore={vibeAverageScore}
            pulseParticipation={vibeParticipation}
            deltaTensions={deltaTensions}
            teamName={teamName}
          />
        </ProGate>
      )}

      {/* Scrum Master: Smart Questions (rule-based) */}
      {teamPlan === 'pro' && subscriptionTier === 'scrum_master' && (
        <div className="space-y-6">
          <div className="bg-stone-50 dark:bg-stone-700/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 dark:text-stone-100">{t('smartQuestionsTitle')}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">{t('smartQuestionsSubtitle')}</p>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-emerald-800 dark:text-emerald-300 italic">{t('coachQuestionsExample')}</p>
            </div>

            <CoachQuestions
              pulseScore={vibeAverageScore}
              pulseParticipation={vibeParticipation}
              deltaTensions={deltaTensions}
              teamName={teamName}
            />
          </div>
        </div>
      )}

      {/* Agile Coach + Transition Coach: AI Coach */}
      {teamPlan === 'pro' && (subscriptionTier === 'agile_coach' || subscriptionTier === 'transition_coach') && (
        <AiCoach
          teamId={teamId}
          teamName={teamName}
          subscriptionTier={subscriptionTier}
        />
      )}
    </div>
  )
}
