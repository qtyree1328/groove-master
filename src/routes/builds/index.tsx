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
  goals?: string[]
  plan?: string
  documentation?: string
  workshopNotes?: string[]
  chat?: ChatMessage[]
  buildPath?: string
  previewUrl?: string
  hubIcon?: string
  hubDescription?: string
  builtAt?: string
}

export const Route = createFileRoute('/builds/')({
  component: BuildsPage,
})

function BuildsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [activeSection, setActiveSection] = useState<'overview' | 'plan' | 'docs' | 'chat'>('overview')
  
  // Form states
  const [chatMessage, setChatMessage] = useState('')
  const [workshopNote, setWorkshopNote] = useState('')
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishConfig, setPublishConfig] = useState({ hubIcon: '🚀', hubDescription: '', previewUrl: '' })

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects?status=development')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
        // Auto-select first if none selected
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

  const apiAction = async (action: string, projectId?: string, payload?: any) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, projectId, ...payload })
    })
    if (res.ok) {
      await loadProjects()
      const data = await res.json()
      if (data.project && selectedProject?.id === projectId) {
        setSelectedProject(data.project)
      }
      return data
    }
  }

  const updateField = async (field: string, value: any) => {
    if (!selectedProject) return
    await apiAction('update-development', selectedProject.id, { [field]: value })
  }

  const addWorkshopNote = async () => {
    if (!selectedProject || !workshopNote.trim()) return
    await apiAction('add-note', selectedProject.id, { note: workshopNote })
    setWorkshopNote('')
  }

  const sendChatMessage = async () => {
    if (!selectedProject || !chatMessage.trim()) return
    await apiAction('add-chat', selectedProject.id, { content: chatMessage, author: 'user' })
    setChatMessage('')
  }

  const publishProject = async () => {
    if (!selectedProject) return
    await apiAction('build', selectedProject.id, publishConfig)
    setShowPublishModal(false)
    setSelectedProject(null)
  }

  const priorityColor = (p: string) => ({
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-slate-100 text-slate-600',
  }[p] || 'bg-slate-100 text-slate-600')

  const categoryColor = (cat: string) => ({
    'Remote Sensing': 'bg-blue-100 text-blue-700',
    'Conservation': 'bg-green-100 text-green-700',
    'Web App': 'bg-purple-100 text-purple-700',
    'Data Viz': 'bg-pink-100 text-pink-700',
    'ML/AI': 'bg-indigo-100 text-indigo-700',
    'Workflow': 'bg-cyan-100 text-cyan-700',
    'Tool': 'bg-orange-100 text-orange-700',
  }[cat] || 'bg-slate-100 text-slate-600')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-slate-600">←</Link>
            <span className="text-2xl">🔨</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Active Builds</h1>
              <p className="text-xs text-slate-500">
                {projects.length} project{projects.length !== 1 ? 's' : ''} in development
              </p>
            </div>
          </div>
          <Link
            to="/projects"
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
          >
            💡 View Ideas
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading builds...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <span className="text-5xl mb-4 block">🔨</span>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Active Builds</h2>
            <p className="text-slate-500 mb-4">Approve ideas from the Projects page to start building</p>
            <Link
              to="/projects"
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              💡 Browse Ideas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Project List */}
            <div className="lg:col-span-1 space-y-2">
              <h2 className="text-sm font-medium text-slate-500 mb-3">PROJECTS</h2>
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-4 rounded-xl cursor-pointer border transition ${
                    selectedProject?.id === project.id 
                      ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-100' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <h3 className="font-medium text-slate-900 text-sm">{project.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                    {project.chat && project.chat.length > 0 && (
                      <span className="text-xs text-slate-400">💬 {project.chat.length}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Detail */}
            <div className="lg:col-span-3">
              {selectedProject ? (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
                        <p className="text-slate-600 mt-1">{selectedProject.description}</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(selectedProject.category)}`}>
                            {selectedProject.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor(selectedProject.priority)}`}>
                            {selectedProject.priority} priority
                          </span>
                          {selectedProject.tech?.map((t, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setPublishConfig({
                            hubIcon: '🚀',
                            hubDescription: selectedProject.description,
                            previewUrl: selectedProject.previewUrl || ''
                          })
                          setShowPublishModal(true)
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shrink-0"
                      >
                        🚀 Publish
                      </button>
                    </div>
                  </div>

                  {/* Section Tabs */}
                  <div className="border-b border-slate-200 px-6">
                    <nav className="flex gap-1 -mb-px">
                      {[
                        { id: 'overview' as const, label: '📋 Overview' },
                        { id: 'plan' as const, label: '📝 Plan' },
                        { id: 'docs' as const, label: '📚 Docs' },
                        { id: 'chat' as const, label: `💬 Chat ${selectedProject.chat?.length ? `(${selectedProject.chat.length})` : ''}` },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSection(tab.id)}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                            activeSection === tab.id
                              ? 'border-purple-600 text-purple-600'
                              : 'border-transparent text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {activeSection === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-2">Overview</label>
                          <textarea
                            value={selectedProject.overview || ''}
                            onChange={e => updateField('overview', e.target.value)}
                            placeholder="High-level overview of what this project does, why it matters..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm min-h-[120px] focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-2">Goals</label>
                          <textarea
                            value={(selectedProject.goals || []).join('\n')}
                            onChange={e => updateField('goals', e.target.value.split('\n').filter(g => g.trim()))}
                            placeholder="One goal per line..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm min-h-[100px] focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                          />
                        </div>
                      </div>
                    )}

                    {activeSection === 'plan' && (
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-2">Implementation Plan</label>
                          <textarea
                            value={selectedProject.plan || ''}
                            onChange={e => updateField('plan', e.target.value)}
                            placeholder="## Phase 1\n- [ ] Task 1\n- [ ] Task 2\n\n## Phase 2\n..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm min-h-[300px] font-mono focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-2">Workshop Notes</label>
                          {selectedProject.workshopNotes && selectedProject.workshopNotes.length > 0 && (
                            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                              {selectedProject.workshopNotes.map((note, i) => (
                                <div key={i} className="text-sm text-slate-600 bg-amber-50 border border-amber-100 p-3 rounded-lg">
                                  {note}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={workshopNote}
                              onChange={e => setWorkshopNote(e.target.value)}
                              placeholder="Add a quick note..."
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                              onKeyDown={e => e.key === 'Enter' && addWorkshopNote()}
                            />
                            <button onClick={addWorkshopNote} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition">
                              + Note
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === 'docs' && (
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">Technical Documentation</label>
                        <textarea
                          value={selectedProject.documentation || ''}
                          onChange={e => updateField('documentation', e.target.value)}
                          placeholder="## Architecture\n\n## API\n\n## Data Flow\n..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm min-h-[400px] font-mono focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                        />
                      </div>
                    )}

                    {activeSection === 'chat' && (
                      <div className="flex flex-col h-[500px]">
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          {selectedProject.chat && selectedProject.chat.length > 0 ? (
                            selectedProject.chat.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    msg.author === 'user'
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-white border border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {msg.author === 'ai' && (
                                    <p className="text-xs font-medium text-purple-600 mb-1">🤖 Clawd</p>
                                  )}
                                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                  <p className={`text-xs mt-2 ${msg.author === 'user' ? 'text-purple-200' : 'text-slate-400'}`}>
                                    {new Date(msg.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <span className="text-4xl mb-3 block">💬</span>
                              <p className="text-slate-500">Start a discussion about this project</p>
                              <p className="text-sm text-slate-400 mt-1">Ask questions, brainstorm, plan together</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={e => setChatMessage(e.target.value)}
                            placeholder="Ask a question, add context, brainstorm..."
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                            onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                          />
                          <button
                            onClick={sendChatMessage}
                            disabled={!chatMessage.trim()}
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-purple-700 transition"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                  <span className="text-4xl mb-3 block">👈</span>
                  <p className="text-slate-500">Select a project to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Publish Modal */}
      {showPublishModal && selectedProject && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">🚀 Publish Project</h3>
            <p className="text-sm text-slate-500 mb-4">
              <strong>{selectedProject.name}</strong> will be marked as built and can be added to the Hub.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Icon</label>
                <input
                  type="text"
                  value={publishConfig.hubIcon}
                  onChange={e => setPublishConfig({ ...publishConfig, hubIcon: e.target.value })}
                  placeholder="🚀"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <input
                  type="text"
                  value={publishConfig.hubDescription}
                  onChange={e => setPublishConfig({ ...publishConfig, hubDescription: e.target.value })}
                  placeholder="Short description"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">URL (optional)</label>
                <input
                  type="text"
                  value={publishConfig.previewUrl}
                  onChange={e => setPublishConfig({ ...publishConfig, previewUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={publishProject} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                🚀 Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
