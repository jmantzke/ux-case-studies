import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 500` for server errors.

export const metadata: Metadata = {
  title: '500 — Something broke | Jurgen Mantzke',
  description: 'An unexpected error occurred on the server.',
}

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      heading="Something broke"
      message="An unexpected error occurred on the server. Please try again in a little while."
    />
  )
}
