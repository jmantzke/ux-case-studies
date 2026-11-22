'use client'

import { useEffect, useState } from 'react'

// ─── Current year ────────────────────────────────────────────────────────────
// Renders the current calendar year. `from` is the year baked into the static
// HTML at build time; it matches on the first client render (so there is no
// hydration mismatch) and then updates to the live year in the browser. This
// lets the copyright roll over on January 1 even if the site is not rebuilt.
//
// The year is the visitor's local year, so it changes at 00:00:00 on
// January 1 in their time zone. A page left open over midnight changes too:
// a timer is set for the next January 1.

// setTimeout can't wait longer than about 24.8 days; longer waits are chained.
const MAX_TIMEOUT = 2 ** 31 - 1

export default function CurrentYear({ from }: { from: number }) {
  const [year, setYear] = useState(from)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const sync = () => {
      const now = new Date()
      setYear(now.getFullYear())
      const nextYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0)
      timer = setTimeout(sync, Math.min(MAX_TIMEOUT, nextYear.getTime() - now.getTime() + 50))
    }
    sync()
    return () => clearTimeout(timer)
  }, [])

  return <>{year}</>
}
