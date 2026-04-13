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
  const [copied, setCopied] = useState(false)

  const handleChange = (corner: keyof BorderRadiusValues, value: string) => {
    const numValue = value.replace(/[^0-9]/g, '') || '0'
    setValues(prev => ({
      ...prev,
      [corner]: numValue
    }))
  }

  const syncAllCorners = (value: string) => {
    const numValue = value.replace(/[^0-9]/g, '') || '0'
    setValues({
      topLeft: numValue,
      topRight: numValue,
      bottomRight: numValue,
      bottomLeft: numValue,
    })
  }

  const borderRadiusValue = `${values.topLeft}${unit} ${values.topRight}${unit} ${values.bottomRight}${unit} ${values.bottomLeft}${unit}`

  const cssCode = `border-radius: ${borderRadiusValue};`

  const allCornersEqual = values.topLeft === values.topRight && values.topRight === values.bottomRight && values.bottomRight === values.bottomLeft

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-2 text-center">Border Radius Previewer</h1>
        <p className="text-lg text-gray-600 text-center mb-10">Adjust border-radius values and see the changes in real-time</p>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Controls</h2>

            {/* Unit Toggle */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Unit</label>
              <div className="flex gap-3">
                {(['px', '%'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all active:scale-95 ${
                      unit === u
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Sync All */}
            <div className="mb-8 pb-8 border-b-2 border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Sync All Corners
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max={unit === 'px' ? '1000' : '100'}
                  value={allCornersEqual ? values.topLeft : ''}
                  placeholder={!allCornersEqual ? 'Mixed values' : undefined}
                  onChange={e => syncAllCorners(e.target.value)}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow-md ${
                    allCornersEqual
                      ? 'border-gray-300 placeholder:text-gray-400 hover:border-gray-400'
                      : 'border-orange-300 bg-orange-50 placeholder:text-orange-500 placeholder:font-medium hover:border-orange-400'
                  }`}
                />
                <span className="text-gray-600 font-semibold text-lg min-w-12">{unit}</span>
              </div>
            </div>

            {/* Corner Inputs */}
            <div className="space-y-4 mb-8">
              {([
                { key: 'topLeft', label: 'Top Left' },
                { key: 'topRight', label: 'Top Right' },
                { key: 'bottomRight', label: 'Bottom Right' },
                { key: 'bottomLeft', label: 'Bottom Left' },
              ] as const).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max={unit === 'px' ? '1000' : '100'}
                      value={values[key]}
                      onChange={e => handleChange(key, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-400 shadow-sm"
                    />
                    <span className="text-gray-600 font-medium min-w-12">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Presets */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Presets</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Sharp', value: '0' },
                  { label: 'Rounded', value: '8' },
                  { label: 'Pill', value: '50' },
                  { label: 'Circle', value: unit === 'px' ? '200' : '50' },
                ].map(preset => (
                  <button
                    key={preset.label}
                    onClick={() => syncAllCorners(preset.value)}
                    className="px-3 py-2 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700 rounded-lg font-semibold hover:from-indigo-200 hover:to-indigo-100 transition-all text-sm border border-indigo-200 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => setValues({ topLeft: '10', topRight: '10', bottomRight: '10', bottomLeft: '10' })}
              className="w-full px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-all active:scale-95 shadow-sm hover:shadow-md"
            >
              Reset All
            </button>
          </div>

          {/* Preview & Code */}
          <div className="space-y-8">
            {/* Preview Box */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Preview</h2>
              <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-12 min-h-80 border border-gray-300 overflow-hidden">
                <div
                  className="w-40 h-40 bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-2xl transition-all duration-150"
                  style={{ borderRadius: borderRadiusValue }}
                />
                {/* Corner labels */}
                <div className="absolute top-3 left-3 text-xs font-bold text-gray-400 opacity-60">TL</div>
                <div className="absolute top-3 right-3 text-xs font-bold text-gray-400 opacity-60">TR</div>
                <div className="absolute bottom-3 right-3 text-xs font-bold text-gray-400 opacity-60">BR</div>
                <div className="absolute bottom-3 left-3 text-xs font-bold text-gray-400 opacity-60">BL</div>
              </div>
            </div>

            {/* CSS Code */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">CSS Code</h2>
              <div className="bg-gray-900 text-gray-100 rounded-lg font-mono text-sm p-4 overflow-x-auto mb-4 border border-gray-800 shadow-inner">
                <div className="whitespace-pre-wrap break-words">{cssCode}</div>
              </div>
              <button
                onClick={copyToClipboard}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy CSS'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
