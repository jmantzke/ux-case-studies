'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Icon } from './Turntable'

// ─── Tracklist ────────────────────────────────────────────────────────────────
// Six tracks, always in this order, in two groups (1–3, 4–6). Figma:
// vinyl/tracklist · vinyl/track/* (1566:7515 …) · transition 1513:6649.
//
//   • XS/SM: one column of rows. Every thumbnail stays small; the playing
//     track shows the orange play marker (state playing-xs). Hovering the
//     playing track's thumbnail shows stop, any other shows play.
//   • MD: the two groups sit side by side. LG/XL: one column beside the
//     turntable. The loaded track is large (state playing) with its details
//     below the cover; the rest are small. Clicking the large cover plays or
//     stops; a small one starts that track.

export type TrackInfo = {
  id: string
  title: string
  album: string
  year: string
  length: string
  cover: string
}

type Props = {
  tracks: TrackInfo[]
  loaded: number
  playing: boolean
  counts: Record<string, number> | null
  failed: string[]
  onSelect: (index: number) => void
}

export default function Tracklist({ tracks, loaded, playing, counts, failed, onSelect }: Props) {
  const groups = [tracks.slice(0, 3), tracks.slice(3)]
  return (
    <div
      className={[
        'flex flex-col gap-[var(--vinyl-tracklist-group-gap)] w-full',
        'md:flex-row md:items-start lg:flex-col lg:w-[var(--vinyl-tracklist-width)] lg:shrink-0',
      ].join(' ')}
    >
      {groups.map((group, g) => (
        <ol
          key={g}
          start={g * 3 + 1}
          className="flex flex-col gap-[var(--vinyl-tracklist-track-gap)] w-full md:flex-1 md:min-w-0 lg:flex-none"
        >
          {group.map((track, k) => {
            const i = g * 3 + k
            return (
              <TrackRow
                key={track.id}
                track={track}
                isLoaded={i === loaded}
                isPlaying={i === loaded && playing}
                count={counts ? counts[track.id] ?? 0 : null}
                unavailable={failed.includes(track.id)}
                onSelect={() => onSelect(i)}
              />
            )
          })}
        </ol>
      ))}
    </div>
  )
}

