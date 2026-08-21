export type Letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export type Accidental = -1 | 0 | 1

export type Mode = 'major' | 'minor'

export type DisplayMode = 'root' | 'notes' | 'triads' | 'intervals'

export type ShapeName = 'C' | 'A' | 'G' | 'E' | 'D'

export type PositionId = ShapeName | 'all'

/** One note of a spelled scale: a pitch class plus its diatonically-correct letter/accidental. */
export interface ScaleTone {
  pc: number
  letter: Letter
  accidental: Accidental
  /** 0-indexed position within the 7-note scale (0 = root). */
  degreeIndex: number
  /** Display label, e.g. "1", "b3", "5". */
  degreeLabel: string
  isRoot: boolean
  /** True for root/3rd/5th (degree index 0, 2, 4). */
  isTriad: boolean
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
