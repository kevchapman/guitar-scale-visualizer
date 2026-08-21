interface SegmentedControlProps<T extends string> {
  label: string
  options: { id: T; label: string; title?: string }[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="control-chip">
      <span className="control-chip__label">{label}</span>
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="segmented__option"
            role="radio"
            aria-checked={value === opt.id}
            data-active={value === opt.id}
            title={opt.title}
            onClick={() => onChange(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
