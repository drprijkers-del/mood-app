/**
 * Vibe Metrics Types
 *
 * Core metrics for team signal monitoring.
 * Designed for Scrum Masters to quickly understand team state.
 */

// Confidence levels based on participation rate
export type ConfidenceLevel = 'low' | 'moderate' | 'high'

// Trend direction
export type TrendDirection = 'rising' | 'stable' | 'declining'

// Zone labels (replaces raw numbers for display)
export type VibeZone = 'under_pressure' | 'mixed_signals' | 'steady_state' | 'high_confidence'

// Day state - creates tension and closure
export type DayState = 'day_forming' | 'signal_emerging' | 'day_complete'

// Week state - creates anticipation and rhythm
export type WeekState = 'week_building' | 'signal_forming' | 'week_complete'

// Data maturity - progression without badges
export type DataMaturity = 'calibrating' | 'establishing_baseline' | 'pattern_forming' | 'reliable_signal'

// Individual metric with trend
export interface VibeMetric {
  value: number | null           // Raw average (null if no data)
  zone: VibeZone | null         // Semantic zone
  trend: TrendDirection          // Direction compared to previous period
  delta: number                  // Change from previous period
  entryCount: number             // Number of entries this period
  participantCount: number       // Total team participants
  confidence: ConfidenceLevel    // Based on participation rate
}

// Complete metrics set for a team
export interface TeamMetrics {
  // Current state
  liveVibe: VibeMetric         // Today, real-time

  // Historical reference
  dayVibe: VibeMetric          // Yesterday (last completed day)
  weekVibe: VibeMetric         // 7-day rolling average
  previousWeekVibe: VibeMetric // Previous 7 days (for week-over-week)

  // Momentum indicator
  momentum: {
    direction: TrendDirection
    velocity: 'slow' | 'moderate' | 'fast'  // How quickly trending
    daysTrending: number                     // Consecutive days in direction
  }

  // Participation health
  participation: {
    today: number                // Entries today
    teamSize: number             // Total participants
    rate: number                 // Percentage (0-100)
    trend: TrendDirection        // vs previous period
  }

  // Temporal state - creates rhythm and closure
  dayState: DayState             // Current day's completion state
  weekState: WeekState           // Current week's completion state

  // Data maturity - progression model
  maturity: {
    level: DataMaturity
    daysOfData: number           // Total days with check-ins
    consistencyRate: number      // % of days with 30%+ participation
  }

  // Metadata
  lastUpdated: string            // ISO timestamp
  hasEnoughData: boolean         // Minimum threshold met
}

// Daily data point for trends
export interface DailyVibe {
  date: string                   // YYYY-MM-DD
  average: number
  count: number
  participantCount: number
}

// Insight generated from metrics
export interface VibeInsight {
  id: string
  type: 'trend' | 'participation' | 'pattern' | 'milestone'
  severity: 'info' | 'attention' | 'warning'
  message: string
  detail?: string
  suggestions?: string[]
  data?: Record<string, unknown>
}
