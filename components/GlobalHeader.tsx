'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CornerDecoration from '@/components/CornerDecoration'

// ─── GlobalHeader ─────────────────────────────────────────────────────────────
// Horizontal header bar used by the Article and Case Study templates.
// Layout: [home-link glyph · "ENFINEITZ" breadcrumb] ← justify-between → [corner]
//
// Hub-and-spoke navigation: the glyph links back to the hub (home). The
// "ENFINEITZ" label is a static breadcrumb (display Regular, 18px, uppercase,
// 2px tracking, --crumb-static).
//
// Sticky: the header is pinned to the top of the viewport (page content scrolls
// behind it on its page-alt background). The bottom hairline only appears once
// the page has scrolled — mirroring the Figma Scroll=True/False variants
// (Scroll=False hides the border, Scroll=True shows border-b #2a2f32).
//
// Responsive (matches Figma template/article/biography XS→XL):
//   • header padding:  py-12 (xs) · py-16 (sm) · py-24 (md+)
//   • corner deco:     30 (xs) · 32 (sm) · 40 (md/lg) · 48 (xl)
//
// Figma: global-header (213:349) · breadcrumb (169:243) · scroll variants (169:240)

export default function GlobalHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    onScroll() // sync initial state (e.g. when loaded already scrolled)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={[
        'sticky top-0 z-30',
        'flex items-start justify-between w-full shrink-0',
        'bg-[var(--surface-page-alt)]',
        // Keep a 1px border always to avoid layout shift; toggle its color so
        // the hairline only shows once scrolled (Scroll=False → transparent).
        'border-b transition-colors duration-150',
        scrolled ? 'border-[#2a2f32]' : 'border-transparent',
      ].join(' ')}
      aria-label="Site header"
    >
      {/* Left: home link combining the glyph + static brand breadcrumb.
          The whole group (efz-glyph-header + breadcrumb-instance) links home. */}
      <Link
        href="/"
        aria-label="Enfineitz home"
        className="flex items-center gap-24 px-24 py-12 sm:py-16 md:py-24"
      >
        <Image
          src="/icons/efz-glyph.svg"
          alt=""
          width={40}
          height={39}
          className="shrink-0"
        />
        <span className="font-display font-normal text-[18px] uppercase tracking-[2px] text-[var(--crumb-static)] whitespace-nowrap">
          Enfineitz
        </span>
      </Link>

      {/* Right: top-right corner decoration */}
      <CornerDecoration
        position="top-right"
        className="size-30 sm:size-32 md:size-40 xl:size-48 shrink-0"
      />
    </header>
  )
}
