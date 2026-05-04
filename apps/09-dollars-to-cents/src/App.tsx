import { useState } from 'react';

export default function App() {
  const [dollars, setDollars] = useState('');
  const [cents, setCents] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    setCents(null);

    if (!dollars.trim()) {
      setError('Please enter a dollar amount');
      return;
    }

    const amount = parseFloat(dollars);
    if (isNaN(amount)) {
      setError('Please enter a valid number');
      return;
    }

    if (amount < 0) {
      setError('Amount cannot be negative');
      return;
    }

    const centAmount = Math.round(amount * 100);
    setCents(centAmount);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  const handleClear = () => {
    setDollars('');
    setCents(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dollars to Cents</h1>
          <p className="text-gray-600">Convert dollar amounts to cents instantly</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dollar Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-xl text-gray-500">$</span>
              <input
                type="number"
                value={dollars}
                onChange={(e) => {
                  setDollars(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConvert}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
            >
              Convert
            </button>
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 active:scale-95"
            >
              Clear
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 font-medium">
              {error}
            </div>
          )}

          {cents !== null && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center">
              <p className="text-gray-600 text-sm font-medium mb-2">Result</p>
              <div className="text-4xl font-bold text-green-600">
                {cents.toLocaleString()}¢
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {dollars} dollars = {cents} cents
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-700">How it works:</span> Enter a dollar amount and we'll convert it to cents. For example, $5.50 = 550¢
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
