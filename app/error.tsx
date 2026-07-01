'use client'

import Link from 'next/link'
import ErrorPage from '@/components/ErrorPage'

// ─── Runtime error boundary ──────────────────────────────────────────────────
// Catches uncaught exceptions thrown while rendering a route segment (client
// side, in the exported app). Must be a Client Component and receives a `reset`
// function to retry rendering the segment.

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorPage
      code="Oops"
      heading="Something went wrong"
      message="An unexpected error occurred. You can try again or head back home."
    >
      <div className="flex flex-col gap-8 items-start xl:items-end">
        <button
          type="button"
          onClick={reset}
          className="font-display font-[600] text-body-lg tracking-wide text-[var(--link-rest)] hover:text-[var(--link-hover)] py-2 transition-colors duration-150 whitespace-nowrap"
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-display font-[600] text-body-lg tracking-wide text-[var(--link-rest)] hover:text-[var(--link-hover)] py-2 transition-colors duration-150 whitespace-nowrap"
        >
          Return home
        </Link>
      </div>
    </ErrorPage>
  )
}
