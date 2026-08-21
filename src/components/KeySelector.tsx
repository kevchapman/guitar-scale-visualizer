import { KEY_ROOTS } from '../theory/notes'

interface KeySelectorProps {
  value: number
  onChange: (pc: number) => void
}

export function KeySelector({ value, onChange }: KeySelectorProps) {
  return (
    <div className="control-chip">
      <span className="control-chip__label">Key</span>
      <select
        className="control-select"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Key"
      >
        {KEY_ROOTS.map((root) => (
          <option key={root.pc} value={root.pc}>
            {root.label}
          </option>
        ))}
      </select>
    </div>
  )
}
