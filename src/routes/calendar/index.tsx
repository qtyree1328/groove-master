import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Calendar, MapPin, Clock, Gift, Plane, Lightbulb, Edit2, Trash2, Star } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time?: string // HH:MM
  endDate?: string
  endTime?: string
  location?: string
  description?: string
  category: 'trip' | 'birthday' | 'meeting' | 'deadline' | 'reminder' | 'personal' | 'other'
  suggestions?: string[] // AI-generated suggestions
  notes?: string
  starred?: boolean
}

export const Route = createFileRoute('/calendar/')({
  component: CalendarPage,
})

const CATEGORY_COLORS: Record<string, string> = {
  trip: 'bg-blue-500',
  birthday: 'bg-pink-500',
  meeting: 'bg-green-500',
  deadline: 'bg-red-500',
  reminder: 'bg-yellow-500',
  personal: 'bg-purple-500',
  other: 'bg-gray-500',
}

const CATEGORY_ICONS: Record<string, any> = {
  trip: Plane,
  birthday: Gift,
  meeting: Calendar,
  deadline: Clock,
  reminder: Clock,
  personal: Star,
  other: Calendar,
}

function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  // Load events from API
  useEffect(() => {
    fetch('/api/calendar')
      .then(r => r.json())
      .then(data => setEvents(data.events || []))
      .catch(() => {
        // Fallback to localStorage
        const saved = localStorage.getItem('calendar-events')
        if (saved) setEvents(JSON.parse(saved))
      })
  }, [])

  // Also keep localStorage in sync as backup
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events))
  }, [events])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const formatDate = (d: Date) => d.toISOString().split('T')[0]
  const today = formatDate(new Date())

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => {
      if (e.date === dateStr) return true
      // Check if it's within a multi-day event
      if (e.endDate && e.date <= dateStr && e.endDate >= dateStr) return true
      return false
    })
  }

  const addEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', event })
      })
      const data = await res.json()
      if (data.ok) {
        setEvents([...events, data.event])
      }
    } catch {
      // Fallback to local
      const newEvent = { ...event, id: Date.now().toString() }
      setEvents([...events, newEvent])
    }
    setIsAddingEvent(false)
    setSelectedDay(null)
  }

  const updateEvent = async (event: CalendarEvent) => {
    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', event })
      })
    } catch {}
    setEvents(events.map(e => e.id === event.id ? event : e))
    setEditingEvent(null)
    setSelectedEvent(event)
  }

  const deleteEvent = async (id: string) => {
    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', eventId: id })
      })
    } catch {}
    setEvents(events.filter(e => e.id !== id))
    setSelectedEvent(null)
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-shell-900/30" />)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayEvents = getEventsForDay(day)
      const isToday = dateStr === today
      
      days.push(
        <div
          key={day}
          onClick={() => {
            setSelectedDay(dateStr)
            if (dayEvents.length === 1) {
              setSelectedEvent(dayEvents[0])
            } else if (dayEvents.length === 0) {
              setIsAddingEvent(true)
            }
          }}
          className={`h-24 p-1 border border-shell-800 cursor-pointer transition-all hover:bg-shell-800/50 ${
            isToday ? 'bg-crab-900/30 border-crab-500' : 'bg-shell-900/50'
          }`}
        >
          <div className={`text-sm font-display ${isToday ? 'text-crab-400 font-bold' : 'text-gray-400'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-0.5 overflow-hidden">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedEvent(event)
                }}
                className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${CATEGORY_COLORS[event.category]}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-[10px] text-gray-500">+{dayEvents.length - 3} more</div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  // Get upcoming events for sidebar
  const upcomingEvents = events
    .filter(e => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-shell-950 texture-grid">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-400 hover:text-white text-sm">← Hub</Link>
            <h1 className="font-arcade text-xl text-crab-400 glow-red">CALENDAR</h1>
          </div>
          <button
            onClick={() => {
              setSelectedDay(today)
              setIsAddingEvent(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-crab-600 hover:bg-crab-500 rounded-lg font-display text-sm transition-all"
          >
            <Plus size={16} /> Add Event
          </button>
        </div>

        <div className="flex gap-6">
          {/* Calendar Grid */}
          <div className="flex-1">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4 bg-shell-900/50 rounded-lg p-3">
              <button onClick={prevMonth} className="p-2 hover:bg-shell-800 rounded-lg transition-all">
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              <div className="flex items-center gap-4">
                <h2 className="font-display text-xl text-white">
                  {monthNames[month]} {year}
                </h2>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-xs bg-shell-800 hover:bg-shell-700 rounded-lg text-gray-300 font-display"
                >
                  Today
                </button>
              </div>
              <button onClick={nextMonth} className="p-2 hover:bg-shell-800 rounded-lg transition-all">
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-display text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 rounded-lg overflow-hidden border border-shell-800">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Sidebar - Upcoming Events */}
          <div className="w-80">
            <div className="bg-shell-900/50 rounded-lg p-4 border border-shell-800">
              <h3 className="font-display text-sm text-crab-400 mb-4 uppercase tracking-wide">Upcoming Events</h3>
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm font-console">No upcoming events</p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => {
                    const Icon = CATEGORY_ICONS[event.category]
                    const daysUntil = Math.ceil((new Date(event.date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="p-3 bg-shell-800/50 rounded-lg cursor-pointer hover:bg-shell-800 transition-all border border-shell-700"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${CATEGORY_COLORS[event.category]}`}>
                            <Icon size={14} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-display text-sm text-white truncate">{event.title}</div>
                            <div className="text-xs text-gray-500 font-console mt-1">
                              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                              {event.time && ` at ${event.time}`}
                            </div>
                            {daysUntil === 0 && <span className="text-xs text-crab-400 font-bold">Today!</span>}
                            {daysUntil === 1 && <span className="text-xs text-yellow-400">Tomorrow</span>}
                            {daysUntil > 1 && daysUntil <= 7 && <span className="text-xs text-blue-400">In {daysUntil} days</span>}
                          </div>
                          {event.suggestions && event.suggestions.length > 0 && (
                            <Lightbulb size={14} className="text-yellow-400" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && !editingEvent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-shell-900 rounded-xl border border-shell-700 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`p-4 ${CATEGORY_COLORS[selectedEvent.category]} rounded-t-xl flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                {(() => { const Icon = CATEGORY_ICONS[selectedEvent.category]; return <Icon size={24} className="text-white" /> })()}
                <h2 className="font-display text-xl text-white">{selectedEvent.title}</h2>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1 hover:bg-white/20 rounded">
                <X size={20} className="text-white" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Date/Time */}
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar size={18} className="text-gray-500" />
                <span>
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.date && (
                    <> — {new Date(selectedEvent.endDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</>
                  )}
                </span>
              </div>
              
              {selectedEvent.time && (
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={18} className="text-gray-500" />
                  <span>{selectedEvent.time}{selectedEvent.endTime && ` — ${selectedEvent.endTime}`}</span>
                </div>
              )}
              
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin size={18} className="text-gray-500" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              
              {selectedEvent.description && (
                <div className="pt-2 border-t border-shell-700">
                  <p className="text-gray-300 text-sm">{selectedEvent.description}</p>
                </div>
              )}
              
              {/* AI Suggestions */}
              {selectedEvent.suggestions && selectedEvent.suggestions.length > 0 && (
                <div className="pt-4 border-t border-shell-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={18} className="text-yellow-400" />
                    <h3 className="font-display text-sm text-yellow-400 uppercase tracking-wide">Suggestions</h3>
                  </div>
                  <ul className="space-y-2">
                    {selectedEvent.suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-crab-400">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedEvent.notes && (
                <div className="pt-4 border-t border-shell-700">
                  <h3 className="font-display text-xs text-gray-500 uppercase tracking-wide mb-2">Notes</h3>
                  <p className="text-gray-400 text-sm">{selectedEvent.notes}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-shell-700">
                <button
                  onClick={() => setEditingEvent(selectedEvent)}
                  className="flex items-center gap-2 px-4 py-2 bg-shell-800 hover:bg-shell-700 rounded-lg text-sm transition-all"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => deleteEvent(selectedEvent.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded-lg text-sm transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal */}
      {(isAddingEvent || editingEvent) && (
        <EventForm
          event={editingEvent}
          defaultDate={selectedDay || today}
          onSave={(event) => {
            if (editingEvent) {
              updateEvent({ ...event, id: editingEvent.id })
            } else {
              addEvent(event)
            }
          }}
          onCancel={() => {
            setIsAddingEvent(false)
            setEditingEvent(null)
            setSelectedDay(null)
          }}
        />
      )}
    </div>
  )
}

function EventForm({ 
  event, 
  defaultDate, 
  onSave, 
  onCancel 
}: { 
  event?: CalendarEvent | null
  defaultDate: string
  onSave: (event: Omit<CalendarEvent, 'id'>) => void
  onCancel: () => void 
}) {
  const [title, setTitle] = useState(event?.title || '')
  const [date, setDate] = useState(event?.date || defaultDate)
  const [time, setTime] = useState(event?.time || '')
  const [endDate, setEndDate] = useState(event?.endDate || '')
  const [endTime, setEndTime] = useState(event?.endTime || '')
  const [location, setLocation] = useState(event?.location || '')
  const [description, setDescription] = useState(event?.description || '')
  const [category, setCategory] = useState<CalendarEvent['category']>(event?.category || 'other')
  const [notes, setNotes] = useState(event?.notes || '')
  const [suggestions, setSuggestions] = useState<string[]>(event?.suggestions || [])
  const [newSuggestion, setNewSuggestion] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date) return
    
    onSave({
      title,
      date,
      time: time || undefined,
      endDate: endDate || undefined,
      endTime: endTime || undefined,
      location: location || undefined,
      description: description || undefined,
      category,
      notes: notes || undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    })
  }

  const addSuggestion = () => {
    if (newSuggestion.trim()) {
      setSuggestions([...suggestions, newSuggestion.trim()])
      setNewSuggestion('')
    }
  }

  const removeSuggestion = (index: number) => {
    setSuggestions(suggestions.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-shell-900 rounded-xl border border-shell-700 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-shell-700 flex items-center justify-between">
          <h2 className="font-display text-lg text-white">{event ? 'Edit Event' : 'Add Event'}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-shell-800 rounded">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
              placeholder="Event title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CalendarEvent['category'])}
              className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
            >
              <option value="trip">🛫 Trip</option>
              <option value="birthday">🎂 Birthday</option>
              <option value="meeting">📅 Meeting</option>
              <option value="deadline">⏰ Deadline</option>
              <option value="reminder">🔔 Reminder</option>
              <option value="personal">⭐ Personal</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          {/* Date/Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Start Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
              />
            </div>
          </div>

          {/* End Date/Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none"
              placeholder="Location"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none resize-none"
              placeholder="Event description..."
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">
              <Lightbulb size={12} className="inline mr-1 text-yellow-400" />
              Suggestions (AI-generated tips)
            </label>
            {suggestions.length > 0 && (
              <ul className="mb-2 space-y-1">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300 bg-shell-800 px-2 py-1 rounded">
                    <span className="flex-1">{s}</span>
                    <button type="button" onClick={() => removeSuggestion(i)} className="text-red-400 hover:text-red-300">
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSuggestion}
                onChange={e => setNewSuggestion(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSuggestion())}
                className="flex-1 px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none text-sm"
                placeholder="Add a suggestion..."
              />
              <button
                type="button"
                onClick={addSuggestion}
                className="px-3 py-2 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-400 rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-gray-500 font-display uppercase tracking-wide mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-shell-800 border border-shell-700 rounded-lg text-white focus:border-crab-500 focus:outline-none resize-none"
              placeholder="Additional notes..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-crab-600 hover:bg-crab-500 rounded-lg font-display text-sm transition-all"
            >
              {event ? 'Update Event' : 'Add Event'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-shell-800 hover:bg-shell-700 rounded-lg font-display text-sm text-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
