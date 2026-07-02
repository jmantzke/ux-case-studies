import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 403` for forbidden requests.

export const metadata: Metadata = {
  title: '403 — Access denied | Jurgen Mantzke',
  description: 'You do not have permission to access this resource.',
}

export default function Forbidden() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/403.svg',
        width: 520,
        height: 228,
        alt: '403',
      }}
      heading="Access denied"
      message="You don’t have permission to access this resource"
    />
  )
}
