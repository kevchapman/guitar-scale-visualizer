import type { CagedPosition, ShapeName } from './types'
import { mod12, OPEN_STRING_PCS } from './notes'
import { MIN_FRET_COUNT } from './fretboard'

/**
 * CAGED positions are derived from the geometry of the 5 open-chord shapes
 * (C A G E D) rather than hardcoded per key. Each shape has a fixed
 * "defining string" (the string whose open-chord root note anchors the
 * shape) and a "root-relative fret" (how many frets above the shape's own
 * reference point that root sits when the chord is played open):
 *
 *   C shape (x32010): root on the A string (idx 1), 3 frets above the shape's start
 *   A shape (x02220): root on the A string (idx 1), at the shape's start
 *   G shape (320003): root on the low E string (idx 0), 3 frets above start
 *   E shape (022100): root on the low E string (idx 0), at the shape's start
 *   D shape (xx0232): root on the D string (idx 2), at the shape's start
 *
 * String indices here follow the same convention as the rest of the app:
 * 0 = low E (string 6) .. 5 = high e (string 1).
 *
 * For a chosen root pitch class, each shape's "start fret" (X) is computed
 * as: (fret where the root falls on the defining string) - (root-relative
 * fret). Sorting the 5 shapes by X reproduces the classic ascending-the-neck
 * CAGED order (C A G E D, cyclically) for any root and works identically
 * for major or minor since it only depends on where the root pitch class
 * physically sits on the neck, not on the scale overlaid on top of it.
 */
const SHAPE_REFERENCE: Record<ShapeName, { definingString: number; rootRelFret: number }> = {
  C: { definingString: 1, rootRelFret: 3 },
  A: { definingString: 1, rootRelFret: 0 },
  G: { definingString: 0, rootRelFret: 3 },
  E: { definingString: 0, rootRelFret: 0 },
  D: { definingString: 2, rootRelFret: 0 },
}

const SHAPE_ORDER: ShapeName[] = ['C', 'A', 'G', 'E', 'D']

export function computeCagedPositions(rootPc: number): CagedPosition[] {
  const anchors = SHAPE_ORDER.map((shape) => {
    const { definingString, rootRelFret } = SHAPE_REFERENCE[shape]
    const rootFret = mod12(rootPc - OPEN_STRING_PCS[definingString])
    let start = rootFret - rootRelFret
    if (start < 0) start += 12
    return { shape, start }
  }).sort((a, b) => a.start - b.start)

  return anchors.map((anchor, i) => {
    const next = anchors[(i + 1) % anchors.length]
    const end = i === anchors.length - 1 ? next.start + 12 : next.start
    return { shape: anchor.shape, startFret: anchor.start, endFret: end }
  })
}

export function computeFretCount(positions: CagedPosition[]): number {
  const maxEnd = positions.reduce((max, p) => Math.max(max, p.endFret), 0)
  return Math.max(MIN_FRET_COUNT, maxEnd)
}
