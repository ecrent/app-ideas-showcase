import { useState, useEffect } from 'react'

export default function App() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(60)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) return

    const interval = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, totalSeconds])

  const updateFromInputs = () => {
    const total = hours * 3600 + minutes * 60 + seconds
    setTotalSeconds(total)
  }

  const setPreset = (seconds: number) => {
    setIsRunning(false)
    setIsCompleted(false)
    setTotalSeconds(seconds)
    setHours(Math.floor(seconds / 3600))
    setMinutes(Math.floor((seconds % 3600) / 60))
    setSeconds(seconds % 60)
  }

  const handleStart = () => {
    if (totalSeconds > 0) {
      setIsRunning(true)
      setIsCompleted(false)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsCompleted(false)
    const total = hours * 3600 + minutes * 60 + seconds
    setTotalSeconds(total)
  }

  const displayHours = Math.floor(totalSeconds / 3600)
  const displayMinutes = Math.floor((totalSeconds % 3600) / 60)
  const displaySeconds = totalSeconds % 60

  const initialTotal = hours * 3600 + minutes * 60 + seconds
  const progressPercent = initialTotal > 0 ? ((initialTotal - totalSeconds) / initialTotal) * 100 : 0

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, parseInt(e.target.value) || 0)
    setHours(value)
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
    setMinutes(value)
  }

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
    setSeconds(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl p-8 max-w-md w-full transition-all duration-300 ${
        isCompleted ? 'bg-green-50 border-2 border-green-500 shadow-green-200' : 'bg-white'
      }`}>
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Countdown Timer</h1>

        <div className={`rounded-xl p-8 mb-8 text-center transition-all duration-300 relative overflow-hidden ${
          isRunning ? 'bg-gradient-to-r from-blue-500 to-blue-600 ring-4 ring-blue-300 shadow-lg shadow-blue-400' : isCompleted ? 'bg-green-500' : 'bg-gray-900'
        }`}>
          {isRunning && initialTotal > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-300 opacity-50">
              <div
                className="h-full bg-blue-200 transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          )}
          <div className="text-6xl font-mono font-bold text-white tracking-wider">
            {String(displayHours).padStart(2, '0')}:{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
          {isCompleted && (
            <div className="text-2xl font-bold text-white mt-4 animate-pulse">✓ Time's up!</div>
          )}
        </div>

        {!isRunning && !isCompleted && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={handleHoursChange}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-center text-xl font-bold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-center text-xl font-bold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                min="0"
                max="59"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={handleSecondsChange}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-center text-xl font-bold text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                min="0"
                max="59"
              />
            </div>
          </div>
        )}

        {!isRunning && !isCompleted && (
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick Presets</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPreset(300)}
                className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-300 text-blue-700 font-bold py-2 px-3 rounded-lg transition duration-150 text-sm active:scale-95"
              >
                5 min
              </button>
              <button
                onClick={() => setPreset(600)}
                className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-300 text-blue-700 font-bold py-2 px-3 rounded-lg transition duration-150 text-sm active:scale-95"
              >
                10 min
              </button>
              <button
                onClick={() => setPreset(900)}
                className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-300 text-blue-700 font-bold py-2 px-3 rounded-lg transition duration-150 text-sm active:scale-95"
              >
                15 min
              </button>
              <button
                onClick={() => setPreset(1800)}
                className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-300 text-blue-700 font-bold py-2 px-3 rounded-lg transition duration-150 text-sm active:scale-95"
              >
                30 min
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={() => {
                updateFromInputs()
                handleStart()
              }}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-200 active:scale-95"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-yellow-200 active:scale-95"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-200 active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
