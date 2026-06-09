import Link from 'next/link'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'What is Enfineitz? — Enfineitz',
  description: 'The Enfineitz brand — what it means and where it came from.',
}

export default function EnfineitzPage() {
  return (
    <div
      className={[
        'relative flex items-start w-full min-h-screen',
        'bg-[var(--surface-page-alt)]',
      ].join(' ')}
    >
      {/* Decorative corner — top-left of entire page */}
      <CornerDecoration position="top-left" />

      {/* ══ LEFT COLUMN — Navigation ══ */}
      <aside
        className={[
          'relative flex-shrink-0',
          'min-w-[194px] max-w-[340px] xl:w-[340px]',
          'h-screen sticky top-0',
          'pl-32 pt-32',
        ].join(' ')}
      >
        <Navigation />
        <CornerDecoration position="bottom-right" />
      </aside>

      {/* ══ RIGHT COLUMN — Brand statement ══ */}
      <main
        className={[
          'relative flex flex-col flex-1 min-w-0',
          'gap-30 min-h-screen',
          'pr-32',
        ].join(' ')}
      >
        <CornerDecoration position="top-left" />

        {/* Top body: heading anchored to bottom */}
        <div
          className={[
            'relative flex flex-col gap-8 items-start justify-end',
            'h-[335px] w-full shrink-0',
          ].join(' ')}
        >
          <CornerDecoration position="bottom-right" />

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

          <p
            className={[
              'font-body font-normal',
              'text-body-lg leading-relaxed tracking-tight',
              'text-[var(--text-caption)]',
              'whitespace-nowrap shrink-0',
            ].join(' ')}
          >
            What is Enfineitz?
          </p>
        </div>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-0 shrink-0"
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'What is Enfineitz?', href: '/enfineitz' },
          ].map((item, index) => (
            <div key={item.href} className="flex items-center h-[22px]">
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
              <div className="flex items-center pr-8">
                {index === 1 ? (
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
                      'hover:text-[var(--link-hover)]',
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

        {/* Brand statement content */}
        <article className="flex flex-col gap-48 pb-64 max-w-[800px]">

          <div className="flex flex-col gap-16">
            <h2
              className={[
                'font-display font-[300]',
                'text-h1 leading-tight',
                'text-[var(--text-brand-enfineitz)]',
              ].join(' ')}
            >
              The name
            </h2>
            <p
              className={[
                'font-body font-normal',
                'text-h4 leading-relaxed',
                'text-[var(--text-body)]',
              ].join(' ')}
            >
              <em>Enfineitz</em> is a invented word — a portmanteau of "en fin" (French: at last, finally) and
              the German suffix <em>-eit</em>, forming a sense of finality and precision. It captures
              the moment when complexity resolves into clarity: the feeling of getting it exactly right.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <h2
              className={[
                'font-display font-[300]',
                'text-h1 leading-tight',
                'text-[var(--text-brand-enfineitz)]',
              ].join(' ')}
            >
              The style
            </h2>
            <p
              className={[
                'font-body font-normal',
                'text-h4 leading-relaxed',
                'text-[var(--text-body)]',
              ].join(' ')}
            >
              <em>Stil</em> is German for style, manner, or characteristic quality. Together,{' '}
              <em>Enfineitz Stil</em> describes a design practice defined by decisive clarity —
              bringing order to ambiguity through precise, considered execution.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <h2
              className={[
                'font-display font-[300]',
                'text-h1 leading-tight',
                'text-[var(--text-brand-enfineitz)]',
              ].join(' ')}
            >
              The practice
            </h2>
            <p
              className={[
                'font-body font-normal',
                'text-h4 leading-relaxed',
                'text-[var(--text-body)]',
              ].join(' ')}
            >
              Transforming complex systems into intuitive, high‑clarity experiences—combining
              deep user insight, rapid AI‑accelerated exploration, and decisive execution to
              bring order to ambiguity, streamline intricate workflows, and help teams move
              from scattered signals to confident, actionable outcomes.
            </p>
          </div>

        </article>

        <CornerDecoration position="bottom-right" />
      </main>
    </div>
  )
}

// ─── Corner Decoration ────────────────────────────────────────────────────────

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
