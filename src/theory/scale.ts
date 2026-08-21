import type { HeptatonicMode, ScaleId, ScaleTone, TriadRole } from './types'
import { FLAT, MAJOR_STEPS, SHARP, buildModeSpelling, mod12 } from './notes'

/**
 * A tone is the "3rd" or "5th" of the tonic triad based on its position in
 * the scale (interval number), not its raw semitone distance — Lydian's
 * raised 4th and Locrian's flattened 5th both sit 6 semitones from the
 * root, but only one of them is actually the scale's 5th degree. Position
 * index 2 is always "some kind of 3rd" and index 4 is always "some kind of
 * 5th", whatever their accidental, by definition of interval numbering.
 */
function triadRoleForPosition(positionIndex: number): TriadRole | null {
  if (positionIndex === 0) return 'root'
  if (positionIndex === 2) return 'third'
  if (positionIndex === 4) return 'fifth'
  return null
}

/**
 * Degree label for a heptatonic scale tone at position `positionIndex`
 * (0-indexed), derived by comparing its semitone distance from the root
 * against the plain major scale's degree at that position. E.g. a minor
 * 3rd (3 semitones, vs. major's 4) at position 2 labels as "b3"; a raised
 * 4th (6 semitones, vs. major's 5) at position 3 labels as "#4".
 */
function degreeLabelFor(semitoneFromRoot: number, positionIndex: number): string {
  const degreeNumber = positionIndex + 1
  let diff = semitoneFromRoot - MAJOR_STEPS[positionIndex]
  while (diff > 6) diff -= 12
  while (diff < -6) diff += 12
  if (diff === 0) return `${degreeNumber}`
  if (diff === -1) return `${FLAT}${degreeNumber}`
  if (diff === 1) return `${SHARP}${degreeNumber}`
  // Not reachable by any of the 7 standard modes, but keep this total.
  return `${diff > 0 ? SHARP.repeat(diff) : FLAT.repeat(-diff)}${degreeNumber}`
}

function buildHeptatonicScale(rootPc: number, mode: HeptatonicMode): ScaleTone[] {
  const spellings = buildModeSpelling(rootPc, mode)
  return spellings.map((spelling, degreeIndex) => {
    const semitoneFromRoot = mod12(spelling.pc - rootPc)
    const triadRole = triadRoleForPosition(degreeIndex)
    return {
      pc: spelling.pc,
      letter: spelling.letter,
      accidental: spelling.accidental,
      degreeIndex,
      degreeLabel: degreeLabelFor(semitoneFromRoot, degreeIndex),
      isRoot: triadRole === 'root',
      isTriad: triadRole !== null,
      triadRole,
    }
  })
}

/** Pentatonic scales as a subset of a parent heptatonic mode's degrees. */
const PENTATONIC_SOURCES: Record<'majorPentatonic' | 'minorPentatonic', { parent: HeptatonicMode; indices: number[] }> = {
  // 1, 2, 3, 5, 6 of the major scale
  majorPentatonic: { parent: 'ionian', indices: [0, 1, 2, 4, 5] },
  // 1, b3, 4, 5, b7 of the natural minor scale
  minorPentatonic: { parent: 'aeolian', indices: [0, 2, 3, 4, 6] },
}

function buildPentatonicScale(rootPc: number, scaleId: 'majorPentatonic' | 'minorPentatonic'): ScaleTone[] {
  const { parent, indices } = PENTATONIC_SOURCES[scaleId]
  const parentScale = buildHeptatonicScale(rootPc, parent)
  return indices.map((parentIndex, degreeIndex) => ({
    ...parentScale[parentIndex],
    degreeIndex,
  }))
}

export function buildScale(rootPc: number, scaleId: ScaleId): ScaleTone[] {
  if (scaleId === 'majorPentatonic' || scaleId === 'minorPentatonic') {
    return buildPentatonicScale(rootPc, scaleId)
  }
  return buildHeptatonicScale(rootPc, scaleId)
}
