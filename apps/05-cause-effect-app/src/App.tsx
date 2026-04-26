import { useState, useEffect } from 'react'

interface CauseEffect {
  id: string
  cause: string
  effect: string
}

const STORAGE_KEY = 'cause-effect-pairs'

export default function App() {
  const [pairs, setPairs] = useState<CauseEffect[]>([])
  const [cause, setCause] = useState('')
  const [effect, setEffect] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPairs(JSON.parse(saved))
      } catch {
        setPairs([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pairs))
  }, [pairs])

  const addPair = () => {
    if (cause.trim() && effect.trim()) {
      setPairs([...pairs, {
        id: Date.now().toString(),
        cause: cause.trim(),
        effect: effect.trim()
      }])
      setCause('')
      setEffect('')
    }
  }

  const removePair = (id: string) => {
    setPairs(pairs.filter(pair => pair.id !== id))
  }

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all relationships?')) {
      setPairs([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPair()
    }
  }

  const findChains = (): Array<CauseEffect[]> => {
    const chains: Array<CauseEffect[]> = []
    const visited = new Set<string>()

    pairs.forEach(pair => {
      if (visited.has(pair.id)) return

      const chain: CauseEffect[] = [pair]
      visited.add(pair.id)
      let currentEffect = pair.effect

      while (true) {
        const nextPair = pairs.find(
          p => p.cause.toLowerCase() === currentEffect.toLowerCase() && !visited.has(p.id)
        )
        if (!nextPair) break
        chain.push(nextPair)
        visited.add(nextPair.id)
        currentEffect = nextPair.effect
      }

      if (chain.length > 1 || !pairs.some(p => p.effect.toLowerCase() === pair.cause.toLowerCase())) {
        chains.push(chain)
      }
    })

    return chains.length > 0 ? chains : []
  }

  const chains = findChains()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cause & Effect</h1>
          <p className="text-gray-600">Explore relationships between actions and outcomes</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Relationship</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="cause" className="block text-sm font-medium text-gray-700 mb-2">
                Cause
              </label>
              <input
                id="cause"
                type="text"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., It rains"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="effect" className="block text-sm font-medium text-gray-700 mb-2">
                Effect
              </label>
              <input
                id="effect"
                type="text"
                value={effect}
                onChange={(e) => setEffect(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., The ground gets wet"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <button
              onClick={addPair}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              + Add Relationship
            </button>
          </div>
        </div>

        {pairs.length === 0 ? (
          <div className="text-center text-gray-400 py-16 px-6">
            <p className="text-lg font-medium">No relationships yet. Create one to get started!</p>
            <p className="text-sm text-gray-400 mt-2">Try something like: "It rains" → "The ground gets wet"</p>
          </div>
        ) : (
          <div className="space-y-8">
            {chains.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Chains ({chains.length})</h2>
                <div className="space-y-4">
                  {chains.map((chain, chainIndex) => (
                    <div
                      key={chainIndex}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                    >
                      <div className="space-y-3">
                        {chain.map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <div className="bg-purple-50 border-l-4 border-purple-500 rounded p-2 flex-1">
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                {itemIndex === 0 ? 'Start' : 'Then'}
                              </p>
                              <p className="text-sm text-gray-900 font-medium">{item.cause}</p>
                            </div>
                            <div className="text-lg text-purple-400">→</div>
                            <div className="bg-purple-50 border-l-4 border-purple-500 rounded p-2 flex-1">
                              <p className="text-xs text-gray-500 font-semibold uppercase">
                                Results in
                              </p>
                              <p className="text-sm text-gray-900 font-medium">{item.effect}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">All Relationships ({pairs.length})</h2>
                <button
                  onClick={clearAll}
                  className="text-sm px-3 py-1 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-800 transition font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-4">
                {pairs.map((pair, index) => (
                  <div
                    key={pair.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded p-3">
                          <p className="text-xs text-gray-600 font-semibold uppercase">Cause</p>
                          <p className="text-base text-gray-900 font-medium">{pair.cause}</p>
                        </div>
                      </div>
                      <div className="text-2xl text-gray-400 flex-shrink-0">→</div>
                      <div className="flex-1">
                        <div className="bg-green-50 border-l-4 border-green-500 rounded p-3">
                          <p className="text-xs text-gray-600 font-semibold uppercase">Effect</p>
                          <p className="text-base text-gray-900 font-medium">{pair.effect}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removePair(pair.id)}
                        className="text-red-500 hover:bg-red-100 hover:text-red-700 transition p-2 rounded-lg font-bold flex-shrink-0"
                        title="Delete relationship"
                        aria-label="Delete relationship"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
