// ─── Vinyl player engine ──────────────────────────────────────────────────────
// Playback, animation and tonearm logic for the Fake Papoose turntable. Ported
// from the Claude Design prototype ("Vinyl Record Player.dc.html"); behavior is
// specified in fake-papoose-vinyl/vinyl-record-player-interaction.md.
//
// The engine owns everything that changes every frame (sticker angle, tonearm
// angle, highlight swing, RPM digits) and writes it straight to the DOM through
// the elements passed to attach(), so React only re-renders on real state
// changes (track loaded, playing, toggles).
//
// Every duration, easing, angle and speed comes from the `motion` tokens
// (--motion-ease-*, --motion-vinyl-*), read from CSS when the engine attaches.
// The geometry constants below are measurements of the SVG artwork, not tokens.

import { nextTrack, PlayQualifier, shuffleStart, type Rng } from './playerLogic'

// ── Geometry (record-player-guides.svg units; 2067.08 × 2000 deck layer) ──
export const DECK_W = 2067.08
const PIVOT = [1923.02, 293.28] // tonearm axis (guide E)
const ARM_B = 7.1417 // start: outer edge of the record (guide B), degrees from rest C
const ARM_A = 32.3406 // end: inner edge of the record (guide A)
const RPM_STEP_SIZE = 5 // the display counts 0, 5, 10 … then the sticker speed
const LIFT = 0.3 // degrees the tonearm must move off its rest before the record starts

export type Track = { id: string }

/** A screen position from a pointer or touch event. */
export type GripPoint = { clientX: number; clientY: number }

export type EngineState = {
  loaded: number
  playing: boolean
  dragging: boolean
  repeat: boolean
  shuffle: boolean
  mute: boolean
  rpmStep: number
  failed: string[]
}

export type EngineElements = {
  deck: HTMLElement
  arm: HTMLElement
  sticker: HTMLElement
  stickerA: HTMLImageElement
  stickerB: HTMLImageElement
  highlight1: HTMLElement
  highlight2: HTMLElement
}

type Ease = (t: number) => number

type Tokens = {
  easeOut: Ease
  easeInOut: Ease
  hl1: number
  hl2: number
  hl1Dur: number
  hl2Dur: number
  fullSpeed: number // deg/s
  rpm: number
  startDur: number
  stopDur: number
  xfade: number
  toStart: number
  ret: number
  next: number
  needleDelay: number
}

type Tween = {
  from: number
  to: number
  dur: number
  ease: Ease
  t: number
  timer: ReturnType<typeof setTimeout>
  res: (done: boolean) => void
}

type Sim = { arm: number; speed: number; rot: number; hlT: number; hlOn: boolean; hlK: number }

// ── Token readers ──
function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
function cssNumber(name: string) {
  const n = parseFloat(cssVar(name))
  if (Number.isNaN(n)) console.warn(`Vinyl player: token ${name} is missing`)
  return Number.isNaN(n) ? 0 : n
}
// Durations in milliseconds. The CSS minifier shortens values when it can
// (2000ms → 2s), so the unit has to be read, not assumed.
function cssMs(name: string) {
  return /\ds$/.test(cssVar(name)) ? cssNumber(name) * 1000 : cssNumber(name)
}
function cssEase(name: string): Ease {
  const m = cssVar(name).match(/cubic-bezier\(([^)]+)\)/)
  if (!m) {
    console.warn(`Vinyl player: token ${name} is missing`)
    return (t) => t
  }
  const [x1, y1, x2, y2] = m[1].split(',').map(Number)
  return bezier(x1, y1, x2, y2)
}

function bezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  return (t) => {
    if (t <= 0) return 0
    if (t >= 1) return 1
    let u = t
    for (let i = 0; i < 8; i++) {
      const x = ((ax * u + bx) * u + cx) * u - t
      const d = (3 * ax * u + 2 * bx) * u + cx
      if (Math.abs(x) < 1e-5 || d === 0) break
      u -= x / d
    }
    u = Math.min(1, Math.max(0, u))
    return ((ay * u + by) * u + cy) * u
  }
}

