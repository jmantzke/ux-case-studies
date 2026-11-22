// ─── Site version ─────────────────────────────────────────────────────────────
// Shown under the copyright as MAJOR.MINOR.PATCH (NEXT_PUBLIC_SITE_VERSION,
// derived from the latest version tag in next.config.ts). Renders nothing if
// the build had no git history or no version tag.

const VERSION = process.env.NEXT_PUBLIC_SITE_VERSION

export default function SiteVersion({ className }: { className?: string }) {
  if (!VERSION) return null
  return <p className={className}>Version {VERSION}</p>
}
