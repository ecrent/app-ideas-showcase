import { useState, useEffect } from 'react'
import TableCreator from './TableCreator'
import TableViewer from './TableViewer'

interface Table {
  id: string
  name: string
  columns: string[]
  rows: Record<string, string>[]
}

export default function Database() {
  const [tables, setTables] = useState<Table[]>([])
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  const STORAGE_KEY = 'db_app_tables'

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setTables(JSON.parse(saved))
      } catch {
        console.error('Failed to load tables')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables))
  }, [tables])

  const createTable = (name: string, columns: string[]) => {
    const newTable: Table = {
      id: Date.now().toString(),
      name,
      columns,
      rows: []
    }
    setTables([...tables, newTable])
    setSelectedTableId(newTable.id)
  }

  const deleteTable = (id: string) => {
    const remaining = tables.filter(t => t.id !== id)
    setTables(remaining)
    if (selectedTableId === id) {
      setSelectedTableId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  const updateTableRow = (tableId: string, rowIndex: number, newData: Record<string, string>) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const newRows = [...table.rows]
        newRows[rowIndex] = newData
        return { ...table, rows: newRows }
      }
      return table
    }))
  }

  const deleteTableRow = (tableId: string, rowIndex: number) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          rows: table.rows.filter((_, i) => i !== rowIndex)
        }
      }
      return table
    }))
  }

  const addTableRow = (tableId: string, rowData: Record<string, string>) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          rows: [...table.rows, rowData]
        }
      }
      return table
    }))
  }

  const selectedTable = tables.find(t => t.id === selectedTableId)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <aside className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Tables</h2>
          </div>
          {tables.length === 0 ? (
            <p className="text-sm text-gray-500">No tables yet. Create one to get started!</p>
          ) : (
            <div className="space-y-2">
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors ${
                    selectedTableId === table.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate block">{table.name}</span>
                  <span className="text-xs text-gray-500">({table.rows.length} rows)</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="lg:col-span-4">
        {selectedTable ? (
          <TableViewer
            table={selectedTable}
            onAddRow={addTableRow}
            onUpdateRow={updateTableRow}
            onDeleteRow={deleteTableRow}
            onDeleteTable={deleteTable}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
            <TableCreator onCreateTable={createTable} />
          </div>
        )}
      </main>
    </div>
  )
}
