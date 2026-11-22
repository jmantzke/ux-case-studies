import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import GlobalHeader from '@/components/GlobalHeader'
import CornerDecoration from '@/components/CornerDecoration'
import VinylPlayer from '@/components/fake-papoose/VinylPlayer'
import content from '@/content/fake-papoose.json'

// ─── Fake Papoose (Article template · vinyl record player) ───────────────────
// Rebuilt to match the Figma "vinyl" responsive set:
//   XS 1614:9988 · SM 1614:9503 · MD 1614:9119 · LG 1602:7672 · XL 1614:8735
//
// Unlike the other article pages, the player renders once (it holds the audio
// and its animation state), so this page uses a single tree and swaps only
// the navigation between breakpoints:
//   • below md → horizontal navigation above the title
//   • md and up → navigation rail to the right of the content
// Widths, margins and gutters come from the "grid and breakpoints" tokens.

const DESCRIPTION = content.description

export const metadata: Metadata = {
  title: `${content.metadataTitle} | Jurgen Mantzke`,
  description: DESCRIPTION,
  keywords: [
    'Fake Papoose',
    'industrial',
    'EBM',
    'electronic',
    'music',
    'record',
    'vinyl',
    'turntable',
    'music player',
    'GarageBand',
    'Garage Band',
    'vibe-code',
    'Front 242',
    'Juno Reactor',
    'Meat Beat Manifesto',
    'Circle of Dust',
    'Front Line Assembly',
    'Nitzer Ebb',
  ],
  openGraph: {
    title: `${content.metadataTitle} | Jurgen Mantzke`,
    description: DESCRIPTION,
    url: 'https://case-studies.enfineitz.com/fake-papoose',
    images: [{ url: '/og/fake-papoose.png', width: 1201, height: 631 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${content.metadataTitle} | Jurgen Mantzke`,
    description: DESCRIPTION,
    images: ['/og/fake-papoose.png'],
  },
  alternates: {
    canonical: 'https://case-studies.enfineitz.com/fake-papoose',
  },
}

export default function FakePapoosePage() {
  return (
    <div className="relative flex flex-col gap-16 items-center w-full min-h-screen page-gradient">
      <GlobalHeader />

      {/* Title block — horizontal navigation (xs/sm) + page title */}
      <div className="flex flex-col gap-24 w-full px-[var(--header-padding-inline)]">
        <div className="md:hidden">
          <Navigation layout="horizontal" displayFakePapoose={false} showCopyright={false} />
        </div>
        <PageTitle />
      </div>

      {/* Body — content column + navigation rail (md+) */}
      <div className="relative flex flex-1 justify-center gap-[var(--grid-gutter)] w-full px-[var(--grid-margin)]">
        <main className="flex-1 min-w-0 max-w-[var(--layout-content-max-width)] pb-64">
          <VinylPlayer tracks={content.tracks}>
            <About />
          </VinylPlayer>
        </main>

        <aside className="relative hidden md:flex flex-col self-stretch items-start justify-between w-[var(--layout-navigation-width)] shrink-0">
          <Navigation displayFakePapoose={false} />
          {/* Rail bottom corner — the aside runs to the page bottom (the 64px bottom
              space belongs to <main>), so this sits level with the page's
              bottom-left corner */}
          <div className="flex items-end w-full shrink-0">
            <CornerDecoration position="bottom-left" className="size-40 xl:size-48 shrink-0 pointer-events-none" />
          </div>
        </aside>
      </div>

      {/* Page bottom-left corner */}
      <CornerDecoration
        position="bottom-left"
        className="absolute bottom-0 left-0 size-30 sm:size-32 md:size-40 xl:size-48 pointer-events-none"
      />
    </div>
  )
}

function PageTitle() {
  return (
    <h1
      className={[
        'flex items-start gap-4 leading-none',
        'font-display font-[200] text-[48px] tracking-tight md:text-[96px] md:tracking-tighter',
      ].join(' ')}
    >
      <span className="shrink-0 whitespace-nowrap text-[var(--text-slash)]">/</span>
      <span className="min-w-0 text-[var(--text-header-reversed)]">{content.title}</span>
    </h1>
  )
}

function About() {
  return (
    <div className="flex flex-col gap-12 w-full max-w-[570px]">
      {content.paragraphs.map((para, i) => (
        <p key={i} className="font-body font-normal text-[14px] leading-[30px] text-[var(--text-body)]">
          {para}
        </p>
      ))}
    </div>
  )
}
