'use client'

import { useEffect, useState } from 'react'

// ─── Current year ────────────────────────────────────────────────────────────
// Renders the current calendar year. `from` is the year baked into the static
// HTML at build time; it matches on the first client render (so there is no
// hydration mismatch) and then updates to the live year in the browser. This
// lets the copyright roll over on January 1 even if the site is not rebuilt.

export default function CurrentYear({ from }: { from: number }) {
  const [year, setYear] = useState(from)

  useEffect(() => {
    const current = new Date().getFullYear()
    if (current !== from) setYear(current)
  }, [from])

  return <>{year}</>
}
