import { useState } from 'react'

export default function App() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num)
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display)

    if (prevValue === null) {
      setPrevValue(currentValue)
    } else if (operation) {
      const result = calculate(prevValue, currentValue, operation)
      setDisplay(String(result))
      setPrevValue(result)
    }

    setOperation(op)
    setWaitingForNewValue(true)
  }

  const calculate = (prev: number, current: number, op: string): number => {
    if (op === '/' && current === 0) {
      return NaN // Invalid operation
    }
    let result: number
    switch (op) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '*':
        result = prev * current
        break
      case '/':
        result = prev / current
        break
      default:
        result = current
    }
    // Round to 10 decimal places to avoid floating point errors
    return Math.round(result * 1e10) / 1e10
  }

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const currentValue = parseFloat(display)
      const result = calculate(prevValue, currentValue, operation)
      setDisplay(String(result))
      setPrevValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const handleDelete = () => {
    if (waitingForNewValue) return
    const newDisplay = display.slice(0, -1) || '0'
    setDisplay(newDisplay)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key
    if (key >= '0' && key <= '9') {
      e.preventDefault()
      handleNumber(key)
    } else if (key === '.') {
      e.preventDefault()
      handleDecimal()
    } else if (key === '+' || key === '-') {
      e.preventDefault()
      handleOperation(key)
    } else if (key === '*') {
      e.preventDefault()
      handleOperation('*')
    } else if (key === '/') {
      e.preventDefault()
      handleOperation('/')
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault()
      handleEquals()
    } else if (key === 'Backspace') {
      e.preventDefault()
      handleDelete()
    } else if (key === 'Escape') {
      e.preventDefault()
      handleClear()
    }
  }

  const buttonClass = 'w-16 h-16 rounded-lg font-semibold text-lg transition-colors'
  const numberButtonClass = `${buttonClass} bg-gray-200 hover:bg-gray-300 text-gray-900`
  const operationButtonClass = `${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`
  const equalsButtonClass = `${buttonClass} bg-green-500 hover:bg-green-600 text-white`
  const clearButtonClass = `${buttonClass} bg-red-500 hover:bg-red-600 text-white`

  const displayValue = display === 'NaN' || !isFinite(parseFloat(display)) ? 'Error' : display

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Calculator</h1>

        <div className="bg-gray-900 rounded-lg p-4 mb-6">
          <div className="text-right text-white text-5xl font-mono overflow-hidden text-ellipsis">
            {displayValue}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={handleClear}
            className={`${clearButtonClass}`}
          >
            C
          </button>
          <button
            onClick={handleDelete}
            className={`${clearButtonClass}`}
          >
            ⌫
          </button>
          <button
            onClick={() => handleOperation('/')}
            className={operationButtonClass}
          >
            ÷
          </button>
          <button
            onClick={() => handleOperation('*')}
            className={operationButtonClass}
          >
            ×
          </button>

          <button onClick={() => handleNumber('7')} className={numberButtonClass}>
            7
          </button>
          <button onClick={() => handleNumber('8')} className={numberButtonClass}>
            8
          </button>
          <button onClick={() => handleNumber('9')} className={numberButtonClass}>
            9
          </button>
          <button
            onClick={() => handleOperation('-')}
            className={operationButtonClass}
          >
            −
          </button>

          <button onClick={() => handleNumber('4')} className={numberButtonClass}>
            4
          </button>
          <button onClick={() => handleNumber('5')} className={numberButtonClass}>
            5
          </button>
          <button onClick={() => handleNumber('6')} className={numberButtonClass}>
            6
          </button>
          <button
            onClick={() => handleOperation('+')}
            className={operationButtonClass}
          >
            +
          </button>

          <button onClick={() => handleNumber('1')} className={numberButtonClass}>
            1
          </button>
          <button onClick={() => handleNumber('2')} className={numberButtonClass}>
            2
          </button>
          <button onClick={() => handleNumber('3')} className={numberButtonClass}>
            3
          </button>
          <button
            onClick={handleEquals}
            className={`${equalsButtonClass} row-span-2`}
          >
            =
          </button>

          <button
            onClick={() => handleNumber('0')}
            className={`${numberButtonClass} col-span-2`}
          >
            0
          </button>
          <button onClick={handleDecimal} className={numberButtonClass}>
            .
          </button>
        </div>
      </div>
    </div>
  )
}
