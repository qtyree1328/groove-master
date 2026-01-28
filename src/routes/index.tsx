import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: Hub,
})

interface Task {
  description: string
  status: 'running' | 'pending' | 'completed'
  timestamp?: string
}

function Hub() {
  const [time, setTime] = useState(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [jobCount, setJobCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Load tasks
    fetch('/api/activity/checkpoint')
      .then(r => r.ok ? r.json() : { tasks: [] })
      .then(data => setTasks(data.tasks || []))
      .catch(() => {})
    
    // Load job count
    fetch('/api/jobs/queue')
      .then(r => r.ok ? r.json() : { jobs: [] })
      .then(data => setJobCount(data.jobs?.filter((j: any) => j.status === 'pending')?.length || 0))
      .catch(() => {})
  }, [])

  const running = tasks.filter(t => t.status === 'running')
  const pending = tasks.filter(t => t.status === 'pending')

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐙</span>
            <div>
              <h1 className="text-lg font-semibold text-white">Command Center</h1>
              <p className="text-xs text-gray-500">Your AI assistant hub</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono text-white">{time.toLocaleTimeString()}</div>
            <div className="text-xs text-gray-500">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Current Task */}
        {running.length > 0 && (
          <div className="mb-8 p-4 bg-green-950/30 border border-green-900/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-400 font-medium">Currently Working On</span>
            </div>
            <p className="text-white">{running[0].description}</p>
          </div>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ToolCard 
            to="/jobs" 
            emoji="🎯" 
            name="Job Hunter" 
            desc="Applications & matches"
            badge={jobCount > 0 ? jobCount.toString() : undefined}
          />
          <ToolCard 
            to="/activity" 
            emoji="📊" 
            name="Activity" 
            desc="Tasks & progress"
          />
          <ToolCard 
            to="/usage" 
            emoji="📈" 
            name="Usage" 
            desc="Tokens & costs"
          />
          <ToolCard 
            to="/projects" 
            emoji="💡" 
            name="Projects" 
            desc="Ideas & plans"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Queue */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Task Queue ({pending.length})</h2>
            {pending.length > 0 ? (
              <ul className="space-y-2">
                {pending.slice(0, 8).map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 shrink-0"></span>
                    <span className="text-gray-300">{t.description}</span>
                  </li>
                ))}
                {pending.length > 8 && (
                  <li className="text-xs text-gray-500 pl-4">+{pending.length - 8} more</li>
                )}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">No pending tasks</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-sm font-medium text-gray-400 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <QuickLink href="http://localhost:18789" emoji="🦞" name="Clawdbot Dashboard" />
              <QuickLink to="/crabwalk" emoji="🦀" name="Crabwalk" />
              <QuickLink to="/monitor" emoji="🔌" name="Monitor" />
              <QuickLink href="https://docs.clawd.bot" emoji="📚" name="Documentation" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Online</span>
          </div>
          <span>•</span>
          <span>Next job scan: 11 PM</span>
        </div>
      </main>
    </div>
  )
}

function ToolCard({ to, emoji, name, desc, badge }: { 
  to: string; emoji: string; name: string; desc: string; badge?: string 
}) {
  return (
    <Link
      to={to}
      className="relative bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:bg-gray-900/80 transition"
    >
      <span className="text-2xl mb-2 block">{emoji}</span>
      <h3 className="font-medium text-white text-sm">{name}</h3>
      <p className="text-xs text-gray-500">{desc}</p>
      {badge && (
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}

function QuickLink({ to, href, emoji, name }: { to?: string; href?: string; emoji: string; name: string }) {
  const className = "flex items-center gap-3 text-sm text-gray-300 hover:text-white transition"
  
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span>{emoji}</span>
        <span>{name}</span>
        <span className="text-gray-600 text-xs">↗</span>
      </a>
    )
  }
  
  return (
    <Link to={to!} className={className}>
      <span>{emoji}</span>
      <span>{name}</span>
    </Link>
  )
}
