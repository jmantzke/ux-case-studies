// ─── Site version ─────────────────────────────────────────────────────────────
// Shown under the copyright. The number is the commit count of the build
// (NEXT_PUBLIC_SITE_VERSION, set in next.config.ts), so it rises with every
// deploy. Renders nothing if the build had no git history.

const VERSION = process.env.NEXT_PUBLIC_SITE_VERSION

export default function SiteVersion({ className }: { className?: string }) {
  if (!VERSION) return null
  return <p className={className}>Version {VERSION}</p>
}
