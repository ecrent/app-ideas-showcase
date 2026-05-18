import { useState, useEffect } from 'react'

interface MailItem {
  id: string
  timestamp: Date
  sender: string
  subject: string
  isRead: boolean
  category: 'work' | 'personal' | 'promotional' | 'other'
}

type FilterType = 'all' | 'unread' | 'read'

export default function App() {
  const [mailItems, setMailItems] = useState<MailItem[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<FilterType>('all')

  useEffect(() => {
    const saved = localStorage.getItem('mailItems')
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: MailItem) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
        setMailItems(parsed)
      } catch {
        setMailItems([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('mailItems', JSON.stringify(mailItems))
    setUnreadCount(mailItems.filter(m => !m.isRead).length)
  }, [mailItems])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const addMailItem = () => {
    const senders = ['Amazon', 'GitHub', 'Stripe', 'Google', 'Netflix', 'Apple', 'Microsoft', 'LinkedIn']
    const subjects = [
      'Your order has shipped',
      'Security alert',
      'Payment received',
      'Action required',
      'New message',
      'Account update',
      'Subscription renewal',
      'Invoice attached'
    ]
    const categories: Array<'work' | 'personal' | 'promotional' | 'other'> = ['work', 'personal', 'promotional', 'other']

    const randomSender = senders[Math.floor(Math.random() * senders.length)]
    let category: 'work' | 'personal' | 'promotional' | 'other'

    if (['GitHub', 'LinkedIn', 'Stripe'].includes(randomSender)) {
      category = 'work'
    } else if (['Netflix', 'Apple'].includes(randomSender)) {
      category = 'personal'
    } else if (['Amazon', 'Google'].includes(randomSender)) {
      category = 'promotional'
    } else {
      category = 'other'
    }

    const newMail: MailItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      sender: randomSender,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      isRead: false,
      category
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

  const filteredMails = mailItems.filter(mail => {
    if (filter === 'unread') return !mail.isRead
    if (filter === 'read') return mail.isRead
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-indigo-500/20 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                📬 IOT Mailbox
              </h1>
              <p className="text-indigo-200/70 text-sm mt-2">Smart mailbox notification simulator</p>
            </div>
            <div className="text-right bg-indigo-600/20 backdrop-blur border border-indigo-500/30 rounded-xl p-4">
              <div className="text-5xl font-bold text-indigo-300">{mailItems.length}</div>
              <div className="text-indigo-200/70 text-sm mt-1">{unreadCount} unread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in animate-pulse">
            {notification}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={addMailItem}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            ➕ Receive Mail
          </button>
          {mailItems.length > 0 && (
            <button
              onClick={clearAll}
              className="bg-red-600/80 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              🗑️ Clear All
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {mailItems.length > 0 && (
          <div className="flex gap-2 mb-6 pb-6 border-b border-indigo-500/20">
            {(['all', 'unread', 'read'] as FilterType[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-indigo-600/20 text-indigo-200 hover:bg-indigo-600/30 border border-indigo-500/30'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Mail List */}
        {mailItems.length === 0 ? (
          <div className="bg-gradient-to-b from-indigo-600/20 to-purple-600/20 backdrop-blur border border-indigo-500/30 rounded-xl shadow-xl p-16 text-center">
            <div className="text-7xl mb-4">📭</div>
            <h2 className="text-3xl font-bold text-indigo-200 mb-2">No mail yet</h2>
            <p className="text-indigo-300/70">Your mailbox is empty. Click "Receive Mail" to simulate incoming mail.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMails.map(mail => {
              const categoryColors = {
                work: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                personal: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                promotional: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                other: 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
              }
              return (
                <div
                  key={mail.id}
                  className={`bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur border transition duration-200 rounded-lg p-4 hover:shadow-lg ${
                    mail.isRead
                      ? 'border-indigo-500/20 opacity-70'
                      : 'border-l-2 border-indigo-500/60 border-indigo-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 cursor-pointer hover:opacity-80 transition" onClick={() => toggleRead(mail.id)}>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-2xl">{mail.isRead ? '📭' : '📬'}</span>
                        <h3 className={`font-semibold ${mail.isRead ? 'text-indigo-300/70' : 'text-indigo-200'}`}>
                          {mail.sender}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${categoryColors[mail.category]}`}>
                          {mail.category}
                        </span>
                        {!mail.isRead && (
                          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${mail.isRead ? 'text-indigo-300/60' : 'text-indigo-200/80'}`}>
                        {mail.subject}
                      </p>
                      <p className="text-xs text-indigo-300/50 mt-2">
                        {mail.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMail(mail.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded transition duration-200 flex-shrink-0"
                      title="Delete mail"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
