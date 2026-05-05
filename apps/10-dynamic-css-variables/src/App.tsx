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

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dynamic CSS Variables</h1>
        <p className="text-gray-600 mb-8">Live CSS custom variables editor</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Variables</h2>

            <div className="space-y-4 mb-6">
              {variables.map((variable) => (
                <div key={variable.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(variable.id, 'name', e.target.value)}
                    placeholder="--variable-name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                  />
                  {isColorValue(variable.value) ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={variable.value}
                        onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                      />
                      <input
                        type="text"
                        value={variable.value}
                        onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={variable.value}
                      onChange={(e) => updateVariable(variable.id, 'value', e.target.value)}
                      placeholder="value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-gray-50"
                    />
                  )}
                  <button
                    onClick={() => removeVariable(variable.id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addVariable}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              Add Variable
            </button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">CSS Output</h3>
                <button
                  onClick={() => copyToClipboard(`:root {\n  ${cssVarString}\n}`)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    copied
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto">
                <code className="text-xs font-mono text-gray-700 whitespace-pre">
                  {`:root {\n  ${cssVarString}\n}`}
                </code>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Live Preview</h2>

            <div
              className="p-8 bg-gray-100 rounded-lg min-h-96"
              style={cssVariables as React.CSSProperties}
            >
              {/* Card Preview */}
              <div
                className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4"
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
                  This card uses the CSS variables you define. Update the values to see changes in real-time.
                </p>
              </div>

              {/* Button Preview */}
              <div className="flex gap-4">
                <button
                  style={{
                    backgroundColor: `var(--primary-color, #3b82f6)`,
                    borderRadius: `var(--border-radius, 8px)`,
                  } as React.CSSProperties}
                  className="px-4 py-2 text-white font-medium hover:opacity-90 transition"
                >
                  Primary Button
                </button>
                <button
                  style={{
                    backgroundColor: `var(--secondary-color, #10b981)`,
                    borderRadius: `var(--border-radius, 8px)`,
                  } as React.CSSProperties}
                  className="px-4 py-2 text-white font-medium hover:opacity-90 transition"
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
