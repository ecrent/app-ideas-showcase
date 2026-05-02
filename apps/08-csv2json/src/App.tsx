import { useState, useRef } from 'react'

export default function App() {
  const [csvText, setCsvText] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (csv: string): string => {
    const lines = csv.trim().split('\n').filter(line => line.trim())
    if (lines.length === 0) return ''

    const headers = lines[0].split(',').map(h => h.trim())
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const obj: Record<string, string> = {}
      headers.forEach((header, i) => {
        obj[header] = values[i] || ''
      })
      return obj
    })

    return JSON.stringify(data, null, 2)
  }

  const handleConvert = () => {
    setError('')
    if (!csvText.trim()) {
      setError('Please enter CSV data')
      return
    }
    try {
      const json = parseCSV(csvText)
      setJsonOutput(json)
    } catch (err) {
      setError('Error parsing CSV. Check your format.')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCsvText(content)
      setError('')
      setJsonOutput('')
    }
    reader.readAsText(file)
  }

  const handleCopy = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput)
    }
  }

  const handleDownload = () => {
    if (!jsonOutput) return
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonOutput))
    element.setAttribute('download', 'data.json')
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">CSV to JSON</h1>
          <p className="text-gray-600">Convert your CSV data to JSON format instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">CSV Input</h2>

              <div className="mb-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors mb-2"
                >
                  Upload CSV File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="relative mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">or paste CSV</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              </div>

              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value)
                  setError('')
                }}
                placeholder="name,age,city&#10;John,28,New York&#10;Jane,34,Los Angeles&#10;Bob,45,Chicago"
                className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleConvert}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95"
              >
                Convert to JSON
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">JSON Output</h2>

              {jsonOutput && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={handleCopy}
                    className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium text-sm rounded-lg transition-colors"
                  >
                    Download
                  </button>
                </div>
              )}

              <pre className="w-full h-64 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-auto border border-gray-300">
                {jsonOutput || '// JSON output will appear here'}
              </pre>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How to use:</h3>
          <ul className="text-gray-700 space-y-2 list-disc list-inside">
            <li>Upload a CSV file or paste CSV data directly into the input area</li>
            <li>The first row should contain column headers</li>
            <li>Click "Convert to JSON" to transform your data</li>
            <li>Copy the JSON output or download it as a file</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
