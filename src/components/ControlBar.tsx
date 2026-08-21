import { useMemo } from 'react'
import type { DisplayMode, PositionId, ScaleId } from '../theory/types'
import { computeCagedPositions } from '../theory/caged'
import { KeySelector } from './KeySelector'
import { ScaleSelector } from './ScaleSelector'
import { SegmentedControl } from './SegmentedControl'

interface ControlBarProps {
  rootPc: number
  onRootPcChange: (pc: number) => void
  scaleId: ScaleId
  onScaleIdChange: (scaleId: ScaleId) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  position: PositionId
  onPositionChange: (position: PositionId) => void
}

const DISPLAY_OPTIONS: { id: DisplayMode; label: string }[] = [
  { id: 'root', label: 'Root' },
  { id: 'notes', label: 'Notes' },
  { id: 'triads', label: 'Triads' },
  { id: 'intervals', label: 'Intervals' },
]

export function ControlBar({
  rootPc,
  onRootPcChange,
  scaleId,
  onScaleIdChange,
  displayMode,
  onDisplayModeChange,
  position,
  onPositionChange,
}: ControlBarProps) {
  const positionOptions = useMemo(() => {
    const positions = computeCagedPositions(rootPc)
    return [
      ...positions.map((p) => ({
        id: p.shape as PositionId,
        label: p.shape,
        title: `${p.shape} shape — frets ${p.startFret}–${p.endFret}`,
      })),
      { id: 'all' as PositionId, label: 'All', title: 'Full fretboard' },
    ]
  }, [rootPc])

  return (
    <header className="control-bar no-print">
      <KeySelector value={rootPc} onChange={onRootPcChange} />
      <ScaleSelector value={scaleId} onChange={onScaleIdChange} />
      <SegmentedControl
        label="Display"
        options={DISPLAY_OPTIONS}
        value={displayMode}
        onChange={onDisplayModeChange}
      />
      <SegmentedControl label="Position" options={positionOptions} value={position} onChange={onPositionChange} />
    </header>
  )
}
