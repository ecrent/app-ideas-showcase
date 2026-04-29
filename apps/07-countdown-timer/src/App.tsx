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
        isCompleted ? 'bg-green-50 border-2 border-green-500' : 'bg-white'
      }`}>
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Countdown Timer</h1>

        <div className={`rounded-xl p-8 mb-8 text-center transition-all duration-300 ${
          isRunning ? 'bg-blue-600 ring-4 ring-blue-300' : 'bg-gray-900'
        }`}>
          <div className="text-6xl font-mono font-bold text-white tracking-wider">
            {String(displayHours).padStart(2, '0')}:{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
          {isCompleted && (
            <div className="text-xl font-semibold text-green-600 mt-4">✓ Time's up!</div>
          )}
        </div>

        {!isRunning && !isCompleted && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={handleHoursChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="59"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={handleSecondsChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="59"
              />
            </div>
          </div>
        )}

        {!isRunning && !isCompleted && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setPreset(300)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm"
            >
              5 min
            </button>
            <button
              onClick={() => setPreset(600)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm"
            >
              10 min
            </button>
            <button
              onClick={() => setPreset(900)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm"
            >
              15 min
            </button>
            <button
              onClick={() => setPreset(1800)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-3 rounded-lg transition duration-150 text-sm"
            >
              30 min
            </button>
          </div>
        )}

        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={() => {
                updateFromInputs()
                handleStart()
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
