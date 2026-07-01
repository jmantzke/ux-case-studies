import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 403` for forbidden requests.

export const metadata: Metadata = {
  title: '403 — Access denied | Jurgen Mantzke',
  description: 'You do not have permission to view this page.',
}

export default function Forbidden() {
  return (
    <ErrorPage
      code="403"
      heading="Access denied"
      message="You don’t have permission to view this page."
    />
  )
}
