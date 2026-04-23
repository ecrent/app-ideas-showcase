import { useState, useEffect } from 'react'

type LightColor = 'red' | 'green' | 'blue' | 'yellow' | 'off'

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
  off: 'bg-gray-400 shadow-none',
}

function Light({ color }: { color: LightColor }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full transition-all duration-300 ${colorClasses[color]}`}
      />
      <div className="w-1 h-3 bg-amber-700" />
    </div>
  )
}

export default function App() {
  const [lights, setLights] = useState<Light[]>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setLights((prevLights) =>
        prevLights.map((light) => ({
          ...light,
          color: colors[Math.floor(Math.random() * colors.length)],
        }))
      )
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-white mb-2">Christmas Lights</h1>
      <p className="text-slate-300 mb-12">Festive animated light display</p>

      <div className="flex flex-wrap gap-8 justify-center max-w-2xl">
        {lights.map((light) => (
          <Light key={light.id} color={light.color} />
        ))}
      </div>
    </div>
  )
}
