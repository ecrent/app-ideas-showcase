import { useState, useEffect } from 'react'

type LightColor = 'red' | 'green' | 'blue' | 'yellow'

interface Light {
  id: number
  color: LightColor
}

const colors: LightColor[] = ['red', 'green', 'blue', 'yellow']

const colorClasses: Record<LightColor, string> = {
  red: 'bg-red-500 shadow-lg shadow-red-500',
  green: 'bg-green-500 shadow-lg shadow-green-500',
  blue: 'bg-blue-500 shadow-lg shadow-blue-500',
  yellow: 'bg-yellow-300 shadow-lg shadow-yellow-300',
}

function Light({ color, isLit }: { color: LightColor; isLit: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full transition-all duration-200 ${
          isLit ? colorClasses[color] : 'bg-gray-600 shadow-none'
        }`}
      />
      <div className="w-1 h-3 bg-amber-700" />
    </div>
  )
}

export default function App() {
  const [lights, setLights] = useState<Light[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
    }))
  )
  const [isAnimating, setIsAnimating] = useState(true)
  const [speed, setSpeed] = useState(400)
  const [litIndices, setLitIndices] = useState<Set<number>>(
    new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 20)))
  )

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setLitIndices((prev) => {
        const newSet = new Set<number>()
        for (let i = 0; i < 10; i++) {
          newSet.add(Math.floor(Math.random() * lights.length))
        }
        return newSet
      })
    }, speed)

    return () => clearInterval(interval)
  }, [isAnimating, speed, lights.length])

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const reset = () => {
    setLitIndices(
      new Set(Array.from({ length: 10 }, () => Math.floor(Math.random() * 20)))
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-2">Christmas Lights</h1>
      <p className="text-slate-300 mb-8">Festive animated light display</p>

      <div className="flex flex-wrap gap-8 justify-center max-w-2xl mb-12">
        {lights.map((light) => (
          <Light
            key={light.id}
            color={light.color}
            isLit={litIndices.has(light.id)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 bg-slate-700 p-6 rounded-lg shadow-lg">
        <div className="flex gap-4">
          <button
            onClick={toggleAnimation}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            {isAnimating ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold">
            Speed: {speed}ms
          </label>
          <input
            type="range"
            min="100"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-48 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
