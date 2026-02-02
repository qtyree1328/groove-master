import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  status: 'backlog' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category?: 'feature' | 'bug' | 'improvement' | 'research' | 'design' | 'build' | 'ui' | 'other'
  project?: string
  dueDate?: string
  createdAt: string
  completedAt?: string
  createdBy: 'user' | 'ai'
  order: number
  result?: string
  movedToBuilds?: boolean
}

type ColumnId = 'backlog' | 'in_progress' | 'done'

const COLUMNS: { id: ColumnId; label: string; color: string; bgColor: string; headerBg: string }[] = [
  { id: 'backlog', label: 'Queue', color: 'text-amber-700', bgColor: 'bg-amber-50', headerBg: 'bg-amber-100' },
  { id: 'in_progress', label: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-50', headerBg: 'bg-blue-100' },
  { id: 'done', label: 'Done', color: 'text-emerald-700', bgColor: 'bg-emerald-50', headerBg: 'bg-emerald-100' },
]

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'border-l-red-500 bg-red-50/50',
  high: 'border-l-orange-500 bg-orange-50/30',
  medium: 'border-l-blue-500',
  low: 'border-l-slate-300',
}

const CATEGORY_BADGES: Record<string, { icon: string; color: string }> = {
  feature: { icon: '✨', color: 'bg-purple-100 text-purple-700' },
  bug: { icon: '🐛', color: 'bg-red-100 text-red-700' },
  improvement: { icon: '⚡', color: 'bg-blue-100 text-blue-700' },
  research: { icon: '🔬', color: 'bg-cyan-100 text-cyan-700' },
  design: { icon: '🎨', color: 'bg-pink-100 text-pink-700' },
  build: { icon: '🔨', color: 'bg-amber-100 text-amber-700' },
  ui: { icon: '🖥️', color: 'bg-indigo-100 text-indigo-700' },
  other: { icon: '📌', color: 'bg-slate-100 text-slate-700' },
}

export const Route = createFileRoute('/activity/')({
  component: KanbanPage,
})

