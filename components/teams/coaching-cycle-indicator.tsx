'use client'

import { useTranslation } from '@/lib/i18n/context'

type CyclePhase = 'observe' | 'sense' | 'prepare'

interface CoachingCycleIndicatorProps {
  phase: CyclePhase
}

const PHASES: { id: CyclePhase; key: 'cycleObserve' | 'cycleSense' | 'cyclePrepare' | 'cycleDiscuss' }[] = [
  { id: 'observe', key: 'cycleObserve' },
  { id: 'sense', key: 'cycleSense' },
  { id: 'prepare', key: 'cyclePrepare' },
]

export function CoachingCycleIndicator({ phase }: CoachingCycleIndicatorProps) {
  const t = useTranslation()

  return (
    <div className="flex items-center gap-1 py-2 px-1">
      {PHASES.map((p, idx) => {
        const isActive = p.id === phase
        const isPast = PHASES.findIndex(x => x.id === phase) > idx
        return (
          <div key={p.id} className="flex items-center gap-1">
            {idx > 0 && (
              <div className={`w-6 sm:w-10 h-px ${isPast || isActive ? 'bg-emerald-300 dark:bg-emerald-700' : 'bg-stone-200 dark:bg-stone-700'}`} />
            )}
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                isActive ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800' :
                isPast ? 'bg-emerald-400 dark:bg-emerald-600' :
                'bg-stone-300 dark:bg-stone-600'
              }`} />
              <span className={`text-[11px] whitespace-nowrap ${
                isActive ? 'font-medium text-emerald-700 dark:text-emerald-400' :
                isPast ? 'text-stone-500 dark:text-stone-400' :
                'text-stone-400 dark:text-stone-500'
              }`}>
                {t(p.key)}
              </span>
            </div>
          </div>
        )
      })}
      {/* Discuss — always open/future */}
      <div className="flex items-center gap-1">
        <div className="w-6 sm:w-10 h-px bg-stone-200 dark:bg-stone-700" />
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full shrink-0 bg-stone-200 dark:bg-stone-700 border border-stone-300 dark:border-stone-600 border-dashed" />
          <span className="text-[11px] text-stone-400 dark:text-stone-500 whitespace-nowrap">
            {t('cycleDiscuss')}
          </span>
        </div>
      </div>
    </div>
  )
}
