import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getTeamContext, hashToken } from '@/lib/tenant/context'
import { TeamResultsView } from '@/components/team/team-results-view'
import { InvalidLink } from '@/components/team/invalid-link'
import crypto from 'crypto'

interface ResultsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ k?: string; error?: string }>
}

const TEAM_COOKIE_NAME = 'mood_team_session'
const DEVICE_COOKIE_NAME = 'mood_device_id'

export default async function ResultsPage({ params, searchParams }: ResultsPageProps) {
  const { slug } = await params
  const { k: token, error } = await searchParams

  // Show error if redirected with error
  if (error === 'invalid') {
    return <InvalidLink message="Deze link is niet geldig of verlopen." />
  }

  // If token is provided, validate it directly and render the page
  if (token) {
    const supabase = await createClient()
    const tokenHash = hashToken(token)

    // Validate token
    const { data: teamData, error: tokenError } = await supabase
      .rpc('validate_invite_token', { p_token_hash: tokenHash })

    if (tokenError || !teamData || teamData.length === 0) {
      return <InvalidLink message="Deze link is niet geldig of verlopen." />
    }

    const team = teamData[0]

    // Verify slug matches
    if (team.team_slug !== slug) {
      return <InvalidLink message="Deze link is niet geldig of verlopen." />
    }

    // Get or create device ID
    const cookieStore = await cookies()
    let deviceId = cookieStore.get(DEVICE_COOKIE_NAME)?.value
    if (!deviceId) {
      deviceId = crypto.randomUUID()
    }

    // Set cookies for future visits
    const session = JSON.stringify({
      teamId: team.team_id,
      teamSlug: team.team_slug,
      teamName: team.team_name,
      deviceId,
    })

    cookieStore.set(DEVICE_COOKIE_NAME, deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })

    cookieStore.set(TEAM_COOKIE_NAME, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    // Render the page directly with validated data
    return <TeamResultsView teamName={team.team_name} teamSlug={team.team_slug} />
  }

  // No token - check existing cookie
  const context = await getTeamContext()

  if (!context || context.teamSlug !== slug) {
    return <InvalidLink message="Je hebt geen toegang tot deze resultaten. Gebruik de uitnodigingslink." />
  }

  return <TeamResultsView teamName={context.teamName} teamSlug={context.teamSlug} />
}
