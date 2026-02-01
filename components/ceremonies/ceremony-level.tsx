'use client'

import { useTranslation } from '@/lib/i18n/context'
import {
  type CeremonyLevel,
  type LevelProgress,
  type LevelRisk,
  getLevelInfo,
  getUnlockRequirements,
  CEREMONY_LEVELS,
} from '@/domain/ceremonies/types'

interface CeremonyLevelProps {
  level: CeremonyLevel
  progress?: LevelProgress | null
  risk?: LevelRisk | null
  compact?: boolean
}

export function CeremonyLevelDisplay({
  level,
  progress,
  risk,
  compact = false,
}: CeremonyLevelProps) {
  const t = useTranslation()
  const levelInfo = getLevelInfo(level)
  const levelIndex = CEREMONY_LEVELS.findIndex(l => l.id === level)
  const isMaxLevel = level === 'ri'

  // Get unlock requirements for next level
  const requirements = progress ? getUnlockRequirements(level, progress) : []
  const metRequirements = requirements.filter(r => r.met).length
  const totalRequirements = requirements.length
  const progressPercent = totalRequirements > 0
    ? Math.round((metRequirements / totalRequirements) * 100)
    : 100

  // Level colors
  const levelColors = {
    shu: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-700 dark:text-amber-400',
      kanji: 'text-amber-600 dark:text-amber-400',
      progress: 'bg-amber-500',
    },
    ha: {
      bg: 'bg-cyan-100 dark:bg-cyan-900/30',
      border: 'border-cyan-300 dark:border-cyan-700',
      text: 'text-cyan-700 dark:text-cyan-400',
      kanji: 'text-cyan-600 dark:text-cyan-400',
      progress: 'bg-cyan-500',
    },
    ri: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      border: 'border-purple-300 dark:border-purple-700',
      text: 'text-purple-700 dark:text-purple-400',
      kanji: 'text-purple-600 dark:text-purple-400',
      progress: 'bg-purple-500',
    },
  }

  const colors = levelColors[level]

  // Compact version - just a badge
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${colors.bg} ${colors.border} border`}>
        <span className={`text-lg font-bold ${colors.kanji}`}>{levelInfo.kanji}</span>
        <span className={`text-sm font-medium ${colors.text}`}>{levelInfo.label}</span>
      </div>
    )
  }

  return (
    <div className={`rounded-xl ${colors.border} border ${colors.bg} p-4 sm:p-5`}>
      {/* Level header */}
      <div className="flex items-start gap-4">
        {/* Kanji character */}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-stone-800 border ${colors.border} flex items-center justify-center`}>
          <span className={`text-3xl sm:text-4xl font-bold ${colors.kanji}`}>
            {levelInfo.kanji}
          </span>
        </div>

        {/* Level info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className={`text-lg font-bold ${colors.text}`}>
              {levelInfo.label}
            </h3>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {levelInfo.subtitle}
            </span>
          </div>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {levelInfo.description}
          </p>

          {/* Risk indicator */}
          {risk && risk.state !== 'none' && (
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              <span className="text-amber-500">⚠</span>
              <span className="text-amber-700 dark:text-amber-400">
                {risk.reason || t('levelRiskGeneric')}
              </span>
            </div>
          )}
        </div>

        {/* Level progress indicator (dots) */}
        <div className="flex gap-1.5">
          {CEREMONY_LEVELS.map((l, i) => (
            <div
              key={l.id}
              className={`w-3 h-3 rounded-full ${
                i <= levelIndex
                  ? levelColors[l.id].progress
                  : 'bg-stone-200 dark:bg-stone-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress to next level */}
      {!isMaxLevel && progress && (
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
              {t('levelProgressTitle')}
            </span>
            <span className="text-sm text-stone-500 dark:text-stone-400">
              {metRequirements}/{totalRequirements}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full ${colors.progress} transition-all duration-500`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Requirements checklist */}
          <div className="grid gap-2 sm:grid-cols-2">
            {requirements.map((req) => (
              <div
                key={req.key}
                className={`flex items-center gap-2 text-sm ${
                  req.met
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {req.met ? (
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                )}
                <span>{req.label}</span>
                {!req.met && req.current !== undefined && (
                  <span className="text-stone-400 dark:text-stone-500">
                    ({req.current})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Max level message */}
      {isMaxLevel && (
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
            <span className="text-lg">✦</span>
            <span>{t('levelMaxReached')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Question depth badge for ceremony list
export function QuestionDepthBadge({ level }: { level: CeremonyLevel }) {
  const levelInfo = getLevelInfo(level)

  const badgeColors = {
    shu: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    ha: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
    ri: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border ${badgeColors[level]}`}>
      <span className="font-bold">{levelInfo.kanji}</span>
      {levelInfo.questionDepth}
    </span>
  )
}
