import { useEffect, useState, useCallback } from 'react'

interface Light {
  id: number
  color: string
  isOn: boolean
  delay: number
}

interface LightString {
  id: number
  lights: Light[]
  speed: 'slow' | 'medium' | 'fast'
}

export default function App() {
  const [strings, setStrings] = useState<LightString[]>([])

  useEffect(() => {
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange', 'cyan']
    const speeds: Array<'slow' | 'medium' | 'fast'> = ['slow', 'medium', 'fast']

    const lightStrings = Array.from({ length: 4 }, (_, stringIdx) => ({
      id: stringIdx,
      speed: speeds[stringIdx % speeds.length],
      lights: Array.from({ length: 12 }, (_, i) => ({
        id: i,
        color: colors[(stringIdx * 2 + i) % colors.length],
        isOn: Math.random() > 0.5,
        delay: Math.random() * 1000,
      })),
    }))
    setStrings(lightStrings)
  }, [])

  const getAnimationSpeed = (speed: string) => {
    switch (speed) {
      case 'slow':
        return 600
      case 'medium':
        return 400
      case 'fast':
        return 250
      default:
        return 400
    }
  }

  useEffect(() => {
    if (strings.length === 0) return

    const intervals = strings.map(str => {
      const speed = getAnimationSpeed(str.speed)
      return setInterval(() => {
        setStrings(prev =>
          prev.map(s =>
            s.id === str.id
              ? {
                  ...s,
                  lights: s.lights.map(light => ({
                    ...light,
                    isOn: Math.random() > 0.5,
                  })),
                }
              : s
          )
        )
      }, speed)
    })

    return () => intervals.forEach(clearInterval)
  }, [strings.length])

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-bold text-white mb-2 drop-shadow-lg">🎄 Christmas Lights</h1>
      <p className="text-slate-300 mb-16 text-lg">Watch the animated light strings</p>

      <div className="space-y-12 max-w-3xl w-full">
        {strings.map(lightString => (
          <div key={lightString.id} className="flex flex-col items-center">
            <div className="relative h-1 w-full bg-gradient-to-r from-transparent via-amber-700 to-transparent mb-6" />

            <div className="flex gap-3 flex-wrap justify-center">
              {lightString.lights.map(light => (
                <div
                  key={`${lightString.id}-${light.id}`}
                  className="relative group"
                  style={{ animationDelay: `${light.delay}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-full transition-all duration-75 transform ${
                      light.isOn
                        ? `${colorClasses[light.color]} shadow-lg scale-100`
                        : 'bg-slate-700 shadow-sm scale-85'
                    } hover:scale-110 hover:shadow-2xl cursor-pointer`}
                  />
                  <div
                    className={`absolute inset-0 rounded-full blur-md transition-opacity duration-75 ${
                      light.isOn
                        ? `${colorClasses[light.color]} opacity-50`
                        : 'opacity-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="relative h-1 w-full bg-gradient-to-r from-transparent via-amber-700 to-transparent mt-6" />
            <p className="text-xs text-slate-400 mt-3">Speed: {lightString.speed}</p>
          </div>
        ))}
      </div>

      <div className="text-center text-slate-400 text-sm mt-16">
        <p>✨ Enjoy the festive display ✨</p>
      </div>
    </div>
  )
}
