import { useState, useEffect } from 'react'

interface Props {
  columns: string[]
  initialData?: Record<string, string>
  onSubmit: (rowData: Record<string, string>) => void
  onCancel: () => void
  isEditing?: boolean
}

export default function RowForm({
  columns,
  initialData,
  onSubmit,
  onCancel,
  isEditing = false
}: Props) {
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      const emptyData: Record<string, string> = {}
      columns.forEach(col => {
        emptyData[col] = ''
      })
      setFormData(emptyData)
    }
  }, [initialData, columns])

  const handleChange = (column: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [column]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
          <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm0 3a1 1 0 11-2 0 1 1 0 012 0zm0 3a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'Edit Row' : 'Add New Row'}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {columns.map(col => (
          <div key={col}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {col}
            </label>
            <input
              type="text"
              value={formData[col] || ''}
              onChange={(e) => handleChange(col, e.target.value)}
              placeholder={`Enter ${col}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors"
        >
          {isEditing ? 'Update' : 'Add'} Row
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
