'use client'

import { useRef, useEffect } from 'react'

interface AccordionSectionProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  accentColor: string // e.g. 'pink', 'cyan', 'purple', 'emerald'
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  badge?: React.ReactNode
}

const accentStyles: Record<string, { border: string; iconBg: string; chevron: string }> = {
  pink: {
    border: 'hover:border-pink-300 dark:hover:border-pink-700',
    iconBg: 'bg-pink-100 dark:bg-pink-900/50',
    chevron: 'group-hover:text-pink-500',
  },
  cyan: {
    border: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/50',
    chevron: 'group-hover:text-cyan-500',
  },
  purple: {
    border: 'hover:border-purple-300 dark:hover:border-purple-700',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    chevron: 'group-hover:text-purple-500',
  },
  emerald: {
    border: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    chevron: 'group-hover:text-emerald-500',
  },
}

export function AccordionSection({
  id,
  title,
  description,
  icon,
  accentColor,
  isOpen,
  onToggle,
  children,
  badge,
}: AccordionSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const style = accentStyles[accentColor] || accentStyles.cyan

  // Scroll into view when opened
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    }
  }, [isOpen])

  return (
    <div
      id={`accordion-${id}`}
      ref={contentRef}
      className={`bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 transition-all ${
        isOpen ? 'shadow-md' : `${style.border} hover:shadow-md`
      } group`}
    >
      {/* Header — always visible, clickable */}
      <button
        onClick={onToggle}
        className="w-full p-3 text-left flex items-start gap-3 cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'scale-105' : 'group-hover:scale-105'}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">{title}</h3>
            {badge}
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">{description}</p>
        </div>
        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-stone-300 dark:text-stone-600 ${style.chevron} transition-all mt-2.5 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Content — animated expand/collapse */}
      <div
        id={`accordion-content-${id}`}
        className={`accordion-content ${isOpen ? 'accordion-open' : ''}`}
        role="region"
        aria-labelledby={`accordion-${id}`}
      >
        <div>
          <div className="px-3 pb-4 pt-1 border-t border-stone-100 dark:border-stone-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
