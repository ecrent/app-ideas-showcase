import { useState } from 'react'

function binaryToDecimal(binary: string): number | null {
  if (binary === '') return null
  if (!/^[01]+$/.test(binary)) return null
  return parseInt(binary, 2)
}

export default function App() {
  const [binary, setBinary] = useState('')
  const [error, setError] = useState('')

  const decimal = binaryToDecimal(binary)

  function handleChange(value: string) {
    setBinary(value)
    if (value && !/^[01]*$/.test(value)) {
      setError('Only 0 and 1 are allowed')
    } else if (value.length > 32) {
      setError('Maximum 32 bits')
    } else {
      setError('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Allow control keys
    if (e.key.length > 1) return
    // Block non-binary characters
    if (e.key !== '0' && e.key !== '1') {
      e.preventDefault()
      setError('Only 0 and 1 are allowed')
      setTimeout(() => setError(''), 1500)
    }
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
            <input
              type="text"
              value={binary}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 10101010"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white text-lg font-mono placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              maxLength={32}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-red-400 text-sm">{error}</p>
            )}
          </div>

          {/* Decimal Output */}
          <div className="mb-6">
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Decimal Output
            </label>
            <div className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-lg font-mono min-h-[52px] flex items-center">
              {decimal !== null ? (
                <span className="text-green-400 text-2xl font-bold">{decimal.toLocaleString()}</span>
              ) : (
                <span className="text-white/30">—</span>
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
                      className={`flex flex-col items-center px-2 py-1 rounded ${
                        bit === '1' ? 'bg-purple-500/30' : 'bg-white/5'
                      }`}
                    >
                      <span className="text-white/40 text-[10px]">2<sup>{power}</sup></span>
                      <span className={`text-lg font-mono font-bold ${bit === '1' ? 'text-purple-300' : 'text-white/30'}`}>
                        {bit}
                      </span>
                      <span className="text-white/40 text-[10px]">{value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick examples */}
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Try these
            </label>
            <div className="flex flex-wrap gap-2">
              {['1010', '11111111', '10000000', '1100100'].map((example) => (
                <button
                  key={example}
                  onClick={() => { setBinary(example); setError('') }}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-purple-200 text-sm font-mono rounded-full transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
