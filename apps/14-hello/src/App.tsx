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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-3 tracking-tight">Hello</h1>
          <p className="text-xl sm:text-2xl text-indigo-600 font-semibold">Greetings in 15 languages</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-14 text-center mb-10 sm:mb-12 min-h-72 sm:min-h-80 flex flex-col justify-center items-center">
          <div className="text-8xl sm:text-9xl mb-6 sm:mb-8 animate-float origin-center">{current.flag}</div>
          <div className="space-y-3 w-full">
            <h2 className="text-5xl sm:text-6xl font-bold text-indigo-600 mb-3 sm:mb-4 animate-fadeIn">{current.greeting}</h2>
            <p className="text-xl sm:text-2xl text-gray-700 mb-10 sm:mb-12 tracking-wide font-semibold animate-fadeIn">{current.language}</p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-5 justify-center">
            <button
              onClick={() => setSelectedIndex((i) => (i - 1 + GREETINGS.length) % GREETINGS.length)}
              className="px-7 sm:px-9 py-3 sm:py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-all transform duration-200"
            >
              ← Previous
            </button>
            <button
              onClick={() => setSelectedIndex((i) => (i + 1) % GREETINGS.length)}
              className="px-7 sm:px-9 py-3 sm:py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 transition-all transform duration-200"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {GREETINGS.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`p-4 sm:p-5 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                index === selectedIndex
                  ? 'bg-indigo-600 text-white shadow-xl scale-105 hover:bg-indigo-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:scale-105'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{item.flag}</div>
              <div className="text-sm sm:text-base break-words">{item.language}</div>
            </button>
          ))}
        </div>

        <div className="text-center text-sm sm:text-base text-gray-600">
          <p>Click any language to jump directly • Use Previous/Next to navigate</p>
        </div>
      </div>
    </div>
  )
}
