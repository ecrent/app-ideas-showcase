import { useState } from 'react'

interface CSSVariable {
  id: string
  name: string
  value: string
}

const isColorValue = (value: string): boolean => {
  return /^#[0-9a-fA-F]{6}$/.test(value) || /^rgb/.test(value) || /^hsl/.test(value)
}

export default function App() {
  const [variables, setVariables] = useState<CSSVariable[]>([
    { id: '1', name: '--primary-color', value: '#3b82f6' },
    { id: '2', name: '--secondary-color', value: '#10b981' },
    { id: '3', name: '--border-radius', value: '8px' },
    { id: '4', name: '--font-size', value: '16px' },
  ])
  const [copied, setCopied] = useState(false)
  const [importMessage, setImportMessage] = useState('')

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const importCSS = (cssText: string) => {
    const varRegex = /--[\w-]+\s*:\s*[^;]+/g
    const matches = cssText.match(varRegex)

    if (!matches) {
      setImportMessage('No CSS variables found in pasted content')
      setTimeout(() => setImportMessage(''), 3000)
      return
    }

    const maxId = Math.max(...variables.map(v => parseInt(v.id)), 0)
    const newVars = matches.map((match, idx) => {
      const [name, value] = match.split(':').map(s => s.trim())
      return {
        id: (maxId + idx + 1).toString(),
        name,
        value
      }
    })

    setVariables([...variables, ...newVars])
    setImportMessage(`Imported ${newVars.length} variable${newVars.length !== 1 ? 's' : ''}`)
    setTimeout(() => setImportMessage(''), 3000)
  }

  const updateVariable = (id: string, field: 'name' | 'value', newValue: string) => {
    setVariables(variables.map(v =>
      v.id === id ? { ...v, [field]: newValue } : v
    ))
  }

  const addVariable = () => {
    const newId = Math.max(...variables.map(v => parseInt(v.id)), 0) + 1
    setVariables([...variables, {
      id: newId.toString(),
      name: '--new-variable',
      value: '#000000'
    }])
  }

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id))
  }

  const cssVarString = variables
    .map(v => `${v.name}: ${v.value}`)
    .join('; ')

  const cssVariables: Record<string, string> = {}
  variables.forEach(v => {
    cssVariables[v.name] = v.value
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Dynamic CSS Variables</h1>
          <p className="text-lg text-gray-600">Live CSS custom variables editor — edit and preview changes in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Variables</h2>

            <div className="space-y-3 mb-6">
              {variables.map((variable) => (
                <div key={variable.id} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                    placeholder="--variable-name"
                    className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {isColorValue(variable.value) ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={variable.value}
                        onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                        className="w-10 h-9 border border-gray-300 rounded-md cursor-pointer"
                        title="Pick a color"
                      />
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                      placeholder="value"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                  <button
                    onClick={() => removeVariable(variable.id)}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition text-sm font-medium border border-red-200"
                    title="Remove this variable"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addVariable}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium mb-6 shadow-sm hover:shadow-md"
            >
              + Add Variable
            </button>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Import from CSS</h3>
              <textarea
                placeholder="Paste CSS with variables here..."
                onPaste={(e) => {
                  e.preventDefault()
                  const text = e.clipboardData.getData('text')
                  importCSS(text)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs font-mono bg-gray-50 h-24 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {importMessage && (
                <div className={`text-xs mb-2 p-2 rounded-md ${
                  importMessage.startsWith('No')
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {importMessage}
                </div>
              )}
              <p className="text-xs text-gray-500">Paste CSS code containing --variable declarations (e.g., <code className="bg-gray-100 px-1 rounded">--color: #fff</code>)</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">CSS Output</h3>
                <button
                  onClick={() => copyToClipboard(`:root {\n  ${cssVarString}\n}`)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    copied
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-sm hover:shadow-md'
                  }`}
                  title="Copy to clipboard"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 overflow-auto">
                <code className="text-xs font-mono text-gray-100 whitespace-pre">
                  {`:root {\n  ${cssVarString}\n}`}
                </code>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Preview</h2>

            <div
              className="space-y-6"
              style={cssVariables as React.CSSProperties}
            >
              {/* Card Preview */}
              <div
                className="bg-white p-6 rounded-lg shadow-md border-l-4"
                style={{
                  borderLeftColor: `var(--primary-color, #3b82f6)`,
                } as React.CSSProperties}
              >
                <h3
                  className="font-bold mb-2"
                  style={{
                    color: `var(--primary-color, #3b82f6)`,
                    fontSize: `var(--font-size, 16px)`,
                  } as React.CSSProperties}
                >
                  Preview Card
                </h3>
                <p className="text-gray-600 text-sm">
                  This card uses the CSS variables you define. Update the values to see changes instantly.
                </p>
              </div>

              {/* Button Preview */}
              <div className="space-y-3">
                <div className="flex gap-3 flex-wrap">
                  <button
                    style={{
                      backgroundColor: `var(--primary-color, #3b82f6)`,
                      borderRadius: `var(--border-radius, 8px)`,
                    } as React.CSSProperties}
                    className="px-4 py-2 text-white font-medium hover:opacity-90 transition"
                  >
                    Primary
                  </button>
                  <button
                    style={{
                      backgroundColor: `var(--secondary-color, #10b981)`,
                      borderRadius: `var(--border-radius, 8px)`,
                    } as React.CSSProperties}
                    className="px-4 py-2 text-white font-medium hover:opacity-90 transition"
                  >
                    Secondary
                  </button>
                  <button
                    style={{
                      borderColor: `var(--primary-color, #3b82f6)`,
                      borderRadius: `var(--border-radius, 8px)`,
                      color: `var(--primary-color, #3b82f6)`,
                      borderWidth: '2px',
                    } as React.CSSProperties}
                    className="px-4 py-2 font-medium hover:opacity-75 transition"
                  >
                    Outlined
                  </button>
                </div>
              </div>

              {/* Badges */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Badges</p>
                <div className="flex gap-2 flex-wrap">
                  <span
                    style={{
                      backgroundColor: `var(--primary-color, #3b82f6)`,
                      borderRadius: `var(--border-radius, 8px)`,
                    } as React.CSSProperties}
                    className="px-3 py-1 text-white text-xs font-medium"
                  >
                    Primary
                  </span>
                  <span
                    style={{
                      backgroundColor: `var(--secondary-color, #10b981)`,
                      borderRadius: `var(--border-radius, 8px)`,
                    } as React.CSSProperties}
                    className="px-3 py-1 text-white text-xs font-medium"
                  >
                    Secondary
                  </span>
                </div>
              </div>

              {/* Typography Preview */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Typography</p>
                <h4
                  style={{
                    fontSize: `var(--font-size, 16px)`,
                    color: `var(--primary-color, #3b82f6)`,
                  } as React.CSSProperties}
                  className="font-bold"
                >
                  Heading with Primary Color
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
