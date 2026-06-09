import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import caseStudies from '@/content/case-studies.json'

// ─── Types ────────────────────────────────────────────────────────────────────

type Section =
  | { type: 'hero';  heading: string; subheading: string }
  | { type: 'text';  heading: string; body: string }
  | { type: 'image'; src: string; alt: string }

type CaseStudy = {
  slug: string
  title: string
  client: string
  role: string
  year: number
  published: boolean
  tags: string[]
  coverImage: string
  coverAlt: string
  summary: string
  sections: Section[]
}

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return (caseStudies as CaseStudy[])
    .filter((s) => s.published)
    .map((s) => ({ slug: s.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = (caseStudies as CaseStudy[]).find((s) => s.slug === slug)
  if (!study) return {}
  return {
    title: `${study.title} — Enfineitz`,
    description: study.summary,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = (caseStudies as CaseStudy[]).find((s) => s.slug === slug)

  if (!study || !study.published) notFound()

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

      {/* ══ RIGHT COLUMN — Case study content ══ */}
      <main
        className={[
          'relative flex flex-col flex-1 min-w-0',
          'gap-30 min-h-screen',
          'pr-32',
        ].join(' ')}
      >
        <CornerDecoration position="top-left" />

        {/* Top body: title anchored to bottom */}
        <div
          className={[
            'relative flex flex-col gap-8 items-start justify-end',
            'h-[335px] w-full shrink-0',
          ].join(' ')}
        >
          <CornerDecoration position="bottom-right" />

          <div className="flex items-center gap-16 flex-wrap">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className={[
                  'font-body font-medium',
                  'text-label tracking-wider uppercase',
                  'text-[var(--text-caption)]',
                ].join(' ')}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className={[
              'font-display font-[200]',
              'text-[96px] leading-none tracking-tighter',
              'whitespace-nowrap',
              'text-[var(--text-brand-enfineitz)]',
            ].join(' ')}
          >
            {study.title}
          </h1>

          <p
            className={[
              'font-body font-normal',
              'text-body-lg leading-relaxed tracking-tight',
              'text-[var(--text-caption)]',
              'whitespace-nowrap shrink-0',
            ].join(' ')}
          >
            {study.client} · {study.role} · {study.year}
          </p>
        </div>

        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-0 shrink-0"
        >
          {[
            { label: 'Home', href: '/' },
            { label: 'Case Studies', href: '/' },
            { label: study.title, href: `/case-study/${study.slug}` },
          ].map((item, index) => (
            <div key={item.href + item.label} className="flex items-center h-[22px]">
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
                {index === 2 ? (
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

        {/* Case study sections */}
        <article className="flex flex-col gap-48 pb-64 max-w-[800px]">
          {study.sections.map((section, i) => {
            if (section.type === 'hero') {
              return (
                <div key={i} className="flex flex-col gap-8">
                  <h2
                    className={[
                      'font-display font-[300]',
                      'text-h1 leading-tight',
                      'text-[var(--text-brand-enfineitz)]',
                    ].join(' ')}
                  >
                    {section.heading}
                  </h2>
                  <p
                    className={[
                      'font-body font-normal',
                      'text-h4 leading-relaxed',
                      'text-[var(--text-caption)]',
                    ].join(' ')}
                  >
                    {section.subheading}
                  </p>
                </div>
              )
            }

            if (section.type === 'text') {
              return (
                <div key={i} className="flex flex-col gap-16">
                  <h3
                    className={[
                      'font-display font-medium',
                      'text-h3 leading-snug tracking-wide',
                      'text-[var(--text-brand-enfineitz)]',
                    ].join(' ')}
                  >
                    {section.heading}
                  </h3>
                  <p
                    className={[
                      'font-body font-normal',
                      'text-h4 leading-relaxed',
                      'text-[var(--text-body)]',
                    ].join(' ')}
                  >
                    {section.body}
                  </p>
                </div>
              )
            }

            if (section.type === 'image') {
              return (
                <div
                  key={i}
                  className="relative w-full aspect-video rounded-msm overflow-hidden"
                >
                  <Image
                    src={section.src}
                    alt={section.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1440px) 100vw, 800px"
                  />
                </div>
              )
            }

            return null
          })}
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
