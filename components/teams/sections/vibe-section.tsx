'use client'

import { deactivateShareLink } from '@/domain/teams/actions'
import { useTranslation } from '@/lib/i18n/context'
import { VibeMetrics } from '@/components/admin/vibe-metrics'
import type { TeamMetrics, VibeInsight } from '@/domain/metrics/types'

interface VibeSectionProps {
  teamId: string
  shareUrl: string | null
  setShareUrl: (url: string | null) => void
  shareLoading: boolean
  setShareLoading: (loading: boolean) => void
  showVibeAdvanced: boolean
  setShowVibeAdvanced: (show: boolean) => void
  handleGetShareLink: () => Promise<void>
  vibeMetrics?: TeamMetrics | null
  vibeInsights?: VibeInsight[]
  resultsCopied: boolean
  setResultsCopied: (copied: boolean) => void
}

export function VibeSection({
  teamId,
  shareUrl,
  setShareUrl,
  shareLoading,
  setShareLoading,
  showVibeAdvanced,
  setShowVibeAdvanced,
  handleGetShareLink,
  vibeMetrics,
  vibeInsights = [],
  resultsCopied,
  setResultsCopied,
}: VibeSectionProps) {
  const t = useTranslation()

  const steps = [t('vibeStep1'), t('vibeStep2'), t('vibeStep3'), t('vibeStep4')]

  return (
    <div className="space-y-6 pt-3">
      {/* How Vibe works */}
      <div className="space-y-3">
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          {t('vibeExplanation')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-700/30">
              <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-300 leading-snug">{step}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 dark:text-stone-500 italic leading-relaxed">
          {t('vibeTrustNote')}
        </p>
      </div>

      {/* Links & Actions */}
      <div className="bg-stone-50 dark:bg-stone-700/30 rounded-xl overflow-hidden">
        <div className="divide-y divide-stone-100 dark:divide-stone-700">
          {/* Share link row */}
          {shareUrl ? (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-stone-900 dark:text-stone-100">{t('shareReady')}</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400 truncate">{shareUrl}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-600 text-stone-400 dark:text-stone-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {t('shareCopy')}
                </button>
                <button
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-600 text-stone-400 dark:text-stone-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                >
                  {t('shareOpen')}
                </button>
              </div>
            </div>
          ) : shareLoading ? (
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-600 flex items-center justify-center shrink-0 animate-pulse">
                <svg className="w-5 h-5 text-stone-400 dark:text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-stone-900 dark:text-stone-100">{t('shareLoading')}</div>
                <div className="text-sm text-stone-500 dark:text-stone-400">{t('shareLoadingDetail')}</div>
              </div>
            </div>
          ) : (
            /* Ghost tile — create share link */
            <button
              onClick={handleGetShareLink}
              className="flex items-center gap-3 p-4 w-full text-left group hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg border-2 border-dashed border-stone-200 dark:border-stone-600 group-hover:border-cyan-400 dark:group-hover:border-cyan-600 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-stone-400 dark:text-stone-500 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <span className="block text-sm font-medium text-stone-400 dark:text-stone-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {t('shareCreate')}
                </span>
                <span className="block text-xs text-stone-400 dark:text-stone-500">
                  {t('shareNotCreatedDetail')}
                </span>
              </div>
            </button>
          )}

          {/* Results row */}
          {shareUrl && (
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-stone-900 dark:text-stone-100">{t('shareResultsTitle')}</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">{t('shareResultsDescription')}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => {
                    const resultsUrl = shareUrl.replace('/vibe/t/', '/results/')
                    navigator.clipboard.writeText(resultsUrl)
                    setResultsCopied(true)
                    setTimeout(() => setResultsCopied(false), 2000)
                  }}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-600 text-stone-400 dark:text-stone-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {resultsCopied ? t('shareCopied') : t('shareCopy')}
                </button>
                <button
                  onClick={() => {
                    const resultsUrl = shareUrl.replace('/vibe/t/', '/results/')
                    window.open(resultsUrl, '_blank')
                  }}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-600 text-stone-400 dark:text-stone-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('shareOpen')}
                </button>
              </div>
            </div>
          )}

          {/* Advanced toggle row */}
          {shareUrl && (
            <button
              onClick={() => setShowVibeAdvanced(!showVibeAdvanced)}
              className="flex items-center justify-between p-4 w-full hover:bg-stone-100 dark:hover:bg-stone-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-500 dark:text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-medium text-sm text-stone-600 dark:text-stone-300">{t('shareAdvanced')}</span>
              </div>
              <svg className={`w-4 h-4 text-stone-400 transition-transform ${showVibeAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Advanced panel */}
        {showVibeAdvanced && (
          <div className="border-t border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 divide-y divide-stone-200 dark:divide-stone-700">
            {/* Reset row */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-900 dark:text-stone-100">{t('shareResetTitle')}</div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{t('shareResetInfo')}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!confirm(t('shareResetConfirm'))) return
                  setShareUrl(null)
                  await handleGetShareLink()
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors shrink-0 ml-3"
              >
                {t('shareResetButton')}
              </button>
            </div>

            {/* Deactivate row */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-stone-900 dark:text-stone-100">{t('shareDeactivateTitle')}</div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{t('shareDeactivateInfo')}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (!confirm(t('shareDeactivateConfirm'))) return
                  setShareLoading(true)
                  const result = await deactivateShareLink(teamId)
                  if (result.success) {
                    setShareUrl(null)
                    setShowVibeAdvanced(false)
                  } else {
                    alert(result.error || 'Could not deactivate link')
                  }
                  setShareLoading(false)
                }}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors shrink-0 ml-3"
              >
                {t('shareDeactivateButton')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vibe Metrics */}
      {vibeMetrics && (
        <VibeMetrics metrics={vibeMetrics} insights={vibeInsights || []} />
      )}
    </div>
  )
}
