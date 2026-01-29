'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/lib/i18n/context'
import type { TeamMetrics, PulseInsight } from '@/domain/metrics/types'
import {
  getZoneLabel,
  getZoneColor,
  getTrendArrow,
  getTrendColor,
  getConfidenceLabel,
  formatParticipationRate,
} from '@/domain/metrics/calculations'

interface PulseMetricsProps {
  metrics: TeamMetrics
  insights: PulseInsight[]
}

export function PulseMetrics({ metrics, insights }: PulseMetricsProps) {
  const { language } = useLanguage()

  const labels = {
    nl: {
      weekPulse: 'Week Pulse',
      today: 'Vandaag',
      yesterday: 'Gisteren',
      weekChange: 'Δ Week',
      participation: 'Deelname',
      of: 'van',
      entries: 'check-ins',
      insights: 'Signalen',
      noData: 'Onvoldoende data',
      noDataDetail: 'Minimaal 3 check-ins nodig voor betrouwbare metrics.',
    },
    en: {
      weekPulse: 'Week Pulse',
      today: 'Today',
      yesterday: 'Yesterday',
      weekChange: 'Δ Week',
      participation: 'Participation',
      of: 'of',
      entries: 'check-ins',
      insights: 'Signals',
      noData: 'Insufficient data',
      noDataDetail: 'Minimum 3 check-ins required for reliable metrics.',
    },
  }

  const t = labels[language]

  // Not enough data
  if (!metrics.hasEnoughData) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="text-4xl mb-4 opacity-50">📊</div>
          <h3 className="font-semibold text-stone-700 mb-2">{t.noData}</h3>
          <p className="text-sm text-stone-500">{t.noDataDetail}</p>
          <div className="mt-4 text-sm text-stone-400">
            {metrics.participation.today} {t.of} {metrics.participation.teamSize} {t.entries}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main metric: Week Pulse */}
      <Card className="overflow-hidden">
        <CardContent className="py-6">
          <div className="text-center">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-2">{t.weekPulse}</p>

            {/* Zone display */}
            <div className={`inline-block px-4 py-2 rounded-xl mb-2 ${getZoneColor(metrics.weekPulse.zone)}`}>
              <span className="text-lg font-semibold">
                {getZoneLabel(metrics.weekPulse.zone, language)}
              </span>
            </div>

            {/* Trend indicator */}
            <div className={`flex items-center justify-center gap-1 ${getTrendColor(metrics.weekPulse.trend)}`}>
              <span className="text-xl">{getTrendArrow(metrics.weekPulse.trend)}</span>
              {metrics.weekPulse.delta !== 0 && (
                <span className="text-sm">
                  {metrics.weekPulse.delta > 0 ? '+' : ''}{metrics.weekPulse.delta.toFixed(1)}
                </span>
              )}
            </div>

            {/* Confidence */}
            <p className="text-xs text-stone-400 mt-2">
              {getConfidenceLabel(metrics.weekPulse.confidence, language)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Secondary metrics grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Today */}
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-stone-400 mb-1">{t.today}</p>
            {metrics.livePulse.value !== null ? (
              <>
                <div className="text-2xl font-bold text-stone-900">
                  {metrics.livePulse.value.toFixed(1)}
                </div>
                <div className={`text-sm ${getTrendColor(metrics.livePulse.trend)}`}>
                  {getTrendArrow(metrics.livePulse.trend)}
                </div>
              </>
            ) : (
              <div className="text-lg text-stone-300">—</div>
            )}
          </CardContent>
        </Card>

        {/* Yesterday */}
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-stone-400 mb-1">{t.yesterday}</p>
            {metrics.dayPulse.value !== null ? (
              <div className="text-2xl font-bold text-stone-900">
                {metrics.dayPulse.value.toFixed(1)}
              </div>
            ) : (
              <div className="text-lg text-stone-300">—</div>
            )}
          </CardContent>
        </Card>

        {/* Week delta */}
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-xs text-stone-400 mb-1">{t.weekChange}</p>
            {metrics.weekPulse.value !== null && metrics.previousWeekPulse.value !== null ? (
              <div className={`text-2xl font-bold ${getTrendColor(metrics.weekPulse.trend)}`}>
                {(metrics.weekPulse.value - metrics.previousWeekPulse.value) > 0 ? '+' : ''}
                {(metrics.weekPulse.value - metrics.previousWeekPulse.value).toFixed(1)}
              </div>
            ) : (
              <div className="text-lg text-stone-300">—</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Participation bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-stone-600">{t.participation}</span>
            <span className="text-sm font-medium text-stone-900">
              {metrics.participation.today} {t.of} {metrics.participation.teamSize}
            </span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                metrics.participation.rate >= 60
                  ? 'bg-cyan-500'
                  : metrics.participation.rate >= 30
                    ? 'bg-amber-400'
                    : 'bg-stone-300'
              }`}
              style={{ width: `${Math.min(metrics.participation.rate, 100)}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {formatParticipationRate(metrics.participation.today, metrics.participation.teamSize)}
          </p>
        </CardContent>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <h3 className="text-sm font-medium text-stone-700 mb-3">{t.insights}</h3>
            <div className="space-y-3">
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} language={language} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InsightCard({ insight, language }: { insight: PulseInsight; language: 'nl' | 'en' }) {
  const severityColors = {
    info: 'border-stone-200 bg-stone-50',
    attention: 'border-amber-200 bg-amber-50',
    warning: 'border-red-200 bg-red-50',
  }

  const severityIcons = {
    info: '💡',
    attention: '⚡',
    warning: '⚠️',
  }

  const checkLabel = language === 'nl' ? 'Wat je zou kunnen checken' : 'What you could check'

  return (
    <div className={`rounded-xl border p-3 ${severityColors[insight.severity]}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm">{severityIcons[insight.severity]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-800">{insight.message}</p>
          {insight.detail && (
            <p className="text-xs text-stone-600 mt-1">{insight.detail}</p>
          )}
          {insight.suggestions && insight.suggestions.length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-cyan-600 cursor-pointer hover:text-cyan-700">
                {checkLabel}
              </summary>
              <ul className="mt-2 text-xs text-stone-600 space-y-1 pl-4">
                {insight.suggestions.map((s, i) => (
                  <li key={i} className="list-disc">{s}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
