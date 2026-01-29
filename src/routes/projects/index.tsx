import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

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
  rejectReason?: string
}

export const Route = createFileRoute('/projects/')({
  component: IdeasPage,
})

const categoryOptions = ['Remote Sensing', 'Conservation', 'Web App', 'Data Viz', 'ML/AI', 'Workflow', 'Tool', 'Other']

function IdeasPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showRejected, setShowRejected] = useState(false)
  
  // Form states
  const [newIdea, setNewIdea] = useState({ name: '', description: '', category: 'Other', priority: 'medium' as const })
  const [approvalComment, setApprovalComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        const data = await res.json()
        setProjects(data.projects || [])
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const apiAction = async (action: string, projectId?: string, payload?: any) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, projectId, ...payload })
    })
    if (res.ok) {
      await loadProjects()
      return await res.json()
    }
  }

  const addIdea = async () => {
    if (!newIdea.name.trim()) return
    await apiAction('add-idea', undefined, { ...newIdea, addedBy: 'user' })
    setNewIdea({ name: '', description: '', category: 'Other', priority: 'medium' })
    setShowAddModal(false)
  }

  const approveIdea = async () => {
    if (!selectedProject) return
    await apiAction('approve', selectedProject.id, { comment: approvalComment })
    setApprovalComment('')
    setShowApproveModal(false)
    setSelectedProject(null)
  }

  const rejectIdea = async () => {
    if (!selectedProject) return
    await apiAction('reject', selectedProject.id, { rejectReason })
    setRejectReason('')
    setShowRejectModal(false)
    setSelectedProject(null)
  }

  const ideas = projects.filter(p => p.status === 'idea')
  const rejected = projects.filter(p => p.status === 'rejected')
  const inDevelopment = projects.filter(p => p.status === 'development').length
  const displayedIdeas = showRejected ? rejected : ideas

  const priorityColor = (p: string) => ({
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-600 border-slate-200',
  }[p] || 'bg-slate-100 text-slate-600 border-slate-200')

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
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-slate-400 hover:text-slate-600">←</Link>
            <span className="text-2xl">💡</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Project Ideas</h1>
              <p className="text-xs text-slate-500">
                {ideas.length} idea{ideas.length !== 1 ? 's' : ''} · {inDevelopment} in builds · {rejected.length} rejected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/builds"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition"
            >
              🔨 Active Builds ({inDevelopment})
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              + Add Idea
            </button>
          </div>
        </div>
      </header>

      {/* Toggle */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setShowRejected(false); setSelectedProject(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              !showRejected ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            💡 Ideas ({ideas.length})
          </button>
          <button
            onClick={() => { setShowRejected(true); setSelectedProject(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              showRejected ? 'bg-white border border-slate-200 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🗑️ Rejected ({rejected.length})
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading ideas...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ideas List */}
            <div className="space-y-3">
              {displayedIdeas.map(project => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`p-5 rounded-xl cursor-pointer border transition ${
                    selectedProject?.id === project.id 
                      ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-100' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(project.category)}`}>
                          {project.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor(project.priority)}`}>
                          {project.priority}
                        </span>
                        {project.addedBy === 'ai' && (
                          <span className="text-xs text-purple-500">🤖 AI</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {project.status === 'rejected' && project.rejectReason && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-red-600">
                        <strong>Rejected:</strong> {project.rejectReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {displayedIdeas.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <span className="text-4xl mb-3 block">{showRejected ? '🗑️' : '💡'}</span>
                  <p className="text-slate-500">
                    {showRejected ? 'No rejected ideas' : 'No ideas yet. Add one!'}
                  </p>
                </div>
              )}
            </div>

            {/* Selected Idea Detail */}
            <div>
              {selectedProject ? (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden sticky top-24">
                  <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white">
                    <h2 className="text-xl font-bold text-slate-900">{selectedProject.name}</h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColor(selectedProject.category)}`}>
                        {selectedProject.category}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor(selectedProject.priority)}`}>
                        {selectedProject.priority} priority
                      </span>
                      {selectedProject.addedBy === 'ai' && (
                        <span className="text-xs text-purple-500">🤖 AI suggested</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                    <p className="text-slate-600 leading-relaxed">{selectedProject.description}</p>

                    {selectedProject.tech && selectedProject.tech.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tech.map((t, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProject.status === 'rejected' && selectedProject.rejectReason && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <h3 className="text-sm font-medium text-red-700 mb-1">Rejection Reason</h3>
                        <p className="text-sm text-red-600">{selectedProject.rejectReason}</p>
                      </div>
                    )}
                  </div>

                  {selectedProject.status === 'idea' && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                      <button
                        onClick={() => setShowApproveModal(true)}
                        className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition"
                      >
                        ✓ Approve → Build
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-medium transition"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center sticky top-24">
                  <span className="text-4xl mb-3 block">👈</span>
                  <p className="text-slate-400">Select an idea to review</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">💡 Add New Idea</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Name</label>
                <input
                  type="text"
                  value={newIdea.name}
                  onChange={e => setNewIdea({ ...newIdea, name: e.target.value })}
                  placeholder="Project name..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newIdea.description}
                  onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                  placeholder="What does this project do? Why build it?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm h-24"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Category</label>
                  <select
                    value={newIdea.category}
                    onChange={e => setNewIdea({ ...newIdea, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newIdea.priority}
                    onChange={e => setNewIdea({ ...newIdea, priority: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={addIdea} disabled={!newIdea.name.trim()} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm disabled:opacity-50">
                Add Idea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedProject && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">✓ Approve & Start Building</h3>
            <p className="text-sm text-slate-500 mb-4">
              <strong>{selectedProject.name}</strong> will move to Active Builds.
            </p>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Comment (optional)</label>
              <textarea
                value={approvalComment}
                onChange={e => setApprovalComment(e.target.value)}
                placeholder="Initial thoughts, scope notes, why this is worth building..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm h-24"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowApproveModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={approveIdea} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                ✓ Approve & Build
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProject && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">✗ Reject Idea</h3>
            <p className="text-sm text-slate-500 mb-4">
              Why is <strong>{selectedProject.name}</strong> not worth pursuing?
            </p>
            
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Reason</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Out of scope, already exists, not feasible, low impact..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm h-24"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">
                Cancel
              </button>
              <button onClick={rejectIdea} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm">
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
