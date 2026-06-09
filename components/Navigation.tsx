import Image from 'next/image'
import Link from 'next/link'
import bioData from '@/content/bio.json'

// ─── Navigation ────────────────────────────────────────────────────────────────
// Left column component — sticky sidebar
// Contains: Enfineitz glyph, brand summary, page links, social links, copyright

export default function Navigation() {
  return (
    <div
      className={[
        'flex flex-col h-full',
        'gap-48',         // screen/navigation-column/gap token = 48px
        'items-start',
      ].join(' ')}
    >
      {/* ── Enfineitz glyph (SVG) ── */}
      <Image
        src="/icons/efz-glyph.svg"
        alt="Enfineitz"
        width={124}
        height={121}
        className="shrink-0"
      />

      {/* ── Anchor content: brand summary + page links ── */}
      <div className="flex flex-col gap-32 items-start w-full pr-16 shrink-0">

        {/* Brand summary — ibm-plex-sans Medium, 12px, lh 22px */}
        <p
          className={[
            'font-body font-medium',
            'text-body-sm leading-[22px] tracking-normal',
            'text-[var(--text-body)]',
            'w-full min-w-full',
          ].join(' ')}
        >
          {bioData.brandSummary}
        </p>

        {/* Page navigation links */}
        <nav className="flex flex-col gap-16 items-start" aria-label="Site navigation">
          <NavLink href="/bio">About me</NavLink>
          <NavLink href="/enfineitz">What is Enfineitz?</NavLink>
        </nav>
      </div>

      {/* ── Social / contact links ── */}
      <div className="flex flex-col gap-24 items-start w-[235px] shrink-0">
        <SocialLink
          href="https://www.linkedin.com/in/enfineitz/"
          icon="/icons/linkedin.svg"
          label="linkedin.com/in/enfineitz"
        />
        <SocialLink
          href="mailto:jurgen@enfineitz.com"
          icon="/icons/email.svg"
          label="jurgen@enfineitz.com"
        />
        <SocialLink
          href="https://www.behance.net/bunyip21"
          icon="/icons/behance.svg"
          label="behance.net/bunyip21"
        />
      </div>

      {/* ── Copyright ── */}
      <div className="flex items-center py-16 w-full shrink-0">
        <p
          className={[
            'font-body font-normal',
            'text-label leading-none tracking-normal',
            'text-[var(--text-caption)]',
            'whitespace-nowrap',
          ].join(' ')}
        >
          ©2026 Enfineitz LLC
        </p>
      </div>
    </div>
  )
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────
// mozilla-headline Medium, 14px, tracking loose (1px)

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        'font-display font-medium',
        'text-body tracking-wide',
        'text-[var(--link-rest)]',
        'hover:text-[var(--link-hover)]',
        'py-4',                       // margin/2xs = 4px vertical padding
        'transition-colors duration-150',
        'whitespace-nowrap',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

// ─── Social Link ──────────────────────────────────────────────────────────────
// Icon + underlined link — ibm-plex-sans Medium, 14px, tracking wide

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: string
  label: string
}) {
  return (
    <div className="flex gap-8 items-center shrink-0">
      {/*
        Export your social icons from Figma as SVG to /public/icons/
        Icons: linkedin.svg, email.svg, behance.svg — 16×16px
      */}
      <Image
        src={icon}
        alt=""
        width={16}
        height={16}
        className="shrink-0"
        aria-hidden="true"
      />
      <a
        href={href}
        target={href.startsWith('mailto') ? undefined : '_blank'}
        rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
        className={[
          'font-display font-medium',
          'text-[14px] tracking-wide',
          'text-[var(--link-rest)]',
          'underline decoration-solid',
          'hover:text-[var(--link-hover)]',
          'transition-colors duration-150',
          'whitespace-nowrap',
        ].join(' ')}
      >
        {label}
      </a>
    </div>
  )
}
