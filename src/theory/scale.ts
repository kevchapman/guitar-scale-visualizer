import type { Mode, ScaleTone } from './types'
import { buildKeySpelling } from './notes'

const DEGREE_LABELS: Record<Mode, string[]> = {
  major: ['1', '2', '3', '4', '5', '6', '7'],
  minor: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
}

/** Root/3rd/5th are always degree indices 0, 2, 4 in a 7-note diatonic scale. */
export const TRIAD_DEGREE_INDICES = [0, 2, 4]

export function buildScale(rootPc: number, mode: Mode): ScaleTone[] {
  const spellings = buildKeySpelling(rootPc, mode)
  const degreeLabels = DEGREE_LABELS[mode]
  return spellings.map((spelling, degreeIndex) => ({
    pc: spelling.pc,
    letter: spelling.letter,
    accidental: spelling.accidental,
    degreeIndex,
    degreeLabel: degreeLabels[degreeIndex],
    isRoot: degreeIndex === 0,
    isTriad: TRIAD_DEGREE_INDICES.includes(degreeIndex),
  }))
}
