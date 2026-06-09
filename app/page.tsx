import Image from 'next/image'
import Link from 'next/link'
import caseStudies from '@/content/case-studies.json'
import CaseStudyCard from '@/components/CaseStudyCard'
import Navigation from '@/components/Navigation'

// ─── Home Page ─────────────────────────────────────────────────────────────────
// Hub page — card grid of all case studies
// Layout: left nav column (fixed) + right main content column (scrollable)

export default function HomePage() {
  return (
    <div
      className={[
        'relative flex items-start w-full min-h-screen',
        'bg-[var(--surface-page-alt)]', // primary-500 / primary-600 dark
      ].join(' ')}
    >
      {/* ── Decorative corner — top-left of entire page ── */}
      <CornerDecoration position="top-left" />

      {/* ══════════════════════════════════════════════
          LEFT COLUMN — Navigation
          Width: 194px (LG min) → 340px (XL fixed)
         ══════════════════════════════════════════════ */}
      <aside
        className={[
          'relative flex-shrink-0',
          'min-w-[194px] max-w-[340px] xl:w-[340px]',
          'h-screen sticky top-0',
          'pl-32 pt-32',
        ].join(' ')}
      >
        <Navigation />

        {/* Decorative corner — bottom-right of nav column */}
        <CornerDecoration position="bottom-right" />
      </aside>

      {/* ══════════════════════════════════════════════
          RIGHT COLUMN — Main content
         ══════════════════════════════════════════════ */}
      <main
        className={[
          'relative flex flex-col flex-1 min-w-0',
          'gap-30 min-h-screen',
          'pr-32',
        ].join(' ')}
      >
        {/* Decorative corner — top-left of content column */}
        <CornerDecoration position="top-left" />

        {/* ── Top body: brand name + identity ── */}
        <div
          className={[
            'relative flex flex-col gap-8 items-start justify-end',
            'h-[335px] w-full shrink-0',
          ].join(' ')}
        >
          {/* Decorative corner — bottom-right of top-body */}
          <CornerDecoration position="bottom-right" />

          {/* Brand name — mozilla-headline ExtraLight, hero3 (96px) */}
          <div className="flex items-center gap-4 shrink-0">
            <span
              className={[
                'font-display font-[200]',
                'text-[96px] leading-none tracking-tighter',
                'whitespace-nowrap',
                'text-[var(--text-brand-enfineitz)]',
              ].join(' ')}
            >
              Enfineitz
            </span>
            <span
              className={[
                'font-display font-[200]',
                'text-[96px] leading-none tracking-tighter',
                'whitespace-nowrap',
                'text-[var(--text-brand-stil)]',
              ].join(' ')}
            >
              Stil
            </span>
          </div>

          {/* Identity line */}
          <p
            className={[
              'font-body font-normal',
              'text-body-lg leading-relaxed tracking-tight',
              'text-[var(--text-caption)]',
              'whitespace-nowrap shrink-0',
            ].join(' ')}
          >
            The personal website of Jürgen Mantzke, UX and product designer
          </p>
        </div>

        {/* ── Breadcrumbs ── */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/', isFirst: true },
            { label: 'Case Studies', href: '/' },
          ]}
        />

        {/* ── Card grid ── */}
        <section
          className={[
            'flex-1 w-full',
            'max-w-[1200px]',
            'pb-0',
          ].join(' ')}
          aria-label="Case study portfolio"
        >
          <div
            className="flex flex-wrap gap-4 items-start w-full"
          >
            {caseStudies.filter((study) => study.published).map((study) => (
              <CaseStudyCard
                key={study.slug}
                slug={study.slug}
                title={study.title}
                summary={study.summary}
                coverImage={study.coverImage}
                coverAlt={study.coverAlt}
                tags={study.tags}
                year={study.year}
              />
            ))}
          </div>
        </section>

        {/* Decorative corner — bottom-right of content column */}
        <CornerDecoration position="bottom-right" />
      </main>
    </div>
  )
}

// ─── Breadcrumbs ───────────────────────────────────────────────────────────────

type BreadcrumbItem = {
  label: string
  href: string
  isFirst?: boolean
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-0 shrink-0"
    >
      {items.map((item, index) => (
        <div key={item.href + item.label} className="flex items-center h-[22px]">
          {/* Slash separator — mozilla-headline Regular, 18px, tracked wide */}
          {index > 0 && (
            <span
              className={[
                'font-display font-normal',
                'text-body-lg tracking-widest uppercase',
                'text-[var(--text-slash)]',
                'w-[7px] flex items-center justify-center',
              ].join(' ')}
              aria-hidden="true"
            >
              /
            </span>
          )}
          {/* Label */}
          <div className="flex items-center pr-8">
            {item.isFirst ? (
              <span
                className={[
                  'font-display font-normal',
                  'text-body-lg tracking-widest uppercase',
                  'text-[var(--crumb-static)]',
                  'whitespace-nowrap',
                ].join(' ')}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={[
                  'font-display font-normal',
                  'text-body-lg tracking-widest uppercase',
                  'text-[var(--crumb-rest)]',
                  'whitespace-nowrap',
                  'hover:text-[var(--crumb-hover)]',
                  'transition-colors duration-150',
                ].join(' ')}
              >
                {item.label}
              </Link>
            )}
          </div>
        </div>
      ))}
    </nav>
  )
}

// ─── Corner Decoration ────────────────────────────────────────────────────────
// Decorative SVG corner element — appears at all four corners of layout zones
// Size: 40px (LG) / 48px (XL) per containers/corner-decoration-w-h token

type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

function CornerDecoration({ position }: { position: CornerPosition }) {
  const positionClasses: Record<CornerPosition, string> = {
    'top-left':     'top-0 left-0',
    'top-right':    'top-0 right-0',
    'bottom-left':  'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }

  const svgMap: Record<CornerPosition, string> = {
    'top-left':     '/icons/upper-left.svg',
    'top-right':    '/icons/upper-right.svg',
    'bottom-left':  '/icons/lower-left.svg',
    'bottom-right': '/icons/lower-right.svg',
  }

  return (
    <div
      className={[
        'absolute pointer-events-none',
        'size-40 lg:size-40 xl:size-48',
        positionClasses[position],
      ].join(' ')}
      aria-hidden="true"
    >
      <img src={svgMap[position]} alt="" className="w-full h-full" />
    </div>
  )
}
