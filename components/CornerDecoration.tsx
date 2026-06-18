// ─── CornerDecoration ─────────────────────────────────────────────────────────
// Decorative quarter-circle corner bracket rendered as inline SVG so that
// fill: var(--accent-decorative-corner) resolves from the document token system.
// Loading via <img> isolates the SVG from the parent document's CSS variables.
//
// Figma: decorative/corner-svg (684:1949) — 30×30px, single path per variant.
// Token: --accent-decorative-corner (light: neutral-400, dark: #8ca0a8)

export type CornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const PATHS: Record<CornerPosition, string> = {
  'top-left':
    'M1.13647 0H30C30 0.628235 29.49 1.13647 28.8635 1.13647H24.4782C11.5871 1.13647 1.13647 11.5871 1.13647 24.4782V28.8635C1.13647 29.4918 0.626471 30 0 30V1.13647V0H1.13647Z',
  'top-right':
    'M28.8635 0H0C0 0.628235 0.51 1.13647 1.13647 1.13647H5.52177C18.4129 1.13647 28.8635 11.5871 28.8635 24.4782V28.8635C28.8635 29.4918 29.3735 30 30 30V0H28.8635Z',
  'bottom-left':
    'M1.13647 30H30C30 29.3718 29.49 28.8635 28.8635 28.8635H24.4782C11.5871 28.8635 1.13647 18.4129 1.13647 5.52177V1.13647C1.13647 0.51 0.628235 0 0 0V28.8635V30H1.13647Z',
  'bottom-right':
    'M28.8635 30H0C0 29.3718 0.51 28.8635 1.13647 28.8635H5.52177C18.4129 28.8635 28.8635 18.4129 28.8635 5.52177V1.13647C28.8635 0.508235 29.3735 0 30 0V30H28.8635Z',
}

const POSITION_CLASSES: Record<CornerPosition, string> = {
  'top-left':     'top-0 left-0',
  'top-right':    'top-0 right-0',
  'bottom-left':  'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
}

type Props = {
  position: CornerPosition
  /** Override placement classes — use when the element is not absolutely positioned */
  className?: string
}

export default function CornerDecoration({ position, className }: Props) {
  return (
    <div
      className={
        className ??
        `absolute pointer-events-none size-40 ${POSITION_CLASSES[position]}`
      }
      aria-hidden="true"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d={PATHS[position]}
          fill="var(--accent-decorative-corner, #8ca0a8)"
        />
      </svg>
    </div>
  )
}
