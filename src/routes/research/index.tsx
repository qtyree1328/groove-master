import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

interface ResearchDoc {
  id: string
  title: string
  type: 'document' | 'data' | 'source' | 'finding' | 'benchmark' | 'notes'
  category: string
  content: string
  source?: string
  url?: string
  linkedBuild?: string // project ID if linked to a build
  addedAt: string
  updatedAt?: string
  addedBy: 'user' | 'ai'
}

interface ResearchData {
  version: number
  documents: ResearchDoc[]
}

const TYPE_BADGES: Record<string, { icon: string; color: string; label: string }> = {
  document: { icon: '📄', color: 'bg-blue-100 text-blue-700', label: 'Document' },
  data: { icon: '📊', color: 'bg-green-100 text-green-700', label: 'Data' },
  source: { icon: '🔗', color: 'bg-purple-100 text-purple-700', label: 'Source' },
  finding: { icon: '💡', color: 'bg-amber-100 text-amber-700', label: 'Finding' },
  benchmark: { icon: '📈', color: 'bg-cyan-100 text-cyan-700', label: 'Benchmark' },
  notes: { icon: '📝', color: 'bg-slate-100 text-slate-700', label: 'Notes' },
}

const CATEGORIES = [
  'General',
  'Market Research',
  'Technical',
  'Conservation',
  'Remote Sensing',
  'GIS',
  'ML/AI',
  'Other'
]

export const Route = createFileRoute('/research/')({
  component: ResearchPage,
})

// Simple markdown renderer
function renderMarkdown(content: string): JSX.Element {
  const lines = content.split('\n')
  const elements: JSX.Element[] = []
  let inCodeBlock = false
  let codeContent: string[] = []
  let inTable = false
  let tableRows: string[][] = []
  
  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={i} className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm my-3">
            <code>{codeContent.join('\n')}</code>
          </pre>
        )
        codeContent = []
      }
      inCodeBlock = !inCodeBlock
      return
    }
    
    if (inCodeBlock) {
      codeContent.push(line)
      return
    }
    
    if (line.startsWith('|')) {
      if (!inTable) inTable = true
      const cells = line.split('|').slice(1, -1).map(c => c.trim())
      if (!cells.every(c => c.match(/^[-:]+$/))) {
        tableRows.push(cells)
      }
      return
    } else if (inTable) {
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border border-slate-200 rounded-lg">
            <thead className="bg-slate-100">
              <tr>
                {tableRows[0]?.map((cell, j) => (
                  <th key={j} className="px-4 py-2 text-left font-semibold border-b border-slate-200">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 border-b border-slate-100">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      tableRows = []
      inTable = false
    }
    
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-slate-900 mt-6 mb-3">{line.slice(2)}</h1>)
      return
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-bold text-slate-800 mt-5 mb-2">{line.slice(3)}</h2>)
      return
    }
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold text-slate-700 mt-4 mb-2">{line.slice(4)}</h3>)
      return
    }
    
    if (line.match(/^[-*_]{3,}$/)) {
      elements.push(<hr key={i} className="my-6 border-slate-200" />)
      return
    }
    
    if (line.match(/^[-*] /)) {
      const text = line.slice(2)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      elements.push(
        <li key={i} className="ml-4 text-slate-600 my-1 list-disc list-inside" dangerouslySetInnerHTML={{ __html: text }} />
      )
      return
    }
    
    if (line.match(/^\d+\. /)) {
      const text = line.replace(/^\d+\. /, '')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      elements.push(
        <li key={i} className="ml-4 text-slate-600 my-1 list-decimal list-inside" dangerouslySetInnerHTML={{ __html: text }} />
      )
      return
    }
    
    if (!line.trim()) {
      elements.push(<div key={i} className="h-3" />)
      return
    }
    
    const formattedLine = line
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm">$1</code>')
    elements.push(<p key={i} className="text-slate-600 my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} />)
  })
  
  if (inTable && tableRows.length > 0) {
    elements.push(
      <div key="final-table" className="overflow-x-auto my-4">
        <table className="min-w-full text-sm border border-slate-200 rounded-lg">
          <thead className="bg-slate-100">
            <tr>
              {tableRows[0]?.map((cell, j) => (
                <th key={j} className="px-4 py-2 text-left font-semibold border-b border-slate-200">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2 border-b border-slate-100">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  return <>{elements}</>
}

function ResearchPage() {
  const [documents, setDocuments] = useState<ResearchDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoc, setSelectedDoc] = useState<ResearchDoc | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const loadDocuments = useCallback(async () => {
    try {
      const res = await fetch('/api/research')
      if (res.ok) {
        const data = await res.json()
        setDocuments(data.documents || [])
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredDocs = documents.filter(doc => {
    if (filterType !== 'all' && doc.type !== filterType) return false
    if (filterCategory !== 'all' && doc.category !== filterCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return doc.title.toLowerCase().includes(q) || 
             doc.content.toLowerCase().includes(q) ||
             (doc.source?.toLowerCase().includes(q))
    }
    return true
  }).sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())

  const categories = [...new Set(documents.map(d => d.category))]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔬</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Research Library</h1>
              <p className="text-xs text-slate-500">
                {documents.length} document{documents.length !== 1 ? 's' : ''} · Documentation, data, and findings
              </p>
            </div>
          </div>
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Hub
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            {Object.entries(TYPE_BADGES).map(([key, val]) => (
              <option key={key} value={key}>{val.icon} {val.label}</option>
            ))}
          </select>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="text-sm text-slate-500">
            {filteredDocs.length} result{filteredDocs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading research...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document List */}
            <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
              {filteredDocs.map(doc => {
                const badge = TYPE_BADGES[doc.type] || TYPE_BADGES.document
                const isSelected = selectedDoc?.id === doc.id
                
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-xl cursor-pointer border transition ${
                      isSelected
                        ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </span>
                      {doc.linkedBuild && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          🔨 Build
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 line-clamp-2">{doc.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{formatDate(doc.addedAt)}</span>
                      {doc.addedBy === 'ai' && <span>🤖</span>}
                    </div>
                  </div>
                )
              })}
              
              {filteredDocs.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <p className="text-slate-500">No research found</p>
                </div>
              )}
            </div>

            {/* Document Viewer */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden sticky top-24">
                  {/* Doc Header */}
                  <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_BADGES[selectedDoc.type]?.color}`}>
                        {TYPE_BADGES[selectedDoc.type]?.icon} {TYPE_BADGES[selectedDoc.type]?.label}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {selectedDoc.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedDoc.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span>{formatDate(selectedDoc.addedAt)}</span>
                      {selectedDoc.source && <span>Source: {selectedDoc.source}</span>}
                      {selectedDoc.url && (
                        <a href={selectedDoc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View Source ↗
                        </a>
                      )}
                      {selectedDoc.linkedBuild && (
                        <Link to={`/builds/${selectedDoc.linkedBuild}`} className="text-purple-600 hover:underline">
                          View Build →
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {/* Doc Content */}
                  <div className="p-6 max-h-[calc(100vh-350px)] overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {renderMarkdown(selectedDoc.content)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center sticky top-24">
                  <span className="text-4xl mb-4 block">👈</span>
                  <p className="text-slate-400">Select a document to view</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
