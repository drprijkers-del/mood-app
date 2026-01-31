'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { Button } from '@/components/ui/button'

export function HomeContent() {
  const t = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 relative overflow-hidden">
      {/* Easter eggs */}
      <div className="absolute top-20 right-10 text-xs opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
        🪰
      </div>
      <div className="absolute -top-2 right-1/4 text-2xl opacity-10 rotate-12">
        🍕
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          <span className="text-lg font-bold text-stone-900">Team Lab</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="text-center max-w-md">
          {/* Lab flask - links to super admin */}
          <Link href="/super-admin/login" className="block text-6xl mb-6 hover:scale-110 transition-transform" title="Lab access">
            🧪
          </Link>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-stone-900">
            {t('labTitle')}
          </h1>

          <p className="text-xl text-stone-500 mb-12">
            {t('labSubtitle')}
          </p>

          {/* Single CTA - Go to Teams */}
          <Link href="/teams">
            <Button size="lg" className="px-8">
              Teams beheren
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Link>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 mb-10">
            <div className="flex items-center gap-2 text-stone-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-sm">{t('labFeature1')}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-sm">{t('labFeature2')}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-sm">{t('labFeature3')}</span>
            </div>
          </div>

          {/* Login hint */}
          <p className="text-sm text-stone-400">
            {t('labLoginHint')}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="pt-6 pb-12 text-center relative z-10">
        <p className="text-xs text-stone-400">
          <a
            href="https://pinkpollos.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-600 transition-colors"
          >
            {t('pinkPollos')}
          </a>
          {' · '}{t('labFooter')}
          <span className="ml-2 opacity-30" title="99.1% pure">⚗️</span>
        </p>
      </footer>
    </div>
  )
}
