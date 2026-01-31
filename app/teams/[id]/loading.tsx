import { AdminHeader } from '@/components/admin/header'
import { Skeleton, SkeletonTeamDetail } from '@/components/ui/skeleton'

export default function TeamDetailLoading() {
  return (
    <>
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Back link */}
        <div className="mb-6">
          <Skeleton className="h-5 w-16" />
        </div>

        <SkeletonTeamDetail />
      </main>
    </>
  )
}
