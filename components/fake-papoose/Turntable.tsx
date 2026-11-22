'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore } from 'react'
import { DECK_W, type EngineElements, type GripPoint } from './playerEngine'
import { RPM_DISPLAYS, RPM_VIEWBOX, RPM_X } from './rpmDisplays'
import { ICONS, type IconName } from './icons'

// ─── Turntable ────────────────────────────────────────────────────────────────
// The record player: plinth, deck (record, sticker, highlights, spindle,
// tonearm) and console. Figma: vinyl/turntable · large-console 1538:8153 ·
// small-console 1654:9959.
//
// The deck is drawn in the units of record-player-guides.svg (2067.08 wide)
// and scaled to the plinth width, plinth art (logo, tonearm rest) included. Its visible window is 743 × 649.95 at the
// 759px plinth, so its height follows the width. The console keeps a fixed
// height: the large layout (row of square buttons) from MD up, where
// vinyl/console/display-large is true, and the small layout (column of wide
// buttons) on XS and SM.
//
// Animated transforms are written by PlayerEngine through the elements this
// component exposes; React renders only the static structure and the states.

const DECK_VISIBLE = 649.954 / 743 // deck window height ÷ width
const SVG = '/fake-papoose/svg'
const HEADSHELL_W = 106.91 // tonearm-hit-area-*.svg, deck units
const HEADSHELL_H = 169.45
const TOUCH_MIN = 44 // smallest touch target, screen px

export type TurntableHandle = EngineElements

type Props = {
  stickerId: string
  playing: boolean
  dragging: boolean
  repeat: boolean
  shuffle: boolean
  mute: boolean
  rpmStep: number
  onPlay: () => void
  onStop: () => void
  onRepeat: () => void
  onShuffle: () => void
  onMute: () => void
  onCartridgeToggle: () => void
  onGripDown: (p: GripPoint) => void
  onGripMove: (p: GripPoint) => void
  onGripUp: () => void
}

