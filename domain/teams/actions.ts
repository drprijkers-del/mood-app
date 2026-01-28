'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/admin'
import { generateSlug } from '@/lib/utils'
import { hashToken, generateToken } from '@/lib/tenant/context'
import { revalidatePath } from 'next/cache'

export interface Team {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface TeamWithStats extends Team {
  participantCount: number
  todayEntries: number
  activeLink?: {
    id: string
    token?: string // Only included when newly created
  }
}

export async function getTeams(): Promise<TeamWithStats[]> {
  await requireAdmin()
  const supabase = await createClient()

  const { data: teams, error } = await supabase
    .from('teams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Get stats for each team
  const teamsWithStats: TeamWithStats[] = await Promise.all(
    (teams || []).map(async (team) => {
      const { count: participantCount } = await supabase
        .from('participants')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id)

      const { count: todayEntries } = await supabase
        .from('mood_entries')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id)
        .eq('entry_date', new Date().toISOString().split('T')[0])

      const { data: activeLink } = await supabase
        .from('invite_links')
        .select('id')
        .eq('team_id', team.id)
        .eq('is_active', true)
        .single()

      return {
        ...team,
        participantCount: participantCount || 0,
        todayEntries: todayEntries || 0,
        activeLink: activeLink || undefined,
      }
    })
  )

  return teamsWithStats
}

export async function getTeam(id: string): Promise<TeamWithStats | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !team) return null

  const { count: participantCount } = await supabase
    .from('participants')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', team.id)

  const { count: todayEntries } = await supabase
    .from('mood_entries')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', team.id)
    .eq('entry_date', new Date().toISOString().split('T')[0])

  const { data: activeLink } = await supabase
    .from('invite_links')
    .select('id')
    .eq('team_id', team.id)
    .eq('is_active', true)
    .single()

  return {
    ...team,
    participantCount: participantCount || 0,
    todayEntries: todayEntries || 0,
    activeLink: activeLink || undefined,
  }
}

export async function createTeam(formData: FormData): Promise<{ success: boolean; teamId?: string; error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string | null

  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Team name is required (min 2 characters)' }
  }

  const slug = generateSlug(name)

  // Check if slug exists
  const { data: existing } = await supabase
    .from('teams')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return { success: false, error: 'A team with this name already exists' }
  }

  // Create team
  const { data: team, error } = await supabase
    .from('teams')
    .insert({ name: name.trim(), slug, description: description?.trim() || null })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  // Create initial invite link
  const token = generateToken()
  const tokenHash = hashToken(token)

  await supabase
    .from('invite_links')
    .insert({ team_id: team.id, token_hash: tokenHash })

  revalidatePath('/admin/teams')

  return { success: true, teamId: team.id }
}

export async function updateTeam(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string | null

  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Team name is required (min 2 characters)' }
  }

  const { error } = await supabase
    .from('teams')
    .update({
      name: name.trim(),
      description: description?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/teams')
  revalidatePath(`/admin/teams/${id}`)

  return { success: true }
}

export async function deleteTeam(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/teams')

  return { success: true }
}

export async function resetTeam(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  const supabase = await createAdminClient()

  // Delete all mood entries for this team
  const { error: moodError } = await supabase
    .from('mood_entries')
    .delete()
    .eq('team_id', id)

  if (moodError) {
    return { success: false, error: moodError.message }
  }

  // Delete all participants for this team
  const { error: participantError } = await supabase
    .from('participants')
    .delete()
    .eq('team_id', id)

  if (participantError) {
    return { success: false, error: participantError.message }
  }

  revalidatePath('/admin/teams')
  revalidatePath(`/admin/teams/${id}`)

  return { success: true }
}

export async function regenerateInviteLink(teamId: string): Promise<{ success: boolean; token?: string; error?: string }> {
  await requireAdmin()
  const supabase = await createClient()

  // Deactivate old links
  await supabase
    .from('invite_links')
    .update({ is_active: false })
    .eq('team_id', teamId)

  // Create new link
  const token = generateToken()
  const tokenHash = hashToken(token)

  const { error } = await supabase
    .from('invite_links')
    .insert({ team_id: teamId, token_hash: tokenHash })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/admin/teams/${teamId}`)

  return { success: true, token }
}

export async function getShareLink(teamId: string): Promise<{ url: string; token: string } | null> {
  await requireAdmin()
  const supabase = await createAdminClient()

  // Get team slug
  const { data: team } = await supabase
    .from('teams')
    .select('slug')
    .eq('id', teamId)
    .single()

  if (!team) return null

  // Get active invite link - we need to create a new token since we don't store raw tokens
  const token = generateToken()
  const tokenHash = hashToken(token)

  // Deactivate old links and create new one
  await supabase
    .from('invite_links')
    .update({ is_active: false })
    .eq('team_id', teamId)

  await supabase
    .from('invite_links')
    .insert({ team_id: teamId, token_hash: tokenHash })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    url: `${baseUrl}/t/${team.slug}?k=${token}`,
    token,
  }
}

export async function getTeamMoodHistory(teamId: string, days: number = 7): Promise<{
  date: string
  average: number
  count: number
}[]> {
  await requireAdmin()
  const supabase = await createClient()

  const { data } = await supabase
    .rpc('get_team_trend', { p_team_id: teamId })

  return data || []
}
