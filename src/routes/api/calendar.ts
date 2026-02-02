import { createAPIFileRoute } from '@tanstack/react-start/api'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const CALENDAR_FILE = path.join(DATA_DIR, 'calendar.json')

interface CalendarEvent {
  id: string
  title: string
  date: string
  time?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string
  category: 'trip' | 'birthday' | 'meeting' | 'deadline' | 'reminder' | 'personal' | 'other'
  suggestions?: string[]
  notes?: string
  starred?: boolean
}

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

async function readCalendar(): Promise<CalendarEvent[]> {
  await ensureDataDir()
  try {
    const data = await readFile(CALENDAR_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeCalendar(events: CalendarEvent[]) {
  await ensureDataDir()
  await writeFile(CALENDAR_FILE, JSON.stringify(events, null, 2))
}

export const APIRoute = createAPIFileRoute('/api/calendar')({
  // GET - Read all events or filter by date range
  GET: async ({ request }) => {
    const url = new URL(request.url)
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const upcoming = url.searchParams.get('upcoming')
    
    let events = await readCalendar()
    
    if (from) {
      events = events.filter(e => e.date >= from)
    }
    if (to) {
      events = events.filter(e => e.date <= to)
    }
    if (upcoming) {
      const today = new Date().toISOString().split('T')[0]
      const days = parseInt(upcoming) || 7
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      const toDate = futureDate.toISOString().split('T')[0]
      events = events.filter(e => e.date >= today && e.date <= toDate)
    }
    
    // Sort by date
    events.sort((a, b) => a.date.localeCompare(b.date))
    
    return Response.json({ events })
  },
  
  // POST - Add or update an event
  POST: async ({ request }) => {
    const body = await request.json()
    const { action, event, eventId, suggestions } = body
    
    let events = await readCalendar()
    
    switch (action) {
      case 'add': {
        const newEvent: CalendarEvent = {
          ...event,
          id: event.id || Date.now().toString()
        }
        events.push(newEvent)
        await writeCalendar(events)
        return Response.json({ ok: true, event: newEvent })
      }
      
      case 'update': {
        const index = events.findIndex(e => e.id === event.id)
        if (index === -1) {
          return Response.json({ ok: false, error: 'Event not found' }, { status: 404 })
        }
        events[index] = { ...events[index], ...event }
        await writeCalendar(events)
        return Response.json({ ok: true, event: events[index] })
      }
      
      case 'delete': {
        events = events.filter(e => e.id !== eventId)
        await writeCalendar(events)
        return Response.json({ ok: true })
      }
      
      case 'add-suggestions': {
        // Add AI suggestions to an existing event
        const idx = events.findIndex(e => e.id === eventId)
        if (idx === -1) {
          return Response.json({ ok: false, error: 'Event not found' }, { status: 404 })
        }
        const existing = events[idx].suggestions || []
        events[idx].suggestions = [...existing, ...(suggestions || [])]
        await writeCalendar(events)
        return Response.json({ ok: true, event: events[idx] })
      }
      
      default:
        return Response.json({ ok: false, error: 'Invalid action' }, { status: 400 })
    }
  }
})