function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [stats, setStats] = useState({ backlog: 0, inProgress: 0, done: 0, total: 0 })
  const [completedToday, setCompletedToday] = useState(0)
  const [loading, setLoading] = useState(true)
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{ column: ColumnId; index: number } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', category: 'other' })
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        const filtered = (data.tasks || []).map((t: Task) => ({
          ...t,
          status: t.status === 'review' ? 'in_progress' : t.status
        }))
        setTasks(filtered)
        setStats({
          backlog: filtered.filter((t: Task) => t.status === 'backlog').length,
          inProgress: filtered.filter((t: Task) => t.status === 'in_progress').length,
          done: filtered.filter((t: Task) => t.status === 'done').length,
          total: filtered.length,
        })
        setCompletedToday(data.completedToday || 0)
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => {
    loadTasks()
    const interval = setInterval(loadTasks, 30000)
    return () => clearInterval(interval)
  }, [loadTasks])

  const getColumnTasks = (columnId: ColumnId) => {
    const filtered = tasks.filter(t => t.status === columnId)
    if (columnId === 'done') {
      // Sort by completedAt (or createdAt as fallback), most recent first
      return filtered.sort((a, b) => {
        const aDate = new Date(a.completedAt || a.createdAt).getTime()
        const bDate = new Date(b.completedAt || b.createdAt).getTime()
        return bDate - aDate
      })
    }
    return filtered.sort((a, b) => a.order - b.order)
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDropTarget(null)
  }

  const handleDragOverTask = (e: React.DragEvent, column: ColumnId, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (column === 'backlog') {
      setDropTarget({ column, index })
    }
  }

  const handleDragOverColumn = (e: React.DragEvent, column: ColumnId) => {
    e.preventDefault()
    const columnTasks = getColumnTasks(column)
    if (column === 'backlog') {
      setDropTarget({ column, index: columnTasks.length })
    }
  }

  const handleDropOnTask = async (e: React.DragEvent, column: ColumnId, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTaskId) return
    
    const draggedTask = tasks.find(t => t.id === draggedTaskId)
    if (!draggedTask) return

    // Moving between columns
    if (draggedTask.status !== column) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'move', id: draggedTaskId, status: column })
      })
      loadTasks()
      handleDragEnd()
      return
    }

    // Reordering within Queue
    if (column === 'backlog') {
      const queueTasks = getColumnTasks('backlog')
      const oldIndex = queueTasks.findIndex(t => t.id === draggedTaskId)
      
      if (oldIndex === dropIndex || oldIndex === dropIndex - 1) {
        handleDragEnd()
        return
      }

      // Build new order
      const newOrder = queueTasks.filter(t => t.id !== draggedTaskId)
      const insertAt = dropIndex > oldIndex ? dropIndex - 1 : dropIndex
      newOrder.splice(insertAt, 0, draggedTask)

      const taskOrders = newOrder.map((t, i) => ({ id: t.id, order: i }))

      // Optimistic update
      setTasks(prev => {
        const nonQueue = prev.filter(t => t.status !== 'backlog')
        return [...nonQueue, ...newOrder.map((t, i) => ({ ...t, order: i }))]
      })

      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', taskOrders })
      })
      
      loadTasks()
    }

    handleDragEnd()
  }

  const handleDropOnColumn = async (e: React.DragEvent, column: ColumnId) => {
    e.preventDefault()
    
    if (!draggedTaskId) return
    
    const draggedTask = tasks.find(t => t.id === draggedTaskId)
    if (!draggedTask) return

    // Moving between columns
    if (draggedTask.status !== column) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'move', id: draggedTaskId, status: column })
      })
      loadTasks()
    }

    handleDragEnd()
  }

  const addTask = async () => {
    if (!newTask.title.trim()) return
    
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'add',
        ...newTask,
        status: 'backlog',
        createdBy: 'user'
      })
    })
    
    setNewTask({ title: '', description: '', priority: 'medium', category: 'other' })
    setShowAddModal(false)
    loadTasks()
  }

  const deleteTask = async (id: string) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    })
    setEditingTask(null)
    loadTasks()
  }

  const clearOldDone = async () => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'clear-done', daysOld: 7 })
    })
    loadTasks()
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const topOfQueue = getColumnTasks('backlog')[0]
  const draggedTask = draggedTaskId ? tasks.find(t => t.id === draggedTaskId) : null

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Kanban — Accountability</h1>
              <p className="text-xs text-slate-500">
                {completedToday} done today · {stats.inProgress} in progress · {stats.backlog} queued
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/activity-log" 
              className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              📜 Activity Log
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition"
            >
              + Add Task
            </button>
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
              ← Hub
            </Link>
          </div>
        </div>
      </header>

      {/* Top of Queue Indicator */}
      {topOfQueue && (
        <div className="max-w-[1400px] mx-auto px-6 pt-4">
          <div className="bg-amber-100 border border-amber-300 rounded-lg px-4 py-3 flex items-center gap-3">
            <span className="text-lg">🎯</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Next Up: <span className="font-bold">{topOfQueue.title}</span></p>
              {topOfQueue.description && (
                <p className="text-xs text-amber-700 mt-0.5">{topOfQueue.description}</p>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded ${CATEGORY_BADGES[topOfQueue.category || 'other']?.color || 'bg-slate-100'}`}>
              {CATEGORY_BADGES[topOfQueue.category || 'other']?.icon} {topOfQueue.category || 'other'}
            </span>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {COLUMNS.map(column => {
              const columnTasks = getColumnTasks(column.id)
              return (
                <div
                  key={column.id}
                  className={`flex flex-col rounded-xl border border-slate-200 overflow-hidden ${
                    draggedTask && draggedTask.status !== column.id ? 'ring-2 ring-blue-300' : ''
                  }`}
                  onDragOver={(e) => handleDragOverColumn(e, column.id)}
                  onDrop={(e) => handleDropOnColumn(e, column.id)}
                >
                  {/* Column Header */}
                  <div className={`px-4 py-3 ${column.headerBg} border-b border-slate-200 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <h2 className={`font-bold ${column.color}`}>{column.label}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full bg-white/80 ${column.color} font-medium`}>
                        {columnTasks.length}
                      </span>
                    </div>
                    {column.id === 'backlog' && (
                      <span className="text-xs text-amber-600">⬆️ drag to reorder</span>
                    )}
                    {column.id === 'done' && stats.done > 5 && (
                      <button
                        onClick={clearOldDone}
                        className="text-xs text-slate-500 hover:text-slate-700"
                      >
                        Clear old
                      </button>
                    )}
                  </div>

                  {/* Tasks */}
                  <div className={`flex-1 overflow-y-auto p-3 space-y-1 ${column.bgColor}`}>
                    {columnTasks.map((task, index) => (
                      <div key={task.id}>
                        {/* Drop indicator BEFORE this task */}
                        {column.id === 'backlog' && dropTarget?.column === 'backlog' && dropTarget.index === index && draggedTaskId && draggedTaskId !== task.id && (
                          <div className="h-1 bg-blue-500 rounded-full mb-1 mx-1 animate-pulse" />
                        )}
                        
                        <div
                          draggable
                          onDragStart={() => handleDragStart(task.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOverTask(e, column.id, index)}
                          onDrop={(e) => handleDropOnTask(e, column.id, index)}
                          onClick={() => setEditingTask(task)}
                          className={`bg-white rounded-lg shadow-sm border-l-4 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition select-none ${PRIORITY_COLORS[task.priority]} ${
                            draggedTaskId === task.id ? 'opacity-40 scale-95' : ''
                          }`}
                        >
                          {/* Position number for Queue */}
                          {column.id === 'backlog' && (
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">#{index + 1}</span>
                              {task.createdBy === 'ai' && <span className="text-xs">🤖</span>}
                            </div>
                          )}
                          
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium text-slate-900 leading-tight">
                              {task.title}
                            </h3>
                            {column.id !== 'backlog' && task.createdBy === 'ai' && (
                              <span className="text-xs shrink-0">🤖</span>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {task.category && CATEGORY_BADGES[task.category] && (
                              <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_BADGES[task.category].color}`}>
                                {CATEGORY_BADGES[task.category].icon} {task.category}
                              </span>
                            )}
                            {task.movedToBuilds && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                → builds
                              </span>
                            )}
                          </div>
                          
                          {task.result && column.id === 'done' && (
                            <p className="text-xs text-emerald-600 mt-2 bg-emerald-50 p-2 rounded">
                              ✓ {task.result}
                            </p>
                          )}
                          
                          {task.completedAt && column.id === 'done' && (
                            <p className="text-xs text-emerald-600 mt-2">
                              ✓ {formatDate(task.completedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Drop indicator at END of queue */}
                    {column.id === 'backlog' && dropTarget?.column === 'backlog' && dropTarget.index === columnTasks.length && draggedTaskId && (
                      <div className="h-1 bg-blue-500 rounded-full mx-1 animate-pulse" />
                    )}
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">
                        {column.id === 'backlog' ? 'Add tasks to the queue' :
                         column.id === 'in_progress' ? 'AI picks from top of queue' :
                         'Completed tasks appear here'}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* How it works */}
        <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4">
          <h3 className="font-semibold text-slate-700 mb-2">🔄 How This Works</h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="flex gap-2">
              <span className="text-amber-500 font-bold">1.</span>
              <p>Add tasks to <strong>Queue</strong>. Drag to set priority order. #1 is next.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-500 font-bold">2.</span>
              <p>Every heartbeat, I check #1 in Queue → move to <strong>In Progress</strong> → do the work.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-500 font-bold">3.</span>
              <p>When done → <strong>Done</strong>. Builds go to /builds. UI changes get implemented.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Add to Queue</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">What needs to be done?</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Build a satellite timelapse tool..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Details / Requirements</label>
                <textarea
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Use NASA GIBS API, allow date range selection..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
                  <select
                    value={newTask.category}
                    onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="build">🔨 Build (→ /builds)</option>
                    <option value="ui">🖥️ UI Change</option>
                    <option value="feature">✨ Feature</option>
                    <option value="bug">🐛 Bug Fix</option>
                    <option value="improvement">⚡ Improvement</option>
                    <option value="research">🔬 Research</option>
                    <option value="design">🎨 Design</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={!newTask.title.trim()}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium disabled:opacity-50"
              >
                Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{editingTask.title}</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            {editingTask.description && (
              <p className="text-sm text-slate-600 mb-4">{editingTask.description}</p>
            )}
            
            <div className="space-y-2 text-sm text-slate-500 mb-4">
              <p><strong>Status:</strong> {editingTask.status === 'backlog' ? 'Queue' : editingTask.status === 'in_progress' ? 'In Progress' : 'Done'}</p>
              <p><strong>Priority:</strong> {editingTask.priority}</p>
              {editingTask.category && <p><strong>Type:</strong> {editingTask.category}</p>}
              <p><strong>Created:</strong> {new Date(editingTask.createdAt).toLocaleString()}</p>
              {editingTask.completedAt && (
                <p><strong>Completed:</strong> {new Date(editingTask.completedAt).toLocaleString()}</p>
              )}
              <p><strong>By:</strong> {editingTask.createdBy === 'ai' ? '🤖 AI' : '👤 You'}</p>
              {editingTask.result && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                  <p className="text-emerald-700"><strong>Result:</strong> {editingTask.result}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={() => deleteTask(editingTask.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
