'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TeamWithStats, deleteTeam, resetTeam } from '@/domain/teams/actions'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/ui/modal'

interface TeamActionsProps {
  team: TeamWithStats
}

export function TeamActions({ team }: TeamActionsProps) {
  const router = useRouter()
  const [showResetModal, setShowResetModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset() {
    setLoading(true)
    const result = await resetTeam(team.id)
    setLoading(false)

    if (result.success) {
      setShowResetModal(false)
      router.refresh()
    }
  }

  async function handleDelete() {
    setLoading(true)
    const result = await deleteTeam(team.id)
    setLoading(false)

    if (result.success) {
      router.push('/admin/teams')
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setShowResetModal(true)}>
          Reset data
        </Button>
        <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
          Verwijderen
        </Button>
      </div>

      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleReset}
        title="Team resetten"
        message={`Weet je zeker dat je alle data van "${team.name}" wilt wissen? Alle check-ins en deelnemers worden verwijderd. De share-link blijft werken.`}
        confirmLabel="Reset team"
        confirmVariant="danger"
        loading={loading}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Team verwijderen"
        message={`Weet je zeker dat je "${team.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt. De share-link wordt ongeldig.`}
        confirmLabel="Verwijderen"
        confirmVariant="danger"
        loading={loading}
      />
    </>
  )
}
