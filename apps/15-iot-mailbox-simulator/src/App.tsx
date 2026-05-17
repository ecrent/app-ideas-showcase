import { useState, useEffect } from 'react'

interface MailItem {
  id: string
  timestamp: Date
  sender: string
  subject: string
  isRead: boolean
}

export default function App() {
  const [mailItems, setMailItems] = useState<MailItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    setUnreadCount(mailItems.filter(m => !m.isRead).length)
  }, [mailItems])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const addMailItem = () => {
    const senders = ['Amazon', 'GitHub', 'Stripe', 'Google', 'Netflix', 'Apple', 'Microsoft']
    const subjects = [
      'Your order has shipped',
      'Security alert',
      'Payment received',
      'Action required',
      'New message',
      'Account update',
      'Subscription renewal'
    ]

    const newMail: MailItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      sender: senders[Math.floor(Math.random() * senders.length)],
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      isRead: false
    }

    setMailItems([newMail, ...mailItems])
    setNotification(`📬 New mail from ${newMail.sender}`)
  }

  const toggleRead = (id: string) => {
    setMailItems(mailItems.map(m =>
      m.id === id ? { ...m, isRead: !m.isRead } : m
    ))
  }

  const deleteMail = (id: string) => {
    setMailItems(mailItems.filter(m => m.id !== id))
  }

  const clearAll = () => {
    setMailItems([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📬 IOT Mailbox</h1>
              <p className="text-gray-600 text-sm mt-1">Smart mailbox notification simulator</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">{mailItems.length}</div>
              <div className="text-gray-600 text-sm">{unreadCount} unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded animate-pulse">
            {notification}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={addMailItem}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            ➕ Receive Mail
          </button>
          {mailItems.length > 0 && (
            <button
              onClick={clearAll}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Mail List */}
        {mailItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No mail</h2>
            <p className="text-gray-600">Your mailbox is empty. Click "Receive Mail" to simulate incoming mail.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mailItems.map(mail => (
              <div
                key={mail.id}
                className={`bg-white rounded-lg shadow p-4 transition ${
                  mail.isRead ? 'opacity-75' : 'border-l-4 border-indigo-600'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 cursor-pointer" onClick={() => toggleRead(mail.id)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{mail.isRead ? '📭' : '📬'}</span>
                      <h3 className={`font-semibold ${mail.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                        {mail.sender}
                      </h3>
                      {!mail.isRead && (
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${mail.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {mail.subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {mail.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteMail(mail.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
