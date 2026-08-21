import { useMemo } from 'react'
import type { DisplayMode, Mode, PositionId } from '../theory/types'
import { computeCagedPositions, computeFretCount } from '../theory/caged'
import { buildFretboardGrid, buildOpenStrings } from '../theory/fretboard'
import { formatSpelling, OPEN_STRING_NAMES } from '../theory/notes'
import { NoteMarker, OpenStringMarker, type MarkerVariant } from './NoteMarker'

interface FretboardProps {
  rootPc: number
  mode: Mode
  displayMode: DisplayMode
  position: PositionId
}

// --- Layout geometry --------------------------------------------------
const FRET_WIDTH = 64
const OPEN_COL_WIDTH = 60
const NUT_WIDTH = 6
const STRING_GAP = 46
const TOP_PAD = 54
const BOTTOM_PAD = 40
const LEFT_PAD = 24
const RIGHT_PAD = 28
const SURFACE_PAD_Y = 24
const MARKER_R = 15
const OPEN_MARKER_R = 17
const STRING_COUNT = 6

const DOT_FRETS = new Set([3, 5, 7, 9, 15])
const DOUBLE_DOT_FRETS = new Set([12])

const nutLeftX = LEFT_PAD + OPEN_COL_WIDTH
const nutRightX = nutLeftX + NUT_WIDTH
const openCenterX = LEFT_PAD + OPEN_COL_WIDTH / 2

function fretWireX(n: number): number {
  return n === 0 ? nutRightX : nutRightX + n * FRET_WIDTH
}

function fretCenterX(n: number): number {
  return fretWireX(n - 1) + FRET_WIDTH / 2
}

function stringY(stringIndex: number): number {
  return TOP_PAD + stringIndex * STRING_GAP
}

function markerVariant(degreeIndex: number, isRoot: boolean, displayMode: DisplayMode): MarkerVariant {
  if (isRoot) return 'root'
  if (displayMode === 'triads' || displayMode === 'intervals') {
    if (degreeIndex === 2) return 'triad3'
    if (degreeIndex === 4) return 'triad5'
  }
  return 'neutral'
}

export function Fretboard({ rootPc, mode, displayMode, position }: FretboardProps) {
  const positions = useMemo(() => computeCagedPositions(rootPc), [rootPc])
  const fretCount = useMemo(() => computeFretCount(positions), [positions])
  const { grid, scale } = useMemo(
    () => buildFretboardGrid(rootPc, mode, fretCount),
    [rootPc, mode, fretCount],
  )
  const openStrings = useMemo(() => buildOpenStrings(scale), [scale])

  const range = useMemo(() => {
    if (position === 'all') return { start: 1, end: fretCount }
    const p = positions.find((pos) => pos.shape === position)
    if (!p) return { start: 1, end: fretCount }
    return { start: Math.max(1, p.startFret), end: p.endFret }
  }, [position, positions, fretCount])

  const visibleCells = useMemo(
    () =>
      grid.filter((cell) => {
        if (cell.fret < range.start || cell.fret > range.end) return false
        if (displayMode === 'triads' && !cell.tone.isTriad) return false
        return true
      }),
    [grid, range, displayMode],
  )

  const totalWidth = fretWireX(fretCount) + RIGHT_PAD
  const totalHeight = TOP_PAD + (STRING_COUNT - 1) * STRING_GAP + BOTTOM_PAD
  const surfaceTop = TOP_PAD - SURFACE_PAD_Y
  const surfaceBottom = TOP_PAD + (STRING_COUNT - 1) * STRING_GAP + SURFACE_PAD_Y
  const dotY = surfaceTop / 2 + 6

  return (
    <div className="fretboard-scroll">
      <svg
        className="fretboard-svg"
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        role="img"
        aria-label={`Fretboard showing ${scale.map(formatSpelling).join(' ')} scale`}
      >
        {/* Fretboard surface */}
        <rect
          className="fretboard-surface"
          x={nutRightX}
          y={surfaceTop}
          width={fretWireX(fretCount) - nutRightX}
          height={surfaceBottom - surfaceTop}
          rx={8}
        />

        {/* Position markers (dots) */}
        {Array.from(DOT_FRETS).map((fret) =>
          fret <= fretCount ? (
            <circle key={`dot-${fret}`} className="fret-dot" cx={fretCenterX(fret)} cy={dotY} r={4.5} />
          ) : null,
        )}
        {Array.from(DOUBLE_DOT_FRETS).map((fret) =>
          fret <= fretCount ? (
            <g key={`dbldot-${fret}`}>
              <circle className="fret-dot" cx={fretCenterX(fret) - 9} cy={dotY} r={4.5} />
              <circle className="fret-dot" cx={fretCenterX(fret) + 9} cy={dotY} r={4.5} />
            </g>
          ) : null,
        )}

        {/* Fret wires (thin), 1..fretCount */}
        {Array.from({ length: fretCount }, (_, i) => i + 1).map((fret) => (
          <line
            key={`wire-${fret}`}
            className="fret-wire"
            x1={fretWireX(fret)}
            y1={surfaceTop}
            x2={fretWireX(fret)}
            y2={surfaceBottom}
          />
        ))}

        {/* Strings */}
        {Array.from({ length: STRING_COUNT }, (_, i) => i).map((stringIndex) => (
          <line
            key={`string-${stringIndex}`}
            className="string-line"
            x1={LEFT_PAD}
            y1={stringY(stringIndex)}
            x2={fretWireX(fretCount)}
            y2={stringY(stringIndex)}
          />
        ))}

        {/* Nut — thicker line, sits before fret 1 */}
        <rect
          className="nut"
          x={nutLeftX}
          y={surfaceTop}
          width={NUT_WIDTH}
          height={surfaceBottom - surfaceTop}
        />

        {/* Fret number labels, below the neck */}
        {Array.from(DOT_FRETS).map((fret) =>
          fret <= fretCount ? (
            <text
              key={`fretnum-${fret}`}
              className="fret-number"
              x={fretCenterX(fret)}
              y={surfaceBottom + 22}
              textAnchor="middle"
            >
              {fret}
            </text>
          ) : null,
        )}

        {/* Open strings — always shown regardless of position filter */}
        {openStrings.map(({ stringIndex, tone }) => {
          const label = OPEN_STRING_NAMES[stringIndex]
          const state = tone ? (tone.isRoot ? 'root' : 'in-scale') : 'muted'
          return (
            <OpenStringMarker
              key={`open-${stringIndex}`}
              cx={openCenterX}
              cy={stringY(stringIndex)}
              r={OPEN_MARKER_R}
              label={label}
              state={state}
            />
          )
        })}

        {/* Fretted note markers */}
        {visibleCells.map((cell) => {
          const variant = markerVariant(cell.tone.degreeIndex, cell.tone.isRoot, displayMode)
          const label =
            displayMode === 'root' ? '' : displayMode === 'intervals' ? cell.tone.degreeLabel : formatSpelling(cell.tone)
          return (
            <NoteMarker
              key={`${cell.stringIndex}-${cell.fret}`}
              cx={fretCenterX(cell.fret)}
              cy={stringY(cell.stringIndex)}
              r={MARKER_R}
              variant={variant}
              label={label}
            />
          )
        })}
      </svg>
    </div>
  )
}