function readTokens(): Tokens {
  const rpm = cssNumber('--motion-vinyl-sticker-rpm')
  return {
    easeOut: cssEase('--motion-ease-out'),
    easeInOut: cssEase('--motion-ease-in-out'),
    hl1: cssNumber('--motion-vinyl-highlight-1-rotation'),
    hl2: cssNumber('--motion-vinyl-highlight-2-rotation'),
    hl1Dur: cssMs('--motion-vinyl-highlight-1-duration'),
    hl2Dur: cssMs('--motion-vinyl-highlight-2-duration'),
    rpm,
    fullSpeed: rpm * 6,
    startDur: cssMs('--motion-vinyl-sticker-start-duration'),
    stopDur: cssMs('--motion-vinyl-sticker-stop-duration'),
    xfade: cssMs('--motion-vinyl-sticker-crossfade-duration'),
    toStart: cssMs('--motion-vinyl-tonearm-to-start-duration'),
    ret: cssMs('--motion-vinyl-tonearm-return-duration'),
    next: cssMs('--motion-vinyl-tonearm-next-track-duration'),
    needleDelay: cssMs('--motion-vinyl-needle-drop-delay'),
  }
}

/** RPM display steps: 0, 5, 10 … 30, then the sticker speed (33⅓). */
export function rpmSteps(rpm: number) {
  const steps: number[] = []
  for (let v = 0; v < rpm - 0.5; v += RPM_STEP_SIZE) steps.push(v)
  return [...steps, rpm]
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ── Sound effects (Web Audio, so they start without delay) ──
const SFX_COUNT = 10
let sharedCtx: AudioContext | null = null
function audioCtx() {
  if (!sharedCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    sharedCtx = new Ctx()
  }
  if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {})
  return sharedCtx
}
const fxUrl = (kind: string, n: number) => `/fake-papoose/sfx/${kind}-${String(n + 1).padStart(2, '0')}.mp3`
const FX_URLS = ['needle', 'scratch'].flatMap((k) => Array.from({ length: SFX_COUNT }, (_, n) => fxUrl(k, n)))

