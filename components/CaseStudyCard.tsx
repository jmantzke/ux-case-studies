import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseStudyCardProps = {
  slug: string
  title: string
  summary: string
  coverImage: string
  coverAlt: string
  tags?: string[]
  year?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudyCard({
  slug,
  title,
  summary,
  coverImage,
  coverAlt,
  tags = [],
  year,
}: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-study/${slug}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-hover)] rounded-msm"
      aria-label={`View case study: ${title}`}
    >
      <article
        className={[
          // Base layout — from Figma: 300×180px, rounded-msm (16px), overflow hidden
          'relative flex flex-col gap-16 overflow-hidden',
          'w-[300px] h-[180px]',
          'rounded-msm',
          'pt-30 pb-48 px-30',
          // Border
          'border border-solid',
          // Rest state colors — surface-card-rest, border-card-rest
          'bg-[var(--surface-card-rest)] border-[var(--border-card-rest)]',
          // Hover state colors — group-hover transitions
          'group-hover:bg-[var(--surface-card-hover)] group-hover:border-[var(--border-card-hover)]',
          // Smooth transition
          'transition-colors duration-200 ease-in-out',
        ].join(' ')}
      >
        {/* ── Background image (right-anchored, decorative) ── */}
        <div
          className={[
            'absolute bottom-[-1px] right-[-1px]',
            'h-[180px] w-[157px]',
            // Rest: 60% opacity. Hover: full opacity
            'opacity-60 group-hover:opacity-100',
            'transition-opacity duration-200 ease-in-out',
            'pointer-events-none',
          ].join(' ')}
          aria-hidden="true"
        >
          <Image
            src={coverImage}
            alt={coverAlt}
            fill
            className="object-cover"
            sizes="157px"
          />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col gap-16 w-[148px]">
          {/* Title — mozilla-headline, h3 scale (24px/600/ls:1px) */}
          <h3
            className={[
              'font-display font-semibold',
              'text-h3 leading-snug tracking-wide',
              // Active link color from token system
              'text-[var(--link-active)]',
              'group-hover:text-[var(--link-hover)]',
              'transition-colors duration-200',
            ].join(' ')}
          >
            {title}
          </h3>

          {/* Summary — visible at rest, stays on hover */}
          <p
            className={[
              'font-body font-normal',
              'text-h4 leading-relaxed tracking-tight',
              'text-[var(--link-active)]',
              'group-hover:text-[var(--link-hover)]',
              'transition-colors duration-200',
              // Constrain width so text doesn't run under the background image
              'w-[240px]',
              // Clamp to 2 lines at rest
              'line-clamp-2',
            ].join(' ')}
          >
            {summary}
          </p>
        </div>
      </article>
    </Link>
  )
}
