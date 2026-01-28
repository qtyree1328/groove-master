import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/usage/')({
  component: UsagePage,
})

// Cost estimates (Claude pricing)
const COST_PER_1M_INPUT = 3 // $3 per 1M input
const COST_PER_1M_OUTPUT = 15 // $15 per 1M output

interface UsageData {
  totalInput: number
  totalOutput: number
  totalCost: number
  sessions: SessionUsage[]
}

interface SessionUsage {
  key: string
  channel: string
  input: number
  output: number
}

function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | 'all'>('24h')

  useEffect(() => {
    fetch(`/api/usage?range=${timeRange}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setUsage(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [timeRange])

  const formatTokens = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n.toString()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Usage</h1>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">← Hub</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Time Range */}
        <div className="flex gap-2 mb-6">
          {(['1h', '24h', '7d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : usage ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total Tokens</p>
                <p className="text-2xl font-semibold text-white">
                  {formatTokens(usage.totalInput + usage.totalOutput)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTokens(usage.totalInput)} in / {formatTokens(usage.totalOutput)} out
                </p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Est. Cost</p>
                <p className="text-2xl font-semibold text-green-400">
                  ${usage.totalCost.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Based on API pricing</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Sessions</p>
                <p className="text-2xl font-semibold text-blue-400">
                  {usage.sessions.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Active in period</p>
              </div>
            </div>

            {/* Sessions */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">Usage by Session</h2>
              {usage.sessions.length > 0 ? (
                <div className="space-y-2">
                  {usage.sessions.map((s, i) => (
                    <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-300">{s.key}</span>
                        <span className="text-xs text-gray-500">{s.channel}</span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-gray-800">
                        <div className="bg-green-500" style={{ width: `${(s.input / (s.input + s.output)) * 100}%` }} />
                        <div className="bg-orange-500" style={{ width: `${(s.output / (s.input + s.output)) * 100}%` }} />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>In: {formatTokens(s.input)}</span>
                        <span>Out: {formatTokens(s.output)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No usage data for this period</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No usage data available</p>
            <p className="text-sm text-gray-600 mt-2">Usage tracking requires gateway connection</p>
          </div>
        )}
      </main>
    </div>
  )
}