// Touch screen, or a browser emulating one: decides whether the headshell
// gets its invisible touch margin.
const COARSE = '(pointer: coarse), (any-pointer: coarse)'
function isTouchScreen() {
  return window.matchMedia(COARSE).matches || navigator.maxTouchPoints > 0 || 'ontouchstart' in window
}
function onTouchChange(cb: () => void) {
  const mq = window.matchMedia(COARSE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

const Turntable = forwardRef<TurntableHandle, Props>(function Turntable(p, ref) {
  const deckWindow = useRef<HTMLDivElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const arm = useRef<HTMLDivElement>(null)
  const sticker = useRef<HTMLDivElement>(null)
  const stickerA = useRef<HTMLImageElement>(null)
  const stickerB = useRef<HTMLImageElement>(null)
  const h1 = useRef<HTMLImageElement>(null)
  const h2 = useRef<HTMLImageElement>(null)
  const [scale, setScale] = useState(0)
  const [gripHover, setGripHover] = useState(false)
  const [cartFocus, setCartFocus] = useState(false)
  const touchScreen = useSyncExternalStore(onTouchChange, isTouchScreen, () => false)
  // Which input is dragging the tonearm. Browsers send pointer events first,
  // so touch events only take over where no pointer events arrive (Firefox's
  // responsive design mode sends touch events alone).
  const grip = useRef<{ input: 'pointer' | 'touch'; id: number } | null>(null)


  useImperativeHandle(ref, () => ({
    deck: deck.current!,
    arm: arm.current!,
    sticker: sticker.current!,
    stickerA: stickerA.current!,
    stickerB: stickerB.current!,
    highlight1: h1.current!,
    highlight2: h2.current!,
  }))

  useEffect(() => {
    const el = deckWindow.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DECK_W))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const endPointer = (e: React.PointerEvent<HTMLElement>) => {
    if (grip.current?.input !== 'pointer' || grip.current.id !== e.pointerId) return
    grip.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
    p.onGripUp()
  }
  const touchOf = (e: React.TouchEvent<HTMLElement>) => {
    if (grip.current?.input !== 'touch') return null
    const id = grip.current.id
    return Array.from(e.changedTouches).find((t) => t.identifier === id) ?? null
  }
  const endTouch = (e: React.TouchEvent<HTMLElement>) => {
    if (!touchOf(e)) return
    grip.current = null
    p.onGripUp()
  }

  const stickerSrc = `/fake-papoose/stickers/${p.stickerId}.webp`
  const fade = 'opacity var(--motion-vinyl-cartridge-state-fade-duration) linear'

  return (
    <div className="relative flex flex-col gap-8 p-8 w-full rounded-[40px] bg-[var(--surface-record-player-cabinet)]">
      {/* Deck window */}
      <div
        ref={deckWindow}
        className="relative w-full overflow-hidden select-none [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
        style={{ aspectRatio: `1 / ${DECK_VISIBLE}` }}
      >
        <div
          ref={deck}
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: DECK_W, height: 2000, transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden' }}
        >
          {/* Plinth art: brand logo and tonearm rest, from plinth-assets.svg with its guides removed */}
          <DeckImg src={`${SVG}/plinth.svg`} x={0} y={0} w={2067.58} h={1808.21} />
          <DeckImg src={`${SVG}/vinyl-base.svg`} x={50.905} y={37.655} w={1723.89} h={1723.89} />

          {/* One rotating container holds both stickers; only the image swaps (doc §3.3) */}
          <div
            ref={sticker}
            className="absolute rounded-full overflow-hidden"
            style={{ left: 646.95, top: 633.7, width: 531.8, height: 531.8 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={stickerA} src={stickerSrc} alt="" draggable={false} className="absolute inset-0 size-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={stickerB} src={stickerSrc} alt="" draggable={false} className="absolute inset-0 size-full opacity-0" />
          </div>

          <DeckImg ref={h1} src={`${SVG}/vinyl-highlight-1.svg`} x={68.835} y={577.264} w={1688.06} h={644.65} origin="844.015px 322.336px" />
          <DeckImg ref={h2} src={`${SVG}/vinyl-highlight-2.svg`} x={72.592} y={409.015} w={1680.45} h={981.25} origin="840.258px 490.585px" />
          <DeckImg src={`${SVG}/center-spindle.svg`} x={870.09} y={856.84} w={85.52} h={85.52} />

          {/* Tonearm — rotates around the tonearm axis; only the headshell is interactive */}
          <div
            ref={arm}
            className="absolute pointer-events-none"
            style={{ left: 1647.34, top: 97.41, width: 354.83, height: 1411.65, transformOrigin: '275.68px 195.87px' }}
          >
            <DeckImg src={`${SVG}/full-tonearm.svg`} x={0} y={0} w={354.83} h={1411.65} />
            {/* Headshell — the whole area that turns blue on hover is the grab
                target, for mouse and touch alike. */}
            <div
              role="button"
              tabIndex={0}
              aria-label={p.playing ? 'Tonearm. Press Enter or Space to stop.' : 'Tonearm. Press Enter or Space to play.'}
              aria-pressed={p.playing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  p.onCartridgeToggle()
                }
              }}
              onFocus={(e) => setCartFocus(e.currentTarget.matches(':focus-visible'))}
              onBlur={() => setCartFocus(false)}
              onPointerDown={(e) => {
                if (grip.current || (e.pointerType === 'mouse' && e.button !== 0)) return
                e.preventDefault()
                e.stopPropagation()
                grip.current = { input: 'pointer', id: e.pointerId }
                e.currentTarget.setPointerCapture(e.pointerId)
                p.onGripDown(e)
              }}
              onPointerMove={(e) => {
                if (grip.current?.input === 'pointer' && grip.current.id === e.pointerId) p.onGripMove(e)
              }}
              onPointerUp={(e) => endPointer(e)}
              onPointerCancel={(e) => endPointer(e)}
              onTouchStart={(e) => {
                if (grip.current) return
                const t = e.changedTouches[0]
                grip.current = { input: 'touch', id: t.identifier }
                p.onGripDown(t)
              }}
              onTouchMove={(e) => {
                const t = touchOf(e)
                if (t) p.onGripMove(t)
              }}
              onTouchEnd={(e) => endTouch(e)}
              onTouchCancel={(e) => endTouch(e)}
              // a long press must not open a menu or callout mid-drag
              onContextMenu={(e) => e.preventDefault()}
              onPointerEnter={(e) => e.pointerType !== 'touch' && setGripHover(true)}
              onPointerLeave={() => setGripHover(false)}
              className="absolute left-0 top-0 origin-top-left outline-none pointer-events-auto touch-none"
              style={{
                width: HEADSHELL_W,
                height: HEADSHELL_H,
                transform: 'translate(179.08px, 882.06px) rotate(20.7deg) translate(10.7px, 343.9px)',
                cursor: p.dragging ? 'grabbing' : 'grab',
              }}
            >
              <DeckImg src={`${SVG}/tonearm-hit-area-rest.svg`} x={0} y={0} w={HEADSHELL_W} h={HEADSHELL_H} />
              <DeckImg
                src={`${SVG}/tonearm-hit-area-hover.svg`}
                x={0} y={0} w={HEADSHELL_W} h={HEADSHELL_H}
                style={{ opacity: (gripHover || p.dragging) && !cartFocus ? 1 : 0, transition: fade }}
              />
              <DeckImg
                src={`${SVG}/tonearm-hit-area-focus.svg`}
                x={0} y={0} w={HEADSHELL_W} h={HEADSHELL_H}
                style={{ opacity: cartFocus ? 1 : 0, transition: fade }}
              />
              {/* On touch screens the headshell is smaller than a fingertip on
                  narrow layouts, so an invisible margin grows the target to at
                  least TOUCH_MIN screen pixels. Nothing visible changes. */}
              {scale > 0 && (
                <div
                  aria-hidden="true"
                  className={touchScreen ? 'absolute' : 'hidden'}
                  style={(() => {
                    const pad = Math.max(0, TOUCH_MIN / scale - Math.min(HEADSHELL_W, HEADSHELL_H)) / 2
                    return { left: -pad, top: -pad, right: -pad, bottom: -pad }
                  })()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Console {...p} />
    </div>
  )
})

export default Turntable

// ─── Deck image ───────────────────────────────────────────────────────────────

const DeckImg = forwardRef<
  HTMLImageElement,
  { src: string; x: number; y: number; w: number; h: number; origin?: string; style?: React.CSSProperties }
>(function DeckImg({ src, x, y, w, h, origin, style }, ref) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      draggable={false}
      className="absolute max-w-none pointer-events-none select-none"
      style={{ left: x, top: y, width: w, height: h, transformOrigin: origin, ...style }}
    />
  )
})

// ─── Console ──────────────────────────────────────────────────────────────────
// Large (MD+): pt-30 pb-48 px-48, 167 tall, buttons 82 × 86 with the label
// above the icon. Small (XS/SM): pt-16 pb-30 px-30, 238 tall, buttons in a
// column with the label left of the icon.

// Button states follow vinyl/console-buttons (1575:8295), at both sizes:
// rest and hover use the outline icon; focus (Tab key) swaps Play, Stop and
// Mute to their filled icons; active uses the solid icon with the
// vinyl/icon/active glow.
const GLOW_ID = 'efz-vinyl-icon-glow'

const CONTROLS: { label: string; icon: IconName; focusIcon: IconName; activeIcon: IconName }[] = [
  { label: 'Play', icon: 'play', focusIcon: 'play-filled', activeIcon: 'play-filled-alt' },
  { label: 'Stop', icon: 'stop', focusIcon: 'stop-filled', activeIcon: 'stop-filled-alt' },
  { label: 'Repeat', icon: 'repeat', focusIcon: 'repeat', activeIcon: 'repeat' },
  { label: 'Shuffle', icon: 'shuffle', focusIcon: 'shuffle', activeIcon: 'shuffle' },
  { label: 'Mute', icon: 'mute', focusIcon: 'mute-filled', activeIcon: 'mute-filled' },
]

// vinyl/console has three variants: large (1538:8005), medium (1675:9694,
// tighter padding and button gap) and small (1654:9838, buttons in a column).
// Below MD it is always small (vinyl/console/display-small). From MD up the
// Figma page frames don't pin a variant to a breakpoint, and the column the
// console sits in varies in width, so it takes the largest variant whose row
// of buttons fits: padding, five buttons at --vinyl-button-width, the gaps and
// the RPM indicator. The buttons never wrap.
type ConsoleSize = 'large' | 'medium' | 'small'
const ROW_LAYOUTS = [
  { size: 'large', pad: 48, gap: 16 },
  { size: 'medium', pad: 24, gap: 8 },
] as const
const RPM_W = 121
const CONSOLE_GAP = 24
const MD_MIN = 1056 // tailwind.config.js screens.md

function useConsoleSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<ConsoleSize>('large')
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const md = window.matchMedia(`(min-width: ${MD_MIN}px)`)
    const measure = () => {
      if (!md.matches) return setSize('small')
      const width = el.getBoundingClientRect().width
      const btn = parseFloat(getComputedStyle(el).getPropertyValue('--vinyl-button-width')) || 82
      const n = CONTROLS.length
      const fit = ROW_LAYOUTS.find((l) => width >= 2 * l.pad + n * btn + (n - 1) * l.gap + CONSOLE_GAP + RPM_W)
      setSize(fit ? fit.size : 'small')
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    md.addEventListener('change', measure)
    return () => {
      ro.disconnect()
      md.removeEventListener('change', measure)
    }
  }, [])
  return [ref, size] as const
}

function Console(p: Props) {
  const [ref, size] = useConsoleSize()
  const state: Record<string, [boolean, () => void]> = {
    Play: [p.playing, p.onPlay],
    Stop: [!p.playing, p.onStop],
    Repeat: [p.repeat, p.onRepeat],
    Shuffle: [p.shuffle, p.onShuffle],
    Mute: [p.mute, p.onMute],
  }
  return (
    <div
      ref={ref}
      data-console-size={size}
      className={[
        'flex flex-wrap items-start gap-24 w-full rounded-lg',
        'bg-[var(--surface-record-player-control-panel)]',
        'pt-16 pb-30 px-30 min-h-[238px]',
        size === 'large' && 'md:pt-30 md:pb-48 md:px-48 md:min-h-[167px]',
        size === 'medium' && 'md:pt-24 md:pb-30 md:px-24 md:min-h-[143px]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <IconGlowFilter />
      <div
        className={[
          'flex flex-[1_0_auto] flex-col items-start justify-center gap-8',
          size !== 'small' && 'md:flex-1 md:min-w-0 md:flex-row md:items-center md:justify-start',
          size === 'large' && 'md:gap-16',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {CONTROLS.map((c) => (
          <ConsoleButton key={c.label} {...c} row={size !== 'small'} active={state[c.label][0]} onClick={state[c.label][1]} />
        ))}
      </div>
      <RpmIndicator step={p.rpmStep} playing={p.playing} />
    </div>
  )
}

// vinyl/icon/active as the Figma canvas draws it: a drop shadow on the icon's
// vector (X 0, Y 0, blur 4, vinyl/button/text-icon/active), hidden behind the
// icon and clipped to the icon's 28 × 28 frame. The style also sets spread 4,
// but the canvas doesn't draw spread on vectors (only Figma's SVG export does).
function IconGlowFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id={GLOW_ID} x="-8" y="-8" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
        <feComposite in2="SourceAlpha" operator="out" result="halo" />
        <feFlood style={{ floodColor: 'var(--vinyl-button-text-icon-active)' }} />
        <feComposite in2="halo" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </svg>
  )
}

function ConsoleButton({
  label,
  icon,
  focusIcon,
  activeIcon,
  active,
  row,
  onClick,
}: (typeof CONTROLS)[number] & { active: boolean; row: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'group flex items-center shrink-0 rounded-sm cursor-pointer outline-none',
        'font-body font-medium text-[11px] leading-none tracking-[2px] uppercase',
        'transition-colors duration-150',
        active
          ? 'bg-black/50 text-[var(--vinyl-button-text-icon-active)] focus-visible:ring-1 focus-visible:ring-[var(--vinyl-button-text-icon-focus)]'
          : [
              'bg-black/30 text-[var(--vinyl-button-text-icon-rest)]',
              'hover:bg-black/40 hover:text-[var(--vinyl-button-text-icon-hover)]',
              'focus-visible:bg-black/40 focus-visible:text-[var(--vinyl-button-text-icon-focus)]',
            ].join(' '),
        // small: label left of icon
        'gap-2 px-8 py-2',
        // large and medium: label above icon, 82 × 86
        row && 'md:flex-col md:justify-center md:gap-16 md:px-2 md:py-8 md:w-[var(--vinyl-button-width)] md:h-[86px]',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={`w-[var(--vinyl-button-smallest-button-text)] text-left ${row ? 'md:w-auto md:text-center' : ''}`}>{label}</span>
      {active ? (
        <Icon name={activeIcon} className="size-[28px] overflow-hidden" glow />
      ) : (
        <>
          <Icon name={icon} className="size-[28px] group-focus-visible:hidden" />
          <Icon name={focusIcon} className="size-[28px] hidden group-focus-visible:block" />
        </>
      )}
    </button>
  )
}

export function Icon({ name, className, glow }: { name: IconName; className?: string; glow?: boolean }) {
  const icon = ICONS[name]
  const paths = icon.paths.map((d, i) => <path key={i} d={d} />)
  return (
    <svg viewBox={icon.viewBox} className={className} fill="currentColor" aria-hidden="true">
      {glow ? <g filter={`url(#${GLOW_ID})`}>{paths}</g> : paths}
    </svg>
  )
}

// ─── RPM indicator ────────────────────────────────────────────────────────────
// Digits follow the record's actual speed (doc §6). Each step crossfades into
// the next, as in the Figma RPM counter animation (1513:6847).
//
// The readouts are Figma's own outlines (rpmDisplays.ts), so the digits sit
// exactly where they do in rpm-indicator (1477:5982) at every step. Colors
// and glows follow the variants: lit digits in vinyl/console/rpm-glow, each
// with a drop shadow (blur 4) in the same color; ghost
// characters in white at 15%; at 33⅓ the whole readout takes one drop shadow
// in interaction/link/rest instead.
const RPM_LIT_GLOW = 'efz-vinyl-rpm-lit'
const RPM_FULL_GLOW = 'efz-vinyl-rpm-full'

// Figma's drop shadow as its canvas draws it: blur 4 (σ 2). The spread of 4
// is in the variables and in Figma's SVG export, but the canvas doesn't draw
// spread on text or vectors, and the canvas is the reference. `out` hides the
// shadow behind the glyph (showShadowBehindNode off), as on the lit digits.
function GlowFilter({ id, color, behind }: { id: string; color: string; behind: boolean }) {
  return (
    <filter id={id} x="-1" y="-1" width="3" height="3" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
      <feComposite in="blur" in2="SourceAlpha" operator={behind ? 'over' : 'out'} result="halo" />
      <feFlood style={{ floodColor: color }} />
      <feComposite in2="halo" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}

function RpmIndicator({ step, playing }: { step: number; playing: boolean }) {
  return (
    <div
      className="flex flex-col items-center gap-12 w-[121px] h-[89px] shrink-0"
      role="img"
      aria-label={playing ? '33 and a third RPM' : '0 RPM'}
    >
      {/* 14px line, as Figma's auto line height, so the counter sits at y 26 */}
      <span className="font-body font-medium text-[11px] leading-[14px] tracking-[2px] uppercase text-[var(--text-body)]" aria-hidden="true">
        RPM
      </span>
      <div className="relative w-full aspect-[121/63] rounded-msm bg-black" aria-hidden="true">
        <svg width="0" height="0" className="absolute">
          <GlowFilter id={RPM_LIT_GLOW} color="var(--vinyl-console-rpm-glow)" behind={false} />
          <GlowFilter id={RPM_FULL_GLOW} color="var(--link-rest)" behind />
        </svg>
        {RPM_DISPLAYS.map((d, i) => (
          <svg
            key={i}
            viewBox={RPM_VIEWBOX}
            className="absolute inset-0 size-full overflow-visible"
            style={{ opacity: i === step ? 1 : 0, transition: 'opacity var(--motion-vinyl-sticker-crossfade-duration) linear' }}
          >
            <g transform={`translate(${RPM_X} ${d.y})`} filter={d.full ? `url(#${RPM_FULL_GLOW})` : undefined}>
              {d.glyphs.map((g, j) => (
                <path
                  key={j}
                  d={g.d}
                  className={g.lit ? 'fill-[var(--vinyl-console-rpm-glow)]' : 'fill-white/15'}
                  filter={g.lit && !d.full ? `url(#${RPM_LIT_GLOW})` : undefined}
                />
              ))}
            </g>
          </svg>
        ))}
      </div>
    </div>
  )
}
