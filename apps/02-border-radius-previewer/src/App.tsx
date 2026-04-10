import { useState } from 'react'

interface BorderRadiusValues {
  topLeft: string
  topRight: string
  bottomRight: string
  bottomLeft: string
}

export default function App() {
  const [values, setValues] = useState<BorderRadiusValues>({
    topLeft: '10',
    topRight: '10',
    bottomRight: '10',
    bottomLeft: '10',
  })

  const [unit, setUnit] = useState<'px' | '%'>('px')

  const handleChange = (corner: keyof BorderRadiusValues, value: string) => {
    const numValue = value.replace(/[^0-9]/g, '') || '0'
    setValues(prev => ({
      ...prev,
      [corner]: numValue
    }))
  }

  const borderRadiusValue = `${values.topLeft}${unit} ${values.topRight}${unit} ${values.bottomRight}${unit} ${values.bottomLeft}${unit}`

  const cssCode = `border-radius: ${borderRadiusValue};`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">Border Radius Previewer</h1>
        <p className="text-gray-600 text-center mb-8">Live CSS border-radius previewer</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Controls</h2>

            {/* Unit Toggle */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Unit</label>
              <div className="flex gap-4">
                {(['px', '%'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      unit === u
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Inputs */}
            <div className="space-y-4">
              {([
                { key: 'topLeft', label: 'Top Left' },
                { key: 'topRight', label: 'Top Right' },
                { key: 'bottomRight', label: 'Bottom Right' },
                { key: 'bottomLeft', label: 'Bottom Left' },
              ] as const).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={unit === 'px' ? '1000' : '100'}
                      value={values[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 font-medium">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setValues({ topLeft: '10', topRight: '10', bottomRight: '10', bottomLeft: '10' })}
              className="w-full mt-8 px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Preview & Code */}
          <div className="space-y-8">
            {/* Preview Box */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-12 min-h-64">
                <div
                  className="w-32 h-32 bg-gradient-to-br from-indigo-400 to-blue-600 shadow-lg"
                  style={{ borderRadius: borderRadiusValue }}
                />
              </div>
            </div>

            {/* CSS Code */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">CSS Code</h2>
              <div className="bg-gray-900 text-gray-100 rounded font-mono text-sm p-4 overflow-x-auto mb-4">
                <div>{cssCode}</div>
              </div>
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors"
              >
                Copy CSS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
