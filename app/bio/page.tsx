import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import bioData from '@/content/bio.json'

export const metadata: Metadata = {
  title: 'About me — Enfineitz',
  description: bioData.identity,
}

export default function BioPage() {
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

      {/* ══ RIGHT COLUMN — Bio content ══ */}
      <main
        className={[
          'relative flex flex-col flex-1 min-w-0',
          'gap-30 min-h-screen',
          'pr-32',
        ].join(' ')}
      >
        <CornerDecoration position="top-left" />

        {/* Top body: name anchored to bottom */}
        <div
          className={[
            'relative flex flex-col gap-8 items-start justify-end',
            'h-[335px] w-full shrink-0',
          ].join(' ')}
        >
          <CornerDecoration position="bottom-right" />

          <h1
            className={[
              'font-display font-[200]',
              'text-[96px] leading-none tracking-tighter',
              'whitespace-nowrap',
              'text-[var(--text-brand-enfineitz)]',
            ].join(' ')}
          >
            About me
          </h1>

          <p
            className={[
              'font-body font-normal',
              'text-body-lg leading-relaxed tracking-tight',
              'text-[var(--text-caption)]',
              'whitespace-nowrap shrink-0',
            ].join(' ')}
          >
            {bioData.identity}
          </p>
        </div>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-0 shrink-0"
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'About me', href: '/bio' },
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

        {/* Bio content */}
        <div className="flex flex-col gap-48 pb-64 max-w-[800px]">

          {/* Photo + name */}
          <div className="flex flex-col gap-24 items-start">
            <div className="relative w-[140px] h-[140px] rounded-round overflow-hidden shrink-0">
              <Image
                src={bioData.photo}
                alt={bioData.photoAlt}
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>
            <h2
              className={[
                'font-display font-[300]',
                'text-h1 leading-tight',
                'text-[var(--text-brand-enfineitz)]',
              ].join(' ')}
            >
              {bioData.name}
            </h2>
          </div>

          {/* Bio paragraphs */}
          <div className="flex flex-col gap-24">
            {bioData.paragraphs.map((para, i) => (
              <p
                key={i}
                className={[
                  'font-body font-normal',
                  'text-h4 leading-relaxed',
                  'text-[var(--text-body)]',
                ].join(' ')}
              >
                {para}
              </p>
            ))}
          </div>

          {/* Certifications */}
          {bioData.certifications.length > 0 && (
            <div className="flex flex-col gap-24">
              <h3
                className={[
                  'font-display font-medium',
                  'text-h3 leading-snug tracking-wide',
                  'text-[var(--text-brand-enfineitz)]',
                ].join(' ')}
              >
                Certifications
              </h3>
              <div className="flex flex-wrap gap-24">
                {bioData.certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex flex-col gap-12 items-start"
                  >
                    <div className="relative w-[70px] h-[70px] shrink-0">
                      <Image
                        src={cert.badge}
                        alt={cert.badgeAlt}
                        fill
                        className="object-contain"
                        sizes="70px"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <p
                        className={[
                          'font-body font-medium',
                          'text-body leading-snug',
                          'text-[var(--text-body)]',
                        ].join(' ')}
                      >
                        {cert.name}
                      </p>
                      <p
                        className={[
                          'font-body font-normal',
                          'text-body-sm',
                          'text-[var(--text-caption)]',
                        ].join(' ')}
                      >
                        {cert.issuer} · {cert.year}
                      </p>
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={[
                          'font-body font-normal',
                          'text-body-sm',
                          'text-[var(--link-rest)]',
                          'underline',
                          'hover:text-[var(--link-hover)]',
                          'transition-colors duration-150',
                        ].join(' ')}
                      >
                        {cert.verifyLabel}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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
