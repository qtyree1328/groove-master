import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

interface Project {
  name: string
  description: string
  tech: string[]
  priority: 'high' | 'medium' | 'low'
  status: 'idea' | 'planned' | 'in-progress' | 'done'
}

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(r => r.ok ? r.json() : { projects: [] })
      .then(data => {
        setProjects(data.projects || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const priorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Project Ideas</h1>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">← Hub</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((p, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-white">{p.name}</h3>
                  <span className={`text-xs ${priorityColor(p.priority)}`}>{p.priority}</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{p.description}</p>
                {p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {p.tech.map((t, j) => (
                      <span key={j} className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-400">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No projects loaded</p>
            <p className="text-sm text-gray-600">Project ideas are in ~/clawd/projects/project-ideas.md</p>
          </div>
        )}
      </main>
    </div>
  )
}
