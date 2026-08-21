import type { ScaleId } from '../theory/types'

export const SCALE_OPTIONS: { id: ScaleId; label: string }[] = [
  { id: 'ionian', label: 'Major (Ionian)' },
  { id: 'dorian', label: 'Dorian' },
  { id: 'phrygian', label: 'Phrygian' },
  { id: 'lydian', label: 'Lydian' },
  { id: 'mixolydian', label: 'Mixolydian' },
  { id: 'aeolian', label: 'Minor (Aeolian)' },
  { id: 'locrian', label: 'Locrian' },
  { id: 'majorPentatonic', label: 'Major Pentatonic' },
  { id: 'minorPentatonic', label: 'Minor Pentatonic' },
]

/** Short form used in the on-screen heading, e.g. "C Major" rather than "C Major (Ionian)". */
export const SCALE_HEADING_NAME: Record<ScaleId, string> = {
  ionian: 'Major',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  lydian: 'Lydian',
  mixolydian: 'Mixolydian',
  aeolian: 'Minor',
  locrian: 'Locrian',
  majorPentatonic: 'Major Pentatonic',
  minorPentatonic: 'Minor Pentatonic',
}

interface ScaleSelectorProps {
  value: ScaleId
  onChange: (scaleId: ScaleId) => void
}

export function ScaleSelector({ value, onChange }: ScaleSelectorProps) {
  return (
    <div className="control-chip">
      <span className="control-chip__label">Mode</span>
      <select
        className="control-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ScaleId)}
        aria-label="Mode"
      >
        {SCALE_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
