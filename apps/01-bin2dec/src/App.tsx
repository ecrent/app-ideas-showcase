import { useState } from 'react'

function binaryToDecimal(binary: string): number | null {
  if (binary === '' || !/^[01]+$/.test(binary)) return null
  return parseInt(binary, 2)
}

function decimalToBinary(decimal: string): string | null {
  if (decimal === '') return null
  const num = parseInt(decimal, 10)
  if (isNaN(num) || num < 0 || num > 4294967295) return null
  return num.toString(2)
}

type Mode = 'bin2dec' | 'dec2bin'

export default function App() {
  const [mode, setMode] = useState<Mode>('bin2dec')
  const [binary, setBinary] = useState('')
  const [decimal, setDecimal] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const computedDecimal = binaryToDecimal(binary)
  const computedBinary = decimalToBinary(decimal)

  function handleBinaryChange(value: string) {
    const cleaned = value.replace(/[^01]/g, '')
    if (cleaned !== value) {
      setError('Only 0 and 1 are allowed')
      setTimeout(() => setError(''), 1500)
    }
    if (cleaned.length > 32) {
      setBinary(cleaned.slice(0, 32))
    } else {
      setBinary(cleaned)
    }
  }

  function handleDecimalChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, '')
    if (cleaned !== value) {
      setError('Only digits are allowed')
      setTimeout(() => setError(''), 1500)
    }
    const num = parseInt(cleaned, 10)
    if (cleaned && num > 4294967295) {
      setError('Maximum value is 4,294,967,295 (2³² - 1)')
      setTimeout(() => setError(''), 2000)
      return
    }
    setDecimal(cleaned)
  }

  function handleBinaryKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key.length > 1) return
    if (e.key !== '0' && e.key !== '1') {
      e.preventDefault()
      setError('Only 0 and 1 are allowed')
      setTimeout(() => setError(''), 1500)
    }
  }

  function handleDecimalKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key.length > 1) return
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
      setError('Only digits are allowed')
      setTimeout(() => setError(''), 1500)
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleClear() {
    setBinary('')
    setDecimal('')
    setError('')
  }

  function toggleMode() {
    setMode(mode === 'bin2dec' ? 'dec2bin' : 'bin2dec')
    setBinary('')
    setDecimal('')
    setError('')
  }

  // Pick the active binary string for the bit breakdown
  const activeBinary =
    mode === 'bin2dec' ? binary : computedBinary ?? ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-1 text-center">
            Bin2Dec
          </h1>
          <p className="text-purple-300 text-sm text-center mb-6">
            Binary ↔ Decimal Converter
          </p>

          {/* Mode toggle */}
          <div className="flex bg-black/30 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('bin2dec'); setBinary(''); setDecimal(''); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === 'bin2dec'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Binary → Decimal
            </button>
            <button
              onClick={() => { setMode('dec2bin'); setBinary(''); setDecimal(''); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                mode === 'dec2bin'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Decimal → Binary
            </button>
          </div>

          {mode === 'bin2dec' ? (
            <>
              {/* Binary Input */}
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Binary Input
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={binary}
                    onChange={(e) => handleBinaryChange(e.target.value)}
                    onKeyDown={handleBinaryKeyDown}
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
                  <span className="text-white/30 text-xs">{binary.length}/32 bits</span>
                </div>
              </div>

              {/* Decimal Output */}
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Decimal Output
                </label>
                <div
                  onClick={() => computedDecimal !== null && handleCopy(String(computedDecimal))}
                  className={`w-full px-4 py-3 bg-black/20 border rounded-lg text-lg font-mono min-h-[52px] flex items-center justify-between ${
                    computedDecimal !== null
                      ? 'border-green-500/30 cursor-pointer hover:bg-black/30 transition'
                      : 'border-white/10'
                  }`}
                  title={computedDecimal !== null ? 'Click to copy' : undefined}
                >
                  {computedDecimal !== null ? (
                    <span className="text-green-400 text-2xl font-bold">
                      {computedDecimal.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                  {computedDecimal !== null && (
                    <span className="text-xs text-white/40">
                      {copied ? '✓ copied' : 'click to copy'}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Decimal Input */}
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Decimal Input
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={decimal}
                    onChange={(e) => handleDecimalChange(e.target.value)}
                    onKeyDown={handleDecimalKeyDown}
                    placeholder="e.g. 255"
                    className="w-full px-4 py-3 pr-10 bg-black/30 border border-white/20 rounded-lg text-white text-lg font-mono placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    autoFocus
                  />
                  {decimal && (
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
                  <span className="text-white/30 text-xs">max 4,294,967,295</span>
                </div>
              </div>

              {/* Binary Output */}
              <div className="mb-6">
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Binary Output
                </label>
                <div
                  onClick={() => computedBinary && handleCopy(computedBinary)}
                  className={`w-full px-4 py-3 bg-black/20 border rounded-lg text-lg font-mono min-h-[52px] flex items-center justify-between ${
                    computedBinary
                      ? 'border-green-500/30 cursor-pointer hover:bg-black/30 transition'
                      : 'border-white/10'
                  }`}
                  title={computedBinary ? 'Click to copy' : undefined}
                >
                  {computedBinary ? (
                    <span className="text-green-400 text-2xl font-bold break-all">
                      {computedBinary}
                    </span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                  {computedBinary && (
                    <span className="text-xs text-white/40 ml-2 shrink-0">
                      {copied ? '✓ copied' : 'click to copy'}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Bit visualization */}
          {activeBinary && !error && (
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Bit Breakdown
              </label>
              <div className="flex flex-wrap gap-1 justify-center">
                {activeBinary.split('').map((bit, i) => {
                  const power = activeBinary.length - 1 - i
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
              {activeBinary.length > 1 && (
                <p className="text-center text-white/30 text-xs mt-2">
                  {activeBinary
                    .split('')
                    .map((bit, i) => {
                      const power = activeBinary.length - 1 - i
                      return parseInt(bit) * Math.pow(2, power)
                    })
                    .filter((v) => v > 0)
                    .join(' + ')}{' '}
                  = {binaryToDecimal(activeBinary)}
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
              {mode === 'bin2dec'
                ? [
                    { val: '1010', label: '10' },
                    { val: '11111111', label: '255' },
                    { val: '10000000', label: '128' },
                    { val: '1100100', label: '100' },
                    { val: '101010', label: '42' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => { setBinary(val); setError('') }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-purple-200 text-sm font-mono rounded-full transition"
                    >
                      {val}
                      <span className="text-white/40 ml-1">={label}</span>
                    </button>
                  ))
                : [
                    { val: '42', label: '101010' },
                    { val: '100', label: '1100100' },
                    { val: '255', label: '11111111' },
                    { val: '1024', label: '10000000000' },
                    { val: '65535', label: '1111111111111111' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      onClick={() => { setDecimal(val); setError('') }}
                      className="px-3 py-1 bg-white/10 hover:bg-white/20 text-purple-200 text-sm font-mono rounded-full transition"
                    >
                      {val}
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
