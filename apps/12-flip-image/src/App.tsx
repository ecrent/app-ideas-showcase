import { useState, useRef } from 'react'

export default function App() {
  const [image, setImage] = useState<string | null>(null)
  const [flipped, setFlipped] = useState({ horizontal: false, vertical: false })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        setImage(src)
        setFlipped({ horizontal: false, vertical: false })
      }
      reader.readAsDataURL(file)
    }
  }

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (!imageRef.current || !canvasRef.current) return

    const newFlipped = { ...flipped }
    if (direction === 'horizontal') {
      newFlipped.horizontal = !newFlipped.horizontal
    } else {
      newFlipped.vertical = !newFlipped.vertical
    }
    setFlipped(newFlipped)
    drawCanvas(newFlipped)
  }

  const drawCanvas = (flipState: typeof flipped) => {
    const img = imageRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.save()

    if (flipState.horizontal && flipState.vertical) {
      ctx.scale(-1, -1)
      ctx.drawImage(img, -canvas.width, -canvas.height)
    } else if (flipState.horizontal) {
      ctx.scale(-1, 1)
      ctx.drawImage(img, -canvas.width, 0)
    } else if (flipState.vertical) {
      ctx.scale(1, -1)
      ctx.drawImage(img, 0, -canvas.height)
    } else {
      ctx.drawImage(img, 0, 0)
    }

    ctx.restore()
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = 'flipped-image.png'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Flip Image</h1>
          <p className="text-gray-600">Upload an image and flip it horizontally or vertically</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <label className="block mb-4">
              <div className="flex items-center justify-center w-full px-6 py-10 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                <div className="text-center">
                  <svg className="w-12 h-12 text-indigo-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-gray-700 font-semibold">Upload Image</p>
                  <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {image && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Original</h2>
                  <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '400px' }}>
                    <img
                      ref={imageRef}
                      src={image}
                      alt="Original"
                      className="max-w-full max-h-full object-contain"
                      onLoad={() => drawCanvas(flipped)}
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Flipped</h2>
                  <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '400px' }}>
                    <canvas
                      ref={canvasRef}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mb-8">
                <button
                  onClick={() => flipImage('horizontal')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    flipped.horizontal
                      ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                      : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4" />
                    </svg>
                    Horizontal
                  </div>
                </button>
                <button
                  onClick={() => flipImage('vertical')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    flipped.vertical
                      ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                      : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16m0 0l-4-4m0 0l-4 4m0 10H4m0 0l4 4m0 0l4-4" />
                    </svg>
                    Vertical
                  </div>
                </button>
                <button
                  onClick={() => {
                    setImage(null)
                    setFlipped({ horizontal: false, vertical: false })
                  }}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </div>
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={downloadImage}
                  className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
