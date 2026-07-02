import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 408` for request timeouts.

export const metadata: Metadata = {
  title: '408 — Outta time | Jurgen Mantzke',
  description: 'The system request timed out.',
}

export default function RequestTimeout() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/408.svg',
        width: 520,
        height: 218,
        alt: '408',
      }}
      heading="Outta time"
      message="The system request timed out"
    />
  )
}
