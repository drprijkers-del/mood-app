import { AdminHeader } from '@/components/admin/header'
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton'

export default function TeamsLoading() {
  return (
    <>
      <AdminHeader />
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-16 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>

        {/* Teams grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard className="hidden sm:block" />
          <SkeletonCard className="hidden lg:block" />
          <SkeletonCard className="hidden lg:block" />
        </div>
      </main>
    </>
  )
}
