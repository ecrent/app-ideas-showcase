import { useState } from 'react'

function binaryToDecimal(binary: string): number | null {
  if (binary === '') return null
  if (!/^[01]+$/.test(binary)) return null
  return parseInt(binary, 2)
}

export default function App() {
  const [binary, setBinary] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const decimal = binaryToDecimal(binary)

  function handleChange(value: string) {
    // Strip anything that isn't 0 or 1
    const cleaned = value.replace(/[^01]/g, '')
    if (cleaned !== value) {
      setError('Only 0 and 1 are allowed')
      setTimeout(() => setError(''), 1500)
    }
    if (cleaned.length > 32) {
      setError('Maximum 32 bits')
      setBinary(cleaned.slice(0, 32))
    } else {
      setBinary(cleaned)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key.length > 1) return
    if (e.key !== '0' && e.key !== '1') {
      e.preventDefault()
      setError('Only 0 and 1 are allowed')
      setTimeout(() => setError(''), 1500)
    }
  }

  function handleCopy() {
    if (decimal === null) return
    navigator.clipboard.writeText(String(decimal))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleClear() {
    setBinary('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-1 text-center">
            Bin2Dec
          </h1>
          <p className="text-purple-300 text-sm text-center mb-8">
            Binary to Decimal Converter
          </p>

          {/* Binary Input */}
          <div className="mb-6">
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Binary Input
            </label>
            <div className="relative">
              <input
                type="text"
                value={binary}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 10101010"
                className="w-full px-4 py-3 pr-10 bg-black/30 border border-white/20 rounded-lg text-white text-lg font-mono placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                maxLength={32}
                autoFocus
              />
              {binary && (
                <button
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition text-xl leading-none"
                  title="Clear"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex justify-between mt-1">
              <span className={`text-sm ${error ? 'text-red-400' : 'text-transparent'}`}>
                {error || '.'}
              </span>
              <span className="text-white/30 text-xs">
                {binary.length}/32 bits
              </span>
            </div>
          </div>

          {/* Decimal Output */}
          <div className="mb-6">
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Decimal Output
            </label>
            <div
              onClick={handleCopy}
              className={`w-full px-4 py-3 bg-black/20 border rounded-lg text-lg font-mono min-h-[52px] flex items-center justify-between ${
                decimal !== null
                  ? 'border-green-500/30 cursor-pointer hover:bg-black/30 transition'
                  : 'border-white/10'
              }`}
              title={decimal !== null ? 'Click to copy' : undefined}
            >
              {decimal !== null ? (
                <span className="text-green-400 text-2xl font-bold">
                  {decimal.toLocaleString()}
                </span>
              ) : (
                <span className="text-white/30">—</span>
              )}
              {decimal !== null && (
                <span className="text-xs text-white/40">
                  {copied ? '✓ copied' : 'click to copy'}
                </span>
              )}
            </div>
          </div>

          {/* Bit visualization */}
          {binary && !error && (
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Bit Breakdown
              </label>
              <div className="flex flex-wrap gap-1 justify-center">
                {binary.split('').map((bit, i) => {
                  const power = binary.length - 1 - i
                  const value = parseInt(bit) * Math.pow(2, power)
                  return (
                    <div
                      key={i}
                      className={`flex flex-col items-center px-2 py-1 rounded transition-colors ${
                        bit === '1'
                          ? 'bg-purple-500/30 border border-purple-400/20'
                          : 'bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="text-white/40 text-[10px]">
                        2<sup>{power}</sup>
                      </span>
                      <span
                        className={`text-lg font-mono font-bold ${
                          bit === '1' ? 'text-purple-300' : 'text-white/30'
                        }`}
                      >
                        {bit}
                      </span>
                      <span className="text-white/40 text-[10px]">{value}</span>
                    </div>
                  )
                })}
              </div>
              {binary.length > 1 && (
                <p className="text-center text-white/30 text-xs mt-2">
                  {binary
                    .split('')
                    .map((bit, i) => {
                      const power = binary.length - 1 - i
                      return parseInt(bit) * Math.pow(2, power)
                    })
                    .filter((v) => v > 0)
                    .join(' + ')}{' '}
                  = {decimal}
                </p>
              )}
            </div>
          )}

          {/* Quick examples */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Try these
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { bin: '1010', label: '10' },
                { bin: '11111111', label: '255' },
                { bin: '10000000', label: '128' },
                { bin: '1100100', label: '100' },
                { bin: '101010', label: '42' },
              ].map(({ bin, label }) => (
                <button
                  key={bin}
                  onClick={() => {
                    setBinary(bin)
                    setError('')
                  }}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-purple-200 text-sm font-mono rounded-full transition"
                >
                  {bin}
                  <span className="text-white/40 ml-1">={label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