// The files are fetched when the player loads and decoded at the first click
// (an AudioContext can only start inside a user gesture), so the needle drop
// and the scratch sound right away instead of after a download.
const fxBytes: Record<string, Promise<ArrayBuffer>> = {}
function fxFetch(url: string) {
  if (!fxBytes[url]) {
    fxBytes[url] = fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${url}: ${r.status}`))))
      .catch((e) => {
        delete fxBytes[url]
        throw e
      })
  }
  return fxBytes[url]
}
const fxCache: Record<string, Promise<AudioBuffer>> = {}
function fxBuffer(url: string) {
  if (!fxCache[url]) {
    fxCache[url] = fxFetch(url)
      .then((ab) => audioCtx().decodeAudioData(ab.slice(0)))
      .catch((e) => {
        delete fxCache[url]
        throw e
      })
  }
  return fxCache[url]
}
function unlockAudio() {
  audioCtx()
  for (const url of FX_URLS) fxBuffer(url).catch(() => {})
}

export class PlayerEngine {
  private tracks: Track[]
  private onChange: (s: EngineState) => void
  private onPlayCounted: (index: number) => void
  private rng: Rng
  private reducedMotion = false

  private state: EngineState
  private els: EngineElements | null = null
  private audio: HTMLAudioElement | null = null
  private T: Tokens | null = null
  private steps: number[] = [0]
  private sim: Sim = { arm: 0, speed: 0, rot: 0, hlT: 0, hlOn: false, hlK: 0 }
  private tw: Record<string, Tween> = {}
  private raf = 0
  private token = 0
  private played = new Set<number>()
  private listen = new PlayQualifier()
  private lastFx: Record<string, number> = { needle: -1, scratch: -1 }
  private scratchBusy = false
  private seeking = false
  private holdArm = false
  private ending = false
  private wasPlaying = false
  private spinTarget = 0 // speed the record is spinning, or heading, towards
  private grabOffset = 0
  private audioReady: Promise<void> = Promise.resolve()
  private audioSeq = 0
  private onPageHide = () => this.audio?.pause()

  // onPlayCounted fires when a listen qualifies as a play (playerLogic.ts).
  constructor(tracks: Track[], onChange: (s: EngineState) => void, onPlayCounted: (index: number) => void, rng: Rng = Math.random) {
    this.tracks = tracks
    this.onChange = onChange
    this.onPlayCounted = onPlayCounted
    this.rng = rng
    this.state = {
      loaded: 0, playing: false, dragging: false,
      repeat: false, shuffle: false, mute: false,
      rpmStep: 0, failed: [],
    }
  }

  get snapshot() {
    return this.state
  }

  private set(patch: Partial<EngineState>) {
    this.state = { ...this.state, ...patch }
    this.onChange(this.state)
  }

  // ── lifecycle ──
  attach(els: EngineElements) {
    this.els = els
    this.T = readTokens()
    this.steps = rpmSteps(this.T.rpm)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.reducedMotion = mq.matches

    this.audio = new Audio()
    this.audio.preload = 'metadata'
    this.audio.addEventListener('ended', () => this.onEnded())
    this.audio.addEventListener('timeupdate', () => {
      const a = this.audio
      if (a && !a.paused && this.listen.update(a.currentTime, a.duration)) this.onPlayCounted(this.state.loaded)
    })
    this.audio.addEventListener('error', () => {
      if (!this.audio?.getAttribute('src')) return
      const id = this.tracks[this.state.loaded].id
      if (!this.state.failed.includes(id)) this.set({ failed: [...this.state.failed, id] })
      if (this.state.playing) this.stop()
    })
    this.audioReady = this.setAudio(this.state.loaded)
    for (const url of FX_URLS) fxFetch(url).catch(() => {})
    window.addEventListener('pagehide', this.onPageHide)

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(50, now - last)
      last = now
      this.step(dt)
      this.raf = requestAnimationFrame(tick)
    }
    this.raf = requestAnimationFrame(tick)
  }

  detach() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('pagehide', this.onPageHide)
    for (const key of Object.keys(this.tw)) this.cancelTween(key as keyof Sim)
    if (this.audio) {
      this.audio.pause()
      this.audio.removeAttribute('src')
      this.audio.load()
    }
    this.audio = null
    this.els = null
  }

  // ── animation primitives ──
  private tween(key: keyof Sim, to: number, dur: number, ease: Ease) {
    return new Promise<boolean>((res) => {
      this.cancelTween(key)
      const w: Tween = { from: this.sim[key] as number, to, dur: Math.max(1, dur), ease, t: 0, res, timer: 0 as unknown as ReturnType<typeof setTimeout> }
      // rAF pauses in background tabs while the music keeps going, which would
      // leave a track change stuck mid-sequence. Force-finish late tweens.
      w.timer = setTimeout(() => {
        if (this.tw[key] !== w) return
        ;(this.sim[key] as number) = to
        delete this.tw[key]
        res(true)
      }, w.dur + 250)
      this.tw[key] = w
    })
  }
  private cancelTween(key: keyof Sim) {
    const w = this.tw[key]
    if (!w) return
    clearTimeout(w.timer)
    delete this.tw[key]
    w.res(false)
  }

  private hlStart() {
    const s = this.sim
    if (!s.hlOn) {
      s.hlOn = true
      s.hlT = 0
    }
    this.cancelTween('hlK')
    s.hlK = 1
  }
  private hlStop() {
    const s = this.sim
    if (s.hlOn || s.hlK > 0) {
      this.tween('hlK', 0, this.T!.stopDur, this.T!.easeOut).then((ok) => {
        if (ok) s.hlOn = false
      })
    }
  }

  private step(dt: number) {
    const els = this.els, T = this.T
    if (!els || !T) return
    const s = this.sim
    for (const key of Object.keys(this.tw) as (keyof Sim)[]) {
      const w = this.tw[key]
      w.t += dt
      const k = Math.min(1, w.t / w.dur)
      ;(s[key] as number) = w.from + (w.to - w.from) * w.ease(k)
      if (k >= 1) {
        clearTimeout(w.timer)
        delete this.tw[key]
        w.res(true)
      }
    }
    const a = this.audio
    if (a && this.state.playing && !this.state.dragging && !this.tw.arm && !this.seeking && !this.holdArm) {
      const p = a.duration && isFinite(a.duration) ? a.currentTime / a.duration : 0
      s.arm = ARM_B + (ARM_A - ARM_B) * Math.min(1, p)
    }
    s.rot = (s.rot + (s.speed * dt) / 1000) % 360

    // Highlights rock like a pendulum; separate swing durations keep them out of step.
    let hl1 = 0, hl2 = 0
    if (s.hlOn && !this.reducedMotion) {
      s.hlT += dt
      const swing = (dur: number) => {
        const ph = (s.hlT % (2 * dur)) / dur
        return ph < 1 ? T.easeInOut(ph) : 1 - T.easeInOut(ph - 1)
      }
      hl1 = T.hl1 * swing(T.hl1Dur) * s.hlK
      hl2 = -T.hl2 * swing(T.hl2Dur) * s.hlK // highlight 2 starts counterclockwise
    }

    // RPM display follows the record's actual speed.
    const rpm = s.speed / 6
    let idx = 0
    for (let i = 0; i < this.steps.length; i++) if (rpm + 0.4 >= this.steps[i]) idx = i
    if (idx !== this.state.rpmStep) this.set({ rpmStep: idx })

    els.arm.style.transform = `rotate(${s.arm.toFixed(3)}deg)`
    els.sticker.style.transform = `rotate(${s.rot.toFixed(2)}deg)`
    els.highlight1.style.transform = `rotate(${hl1.toFixed(3)}deg)`
    els.highlight2.style.transform = `rotate(${hl2.toFixed(3)}deg)`
  }

  // ── sound ──
  private fx(kind: 'needle' | 'scratch') {
    if (this.state.mute) return null
    let n: number
    do n = Math.floor(Math.random() * SFX_COUNT)
    while (n === this.lastFx[kind])
    this.lastFx[kind] = n
    const url = fxUrl(kind, n)
    // resolves when the effect finishes (or fails)
    return fxBuffer(url).then(
      (b) =>
        new Promise<void>((res) => {
          const ctx = audioCtx()
          const node = ctx.createBufferSource()
          node.buffer = b
          node.connect(ctx.destination)
          node.onended = () => res()
          node.start()
        }),
      () => {},
    )
  }
  private scratch() {
    if (this.scratchBusy) return
    const p = this.fx('scratch')
    if (!p) return
    this.scratchBusy = true
    p.then(() => {
      this.scratchBusy = false
    })
  }

  // ── audio ──
  private async setAudio(i: number) {
    const a = this.audio
    if (!a) return
    ++this.audioSeq
    a.muted = this.state.mute
    a.src = `/fake-papoose/tracks/${this.tracks[i].id}.mp3`
    a.load()
  }

  private async waitMeta() {
    const a = this.audio
    if (!a) return
    if (a.readyState >= 1 && a.duration && isFinite(a.duration)) return
    await Promise.race([new Promise((r) => a.addEventListener('loadedmetadata', r, { once: true })), wait(4000)])
  }

  private canSeek(target: number) {
    const r = this.audio?.seekable
    if (!r) return false
    for (let i = 0; i < r.length; i++) if (target >= r.start(i) && target <= r.end(i)) return true
    return false
  }

  // Set currentTime and wait until the element has actually moved there.
  private async applySeek(target: number) {
    const a = this.audio
    if (!a) return false
    // A server that ignores byte ranges leaves nothing seekable; don't wait
    // for a seek that can't happen (that wait was the silence after a drop).
    if (target >= 1 && !this.canSeek(target)) return false
    const seeked = new Promise((r) => a.addEventListener('seeked', r, { once: true }))
    a.currentTime = target
    await Promise.race([seeked, wait(2000)])
    return Math.abs(a.currentTime - target) < 1
  }

  // Seeks to the dropped position. If the server can't serve byte ranges the
  // track can't seek; pull the whole file into memory once and seek within
  // that instead. Production and `npm run preview` both serve ranges.
  private async seekTo(progress: number) {
    const a = this.audio
    if (!a) return
    await this.waitMeta()
    if (!(a.duration && isFinite(a.duration))) return
    const target = Math.min(a.duration - 0.25, Math.max(0, progress * a.duration))
    if (await this.applySeek(target)) return
    if (target < 1 || !a.currentSrc || a.currentSrc.startsWith('blob:')) return
    try {
      const seq = this.audioSeq
      const blob = await (await fetch(a.currentSrc)).blob()
      if (seq !== this.audioSeq) return
      a.src = URL.createObjectURL(blob)
      a.load()
      await this.waitMeta()
      await this.applySeek(target)
    } catch {}
  }

  private async crossfade(i: number) {
    const els = this.els
    if (!els) return
    const { stickerA: A, stickerB: B } = els
    const src = `/fake-papoose/stickers/${this.tracks[i].id}.webp`
    const img = new Image()
    img.src = src
    try {
      await img.decode()
    } catch {}
    const d = this.T!.xfade
    B.src = src
    B.style.transition = 'none'
    B.style.opacity = '0'
    void B.offsetWidth
    B.style.transition = `opacity ${d}ms linear`
    B.style.opacity = '1'
    await wait(d)
    A.src = src
    B.style.transition = 'none'
    B.style.opacity = '0'
  }

  private spinUp() {
    if (this.spinTarget !== this.T!.fullSpeed) {
      this.spinTarget = this.T!.fullSpeed
      this.tween('speed', this.T!.fullSpeed, this.T!.startDur, this.T!.easeOut)
    }
    this.hlStart()
  }
  private spinDown() {
    this.spinTarget = 0
    this.hlStop()
    return this.tween('speed', 0, this.T!.stopDur, this.T!.easeOut)
  }

  // Needle on the record. needle=true is the start of a track (doc §8.1):
  // needle-drop sound, then needle-drop-delay, then music. needle=false is a
  // hand drop partway through: music immediately, no sound, no delay.
  private async begin(progress: number, tk: number, needle: boolean) {
    const a = this.audio
    if (!a) return
    this.seeking = true
    await this.audioReady
    if (tk !== this.token) return
    await this.seekTo(progress)
    // A newer action (another drop, Stop) owns the tonearm now. Leave its
    // flags alone, or the arm would jump to this seek's stale position.
    if (tk !== this.token) return
    this.seeking = false
    this.holdArm = false
    this.ending = false
    this.set({ playing: true })
    this.spinUp()
    if (needle) {
      this.fx('needle')
      await wait(this.T!.needleDelay)
      if (tk !== this.token) return
    }
    this.priming = false
    a.muted = this.state.mute
    // Only a listen from the very start can count as a play.
    if (progress === 0) this.listen.begin()
    else this.listen.cancel()
    a.play().then(
      () => {},
      () => {
        if (tk === this.token) this.stop()
      },
    )
  }

  // Track change while the record spins (doc §3.3): normal play, shuffle, and
  // switching by hand. The record never slows: the sticker stays at 33⅓ and
  // the highlights keep rocking. Order: tonearm straight to B (never via C),
  // sticker crossfade, thumbnail, needle drop, delay, music.
  private async advanceTo(i: number, tk: number) {
    this.listen.cancel()
    this.holdArm = true
    this.audio?.pause()
    this.spinUp()
    const sweep = this.tween('arm', ARM_B, this.T!.next, this.T!.easeInOut)
    // start loading the next track during the sweep so the gap stays short
    if (i !== this.state.loaded) this.audioReady = this.setAudio(i)
    await sweep
    if (tk !== this.token) return
    if (i !== this.state.loaded) {
      await this.crossfade(i)
      if (tk !== this.token) return
      this.set({ loaded: i })
    }
    await this.begin(0, tk, true)
  }

  // Called inside every user gesture that can lead to sound. Web Audio (the
  // effects) can only start in a gesture. The track element is primed too: a
  // silent play-and-pause now lets the music start after the tonearm and
  // needle-drop delay (~1s later), which Safari on iOS would otherwise refuse
  // as no longer part of the tap.
  private primed = false
  private priming = false
  private unlock() {
    unlockAudio()
    const a = this.audio
    if (!a || this.primed || !a.paused) return
    this.priming = true
    a.muted = true
    a.play().then(
      () => {
        this.primed = true
        // begin() may already have started the music; leave it playing then
        if (this.priming) {
          a.pause()
          a.muted = this.state.mute
        }
        this.priming = false
      },
      () => {
        this.priming = false
        a.muted = this.state.mute
      },
    )
  }

  // ── public controls ──
  async start(i: number, manual = true) {
    if (!this.T) return
    const tk = ++this.token
    if (manual) this.played = new Set([i])
    this.unlock()
    if (this.state.playing || this.sim.speed > 0) {
      this.set({ playing: true })
      return this.advanceTo(i, tk)
    }
    this.set({ playing: true })
    this.spinUp() // rotation starts the instant playback is triggered (doc §8.1)
    if (i !== this.state.loaded) {
      this.audioReady = this.setAudio(i)
      await this.crossfade(i)
      if (tk !== this.token) return
      this.set({ loaded: i })
    }
    await this.tween('arm', ARM_B, Math.abs(this.sim.arm) < 0.05 ? this.T.toStart : this.T.ret, this.T.easeInOut)
    if (tk !== this.token) return
    await this.begin(0, tk, true)
  }

  // The Stop button, the tonearm dropped on its rest, and a stop from an
  // error all come through here, so they slow down the same way.
  stop() {
    if (!this.T) return
    ++this.token
    this.listen.cancel()
    this.holdArm = false
    this.ending = false
    this.seeking = false
    if (this.audio) {
      this.audio.pause()
      if (this.audio.readyState > 0) this.audio.currentTime = 0
    }
    this.set({ playing: false })
    this.spinDown()
    this.tween('arm', 0, this.T.ret, this.T.easeInOut)
  }

  /** Play or stop the loaded track (cartridge keys, large thumbnail). */
  toggle() {
    if (this.state.playing) this.stop()
    else this.start(this.state.loaded, true)
  }

  play() {
    if (!this.state.playing) this.start(this.state.loaded, true)
  }

  stopIfActive() {
    if (this.state.playing || this.sim.arm > 0.05) this.stop()
  }

  setRepeat(on: boolean) {
    this.set({ repeat: on })
  }

  // Shuffle on: load a random track and play it straight away. Shuffle off:
  // the current track carries on and the tracklist order resumes after it.
  // Stop leaves the mode as it is.
  toggleShuffle() {
    if (this.state.shuffle) {
      this.played = new Set([this.state.loaded])
      this.set({ shuffle: false })
      return
    }
    this.set({ shuffle: true })
    const busy = this.state.playing || this.sim.speed > 0
    const i = shuffleStart(this.tracks.length, busy ? this.state.loaded : null, this.rng)
    this.start(i, true)
  }

  setMute(on: boolean) {
    if (this.audio) this.audio.muted = on
    this.set({ mute: on })
  }

  private nextIndex() {
    const { loaded, shuffle, repeat } = this.state
    return nextTrack(loaded, this.tracks.length, { shuffle, repeat, played: this.played }, this.rng)
  }

  private async onEnded() {
    if (this.ending || !this.T) return
    this.ending = true
    this.listen.cancel()
    this.audio?.pause()
    const next = this.nextIndex()
    const tk = ++this.token
    if (next === null) {
      await this.spinDown()
      if (tk !== this.token) return
      this.set({ playing: false })
      await this.tween('arm', 0, this.T.ret, this.T.easeInOut)
      if (this.audio) this.audio.currentTime = 0
      this.ending = false
      return
    }
    this.advanceTo(next, tk)
  }

  // ── tonearm drag (doc §4.3) ──
  private pointerAngle(e: GripPoint) {
    const r = this.els!.deck.getBoundingClientRect()
    const u = r.width / DECK_W
    const x = (e.clientX - r.left) / u, y = (e.clientY - r.top) / u
    return (Math.atan2(PIVOT[0] - x, y - PIVOT[1]) * 180) / Math.PI
  }

  // The Turntable feeds these from pointer events, or from touch events where
  // a browser sends no pointer events (Firefox's responsive design mode).
  gripDown(e: GripPoint) {
    if (!this.els || this.state.dragging) return
    this.unlock()
    this.holdArm = false
    this.ending = false
    this.listen.cancel() // moving the tonearm interrupts the listen
    ++this.token
    this.cancelTween('arm')
    this.seeking = false
    this.grabOffset = this.pointerAngle(e) - this.sim.arm
    this.wasPlaying = this.state.playing
    if (this.state.playing) this.audio?.pause()
    this.set({ dragging: true })
  }

  gripMove(e: GripPoint) {
    if (!this.state.dragging) return
    const a = Math.min(ARM_A, Math.max(0, this.pointerAngle(e) - this.grabOffset))
    const moved = Math.abs(a - this.sim.arm)
    this.sim.arm = a
    // Lifting the arm off its rest starts the record, which spins up as it
    // does for Play. Passing back over the rest doesn't stop it; only
    // letting go there does (gripUp).
    if (a > LIFT && this.spinTarget === 0) this.spinUp()
    if (a >= ARM_B && moved > 0.05) this.scratch()
  }

  gripUp() {
    if (!this.state.dragging || !this.T) return
    this.set({ dragging: false })
    const a = this.sim.arm
    if (a < ARM_B * 0.5) {
      if (this.wasPlaying || this.spinTarget > 0 || this.sim.speed > 0) this.stop()
      else this.tween('arm', 0, this.T.ret, this.T.easeInOut)
      return
    }
    const tk = ++this.token
    if (a < ARM_B) this.tween('arm', ARM_B, this.T.toStart, this.T.easeInOut)
    // Music resumes exactly where the needle lands, earlier or later in the track.
    const progress = Math.min(1, Math.max(0, (a - ARM_B) / (ARM_A - ARM_B)))
    this.seeking = true
    if (!this.wasPlaying) this.played = new Set([this.state.loaded])
    this.begin(progress, tk, false)
  }
}
