import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import GlobalHeader from '@/components/GlobalHeader'
import CornerDecoration from '@/components/CornerDecoration'
import CaseStudyContent from '@/components/CaseStudyContent'
import caseStudies from '@/content/case-studies.json'
import {
  getCaseStudyContent,
  type CaseStudyBlock,
} from '@/content/case-studies/contentMap'

// ─── Types ────────────────────────────────────────────────────────────────────
// The case study template is identical for every case study, save for two
// unique pieces: the page title and the authored content (a JSON file of
// content blocks, rendered by <CaseStudyContent />). The shell mirrors the
// shared article template (bio / manifesto): a stacked layout below `md` and a
// two-column layout (content + navigation rail) at `md` and up.

type CaseStudyIndexEntry = {
  slug: string
  title: string
  pageTitle?: string
  client: string
  role: string
  year: number
  published: boolean
  tags: string[]
  coverImage: string
  coverAlt: string
  summary: string
}

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return (caseStudies as CaseStudyIndexEntry[])
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
  const study = (caseStudies as CaseStudyIndexEntry[]).find(
    (s) => s.slug === slug,
  )
  if (!study) return {}
  return {
    title: `${study.pageTitle ?? study.title} — Enfineitz`,
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
  const study = (caseStudies as CaseStudyIndexEntry[]).find(
    (s) => s.slug === slug,
  )

  if (!study || !study.published) notFound()

  // Authored content blocks. Case studies still awaiting their JSON file fall
  // back to a single summary block so their card link doesn't 404.
  const blocks: CaseStudyBlock[] = getCaseStudyContent(slug)?.content ?? [
    { type: 'summary', subtitle: study.summary, body: '' },
  ]

  return (
    <div className="relative w-full min-h-screen bg-[var(--surface-page-alt)]">
      <StackedLayout title={study.pageTitle ?? study.title} blocks={blocks} />
      <TwoColumnLayout title={study.pageTitle ?? study.title} blocks={blocks} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// STACKED LAYOUT — xs / sm (below md)
// ════════════════════════════════════════════════════════════════════════════

function StackedLayout({
  title,
  blocks,
}: {
  title: string
  blocks: CaseStudyBlock[]
}) {
  return (
    <div className="relative flex flex-col md:hidden gap-16 items-center min-h-screen w-full">
      <GlobalHeader />

      {/* Title block — horizontal navigation + page title */}
      <div className="flex flex-col gap-24 items-center px-8 sm:px-16 w-full">
        <Navigation layout="horizontal" showCopyright={false} />
        <PageTitle
          title={title}
          className="font-display text-[24px] font-[400] sm:text-[48px] sm:font-[200] tracking-[0.01em] sm:tracking-tight"
        />
      </div>

      {/* Below — case study content */}
      <div className="relative flex flex-col flex-1 items-center p-8 sm:p-16 w-full">
        <CornerDecoration
          position="top-right"
          className="absolute top-0 right-0 size-30 sm:size-32 pointer-events-none"
        />

        <CaseStudyContent blocks={blocks} />
      </div>

      {/* Page bottom-left corner */}
      <CornerDecoration
        position="bottom-left"
        className="absolute bottom-0 left-0 size-30 sm:size-32 pointer-events-none"
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TWO-COLUMN LAYOUT — md / lg / xl
// ════════════════════════════════════════════════════════════════════════════

function TwoColumnLayout({
  title,
  blocks,
}: {
  title: string
  blocks: CaseStudyBlock[]
}) {
  return (
    <div className="relative hidden md:flex flex-col gap-24 items-center min-h-screen w-full">
      <GlobalHeader />

      {/* Title — centered; MD caps at 1023, LG is full-width, XL caps at 1376 */}
      <div className="w-full max-w-[1023px] lg:max-w-none xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        <PageTitle
          title={title}
          className="font-display text-[60px] font-[300] tracking-tight"
        />
      </div>

      {/* Top-right corner of the body */}
      <CornerDecoration
        position="top-right"
        className="absolute top-[207px] xl:top-[191px] right-0 size-40 xl:size-48 pointer-events-none z-10"
      />

      {/* Body — content column + navigation rail */}
      <div className="flex flex-1 gap-20 lg:gap-24 items-start justify-center w-full max-w-[1023px] lg:max-w-none xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        <CaseStudyContent blocks={blocks} className="flex-1 min-w-0" />

        {/* Navigation rail */}
        <aside
          className={[
            'relative flex flex-col self-stretch items-start justify-between',
            'md:min-w-[185px] md:max-w-[231px]',
            'lg:min-w-[194px] lg:max-w-[340px]',
            'xl:min-w-[340px] xl:max-w-[340px]',
            'flex-1',
          ].join(' ')}
        >
          <Navigation />

          {/* Rail bottom corner */}
          <div className="flex items-end w-full shrink-0">
            <CornerDecoration
              position="bottom-right"
              className="size-40 xl:size-48 shrink-0 pointer-events-none"
            />
          </div>
        </aside>
      </div>

      {/* Page bottom-left corner */}
      <CornerDecoration
        position="bottom-left"
        className="absolute bottom-0 left-0 size-40 xl:size-48 pointer-events-none"
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED PIECES
// ════════════════════════════════════════════════════════════════════════════

function PageTitle({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  return (
    <div
      className={['flex items-center gap-4 leading-none whitespace-nowrap', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-[var(--text-slash)]">/</span>
      <span className="text-[var(--text-header-reversed)]">{title}</span>
    </div>
  )
}
