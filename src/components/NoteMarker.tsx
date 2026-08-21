export type MarkerVariant = 'root' | 'triad3' | 'triad5' | 'neutral'

interface NoteMarkerProps {
  cx: number
  cy: number
  r: number
  variant: MarkerVariant
  label: string
}

/** A single note marker: filled amber for roots, outlined + color-coded for everything else. */
export function NoteMarker({ cx, cy, r, variant, label }: NoteMarkerProps) {
  const className = `note-marker note-marker--${variant}`
  return (
    <g className={className}>
      <circle cx={cx} cy={cy} r={r} />
      {label && (
        <text x={cx} y={cy} dominantBaseline="central" textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  )
}

interface OpenStringMarkerProps {
  cx: number
  cy: number
  r: number
  label: string
  state: 'root' | 'in-scale' | 'muted'
}

/** Open-string indicator: a circle around the string name, or plain muted text if out of scale. */
export function OpenStringMarker({ cx, cy, r, label, state }: OpenStringMarkerProps) {
  if (state === 'muted') {
    return (
      <text className="open-string-label open-string-label--muted" x={cx} y={cy} dominantBaseline="central" textAnchor="middle">
        {label}
      </text>
    )
  }
  const variant: MarkerVariant = state === 'root' ? 'root' : 'neutral'
  return <NoteMarker cx={cx} cy={cy} r={r} variant={variant} label={label} />
}
