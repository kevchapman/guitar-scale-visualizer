import { useState } from 'react'
import { ControlBar } from './components/ControlBar'
import { Fretboard } from './components/Fretboard'
import type { DisplayMode, Mode, PositionId } from './theory/types'
import { buildKeySpelling, formatSpelling } from './theory/notes'

function App() {
  const [rootPc, setRootPc] = useState(0)
  const [mode, setMode] = useState<Mode>('major')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('root')
  const [position, setPosition] = useState<PositionId>('all')

  const tonic = buildKeySpelling(rootPc, mode)[0]
  const keyName = `${formatSpelling(tonic)} ${mode === 'major' ? 'Major' : 'Minor'}`

  return (
    <div className="app-shell">
      <ControlBar
        rootPc={rootPc}
        onRootPcChange={setRootPc}
        mode={mode}
        onModeChange={setMode}
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
        <Fretboard rootPc={rootPc} mode={mode} displayMode={displayMode} position={position} />
      </main>

      {/* Print output always shows the full fretboard with note names, regardless of on-screen state. */}
      <main className="fretboard-area print-only">
        <h1 className="key-heading print-heading">{keyName}</h1>
        <Fretboard rootPc={rootPc} mode={mode} displayMode="notes" position="all" />
      </main>
    </div>
  )
}

export default App
