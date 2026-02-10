import type { Metadata } from 'next'
import { validateSessionCode } from '@/domain/wow/actions'
import { ParticipationContent } from '@/components/wow/participation-content'
import { InvalidSession } from '@/components/wow/invalid-session'

const ANGLE_LABELS: Record<string, string> = {
  scrum: 'Scrum', flow: 'Flow', ownership: 'Ownership', collaboration: 'Collaboration',
  technical_excellence: 'Technical Excellence', refinement: 'Refinement', planning: 'Planning',
  retro: 'Retro', demo: 'Demo', obeya: 'Obeya', dependencies: 'Dependencies',
  psychological_safety: 'Psych Safety', devops: 'DevOps', stakeholder: 'Stakeholders', leadership: 'Leadership',
}

interface ParticipationPageProps {
  params: Promise<{ sessionCode: string }>
}

export async function generateMetadata({ params }: ParticipationPageProps): Promise<Metadata> {
  const { sessionCode } = await params
  const validation = await validateSessionCode(sessionCode)

  if (!validation.valid || !validation.session) {
    return { title: 'Pulse Labs' }
  }

  const { team_name, angle, title } = validation.session
  const angleLabel = ANGLE_LABELS[angle] || angle
  const pageTitle = title || `${angleLabel} — ${team_name}`
  const description = `Help ${team_name} hun werkwijze verbeteren. Deel jouw perspectief op ${angleLabel}.`
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://pulse-labs.io').trim()

  return {
    title: `${pageTitle} | Pulse Labs`,
    description,
    openGraph: {
      title: pageTitle,
      description,
      siteName: 'Pulse Labs',
      type: 'website',
      url: `${baseUrl}/d/${sessionCode}`,
      images: [{
        url: `${baseUrl}/d/${sessionCode}/og`,
        width: 1200,
        height: 630,
        alt: `${team_name} — ${angleLabel}`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
    },
  }
}

export default async function ParticipationPage({ params }: ParticipationPageProps) {
  const { sessionCode } = await params

  const validation = await validateSessionCode(sessionCode)

  if (!validation.valid || !validation.session) {
    return <InvalidSession />
  }

  return (
    <ParticipationContent
      sessionId={validation.session.id}
      teamName={validation.session.team_name}
      angle={validation.session.angle}
      title={validation.session.title}
      wowLevel={validation.session.wow_level}
      teamSize={validation.session.team_size}
    />
  )
}
