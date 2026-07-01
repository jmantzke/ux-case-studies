import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 503` during maintenance/downtime.

export const metadata: Metadata = {
  title: '503 — Be right back | Jurgen Mantzke',
  description: 'The site is temporarily unavailable for maintenance.',
}

export default function ServiceUnavailable() {
  return (
    <ErrorPage
      code="503"
      heading="Be right back"
      message="The site is briefly down for maintenance. Please check back shortly."
    />
  )
}
