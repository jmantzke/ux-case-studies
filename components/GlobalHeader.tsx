'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CornerDecoration from '@/components/CornerDecoration'

// ─── GlobalHeader ─────────────────────────────────────────────────────────────
// Horizontal header bar used by the Article and Case Study templates.
// Layout: [home-link glyph · "ENFINEITZ" breadcrumb] ← justify-between → [corner]
//
// Hub-and-spoke navigation: the glyph + "ENFINEITZ" label are a single brand
// component (Figma GlobalBrand 956:3766) that links back to the hub (home) and
// shares one hover state — the two-tone glyph crossfades to an all-white mark
// and the label shifts --crumb-rest (#ffa632) → --crumb-hover (#fff0c4).
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
// Figma: global-header (213:349) · brand (956:3766) · scroll variants (169:240)

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
      {/* Left: home link combining the glyph + brand label into one hover group.
          The whole group (efz-glyph + ENFINEITZ label) links home. */}
      <Link
        href="/"
        aria-label="Enfineitz home"
        className="group flex items-center gap-8 px-24 py-12 sm:py-16 md:py-24"
      >
        {/* Glyph: two-tone rest mark crossfades to an all-white mark on hover */}
        <span className="relative shrink-0 h-[39px] w-[40px]">
          <Image
            src="/icons/efz-glyph.svg"
            alt=""
            width={40}
            height={39}
            className="absolute left-0 top-0 transition-opacity duration-150 group-hover:opacity-0"
          />
          <Image
            src="/icons/efz-glyph-hover.svg"
            alt=""
            width={40}
            height={39}
            className="absolute left-0 top-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          />
        </span>
        <span className="font-display font-normal text-[18px] uppercase tracking-[2px] text-[var(--crumb-rest)] transition-colors duration-150 group-hover:text-[var(--crumb-hover)] whitespace-nowrap">
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
