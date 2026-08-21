export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

// Practically always -1, 0, or 1 for the scales this app builds, but kept as
// a plain number (rather than a -1|0|1 union) so a pathological enharmonic
// spelling (a double sharp/flat) degrades gracefully instead of failing to
// type-check.
export type Accidental = number

/** The 7 diatonic modes of the major scale. */
export type HeptatonicMode = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian'

/** Every scale the app can display: the 7 modes plus major/minor pentatonic. */
export type ScaleId = HeptatonicMode | 'majorPentatonic' | 'minorPentatonic'

export type DisplayMode = 'root' | 'notes' | 'triads' | 'intervals'

export type ShapeName = 'C' | 'A' | 'G' | 'E' | 'D'

export type PositionId = ShapeName | 'all'

export type TriadRole = 'root' | 'third' | 'fifth'

/** One note of a spelled scale: a pitch class plus its diatonically-correct letter/accidental. */
export interface ScaleTone {
  pc: number
  letter: Letter
  accidental: Accidental
  /** 0-indexed position within the returned scale array (0 = root). */
  degreeIndex: number
  /** Display label, e.g. "1", "b3", "5". */
  degreeLabel: string
  isRoot: boolean
  /** True for whichever tone functions as root/3rd/5th of the tonic triad. */
  isTriad: boolean
  triadRole: TriadRole | null
}

/** A single cell on the fretboard grid that lands on an in-scale note. */
export interface FretCell {
  stringIndex: number // 0 = low E (string 6) .. 5 = high e (string 1)
  fret: number
  tone: ScaleTone
}

export interface CagedPosition {
  shape: ShapeName
  startFret: number
  endFret: number
}
