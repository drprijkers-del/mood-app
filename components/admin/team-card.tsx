'use client'

import Link from 'next/link'
import { TeamWithStats } from '@/domain/teams/actions'
import { Card, CardContent } from '@/components/ui/card'

interface TeamCardProps {
  team: TeamWithStats
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/admin/teams/${team.id}`}>
      <Card className="card-hover cursor-pointer">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white text-xl font-bold">
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                <p className="text-sm text-gray-500">
                  {team.participantCount} deelnemers • {team.todayEntries} check-ins vandaag
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {team.activeLink && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Link actief
                </span>
              )}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
