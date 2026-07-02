import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 415` for unsupported media types.

export const metadata: Metadata = {
  title: '415 — What is this? | Jurgen Mantzke',
  description: 'The system encountered an unsupported media type.',
}

export default function UnsupportedMediaType() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/415.svg',
        width: 520,
        height: 216,
        alt: '415',
      }}
      heading="What is this?"
      message="The system encountered an unsupported media type"
    />
  )
}
