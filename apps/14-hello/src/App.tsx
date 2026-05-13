import { useState } from 'react'

const GREETINGS = [
  { language: 'English', greeting: 'Hello', flag: '🇬🇧' },
  { language: 'Spanish', greeting: 'Hola', flag: '🇪🇸' },
  { language: 'French', greeting: 'Bonjour', flag: '🇫🇷' },
  { language: 'German', greeting: 'Hallo', flag: '🇩🇪' },
  { language: 'Italian', greeting: 'Ciao', flag: '🇮🇹' },
  { language: 'Portuguese', greeting: 'Olá', flag: '🇵🇹' },
  { language: 'Dutch', greeting: 'Hallo', flag: '🇳🇱' },
  { language: 'Swedish', greeting: 'Hej', flag: '🇸🇪' },
  { language: 'Polish', greeting: 'Cześć', flag: '🇵🇱' },
  { language: 'Russian', greeting: 'Привет', flag: '🇷🇺' },
  { language: 'Japanese', greeting: 'こんにちは', flag: '🇯🇵' },
  { language: 'Chinese', greeting: '你好', flag: '🇨🇳' },
  { language: 'Korean', greeting: '안녕하세요', flag: '🇰🇷' },
  { language: 'Arabic', greeting: 'مرحبا', flag: '🇸🇦' },
  { language: 'Hebrew', greeting: 'שלום', flag: '🇮🇱' },
]

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const current = GREETINGS[selectedIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Hello</h1>
          <p className="text-lg text-gray-600">Hello world in multiple languages</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 text-center mb-8">
          <div className="text-6xl mb-4">{current.flag}</div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">{current.greeting}</h2>
          <p className="text-lg text-gray-600 mb-8">{current.language}</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setSelectedIndex((i) => (i - 1 + GREETINGS.length) % GREETINGS.length)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              ← Previous
            </button>
            <button
              onClick={() => setSelectedIndex((i) => (i + 1) % GREETINGS.length)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {GREETINGS.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`p-3 rounded-lg font-medium transition ${
                index === selectedIndex
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              <div className="text-2xl mb-1">{item.flag}</div>
              <div className="text-xs md:text-sm">{item.language}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
