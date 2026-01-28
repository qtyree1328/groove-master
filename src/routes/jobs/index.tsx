import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

interface Job {
  id: string
  company: string
  title: string
  url: string
  description?: string
  matchScore: number
  matchReasons?: string[]
  tone?: string
  discovered: string
  status: 'pending' | 'applied' | 'rejected'
}

interface Company {
  id: string
  name: string
  ranking: number
  sector: string
  jobPortal: string
}

export const Route = createFileRoute('/jobs/')({
  component: JobsPage,
})

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'queue' | 'companies'>('queue')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState<string | null>(null)
  const [showAddCompany, setShowAddCompany] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', portal: '', sector: '', ranking: 7 })

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs/queue').then(r => r.ok ? r.json() : { jobs: [] }),
      fetch('/api/jobs/companies').then(r => r.ok ? r.json() : { companies: [] })
    ]).then(([jobsData, companiesData]) => {
      setJobs(jobsData.jobs || [])
      setCompanies(companiesData.companies || [])
      setLoading(false)
    })
  }, [])

  const loadCoverLetter = async (jobId: string) => {
    const res = await fetch(`/api/jobs/cover-letter?id=${jobId}`)
    if (res.ok) {
      const data = await res.json()
      setCoverLetter(data.content)
    }
  }

  const selectJob = (job: Job) => {
    setSelectedJob(job)
    loadCoverLetter(job.id)
  }

  const addCompany = async () => {
    if (!newCompany.name || !newCompany.portal) return
    
    const company: Company = {
      id: newCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: newCompany.name,
      ranking: newCompany.ranking,
      sector: newCompany.sector,
      jobPortal: newCompany.portal
    }
    
    const updated = [...companies, company]
    setCompanies(updated)
    
    await fetch('/api/jobs/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: updated })
    })
    
    setNewCompany({ name: '', portal: '', sector: '', ranking: 7 })
    setShowAddCompany(false)
  }

  const pendingJobs = jobs.filter(j => j.status === 'pending').sort((a, b) => b.matchScore - a.matchScore)

  const scoreColor = (s: number) => {
    if (s >= 8) return 'bg-green-500'
    if (s >= 6) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white">←</Link>
            <h1 className="text-xl font-semibold">Job Hunter</h1>
            <span className="text-xs text-gray-500">{pendingJobs.length} pending</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('queue')}
              className={`px-3 py-1.5 text-sm rounded ${view === 'queue' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              Queue
            </button>
            <button
              onClick={() => setView('companies')}
              className={`px-3 py-1.5 text-sm rounded ${view === 'companies' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              Companies ({companies.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : view === 'queue' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job List */}
            <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto">
              {pendingJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => selectJob(job)}
                  className={`p-3 rounded-lg cursor-pointer border transition ${
                    selectedJob?.id === job.id 
                      ? 'bg-gray-800 border-blue-500' 
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-white text-sm truncate">{job.title}</h3>
                      <p className="text-xs text-gray-500 truncate">{job.company}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full ${scoreColor(job.matchScore)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                      {job.matchScore}
                    </div>
                  </div>
                </div>
              ))}
              {pendingJobs.length === 0 && (
                <p className="text-gray-500 text-sm py-8 text-center">No pending jobs</p>
              )}
            </div>

            {/* Job Detail */}
            <div className="lg:col-span-2">
              {selectedJob ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                  {/* Job Header */}
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-white">{selectedJob.title}</h2>
                        <p className="text-blue-400">{selectedJob.company}</p>
                        <p className="text-xs text-gray-500 mt-1">Discovered {selectedJob.discovered}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg ${scoreColor(selectedJob.matchScore)} flex items-center justify-center text-lg font-bold text-white`}>
                        {selectedJob.matchScore}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-3 mt-4">
                      <a
                        href={selectedJob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-medium"
                      >
                        View Posting →
                      </a>
                      <Link
                        to={`/jobs/${selectedJob.id}`}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-medium"
                      >
                        Edit Application
                      </Link>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {selectedJob.matchReasons && selectedJob.matchReasons.length > 0 && (
                    <div className="p-6 border-b border-gray-800">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Why This Matches</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.matchReasons.map((r, i) => (
                          <span key={i} className="text-xs bg-green-900/30 border border-green-800 text-green-400 px-2 py-1 rounded">
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedJob.description && (
                    <div className="p-6 border-b border-gray-800">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                      <p className="text-sm text-gray-300">{selectedJob.description}</p>
                    </div>
                  )}

                  {/* Cover Letter */}
                  <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Cover Letter Draft</h3>
                    {coverLetter ? (
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-gray-950 p-4 rounded border border-gray-800 max-h-80 overflow-y-auto">
                        {coverLetter}
                      </pre>
                    ) : (
                      <p className="text-sm text-gray-500">Loading cover letter...</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                  <p className="text-gray-500">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Companies View */
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{companies.length} companies tracked</p>
              <button
                onClick={() => setShowAddCompany(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
              >
                + Add Company
              </button>
            </div>

            {/* Add Company Modal */}
            {showAddCompany && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-medium text-white mb-4">Add Company</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={newCompany.name}
                        onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="e.g. Pachama"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Careers Page URL *</label>
                      <input
                        type="text"
                        value={newCompany.portal}
                        onChange={e => setNewCompany({ ...newCompany, portal: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="https://company.com/careers"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Sector</label>
                      <input
                        type="text"
                        value={newCompany.sector}
                        onChange={e => setNewCompany({ ...newCompany, sector: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                        placeholder="e.g. Conservation Tech"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Priority (1-10)</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={newCompany.ranking}
                        onChange={e => setNewCompany({ ...newCompany, ranking: parseInt(e.target.value) })}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">{newCompany.ranking}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowAddCompany(false)}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addCompany}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Add Company
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Companies List */}
            <div className="space-y-2">
              {companies.sort((a, b) => b.ranking - a.ranking).map(c => (
                <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                      c.ranking >= 8 ? 'bg-green-900 text-green-400' :
                      c.ranking >= 5 ? 'bg-yellow-900 text-yellow-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {c.ranking}
                    </span>
                    <div>
                      <h3 className="font-medium text-white text-sm">{c.name}</h3>
                      <p className="text-xs text-gray-500">{c.sector}</p>
                    </div>
                  </div>
                  {c.jobPortal && (
                    <a
                      href={c.jobPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Careers →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
