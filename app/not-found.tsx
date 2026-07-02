import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// ─── 404 — Not Found ─────────────────────────────────────────────────────────
// Rendered for any unmatched route. With `output: 'export'` this compiles to a
// static `404.html`, which the host serves for missing URLs.
//
// Figma: error/404 component (1076:3797) — a shattered enfineitz-glyph
// illustration sits behind a right-aligned text block ("404" numeral +
// "Nothing here" + description). The shared ErrorPage renders the pixel-matched
// "404" numeral SVG; it scales responsively across the five breakpoints.

export const metadata: Metadata = {
  title: '404 — Nothing here | Jurgen Mantzke',
  description: 'The requested URL was not found on this server.',
}

export default function NotFound() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/404.svg',
        width: 520,
        height: 226,
        alt: '404',
      }}
      heading="Nothing here"
      message="The requested URL was not found on this server"
    />
  )
}
