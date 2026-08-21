import type { Accidental, Letter } from './types'

export const SHARP = '♯' // ♯
export const FLAT = '♭' // ♭

export function mod12(n: number): number {
  return ((n % 12) + 12) % 12
}

/** The 12 root choices offered in the Key selector, in chromatic order. */
export const KEY_ROOTS: { pc: number; label: string }[] = [
  { pc: 0, label: 'C' },
  { pc: 1, label: `D${FLAT}` },
  { pc: 2, label: 'D' },
  { pc: 3, label: `E${FLAT}` },
  { pc: 4, label: 'E' },
  { pc: 5, label: 'F' },
  { pc: 6, label: `F${SHARP}` },
  { pc: 7, label: 'G' },
  { pc: 8, label: `A${FLAT}` },
  { pc: 9, label: 'A' },
  { pc: 10, label: `B${FLAT}` },
  { pc: 11, label: 'B' },
]

const LETTER_CYCLE: Letter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
const LETTER_NATURAL_PC: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const SHARP_ORDER: Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B']
const FLAT_ORDER: Letter[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F']

type AccidentalSign = 'sharp' | 'flat' | 'none'

interface MajorKeyInfo {
  letter: Letter
  accidental: Accidental
  count: number
  sign: AccidentalSign
}

/**
 * Circle-of-fifths key signature for each of the 12 major keys (indexed by
 * tonic pitch class), using the conventional minimal-accidental spelling.
 */
const MAJOR_KEY_TABLE: Record<number, MajorKeyInfo> = {
  0: { letter: 'C', accidental: 0, count: 0, sign: 'none' },
  1: { letter: 'D', accidental: -1, count: 5, sign: 'flat' },
  2: { letter: 'D', accidental: 0, count: 2, sign: 'sharp' },
  3: { letter: 'E', accidental: -1, count: 3, sign: 'flat' },
  4: { letter: 'E', accidental: 0, count: 4, sign: 'sharp' },
  5: { letter: 'F', accidental: 0, count: 1, sign: 'flat' },
  6: { letter: 'F', accidental: 1, count: 6, sign: 'sharp' },
  7: { letter: 'G', accidental: 0, count: 1, sign: 'sharp' },
  8: { letter: 'A', accidental: -1, count: 4, sign: 'flat' },
  9: { letter: 'A', accidental: 0, count: 3, sign: 'sharp' },
  10: { letter: 'B', accidental: -1, count: 2, sign: 'flat' },
  11: { letter: 'B', accidental: 0, count: 5, sign: 'sharp' },
}

export interface NoteSpelling {
  letter: Letter
  accidental: Accidental
  pc: number
}

/**
 * Builds the 7 diatonically-spelled notes for a key, starting on the tonic.
 * For minor keys the key signature (and thus accidentals) is borrowed from
 * the relative major, and the tonic letter is derived as "2 letters below"
 * the relative major's tonic — the standard music-theory relationship. This
 * naturally produces idiomatic enharmonic spelling (e.g. root pitch-class 1
 * in minor mode spells as C# minor, not Db minor, matching real usage).
 */
export function buildKeySpelling(rootPc: number, mode: 'major' | 'minor'): NoteSpelling[] {
  let tonicLetter: Letter
  let count: number
  let sign: AccidentalSign

  if (mode === 'major') {
    const info = MAJOR_KEY_TABLE[mod12(rootPc)]
    tonicLetter = info.letter
    count = info.count
    sign = info.sign
  } else {
    const relativeMajorPc = mod12(rootPc + 3)
    const relInfo = MAJOR_KEY_TABLE[relativeMajorPc]
    tonicLetter = LETTER_CYCLE[(LETTER_CYCLE.indexOf(relInfo.letter) - 2 + 7) % 7]
    count = relInfo.count
    sign = relInfo.sign
  }

  const accidentals: Record<Letter, Accidental> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 }
  const order = sign === 'sharp' ? SHARP_ORDER : sign === 'flat' ? FLAT_ORDER : []
  for (let i = 0; i < count; i++) {
    accidentals[order[i]] = sign === 'sharp' ? 1 : -1
  }

  const startIdx = LETTER_CYCLE.indexOf(tonicLetter)
  const letters: Letter[] = Array.from({ length: 7 }, (_, i) => LETTER_CYCLE[(startIdx + i) % 7])

  return letters.map((letter) => ({
    letter,
    accidental: accidentals[letter],
    pc: mod12(LETTER_NATURAL_PC[letter] + accidentals[letter]),
  }))
}

export function formatSpelling(spelling: Pick<NoteSpelling, 'letter' | 'accidental'>): string {
  const accStr = spelling.accidental === 1 ? SHARP : spelling.accidental === -1 ? FLAT : ''
  return `${spelling.letter}${accStr}`
}

/** Fixed open-string names for standard tuning, low E (string 6) to high e (string 1). */
export const OPEN_STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'] as const

/** Open-string pitch classes, same order as OPEN_STRING_NAMES. */
export const OPEN_STRING_PCS = [4, 9, 2, 7, 11, 4] as const
