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
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">Hello</h1>
          <p className="text-xl text-gray-600">Hello world in multiple languages</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center mb-10 min-h-64 flex flex-col justify-center">
          <div className="text-8xl mb-6 animate-bounce">{current.flag}</div>
          <h2 className="text-5xl font-bold text-gray-900 mb-3 transition-all">{current.greeting}</h2>
          <p className="text-xl text-gray-600 mb-10 tracking-wider">{current.language}</p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setSelectedIndex((i) => (i - 1 + GREETINGS.length) % GREETINGS.length)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition transform"
            >
              ← Previous
            </button>
            <button
              onClick={() => setSelectedIndex((i) => (i + 1) % GREETINGS.length)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 active:scale-95 transition transform"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {GREETINGS.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`p-4 rounded-xl font-semibold transition transform active:scale-95 ${
                index === selectedIndex
                  ? 'bg-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-lg'
              }`}
            >
              <div className="text-3xl mb-2">{item.flag}</div>
              <div className="text-xs sm:text-sm break-words">{item.language}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
