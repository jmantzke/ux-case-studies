import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 503` during maintenance/downtime.

export const metadata: Metadata = {
  title: '503 — Be right back | Jurgen Mantzke',
  description: 'The service is temporarily down for maintenance.',
}

export default function ServiceUnavailable() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/503.svg',
        width: 520,
        height: 230,
        alt: '503',
      }}
      heading="Be right back"
      message="The service is temporarily down for maintenance"
    />
  )
}
