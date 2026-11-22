// ─── Vinyl player rules ───────────────────────────────────────────────────────
// The parts of the player's behavior that don't touch the DOM or audio:
// shuffle picks, the next track, and when a listen counts as a play. Kept
// separate so they can be tested (tests/fake-papoose-player.test.mjs).

export type Rng = () => number

/**
 * Track to load when Shuffle is switched on. Any of the tracks can come up,
 * including the first. While a track is already playing it is left out, so
 * pressing Shuffle always changes the record.
 */
export function shuffleStart(count: number, playing: number | null, rng: Rng = Math.random) {
  const pool = Array.from({ length: count }, (_, i) => i).filter((i) => i !== playing)
  return pool[Math.floor(rng() * pool.length)] ?? 0
}

/**
 * Track after `current`, or null when playback should stop. In shuffle mode
 * `played` holds the tracks heard in this shuffle round; it is updated in place.
 */
export function nextTrack(
  current: number,
  count: number,
  opts: { shuffle: boolean; repeat: boolean; played: Set<number> },
  rng: Rng = Math.random,
) {
  const all = Array.from({ length: count }, (_, i) => i)
  if (opts.shuffle) {
    let left = all.filter((i) => !opts.played.has(i))
    if (!left.length) {
      if (!opts.repeat) return null
      opts.played.clear()
      opts.played.add(current)
      left = all.filter((i) => i !== current)
    }
    const n = left[Math.floor(rng() * left.length)]
    opts.played.add(n)
    return n
  }
  if (current + 1 < count) return current + 1
  return opts.repeat ? 0 : null
}

/** Share of a track that has to play, from the start and without a break, to count. */
export const PLAY_THRESHOLD = 0.9

// A step between two time updates larger than this is a jump, not playback.
const MAX_STEP = 3

/**
 * Decides when a listen counts as a play: the track started at the beginning
 * and played on its own, without the tonearm being moved, up to 90%.
 * Feed it every time update; it returns true once, at the moment the listen
 * qualifies.
 */
export class PlayQualifier {
  private active = false
  private counted = false
  private listened = 0
  private last = 0

  /** The needle dropped at the start of a track. */
  begin() {
    this.active = true
    this.counted = false
    this.listened = 0
    this.last = 0
  }

  /** The listen was interrupted (tonearm moved, Stop, track change). */
  cancel() {
    this.active = false
  }

  update(time: number, duration: number) {
    if (!this.active || this.counted || !(duration > 0) || !isFinite(duration)) return false
    const step = time - this.last
    this.last = time
    if (step < 0 || step > MAX_STEP) {
      // the playhead jumped: not a continuous listen any more
      this.active = false
      return false
    }
    this.listened += step
    const need = duration * PLAY_THRESHOLD
    if (time >= need && this.listened >= need - MAX_STEP) {
      this.counted = true
      return true
    }
    return false
  }
}
