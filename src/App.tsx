import { useState } from 'react'
import { ControlBar } from './components/ControlBar'
import { Fretboard } from './components/Fretboard'
import { SCALE_HEADING_NAME } from './components/ScaleSelector'
import type { DisplayMode, PositionId, ScaleId } from './theory/types'
import { formatSpelling } from './theory/notes'
import { buildScale } from './theory/scale'

function App() {
  const [rootPc, setRootPc] = useState(0)
  const [scaleId, setScaleId] = useState<ScaleId>('ionian')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('root')
  const [position, setPosition] = useState<PositionId>('all')

  const tonic = buildScale(rootPc, scaleId)[0]
  const keyName = `${formatSpelling(tonic)} ${SCALE_HEADING_NAME[scaleId]}`

  return (
    <div className="app-shell">
      <ControlBar
        rootPc={rootPc}
        onRootPcChange={setRootPc}
        scaleId={scaleId}
        onScaleIdChange={setScaleId}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        position={position}
        onPositionChange={setPosition}
      />

      <div className="title-row no-print">
        <h1 className="key-heading">{keyName}</h1>
        <button type="button" className="print-button" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <main className="fretboard-area no-print">
        <Fretboard rootPc={rootPc} scaleId={scaleId} displayMode={displayMode} position={position} />
      </main>

      {/* Print output always shows the full fretboard with note names, regardless of on-screen state. */}
      <main className="fretboard-area print-only">
        <h1 className="key-heading print-heading">{keyName}</h1>
        <Fretboard rootPc={rootPc} scaleId={scaleId} displayMode="notes" position="all" />
      </main>
    </div>
  )
}

export default App
