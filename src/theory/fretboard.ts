import type { FretCell, Mode, ScaleTone } from './types'
import { mod12, OPEN_STRING_PCS } from './notes'
import { buildScale } from './scale'

export const MIN_FRET_COUNT = 15

/**
 * Full string x fret grid of in-scale notes. Cells that don't land on a
 * scale tone are simply absent. Frets run 1..fretCount (open strings, fret
 * 0, are handled separately since they're always shown as a labeled circle
 * rather than a grid marker).
 */
export function buildFretboardGrid(
  rootPc: number,
  mode: Mode,
  fretCount: number,
): { grid: FretCell[]; scale: ScaleTone[] } {
  const scale = buildScale(rootPc, mode)
  const byPc = new Map(scale.map((tone) => [tone.pc, tone]))

  const grid: FretCell[] = []
  for (let stringIndex = 0; stringIndex < OPEN_STRING_PCS.length; stringIndex++) {
    const openPc = OPEN_STRING_PCS[stringIndex]
    for (let fret = 1; fret <= fretCount; fret++) {
      const pc = mod12(openPc + fret)
      const tone = byPc.get(pc)
      if (tone) grid.push({ stringIndex, fret, tone })
    }
  }
  return { grid, scale }
}

export interface OpenStringInfo {
  stringIndex: number
  tone: ScaleTone | null // null when the open string isn't in the scale at all
}

export function buildOpenStrings(scale: ScaleTone[]): OpenStringInfo[] {
  const byPc = new Map(scale.map((tone) => [tone.pc, tone]))
  return OPEN_STRING_PCS.map((pc, stringIndex) => ({
    stringIndex,
    tone: byPc.get(pc) ?? null,
  }))
}
