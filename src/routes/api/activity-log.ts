import { createFileRoute } from '@tanstack/react-router'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ACTIVITY_PATH = path.join(process.env.HOME || '', '.clawdbot/activity-log.json')

interface ActivityEntry {
  id: string
  type: 'heartbeat' | 'memory' | 'research' | 'check' | 'update' | 'fix' | 'other'
  title: string
  details?: string
  timestamp: string
  duration?: number // minutes
}

interface ActivityData {
  version: number
  entries: ActivityEntry[]
}

async function loadActivity(): Promise<ActivityEntry[]> {
  try {
    if (existsSync(ACTIVITY_PATH)) {
      const data = await readFile(ACTIVITY_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      return parsed.entries || []
    }
  } catch {}
  return []
}

async function saveActivity(entries: ActivityEntry[]): Promise<void> {
  const dir = path.dirname(ACTIVITY_PATH)
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }
  // Keep only last 500 entries
  const trimmed = entries.slice(-500)
  const data: ActivityData = { version: 1, entries: trimmed }
  await writeFile(ACTIVITY_PATH, JSON.stringify(data, null, 2))
}

async function handleGet({ request }: { request: Request }) {
  const url = new URL(request.url)
  const limit = parseInt(url.searchParams.get('limit') || '100')
  const type = url.searchParams.get('type')
  const date = url.searchParams.get('date') // YYYY-MM-DD
  
  let entries = await loadActivity()
  
  if (type) entries = entries.filter(e => e.type === type)
  if (date) entries = entries.filter(e => e.timestamp.startsWith(date))
  
  // Sort newest first
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  
  // Stats by type
  const today = new Date().toISOString().split('T')[0]
  const todayEntries = entries.filter(e => e.timestamp.startsWith(today))
  
  const stats = {
    total: entries.length,
    today: todayEntries.length,
    byType: {
      heartbeat: todayEntries.filter(e => e.type === 'heartbeat').length,
      memory: todayEntries.filter(e => e.type === 'memory').length,
      research: todayEntries.filter(e => e.type === 'research').length,
      check: todayEntries.filter(e => e.type === 'check').length,
      update: todayEntries.filter(e => e.type === 'update').length,
      fix: todayEntries.filter(e => e.type === 'fix').length,
      other: todayEntries.filter(e => e.type === 'other').length,
    }
  }
  
  return Response.json({ 
    entries: entries.slice(0, limit), 
    stats 
  })
}

async function handlePost({ request }: { request: Request }) {
  const body = await request.json()
  const { action, ...payload } = body
  
  let entries = await loadActivity()
  
  if (action === 'add') {
    const entry: ActivityEntry = {
      id: `activity-${Date.now()}`,
      type: payload.type || 'other',
      title: payload.title || 'Untitled',
      details: payload.details,
      timestamp: new Date().toISOString(),
      duration: payload.duration,
    }
    entries.push(entry)
    await saveActivity(entries)
    return Response.json({ ok: true, entry })
  }
  
  if (action === 'clear-old') {
    const daysOld = payload.daysOld || 30
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysOld)
    entries = entries.filter(e => new Date(e.timestamp) > cutoff)
    await saveActivity(entries)
    return Response.json({ ok: true, remaining: entries.length })
  }
  
  return Response.json({ error: 'Invalid action' }, { status: 400 })
}

export const Route = createFileRoute('/api/activity-log')({
  server: {
    handlers: {
      GET: handleGet,
      POST: handlePost,
    },
  },
})
