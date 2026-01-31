'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { Button } from '@/components/ui/button'

export function AdminHeader() {
  const t = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  // Active state: /teams or /session (both are admin areas)
  const isActive = pathname?.startsWith('/teams') || pathname?.startsWith('/session')

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-stone-200" role="banner">
      <nav className="max-w-4xl mx-auto px-4" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center gap-6">
            <Link href="/teams" className="flex items-center gap-2" aria-label="Team Lab - Teams">
              <span className="text-2xl" aria-hidden="true">🧪</span>
              <span className="font-bold text-lg text-stone-900">Team Lab</span>
            </Link>

            {/* Simple navigation - just Teams */}
            <div className="hidden sm:flex items-center">
              <Link
                href="/teams"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Teams
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Log out">
              {t('adminLogout')}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
