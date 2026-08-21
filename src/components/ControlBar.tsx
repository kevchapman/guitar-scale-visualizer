import { useMemo } from 'react'
import type { DisplayMode, Mode, PositionId } from '../theory/types'
import { computeCagedPositions } from '../theory/caged'
import { KeySelector } from './KeySelector'
import { SegmentedControl } from './SegmentedControl'

interface ControlBarProps {
  rootPc: number
  onRootPcChange: (pc: number) => void
  mode: Mode
  onModeChange: (mode: Mode) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  position: PositionId
  onPositionChange: (position: PositionId) => void
}

const MODE_OPTIONS: { id: Mode; label: string }[] = [
  { id: 'major', label: 'Major' },
  { id: 'minor', label: 'Minor' },
]

const DISPLAY_OPTIONS: { id: DisplayMode; label: string }[] = [
  { id: 'root', label: 'Root' },
  { id: 'notes', label: 'Notes' },
  { id: 'triads', label: 'Triads' },
  { id: 'intervals', label: 'Intervals' },
]

export function ControlBar({
  rootPc,
  onRootPcChange,
  mode,
  onModeChange,
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
      <SegmentedControl label="Mode" options={MODE_OPTIONS} value={mode} onChange={onModeChange} />
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
