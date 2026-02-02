import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

interface ChatMessage {
  id: string
  author: 'user' | 'ai'
  content: string
  timestamp: string
}

interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  category: string
  status: 'idea' | 'development' | 'built' | 'rejected'
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  updatedAt?: string
  addedBy: 'user' | 'ai'
  overview?: string
  chat?: ChatMessage[]
  previewUrl?: string
  hubIcon?: string
  hubDescription?: string
  builtAt?: string
  repoUrl?: string
  liveUrl?: string
}

export const Route = createFileRoute('/published/')({
  component: PublishedPage,
})

function PublishedPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [chatMessage, setChatMessage] = useState('')

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?status=published')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
        if (!selectedProject && data.projects?.length > 0) {
          setSelectedProject(data.projects[0])
        }
      }
    } catch {}
    setLoading(false)
  }, [selectedProject])

  useEffect(() => {
    loadProjects()
  }, [])

  const sendChatMessage = async () => {
    if (!selectedProject || !chatMessage.trim()) return
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'add-chat', 
        projectId: selectedProject.id, 
        content: chatMessage, 
        author: 'user' 
      })
    })
    if (res.ok) {
      const data = await res.json()
      if (data.project) {
        setSelectedProject(data.project)
        setProjects(prev => prev.map(p => p.id === data.project.id ? data.project : p))
      }
      setChatMessage('')
    }
  }

  const categoryColor = (cat: string) => ({
    'Remote Sensing': 'bg-blue-100 text-blue-700',
    'Conservation': 'bg-green-100 text-green-700',
    'Web App': 'bg-purple-100 text-purple-700',
    'Data Viz': 'bg-pink-100 text-pink-700',
    'ML/AI': 'bg-indigo-100 text-indigo-700',
    'Portfolio': 'bg-emerald-100 text-emerald-700',
  }[cat] || 'bg-slate-100 text-slate-600')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-slate-600">←</Link>
            <span className="text-2xl">🚀</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Published Projects</h1>
              <p className="text-xs text-slate-500">
                {projects.length} live project{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/builds"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
            >
              🔨 Builds
            </Link>
            <Link
              to="/projects"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
            >
              💡 Ideas
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading published projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <span className="text-5xl mb-4 block">🚀</span>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Published Projects Yet</h2>
            <p className="text-slate-500 mb-4">Projects will appear here after you publish them from Builds</p>
            <Link
              to="/builds"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              🔨 Go to Builds
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="text-sm font-medium text-slate-500 mb-3">LIVE PROJECTS</h2>
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-4 rounded-xl cursor-pointer border transition ${
                    selectedProject?.id === project.id 
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-100' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{project.hubIcon || '🚀'}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900 text-sm">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{project.hubDescription || project.description}</p>
                    </div>
                  </div>
                  {project.chat && project.chat.length > 0 && (
                    <div className="mt-2 text-xs text-slate-400">
                      💬 {project.chat.length} message{project.chat.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Project Detail */}
            <div className="lg:col-span-2">
              {selectedProject ? (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{selectedProject.hubIcon || '🚀'}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
                          <p className="text-slate-600 mt-1">{selectedProject.hubDescription || selectedProject.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(selectedProject.category)}`}>
                              {selectedProject.category}
                            </span>
                            {selectedProject.builtAt && (
                              <span className="text-xs text-slate-400">
                                Published {new Date(selectedProject.builtAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {(selectedProject.previewUrl || selectedProject.liveUrl) && (
                        <a
                          href={selectedProject.liveUrl || selectedProject.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shrink-0"
                        >
                          🔗 Open Project
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {selectedProject.tech && selectedProject.tech.length > 0 && (
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tech.map((t, i) => (
                          <span key={i} className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Discussion */}
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-4">💬 Discussion & Issues</h3>
                    
                    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                      {/* Messages */}
                      <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                        {selectedProject.chat && selectedProject.chat.length > 0 ? (
                          selectedProject.chat.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                  msg.author === 'user'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-200 text-slate-700'
                                }`}
                              >
                                {msg.author === 'ai' && (
                                  <p className="text-xs font-medium text-emerald-600 mb-1">🤖 Clawd</p>
                                )}
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className={`text-xs mt-2 ${msg.author === 'user' ? 'text-emerald-200' : 'text-slate-400'}`}>
                                  {new Date(msg.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <span className="text-3xl mb-2 block">💬</span>
                            <p className="text-slate-500 text-sm">No discussions yet</p>
                            <p className="text-slate-400 text-xs mt-1">Report bugs, request changes, or discuss improvements</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Input */}
                      <div className="border-t border-slate-200 p-3 flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={e => setChatMessage(e.target.value)}
                          placeholder="Report an issue, suggest a change..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                        />
                        <button
                          onClick={sendChatMessage}
                          disabled={!chatMessage.trim()}
                          className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-emerald-700 transition"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                  <span className="text-4xl mb-3 block">👈</span>
                  <p className="text-slate-400">Select a project to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
