import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 500` for server errors.

export const metadata: Metadata = {
  title: '500 — Server error | Jurgen Mantzke',
  description: 'The system encountered an internal server error.',
}

export default function ServerError() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/500.svg',
        width: 520,
        height: 217,
        alt: '500',
      }}
      heading="Server error"
      message="The system encountered an internal server error"
    />
  )
}
