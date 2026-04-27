import { useState, useEffect } from 'react';

const COLORS = [
  { name: 'Red', hex: '#EF4444', rgb: 'rgb(239, 68, 68)' },
  { name: 'Orange', hex: '#F97316', rgb: 'rgb(249, 115, 22)' },
  { name: 'Yellow', hex: '#EAB308', rgb: 'rgb(234, 179, 8)' },
  { name: 'Green', hex: '#22C55E', rgb: 'rgb(34, 197, 94)' },
  { name: 'Blue', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
  { name: 'Purple', hex: '#A855F7', rgb: 'rgb(168, 85, 247)' },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % COLORS.length);
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const currentColor = COLORS[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + COLORS.length) % COLORS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % COLORS.length);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500"
      style={{ backgroundColor: currentColor.rgb }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Color Cycle
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Smooth color animation
        </p>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-24 h-24 rounded-lg shadow-md transition-all"
              style={{ backgroundColor: currentColor.rgb }}
            />
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">
                {currentColor.name}
              </p>
              <p className="text-lg text-gray-600 font-mono">
                {currentColor.hex}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handlePrevious}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speed: {(speed / 1000).toFixed(1)}s
            </label>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="w-full bg-gray-100 rounded p-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">Colors:</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color, index) => (
                <button
                  key={color.name}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-8 h-8 rounded transition-all ${
                    index === currentIndex ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color.rgb }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
