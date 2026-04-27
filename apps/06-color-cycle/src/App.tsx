import { useState, useEffect } from 'react';
import './styles.css';

const COLORS = [
  { name: 'Red', hex: '#EF4444', rgb: 'rgb(239, 68, 68)' },
  { name: 'Orange', hex: '#F97316', rgb: 'rgb(249, 115, 22)' },
  { name: 'Yellow', hex: '#EAB308', rgb: 'rgb(234, 179, 8)' },
  { name: 'Green', hex: '#22C55E', rgb: 'rgb(34, 197, 94)' },
  { name: 'Blue', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
  { name: 'Purple', hex: '#A855F7', rgb: 'rgb(168, 85, 247)' },
  { name: 'Pink', hex: '#EC4899', rgb: 'rgb(236, 72, 153)' },
  { name: 'Cyan', hex: '#06B6D4', rgb: 'rgb(6, 182, 212)' },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1500);

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
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-700"
      style={{ backgroundColor: currentColor.rgb }}
    >
      <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 ${isPlaying ? 'playing' : ''}`}>
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-1">
          Color Cycle
        </h1>
        <p className="text-center text-gray-500 text-sm mb-10">
          Watch colors flow in a smooth animation
        </p>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full">
            <div
              className="color-swatch w-full h-40 rounded-xl shadow-lg transition-colors duration-700 border-4 border-gray-200"
              style={{ backgroundColor: currentColor.rgb }}
            />
          </div>

          <div className="text-center w-full">
            <p className="text-3xl font-bold text-gray-900">
              {currentColor.name}
            </p>
            <p className="text-lg text-gray-600 font-mono mt-1">
              {currentColor.hex}
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={handlePrevious}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all"
            >
              ← Previous
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 active:scale-95 transition-all"
            >
              Next →
            </button>
          </div>

          <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Animation Speed
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="text-sm font-mono text-gray-600 min-w-fit">
                {(speed / 1000).toFixed(1)}s
              </span>
            </div>
          </div>

          <div className="w-full">
            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Quick Select
            </p>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((color, index) => (
                <button
                  key={color.name}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-10 h-10 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
                    index === currentIndex ? 'ring-2 ring-offset-2 ring-gray-400 shadow-lg' : 'shadow'
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
