import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

interface ActivityEntry {
  id: string
  type: 'heartbeat' | 'memory' | 'research' | 'check' | 'update' | 'fix' | 'other'
  title: string
  details?: string
  timestamp: string
  duration?: number
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  heartbeat: { icon: '💓', label: 'Heartbeat', color: 'bg-pink-100 text-pink-700' },
  memory: { icon: '🧠', label: 'Memory', color: 'bg-purple-100 text-purple-700' },
  research: { icon: '🔍', label: 'Research', color: 'bg-blue-100 text-blue-700' },
  check: { icon: '✅', label: 'Check', color: 'bg-green-100 text-green-700' },
  update: { icon: '📝', label: 'Update', color: 'bg-amber-100 text-amber-700' },
  fix: { icon: '🔧', label: 'Fix', color: 'bg-orange-100 text-orange-700' },
  other: { icon: '📌', label: 'Other', color: 'bg-slate-100 text-slate-700' },
}

export const Route = createFileRoute('/activity-log/')({
  component: ActivityLogPage,
})

function ActivityLogPage() {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  const loadActivity = async () => {
    try {
      const params = new URLSearchParams()
      if (filter) params.set('type', filter)
      params.set('limit', '200')
      
      const res = await fetch(`/api/activity-log?${params}`)
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries || [])
        setStats(data.stats || {})
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    loadActivity()
    const interval = setInterval(loadActivity, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [filter])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const groupByDate = (entries: ActivityEntry[]) => {
    const groups: Record<string, ActivityEntry[]> = {}
    entries.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString('en-US', { 
        weekday: 'long', month: 'short', day: 'numeric' 
      })
      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    })
    return groups
  }

  const grouped = groupByDate(entries)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-slate-400 hover:text-slate-600">
                ← Hub
              </Link>
              <h1 className="text-2xl font-bold text-slate-800">📋 Activity Log</h1>
            </div>
            <Link 
              to="/activity" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Kanban →
            </Link>
          </div>
          
          <p className="text-slate-600 mb-4">
            Small tasks, routine checks, and background work. For significant tasks, see{' '}
            <Link to="/activity" className="text-blue-600 hover:underline">Kanban</Link>.
          </p>

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Today:</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                {stats.today || 0} activities
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">Total:</span>
              <span className="text-slate-600">{stats.total || 0}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !filter ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {Object.entries(TYPE_CONFIG).map(([type, config]) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                filter === type ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {config.icon} {config.label}
              {stats.byType?.[type] > 0 && (
                <span className="ml-1 text-xs opacity-70">({stats.byType[type]})</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-slate-500">No activity logged yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, dateEntries]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-slate-500 mb-3 sticky top-20 bg-slate-50 py-1">
                  {date}
                </h2>
                <div className="space-y-2">
                  {dateEntries.map(entry => {
                    const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.other
                    return (
                      <div 
                        key={entry.id}
                        className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{config.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                                {config.label}
                              </span>
                              <span className="text-xs text-slate-400">{formatTime(entry.timestamp)}</span>
                              {entry.duration && (
                                <span className="text-xs text-slate-400">• {entry.duration}m</span>
                              )}
                            </div>
                            <h3 className="font-medium text-slate-800">{entry.title}</h3>
                            {entry.details && (
                              <p className="text-sm text-slate-600 mt-1">{entry.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
