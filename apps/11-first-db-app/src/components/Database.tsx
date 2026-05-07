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
    setTables(tables.filter(t => t.id !== id))
    if (selectedTableId === id) {
      setSelectedTableId(tables.length > 1 ? tables[0].id : null)
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tables</h2>
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
                  {table.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="md:col-span-3">
        {selectedTable ? (
          <TableViewer
            table={selectedTable}
            onAddRow={addTableRow}
            onUpdateRow={updateTableRow}
            onDeleteRow={deleteTableRow}
            onDeleteTable={deleteTable}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <TableCreator onCreateTable={createTable} />
          </div>
        )}
      </main>
    </div>
  )
}
