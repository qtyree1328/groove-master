import { createFileRoute } from '@tanstack/react-router'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const RESEARCH_PATH = path.join(process.env.HOME || '', '.clawdbot/research/research.json')

interface ResearchDoc {
  id: string
  title: string
  type: 'document' | 'data' | 'source' | 'finding' | 'benchmark' | 'notes'
  category: string
  content: string
  source?: string
  url?: string
  linkedBuild?: string
  addedAt: string
  updatedAt?: string
  addedBy: 'user' | 'ai'
}

interface ResearchData {
  version: number
  documents: ResearchDoc[]
}

async function loadResearch(): Promise<ResearchDoc[]> {
  try {
    if (existsSync(RESEARCH_PATH)) {
      const data = await readFile(RESEARCH_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      return parsed.documents || []
    }
  } catch {}
  return []
}

async function saveResearch(documents: ResearchDoc[]): Promise<void> {
  const dir = path.dirname(RESEARCH_PATH)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
  const data: ResearchData = {
    version: 1,
    documents
  }
  await writeFile(RESEARCH_PATH, JSON.stringify(data, null, 2))
}

async function handleGet({ request }: { request: Request }) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const type = url.searchParams.get('type')
  const linkedBuild = url.searchParams.get('linkedBuild')
  
  let documents = await loadResearch()
  
  if (category) {
    documents = documents.filter(d => d.category === category)
  }
  if (type) {
    documents = documents.filter(d => d.type === type)
  }
  if (linkedBuild) {
    documents = documents.filter(d => d.linkedBuild === linkedBuild)
  }
  
  return Response.json({ documents })
}

async function handlePost({ request }: { request: Request }) {
  const body = await request.json()
  const { action, id, ...payload } = body
  
  let documents = await loadResearch()
  
  // Add document
  if (action === 'add') {
    const newDoc: ResearchDoc = {
      id: `research-${Date.now()}`,
      title: payload.title || 'Untitled',
      type: payload.type || 'document',
      category: payload.category || 'General',
      content: payload.content || '',
      source: payload.source,
      url: payload.url,
      linkedBuild: payload.linkedBuild,
      addedAt: new Date().toISOString(),
      addedBy: payload.addedBy || 'ai',
    }
    documents.push(newDoc)
    await saveResearch(documents)
    return Response.json({ ok: true, document: newDoc })
  }
  
  // Update document
  if (action === 'update' && id) {
    const idx = documents.findIndex(d => d.id === id)
    if (idx === -1) return Response.json({ error: 'Not found' }, { status: 404 })
    
    documents[idx] = {
      ...documents[idx],
      ...payload,
      id: documents[idx].id,
      addedAt: documents[idx].addedAt,
      updatedAt: new Date().toISOString(),
    }
    await saveResearch(documents)
    return Response.json({ ok: true, document: documents[idx] })
  }
  
  // Delete document
  if (action === 'delete' && id) {
    documents = documents.filter(d => d.id !== id)
    await saveResearch(documents)
    return Response.json({ ok: true })
  }
  
  return Response.json({ error: 'Invalid action' }, { status: 400 })
}

export const Route = createFileRoute('/api/research')({
  server: {
    handlers: {
      GET: handleGet,
      POST: handlePost,
    },
  },
})
