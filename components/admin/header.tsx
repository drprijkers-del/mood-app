'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin/teams" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-lg gradient-text">Mood App</span>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
              Admin
            </span>
          </Link>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Uitloggen
          </Button>
        </div>
      </div>
    </header>
  )
}
