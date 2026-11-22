// Vinyl player rules (components/fake-papoose/playerLogic.ts). Run: npm test
import test from 'node:test'
import assert from 'node:assert/strict'
import { shuffleStart, nextTrack, PlayQualifier } from '../components/fake-papoose/playerLogic.ts'

const TRACKS = 6
// rng that returns the values given, in order
const seq = (...v) => () => v.shift()
const pick = (i, n) => (i + 0.5) / n // rng value that lands on index i of n

test('shuffle can start on any of the six tracks, the first included', () => {
  const hits = new Set()
  for (let i = 0; i < TRACKS; i++) hits.add(shuffleStart(TRACKS, null, seq(pick(i, TRACKS))))
  assert.deepEqual([...hits].sort(), [0, 1, 2, 3, 4, 5])
})

test('shuffle is not stuck on the first track with a real random source', () => {
  const hits = new Set()
  for (let i = 0; i < 500; i++) hits.add(shuffleStart(TRACKS, null))
  assert.equal(hits.size, TRACKS)
})

test('shuffle while a track plays switches to another track', () => {
  for (let i = 0; i < TRACKS - 1; i++) assert.notEqual(shuffleStart(TRACKS, 2, seq(pick(i, TRACKS - 1))), 2)
})

test('in order: next track, then stop or wrap with repeat', () => {
  const played = new Set()
  assert.equal(nextTrack(0, TRACKS, { shuffle: false, repeat: false, played }), 1)
  assert.equal(nextTrack(5, TRACKS, { shuffle: false, repeat: false, played }), null)
  assert.equal(nextTrack(5, TRACKS, { shuffle: false, repeat: true, played }), 0)
})

test('shuffle plays every track once, then stops (or starts a new round with repeat)', () => {
  const played = new Set([3])
  const order = [3]
  let cur = 3
  for (;;) {
    const n = nextTrack(cur, TRACKS, { shuffle: true, repeat: false, played }, () => 0)
    if (n === null) break
    order.push(n)
    cur = n
  }
  assert.deepEqual([...order].sort(), [0, 1, 2, 3, 4, 5])
  const again = nextTrack(cur, TRACKS, { shuffle: true, repeat: true, played }, () => 0)
  assert.notEqual(again, null)
  assert.notEqual(again, cur)
})

// time updates every 0.25s from `from` to `to`; returns how many times it qualified
function listen(q, from, to, duration) {
  let hits = 0
  for (let t = from; t <= to; t += 0.25) if (q.update(t, duration)) hits++
  return hits
}

test('a listen from the start to 90% counts once', () => {
  const q = new PlayQualifier()
  q.begin()
  assert.equal(listen(q, 0, 89.75, 100), 0)
  assert.equal(listen(q, 90, 100, 100), 1)
})

test('jumping ahead to 90% or later does not count', () => {
  const q = new PlayQualifier()
  q.begin()
  listen(q, 0, 10, 100)
  assert.equal(listen(q, 92, 100, 100), 0)
})

test('moving the tonearm cancels the listen, even if it lands before 90%', () => {
  const q = new PlayQualifier()
  q.begin()
  listen(q, 0, 50, 100)
  q.cancel()
  assert.equal(listen(q, 50.25, 100, 100), 0)
})

test('nothing counts until a listen begins at the start of a track', () => {
  const q = new PlayQualifier()
  assert.equal(listen(q, 0, 100, 100), 0)
})

test('a new listen (repeat, replay) can count again', () => {
  const q = new PlayQualifier()
  q.begin()
  assert.equal(listen(q, 0, 100, 100), 1)
  q.begin()
  assert.equal(listen(q, 0, 100, 100), 1)
})
