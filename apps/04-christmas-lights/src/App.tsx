import { useEffect, useState } from 'react'

interface Light {
  id: number
  color: string
  isOn: boolean
  delay: number
}

export default function App() {
  const [lights, setLights] = useState<Light[]>([])

  useEffect(() => {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange', 'cyan']
    const initialLights = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      isOn: Math.random() > 0.5,
      delay: Math.random() * 1000,
    }))
    setLights(initialLights)
  }, [])

  useEffect(() => {
    if (lights.length === 0) return

    const interval = setInterval(() => {
      setLights(prev =>
        prev.map(light => ({
          ...light,
          isOn: Math.random() > 0.5,
        }))
      )
    }, 400)

    return () => clearInterval(interval)
  }, [lights.length])

  const colorClasses: Record<string, string> = {
    red: 'bg-red-500 shadow-red-500',
    green: 'bg-green-500 shadow-green-500',
    blue: 'bg-blue-500 shadow-blue-500',
    yellow: 'bg-yellow-300 shadow-yellow-300',
    purple: 'bg-purple-500 shadow-purple-500',
    pink: 'bg-pink-500 shadow-pink-500',
    orange: 'bg-orange-500 shadow-orange-500',
    cyan: 'bg-cyan-400 shadow-cyan-400',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
        Christmas Lights
      </h1>
      <p className="text-slate-200 mb-12 text-lg">Hover over lights for effects</p>

      <div className="flex gap-4 flex-wrap justify-center max-w-4xl mb-8">
        {lights.map(light => (
          <div
            key={light.id}
            className="relative group"
            style={{ animationDelay: `${light.delay}ms` }}
          >
            <div
              className={`w-12 h-12 rounded-full transition-all duration-100 transform ${
                light.isOn
                  ? `${colorClasses[light.color]} shadow-lg scale-100`
                  : 'bg-slate-700 shadow-sm scale-95'
              } hover:scale-125 hover:shadow-2xl cursor-pointer`}
            />
          </div>
        ))}
      </div>

      <div className="text-center text-slate-300 text-sm">
        <p>✨ Lights blink automatically ✨</p>
      </div>
    </div>
  )
}
