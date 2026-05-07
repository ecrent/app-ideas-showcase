import { useState, useEffect } from 'react'
import Database from './components/Database'

export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">First DB App</h1>
          <p className="text-sm text-gray-600 mt-1">Simple browser-based database</p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Database />
      </main>
    </div>
  )
}
