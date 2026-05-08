import { useState } from 'react'
import RowForm from './RowForm'

interface Table {
  id: string
  name: string
  columns: string[]
  rows: Record<string, string>[]
}

interface Props {
  table: Table
  onAddRow: (tableId: string, rowData: Record<string, string>) => void
  onUpdateRow: (tableId: string, rowIndex: number, newData: Record<string, string>) => void
  onDeleteRow: (tableId: string, rowIndex: number) => void
  onDeleteTable: (tableId: string) => void
}

export default function TableViewer({
  table,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
  onDeleteTable
}: Props) {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddRow = (rowData: Record<string, string>) => {
    onAddRow(table.id, rowData)
    setShowAddForm(false)
  }

  const handleUpdateRow = (rowData: Record<string, string>) => {
    if (editingRowIndex !== null) {
      onUpdateRow(table.id, editingRowIndex, rowData)
      setEditingRowIndex(null)
    }
  }

  const handleDeleteTable = () => {
    if (window.confirm(`Delete table "${table.name}" and all its data?`)) {
      onDeleteTable(table.id)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{table.name}</h2>
        </div>
        <button
          onClick={handleDeleteTable}
          className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 font-medium transition-colors"
        >
          Delete Table
        </button>
      </div>

      <div className="p-6">
        {showAddForm ? (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <RowForm
              columns={table.columns}
              onSubmit={handleAddRow}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm transition-colors"
          >
            + Add Row
          </button>
        )}

        {editingRowIndex !== null ? (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <RowForm
              columns={table.columns}
              initialData={table.rows[editingRowIndex]}
              onSubmit={handleUpdateRow}
              onCancel={() => setEditingRowIndex(null)}
              isEditing
            />
          </div>
        ) : null}

        {table.rows.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No rows yet. Add one to get started!</p>
        ) : (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-12">#</th>
                  {table.columns.map(col => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 font-semibold text-gray-700 bg-gray-50 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                    {table.columns.map(col => (
                      <td key={col} className="px-4 py-3 text-gray-900 break-words max-w-sm">
                        {row[col] ? <span className="truncate inline-block" title={row[col]}>{row[col]}</span> : <span className="text-gray-400">—</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3 space-x-2 flex whitespace-nowrap">
                      <button
                        onClick={() => setEditingRowIndex(index)}
                        disabled={editingRowIndex !== null}
                        className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this row?')) {
                            onDeleteRow(table.id, index)
                          }
                        }}
                        disabled={editingRowIndex !== null}
                        className="text-red-600 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total rows: <span className="font-semibold text-gray-900">{table.rows.length}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
