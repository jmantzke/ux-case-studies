import alaskaAirlines from './alaska-airlines-flight-attendant-training.json'
import alaskaPilotVacationTrading from './alaska-airlines-pilot-vacation-trading.json'
import ecommerceBrandingKit from './ecommerce-branding-kit.json'

// ─── Case study content block types ─────────────────────────────────────────
// Each case study's body is authored as a JSON file of content blocks. The
// template page (app/case-study/[slug]/page.tsx) renders these via
// <CaseStudyContent />.

export type HeroBlock = {
  type: 'hero'
  image: { src: string; alt: string; aspect: string }
}

export type SummaryBlock = {
  type: 'summary'
  subtitle: string
  body: string
}

export type GalleryFigure = {
  src: string
  alt: string
  aspect: string
  caption?: string
}

export type GalleryBlock = {
  type: 'gallery'
  figures: GalleryFigure[]
}

export type SectionBlock = {
  type: 'section'
  heading: string
  paragraphs: string[]
}

export type CaseStudyBlock = HeroBlock | SummaryBlock | GalleryBlock | SectionBlock

export type CaseStudyContentData = {
  slug: string
  title: string
  content: CaseStudyBlock[]
}

// Slug → authored content. Add new case studies here as their JSON files land.
const contentBySlug: Record<string, CaseStudyContentData> = {
  'alaska-airlines-flight-attendant-training':
    alaskaAirlines as CaseStudyContentData,
  'alaska-airlines-pilot-vacation-trading':
    alaskaPilotVacationTrading as CaseStudyContentData,
  'ecommerce-branding-kit': ecommerceBrandingKit as CaseStudyContentData,
}

export function getCaseStudyContent(
  slug: string,
): CaseStudyContentData | undefined {
  return contentBySlug[slug]
}
