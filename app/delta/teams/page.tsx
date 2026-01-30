import { getTeams } from '@/domain/teams/actions'
import { TeamsListContent } from '@/components/admin/teams-list-content'

export default async function DeltaTeamsPage() {
  const teams = await getTeams('delta')
  return <TeamsListContent teams={teams} appType="delta" />
}
