import type { Accidental, HeptatonicMode, Letter } from './types'

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
  count: number
  sign: AccidentalSign
}

/**
 * Circle-of-fifths key signature for each of the 12 major keys (indexed by
 * tonic pitch class), using the conventional minimal-accidental spelling.
 */
const MAJOR_KEY_TABLE: Record<number, MajorKeyInfo> = {
  0: { letter: 'C', count: 0, sign: 'none' },
  1: { letter: 'D', count: 5, sign: 'flat' },
  2: { letter: 'D', count: 2, sign: 'sharp' },
  3: { letter: 'E', count: 3, sign: 'flat' },
  4: { letter: 'E', count: 4, sign: 'sharp' },
  5: { letter: 'F', count: 1, sign: 'flat' },
  6: { letter: 'F', count: 6, sign: 'sharp' },
  7: { letter: 'G', count: 1, sign: 'sharp' },
  8: { letter: 'A', count: 4, sign: 'flat' },
  9: { letter: 'A', count: 3, sign: 'sharp' },
  10: { letter: 'B', count: 2, sign: 'flat' },
  11: { letter: 'B', count: 5, sign: 'sharp' },
}

export interface NoteSpelling {
  letter: Letter
  accidental: Accidental
  pc: number
}

/** Builds the 7 diatonically-spelled notes of a major key, starting on the tonic. */
function buildMajorKeySpelling(rootPc: number): NoteSpelling[] {
  const info = MAJOR_KEY_TABLE[mod12(rootPc)]
  const accidentals: Record<Letter, Accidental> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 }
  const order = info.sign === 'sharp' ? SHARP_ORDER : info.sign === 'flat' ? FLAT_ORDER : []
  for (let i = 0; i < info.count; i++) {
    accidentals[order[i]] = info.sign === 'sharp' ? 1 : -1
  }

  const startIdx = LETTER_CYCLE.indexOf(info.letter)
  const letters: Letter[] = Array.from({ length: 7 }, (_, i) => LETTER_CYCLE[(startIdx + i) % 7])

  return letters.map((letter) => ({
    letter,
    accidental: accidentals[letter],
    pc: mod12(LETTER_NATURAL_PC[letter] + accidentals[letter]),
  }))
}

/** Semitone offset of each major-scale degree (1..7) from its own tonic. */
export const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11]

/** Semitone offset of each mode's own degrees (1..7) from its own tonic. */
const MODE_STEPS: Record<HeptatonicMode, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
}

/** Wraps an accidental-difference into (-6, 6], the range a single key signature can produce. */
function normalizeAccidental(diff: number): number {
  let d = diff
  while (d > 6) d -= 12
  while (d < -6) d += 12
  return d
}

/**
 * Spells 7 notes starting on `tonicLetter`, cycling naturally through the
 * musical alphabet, with each note's accidental computed directly to land
 * on the pitch class `rootPc + steps[i]`. This never has to choose between
 * enharmonic parent keys — the tonic's letter is fixed up front and every
 * other note falls out mechanically, which is what keeps e.g. F# Lydian
 * spelled with F as its tonic letter rather than silently becoming Gb.
 */
function spellFromTonic(rootPc: number, tonicLetter: Letter, steps: number[]): NoteSpelling[] {
  const startIdx = LETTER_CYCLE.indexOf(tonicLetter)
  const letters: Letter[] = Array.from({ length: 7 }, (_, i) => LETTER_CYCLE[(startIdx + i) % 7])
  return letters.map((letter, i) => {
    const pc = mod12(rootPc + steps[i])
    const accidental = normalizeAccidental(pc - LETTER_NATURAL_PC[letter])
    return { letter, accidental, pc }
  })
}

/**
 * The tonic letter natural-minor (Aeolian) keys use, derived from the
 * relative major exactly as real key signatures work: the tonic letter is
 * "2 letters below" the relative major's tonic letter. This is what makes
 * e.g. root pitch-class 1 in Aeolian spell as C# minor rather than Db minor
 * — the idiomatic, lower-accidental choice — matching real usage.
 */
function minorTonicLetter(rootPc: number): Letter {
  const relativeMajorPc = mod12(rootPc + 3)
  const relInfo = MAJOR_KEY_TABLE[relativeMajorPc]
  return LETTER_CYCLE[(LETTER_CYCLE.indexOf(relInfo.letter) - 2 + 7) % 7]
}

const hasDoubleAccidental = (spelling: NoteSpelling[]) => spelling.some((n) => Math.abs(n.accidental) > 1)

/**
 * Builds the 7 diatonically-spelled notes for any mode, starting on the
 * tonic. Every mode except Aeolian keeps the same tonic letter the Key
 * selector shows for Ionian (so picking "F#" always spells its tonic as F#,
 * whatever mode is chosen) — Aeolian is the one case with its own
 * well-established minor-key spelling convention (see minorTonicLetter).
 *
 * A handful of combinations (e.g. Db Locrian) stack the mode's own flats
 * onto an already-flat tonic letter and land on a double flat. When that
 * happens, fall back to the enharmonic tonic letter one step the other way
 * (Db -> C#), which always resolves to single accidentals — the same kind
 * of "pick the idiomatic spelling" fallback minor keys already get.
 */
export function buildModeSpelling(rootPc: number, mode: HeptatonicMode): NoteSpelling[] {
  if (mode === 'ionian') return buildMajorKeySpelling(rootPc)

  if (mode === 'aeolian') {
    return spellFromTonic(rootPc, minorTonicLetter(rootPc), MODE_STEPS.aeolian)
  }

  const canonical = MAJOR_KEY_TABLE[mod12(rootPc)]
  const canonicalAccidental = normalizeAccidental(mod12(rootPc) - LETTER_NATURAL_PC[canonical.letter])
  const primary = spellFromTonic(rootPc, canonical.letter, MODE_STEPS[mode])
  if (canonicalAccidental === 0 || !hasDoubleAccidental(primary)) return primary

  const altIdx = (LETTER_CYCLE.indexOf(canonical.letter) + (canonicalAccidental > 0 ? 1 : -1) + 7) % 7
  const alternate = spellFromTonic(rootPc, LETTER_CYCLE[altIdx], MODE_STEPS[mode])
  return hasDoubleAccidental(alternate) ? primary : alternate
}

export function formatSpelling(spelling: Pick<NoteSpelling, 'letter' | 'accidental'>): string {
  const { accidental } = spelling
  const accStr = accidental === 0 ? '' : (accidental > 0 ? SHARP : FLAT).repeat(Math.abs(accidental))
  return `${spelling.letter}${accStr}`
}

/** Fixed open-string names for standard tuning, low E (string 6) to high e (string 1). */
export const OPEN_STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'] as const

/** Open-string pitch classes, same order as OPEN_STRING_NAMES. */
export const OPEN_STRING_PCS = [4, 9, 2, 7, 11, 4] as const
