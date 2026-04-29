import { useState, useEffect } from 'react'

export default function App() {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || totalSeconds <= 0) return

    const interval = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          setIsRunning(false)
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

  const handleStart = () => {
    if (totalSeconds > 0) {
      setIsRunning(true)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Countdown Timer</h1>

        <div className="bg-gray-900 rounded-xl p-8 mb-8 text-center">
          <div className="text-6xl font-mono font-bold text-white tracking-wider">
            {String(displayHours).padStart(2, '0')}:{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
          </div>
        </div>

        {!isRunning && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={handleHoursChange}
                disabled={isRunning}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={handleMinutesChange}
                disabled={isRunning}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
                disabled={isRunning}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                min="0"
                max="59"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-4">
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
