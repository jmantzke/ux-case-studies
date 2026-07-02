import type { Metadata } from 'next'
import ErrorPage from '@/components/ErrorPage'

// Static page served by Apache `ErrorDocument 502` for bad-gateway responses.

export const metadata: Metadata = {
  title: '502 — Yucky gate | Jurgen Mantzke',
  description: 'The upstream server returned an invalid response.',
}

export default function BadGateway() {
  return (
    <ErrorPage
      codeImage={{
        src: '/images/errors/502.svg',
        width: 520,
        height: 221,
        alt: '502',
      }}
      heading="Yucky gate"
      message="The upstream server returned invalid response"
    />
  )
}
