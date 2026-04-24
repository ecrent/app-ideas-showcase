import { useState, useEffect } from 'react'

type LightColor = 'red' | 'green' | 'blue' | 'yellow'

interface Light {
  id: number
  color: LightColor
}

interface LightString {
  id: number
  lights: Light[]
  isActive: boolean
  speed: number
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
          isLit ? colorClasses[color] : 'bg-gray-700 shadow-none'
        }`}
      />
      <div className="w-1 h-4 bg-amber-900" />
    </div>
  )
}

function LightStringDisplay({
  lightString,
  litIndices,
}: {
  lightString: LightString
  litIndices: Set<number>
}) {
  return (
    <div className="flex gap-8 justify-center opacity-80 hover:opacity-100 transition-opacity">
      {lightString.lights.map((light) => (
        <Light
          key={light.id}
          color={light.color}
          isLit={
            lightString.isActive && litIndices.has(light.id)
          }
        />
      ))}
    </div>
  )
}

export default function App() {
  const createLightString = (id: number): LightString => ({
    id,
    lights: Array.from({ length: 15 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
    })),
    isActive: true,
    speed: 300 + id * 100,
  })

  const [lightStrings, setLightStrings] = useState<LightString[]>(
    Array.from({ length: 3 }, (_, i) => createLightString(i))
  )
  const [isAnimating, setIsAnimating] = useState(true)
  const [litIndicesList, setLitIndicesList] = useState<Map<number, Set<number>>>(
    new Map(
      lightStrings.map((ls) => [
        ls.id,
        new Set(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * ls.lights.length))
        ),
      ])
    )
  )

  useEffect(() => {
    if (!isAnimating) return

    const intervals = lightStrings.map((lightString) =>
      setInterval(() => {
        setLitIndicesList((prev) => {
          const newMap = new Map(prev)
          const newSet = new Set<number>()
          for (let i = 0; i < 8; i++) {
            newSet.add(Math.floor(Math.random() * lightString.lights.length))
          }
          newMap.set(lightString.id, newSet)
          return newMap
        })
      }, lightString.speed)
    )

    return () => intervals.forEach(clearInterval)
  }, [isAnimating, lightStrings])

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  const toggleString = (id: number) => {
    setLightStrings((prev) =>
      prev.map((ls) =>
        ls.id === id ? { ...ls, isActive: !ls.isActive } : ls
      )
    )
  }

  const reset = () => {
    setLitIndicesList(
      new Map(
        lightStrings.map((ls) => [
          ls.id,
          new Set(
            Array.from({ length: 8 }, () => Math.floor(Math.random() * ls.lights.length))
          ),
        ])
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold text-white mb-3">🎄 Christmas Lights 🎄</h1>
        <p className="text-slate-400 text-lg">Festive animated light display</p>
      </div>

      <div className="flex flex-col gap-8 mb-16 bg-slate-900/50 p-8 rounded-xl backdrop-blur">
        {lightStrings.map((lightString) => (
          <LightStringDisplay
            key={lightString.id}
            lightString={lightString}
            litIndices={litIndicesList.get(lightString.id) || new Set()}
          />
        ))}
      </div>

      <div className="flex flex-col gap-6 bg-slate-800/80 p-8 rounded-xl shadow-2xl backdrop-blur border border-slate-700">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={toggleAnimation}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-red-500/50 hover:shadow-xl"
          >
            {isAnimating ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={reset}
            className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-green-500/50 hover:shadow-xl"
          >
            ↻ Reset
          </button>
        </div>

        <div className="border-t border-slate-600 pt-6">
          <p className="text-slate-400 text-sm mb-4 text-center font-medium">LIGHT STRINGS</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {lightStrings.map((lightString) => (
              <button
                key={lightString.id}
                onClick={() => toggleString(lightString.id)}
                className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                  lightString.isActive
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/50'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                String {lightString.id + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