function TrackRow({
  track,
  isLoaded,
  isPlaying,
  count,
  unavailable,
  onSelect,
}: {
  track: TrackInfo
  isLoaded: boolean
  isPlaying: boolean
  count: number | null
  unavailable: boolean
  onSelect: () => void
}) {
  const coverRef = useRef<HTMLButtonElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const wasLoaded = useRef(isLoaded)
  const [pressed, setPressed] = useState(false)

  // MD+ small → large transition (Figma 1513:6649, 700ms): the cover grows
  // from the small size over 0–500ms (ease-in-out, top-left origin); the
  // details below slide down from −300px (ease-out, 0–500ms) and fade in over
  // 221–500ms. These timings are not motion tokens yet.
  useLayoutEffect(() => {
    const becameLarge = isLoaded && !wasLoaded.current
    wasLoaded.current = isLoaded
    if (!becameLarge) return
    if (!window.matchMedia('(min-width: 1056px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cover = coverRef.current, meta = metaRef.current
    if (!cover || !meta) return
    const root = getComputedStyle(document.documentElement)
    const small = parseFloat(root.getPropertyValue('--vinyl-album-cover-small-max-width')) || 72
    const k = small / cover.getBoundingClientRect().width
    cover.animate([{ transform: `scale(${k})` }, { transform: 'scale(1)' }], {
      duration: 500,
      easing: root.getPropertyValue('--motion-ease-in-out').trim() || 'ease-in-out',
      fill: 'backwards',
    })
    meta.animate(
      [
        { transform: 'translateY(-300px)', opacity: 0 },
        { opacity: 0, offset: 221 / 500 },
        { transform: 'translateY(0)', opacity: 1 },
      ],
      { duration: 500, easing: root.getPropertyValue('--motion-ease-out').trim() || 'ease-out', fill: 'backwards' },
    )
  }, [isLoaded])

  const action = isPlaying ? `Stop ${track.title}` : `Play ${track.title}`

  return (
    <li
      className={[
        'flex items-start gap-16 w-full',
        isLoaded ? 'md:flex-col md:gap-24' : '',
      ].join(' ')}
    >
      <button
        ref={coverRef}
        type="button"
        onClick={onSelect}
        onPointerDown={(e) => e.pointerType !== 'mouse' && setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        // touch events too: Firefox's responsive design mode sends no pointer events
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        onTouchCancel={() => setPressed(false)}
        data-pressed={pressed || undefined}
        aria-label={action}
        className={[
          'group relative shrink-0 aspect-square overflow-hidden cursor-pointer origin-top-left [-webkit-tap-highlight-color:transparent]',
          'outline-none focus-visible:ring-2 focus-visible:ring-[var(--vinyl-button-text-icon-focus)]',
          'w-[var(--vinyl-album-cover-small-max-width)] min-w-[var(--vinyl-album-cover-min-width)]',
          isLoaded ? 'md:w-full md:max-w-[var(--vinyl-album-cover-large-max-width)]' : '',
        ].join(' ')}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/fake-papoose/covers/${track.cover}${isLoaded ? '' : '-thumb'}.webp`}
          alt=""
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
        {/* Hover state: dark overlay with play, or stop on the playing track.
            Touch screens have no hover, so on XS/SM the same overlay shows
            while the thumbnail is pressed (data-pressed, set from touch and
            pen pointer events and from touch events; CSS :active is
            unreliable on touch): straight away, fading out on release. */}
        <span
          aria-hidden="true"
          className={[
            'absolute inset-0 flex items-center justify-center bg-black/30 text-white',
            'opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100',
            'max-md:group-data-pressed:opacity-100 max-md:group-data-pressed:duration-0',
          ].join(' ')}
        >
          <Icon
            name={isPlaying ? 'stop-filled-alt' : 'play'}
            className={isLoaded ? 'size-[28px] md:size-[56px]' : 'size-[28px]'}
          />
        </span>
      </button>

      {/* XS/SM playing marker */}
      {isPlaying && (
        <Icon
          name="play-marker"
          className="size-16 shrink-0 mt-2 text-[var(--vinyl-button-text-icon-active)] md:hidden"
        />
      )}

      <div ref={metaRef} className="flex flex-col gap-16 flex-1 min-w-0 md:w-full">
        <p className="font-display font-[600] text-[20px] leading-none tracking-tight text-[var(--text-body)]">
          {track.title}
        </p>
        <div className="flex flex-wrap items-start gap-16 w-full">
          <LabelValue label="Album" value={track.album} className="min-w-[200px]" />
          <div className="flex items-start gap-24">
            <LabelValue label="Year" value={track.year} className="w-48" />
            <LabelValue label="Length" value={unavailable ? 'Unavailable' : track.length} className="min-w-60" />
          </div>
          {count !== null && <PlayCount count={count} />}
        </div>
      </div>
    </li>
  )
}

function LabelValue({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={['flex flex-col gap-2 text-[var(--text-body)] whitespace-nowrap', className].filter(Boolean).join(' ')}>
      <span className="font-body font-medium text-[11px] leading-none tracking-[2px] uppercase">{label}</span>
      <span className="font-body font-normal text-[14px] leading-[30px]">{value}</span>
    </div>
  )
}

// Play counter badge: surface-3 pill, headphones icon, link-colored count.
function PlayCount({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-8 px-12 py-8 rounded-md bg-[var(--surface-3)]"
      aria-label={`${count} ${count === 1 ? 'play' : 'plays'}`}
      role="img"
    >
      <Icon name="headphones" className="size-16 text-[var(--text-body)]" />
      <span className="font-body font-medium text-[11px] leading-none tracking-[2px] text-[var(--link-rest)]" aria-hidden="true">
        {String(count).padStart(2, '0')}
      </span>
    </div>
  )
}
