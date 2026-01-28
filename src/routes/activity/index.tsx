import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

interface TaskSummary {
  description: string
  timestamp: string
  tokens?: { input: number; output: number }
  status: 'completed' | 'running' | 'pending'
}

export const Route = createFileRoute('/activity/')({
  component: ActivityPage,
})

function ActivityPage() {
  const [tasks, setTasks] = useState<TaskSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activity/checkpoint')
      .then(r => r.ok ? r.json() : { tasks: [] })
      .then(data => {
        setTasks(data.tasks || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const running = tasks.filter(t => t.status === 'running')
  const pending = tasks.filter(t => t.status === 'pending')
  const completed = tasks.filter(t => t.status === 'completed')

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Activity</h1>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">← Hub</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-8">
            {/* Currently Running */}
            <section>
              <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Currently Running
              </h2>
              {running.length > 0 ? (
                <div className="space-y-2">
                  {running.map((t, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                      <p className="text-white">{t.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Started {formatTime(t.timestamp)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No active tasks</p>
              )}
            </section>

            {/* Pending */}
            <section>
              <h2 className="text-sm font-medium text-gray-400 mb-3">📋 Up Next ({pending.length})</h2>
              {pending.length > 0 ? (
                <ul className="space-y-2">
                  {pending.map((t, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300 bg-gray-900 border border-gray-800 rounded-lg p-3">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      {t.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">No pending tasks</p>
              )}
            </section>

            {/* Completed */}
            <section>
              <h2 className="text-sm font-medium text-gray-400 mb-3">✓ Completed Today ({completed.length})</h2>
              {completed.length > 0 ? (
                <div className="space-y-2">
                  {completed.map((t, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex justify-between items-start">
                      <div>
                        <p className="text-gray-300">{t.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTime(t.timestamp)}</p>
                      </div>
                      {t.tokens && (
                        <span className="text-xs text-gray-500 font-mono">
                          {((t.tokens.input + t.tokens.output) / 1000).toFixed(1)}K tokens
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No completed tasks yet</p>
              )}
            </section>

            {/* Stats */}
            <section className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-400">{completed.length}</p>
                <p className="text-xs text-gray-500">Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-yellow-400">{pending.length}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-400">{running.length}</p>
                <p className="text-xs text-gray-500">Running</p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
