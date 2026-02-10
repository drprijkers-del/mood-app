'use client'

import { FeedbackTool } from '@/components/teams/feedback-tool'

interface FeedbackSectionProps {
  teamId: string
  teamName: string
}

export function FeedbackSection({ teamId, teamName }: FeedbackSectionProps) {
  return (
    <div className="pt-3">
      <FeedbackTool teamId={teamId} teamName={teamName} />
    </div>
  )
}
