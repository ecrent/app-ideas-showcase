import { useState } from 'react'

interface Props {
  onCreateTable: (name: string, columns: string[]) => void
}

export default function TableCreator({ onCreateTable }: Props) {
  const [tableName, setTableName] = useState('')
  const [columnInput, setColumnInput] = useState('')
  const [columns, setColumns] = useState<string[]>([])

  const addColumn = () => {
    if (columnInput.trim() && !columns.includes(columnInput.trim())) {
      setColumns([...columns, columnInput.trim()])
      setColumnInput('')
    }
  }

  const removeColumn = (col: string) => {
    setColumns(columns.filter(c => c !== col))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tableName.trim() && columns.length > 0) {
      onCreateTable(tableName.trim(), columns)
      setTableName('')
      setColumns([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Table</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Table Name
        </label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="e.g., Users, Products"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Columns
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={columnInput}
            onChange={(e) => setColumnInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColumn())}
            placeholder="e.g., id, name, email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={addColumn}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
          >
            Add
          </button>
        </div>

        {columns.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {columns.map(col => (
              <div
                key={col}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {col}
                <button
                  type="button"
                  onClick={() => removeColumn(col)}
                  className="text-blue-500 hover:text-blue-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!tableName.trim() || columns.length === 0}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
      >
        Create Table
      </button>
      {!tableName.trim() && <p className="text-xs text-gray-500 mt-2">Enter a table name</p>}
      {tableName.trim() && columns.length === 0 && <p className="text-xs text-gray-500 mt-2">Add at least one column</p>}
    </form>
  )
}
