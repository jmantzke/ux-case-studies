'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Turntable, { type TurntableHandle } from './Turntable'
import Tracklist, { type TrackInfo } from './Tracklist'
import { PlayerEngine, type EngineState } from './playerEngine'

// ─── VinylPlayer ──────────────────────────────────────────────────────────────
// The Fake Papoose record player and its tracklist (Figma vinyl/record-player
// + vinyl/tracklist). `children` is the about text, which shares the left
// column with the turntable from LG up while the tracklist sits beside them.
//
// A play is counted when a track has played from its start to 90% without
// the tonearm being moved (playerLogic.ts, PlayQualifier).
//
// Play counts come from /api/plays.php (public/api/plays.php), which only runs
// where PHP is available: the live server and `npm run preview`. Anywhere
// else the request fails and the badges stay hidden; the player still works.

const PLAYS_URL = '/api/plays.php'

export default function VinylPlayer({ tracks, children }: { tracks: TrackInfo[]; children: React.ReactNode }) {
  const turntable = useRef<TurntableHandle>(null)
  const engine = useRef<PlayerEngine | null>(null)
  const [state, setState] = useState<EngineState | null>(null)
  const [counts, setCounts] = useState<Record<string, number> | null>(null)

  const countPlay = useCallback(
    (index: number) => {
      fetch(PLAYS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: tracks[index].id }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => data.counts && setCounts(data.counts))
        .catch(() => {})
    },
    [tracks],
  )

  useEffect(() => {
    const e = new PlayerEngine(tracks, setState, countPlay)
    engine.current = e
    if (turntable.current) e.attach(turntable.current)
    return () => {
      e.detach()
      engine.current = null
    }
  }, [tracks, countPlay])

  useEffect(() => {
    fetch(PLAYS_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => data.counts && setCounts(data.counts))
      .catch(() => setCounts(null))
  }, [])

  const s = state ?? {
    loaded: 0, playing: false, dragging: false, repeat: false, shuffle: false, mute: false, rpmStep: 0, failed: [],
  }
  const e = () => engine.current

  return (
    <div className="flex flex-col gap-[var(--vinyl-gap)] w-full lg:flex-row lg:items-start">
      <div className="flex flex-col gap-[var(--vinyl-gap)] w-full lg:flex-1 lg:min-w-0">
        {children}
        <Turntable
          ref={turntable}
          stickerId={tracks[s.loaded].id}
          playing={s.playing}
          dragging={s.dragging}
          repeat={s.repeat}
          shuffle={s.shuffle}
          mute={s.mute}
          rpmStep={s.rpmStep}
          onPlay={() => e()?.play()}
          onStop={() => e()?.stopIfActive()}
          onRepeat={() => e()?.setRepeat(!s.repeat)}
          onShuffle={() => e()?.toggleShuffle()}
          onMute={() => e()?.setMute(!s.mute)}
          onCartridgeToggle={() => e()?.toggle()}
          onGripDown={(ev) => e()?.gripDown(ev)}
          onGripMove={(ev) => e()?.gripMove(ev)}
          onGripUp={() => e()?.gripUp()}
        />
      </div>

      <Tracklist
        tracks={tracks}
        loaded={s.loaded}
        playing={s.playing}
        counts={counts}
        failed={s.failed}
        onSelect={(i) => {
          if (i === s.loaded && s.playing) e()?.stop()
          else e()?.start(i, true)
        }}
      />
    </div>
  )
}
