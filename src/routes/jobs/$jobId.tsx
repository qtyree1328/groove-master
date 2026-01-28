import { createFileRoute, Link, useParams } from '@tanstack/react-router'
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

export const Route = createFileRoute('/jobs/$jobId')({
  component: JobApplicationPage,
})

function JobApplicationPage() {
  const { jobId } = useParams({ from: '/jobs/$jobId' })
  const [job, setJob] = useState<Job | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editRequest, setEditRequest] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs/queue').then(r => r.ok ? r.json() : { jobs: [] }),
      fetch(`/api/jobs/cover-letter?id=${jobId}`).then(r => r.ok ? r.json() : { content: '' })
    ]).then(([jobsData, letterData]) => {
      const foundJob = jobsData.jobs?.find((j: Job) => j.id === jobId)
      setJob(foundJob || null)
      setCoverLetter(letterData.content || '')
      setLoading(false)
    })
  }, [jobId])

  const saveCoverLetter = async () => {
    setSaving(true)
    await fetch('/api/jobs/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jobId, content: coverLetter })
    })
    setSaving(false)
  }

  const requestEdit = async () => {
    if (!editRequest.trim()) return
    // This would integrate with Clawdbot to request edits
    // For now, show a message
    alert(`Edit request sent: "${editRequest}"\n\nIn the full implementation, this will call Clawdbot to regenerate the cover letter.`)
    setEditRequest('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Job not found</p>
          <Link to="/jobs" className="text-blue-400 hover:text-blue-300">← Back to Jobs</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/jobs" className="text-gray-400 hover:text-white">← Jobs</Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">{job.title}</h1>
            <p className="text-sm text-blue-400">{job.company}</p>
          </div>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
          >
            View Posting →
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Match Score</h3>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold text-white ${
                  job.matchScore >= 8 ? 'bg-green-600' :
                  job.matchScore >= 6 ? 'bg-yellow-600' : 'bg-gray-600'
                }`}>
                  {job.matchScore}
                </div>
                <span className="text-sm text-gray-400">/10</span>
              </div>
            </div>

            {job.matchReasons && job.matchReasons.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Match Reasons</h3>
                <ul className="space-y-1">
                  {job.matchReasons.map((r, i) => (
                    <li key={i} className="text-sm text-green-400 flex items-center gap-2">
                      <span>✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.description && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                <p className="text-sm text-gray-300">{job.description}</p>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Posting URL</h3>
              <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 break-all">
                {job.url}
              </a>
            </div>
          </div>

          {/* Cover Letter Editor */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-medium text-white">Cover Letter</h3>
                <button
                  onClick={saveCoverLetter}
                  disabled={saving}
                  className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm rounded"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
              
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                className="w-full h-96 bg-gray-950 text-gray-200 p-4 text-sm font-sans leading-relaxed resize-none focus:outline-none"
                placeholder="Cover letter content..."
              />
              
              {/* Edit Request */}
              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <label className="text-sm text-gray-400 block mb-2">Request AI Edit</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editRequest}
                    onChange={e => setEditRequest(e.target.value)}
                    placeholder="e.g. Make it more technical, add thesis work..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
                  />
                  <button
                    onClick={requestEdit}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded"
                  >
                    Apply Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
