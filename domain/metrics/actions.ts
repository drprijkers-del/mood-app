'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import type { TeamMetrics, DailyPulse, PulseInsight } from './types'
import {
  buildPulseMetric,
  calculateMomentum,
  calculateConfidence,
  calculateTrend,
  hasMinimumData,
} from './calculations'

/**
 * Get comprehensive metrics for a team
 */
export async function getTeamMetrics(teamId: string): Promise<TeamMetrics | null> {
  const adminUser = await requireAdmin()
  const supabase = await createClient()

  // Verify team access
  const { data: team } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single()

  if (!team) return null
  if (adminUser.role !== 'super_admin' && team.owner_id !== adminUser.id) {
    return null
  }

  // Get participant count
  const { count: participantCount } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)

  const totalParticipants = participantCount || 0

  // Get last 14 days of data for calculations
  const { data: rawHistory } = await supabase
    .rpc('get_team_trend', { p_team_id: teamId })

  const history: DailyPulse[] = (rawHistory || []).map((d: { date: string; average: number; count: number }) => ({
    date: d.date,
    average: d.average,
    count: d.count,
    participantCount: totalParticipants,
  }))

  // Get today's date
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Split data by time periods
  const todayData = history.filter(d => d.date === today)
  const yesterdayData = history.filter(d => d.date === yesterday)
  const last7Days = history.filter(d => {
    const date = new Date(d.date)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
    return date >= sevenDaysAgo
  })
  const previous7Days = history.filter(d => {
    const date = new Date(d.date)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000)
    return date >= fourteenDaysAgo && date < sevenDaysAgo
  })

  // Build metrics
  const livePulse = buildPulseMetric(todayData, yesterdayData, totalParticipants)
  const dayPulse = buildPulseMetric(yesterdayData, [], totalParticipants)
  const weekPulse = buildPulseMetric(last7Days, previous7Days, totalParticipants)
  const previousWeekPulse = buildPulseMetric(previous7Days, [], totalParticipants)

  // Calculate momentum
  const momentum = calculateMomentum(last7Days)

  // Today's participation
  const todayEntries = todayData.reduce((sum, d) => sum + d.count, 0)
  const yesterdayEntries = yesterdayData.reduce((sum, d) => sum + d.count, 0)

  return {
    livePulse,
    dayPulse,
    weekPulse,
    previousWeekPulse,
    momentum,
    participation: {
      today: todayEntries,
      teamSize: totalParticipants,
      rate: totalParticipants > 0 ? Math.round((todayEntries / totalParticipants) * 100) : 0,
      trend: calculateTrend(todayEntries - yesterdayEntries),
    },
    lastUpdated: new Date().toISOString(),
    hasEnoughData: hasMinimumData(last7Days.reduce((sum, d) => sum + d.count, 0)),
  }
}

/**
 * Generate insights from team metrics
 */
export async function getTeamInsights(teamId: string): Promise<PulseInsight[]> {
  const metrics = await getTeamMetrics(teamId)
  if (!metrics) return []

  const insights: PulseInsight[] = []

  // Low confidence warning
  if (metrics.livePulse.confidence === 'low' && metrics.participation.teamSize > 0) {
    insights.push({
      id: 'low-participation',
      type: 'participation',
      severity: 'info',
      message: 'Limited data today',
      detail: `${metrics.participation.today} of ${metrics.participation.teamSize} team members have checked in.`,
      suggestions: [
        'Share the check-in link as a reminder',
        'Check if the timing works for the team',
      ],
    })
  }

  // Declining trend
  if (metrics.momentum.direction === 'declining' && metrics.momentum.daysTrending >= 3) {
    insights.push({
      id: 'declining-trend',
      type: 'trend',
      severity: 'attention',
      message: `Pulse has been lower for ${metrics.momentum.daysTrending} days`,
      detail: 'This sustained pattern may indicate increased pressure or challenges.',
      suggestions: [
        'Check in with the team about workload',
        'Review any recent changes that might have impacted the team',
        'Consider discussing in the next retrospective',
      ],
    })
  }

  // Rising trend (positive)
  if (metrics.momentum.direction === 'rising' && metrics.momentum.daysTrending >= 3) {
    insights.push({
      id: 'rising-trend',
      type: 'trend',
      severity: 'info',
      message: `Pulse has been improving for ${metrics.momentum.daysTrending} days`,
      detail: 'The team appears to be in a positive trend.',
      suggestions: [
        'Consider noting what might be contributing to this',
        'Capture learnings that could help sustain it',
      ],
    })
  }

  // Under pressure zone
  if (metrics.weekPulse.zone === 'under_pressure' && metrics.weekPulse.confidence !== 'low') {
    insights.push({
      id: 'under-pressure',
      type: 'pattern',
      severity: 'warning',
      message: 'Week pulse indicates pressure',
      detail: 'The team average suggests sustained stress or challenges.',
      suggestions: [
        'Have an open conversation about workload',
        'Review sprint scope and commitments',
        'Check for blockers or unclear priorities',
      ],
    })
  }

  // Week-over-week significant drop
  if (metrics.weekPulse.value && metrics.previousWeekPulse.value) {
    const weekDelta = metrics.weekPulse.value - metrics.previousWeekPulse.value
    if (weekDelta <= -0.5) {
      insights.push({
        id: 'week-drop',
        type: 'trend',
        severity: 'attention',
        message: 'Significant drop compared to last week',
        detail: `Week pulse is ${Math.abs(weekDelta).toFixed(1)} lower than the previous week.`,
        suggestions: [
          'What changed this week?',
          'Are there external factors affecting the team?',
          'Is the sprint on track?',
        ],
      })
    }
  }

  return insights
}

/**
 * Get the fly animation frequency based on metrics
 * Returns 'none' | 'rare' | 'medium' | 'high'
 */
export async function getFlyFrequency(teamId: string): Promise<'none' | 'rare' | 'medium' | 'high'> {
  const metrics = await getTeamMetrics(teamId)
  if (!metrics || !metrics.hasEnoughData) return 'rare'

  // High frequency: under pressure for 3+ days
  if (
    metrics.weekPulse.zone === 'under_pressure' &&
    metrics.momentum.direction === 'declining' &&
    metrics.momentum.daysTrending >= 3
  ) {
    return 'high'
  }

  // Medium: declining trend
  if (metrics.momentum.direction === 'declining' && metrics.momentum.daysTrending >= 2) {
    return 'medium'
  }

  // Rare: occasional appearance for healthy teams
  return 'rare'
}
