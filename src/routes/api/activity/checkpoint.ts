import { createFileRoute } from '@tanstack/react-router'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

interface Task {
  description: string
  timestamp: string
  status: 'completed' | 'running' | 'pending'
  tokens?: { input: number; output: number }
}

function parseCheckpoint(): Task[] {
  // Try today first, then yesterday (for timezone differences)
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  let memoryPath = join(homedir(), `clawd/memory/${today}.md`)
  if (!existsSync(memoryPath)) {
    memoryPath = join(homedir(), `clawd/memory/${yesterday}.md`)
  }
  
  if (!existsSync(memoryPath)) {
    return []
  }
  
  try {
    const content = readFileSync(memoryPath, 'utf8')
    const tasks: Task[] = []
    const seen = new Set<string>()
    
    // Find active task
    const activeMatch = content.match(/\*\*Active task:\*\*\s*(.+)/i)
    if (activeMatch && activeMatch[1].trim() !== 'None' && !activeMatch[1].includes('None')) {
      const desc = activeMatch[1].trim()
      tasks.push({
        description: desc,
        timestamp: new Date().toISOString(),
        status: 'running'
      })
      seen.add(desc)
    }
    
    // Find all completed tasks (checked items) - [x]
    const completedRegex = /^- \[x\]\s*(.+)$/gim
    let match
    while ((match = completedRegex.exec(content)) !== null) {
      const desc = match[1].trim()
      if (!seen.has(desc)) {
        tasks.push({
          description: desc,
          timestamp: new Date().toISOString(),
          status: 'completed'
        })
        seen.add(desc)
      }
    }
    
    // Find all pending tasks (unchecked items) - [ ]
    const pendingRegex = /^- \[ \]\s*(.+)$/gim
    while ((match = pendingRegex.exec(content)) !== null) {
      const desc = match[1].trim()
      if (!seen.has(desc)) {
        tasks.push({
          description: desc,
          timestamp: new Date().toISOString(),
          status: 'pending'
        })
        seen.add(desc)
      }
    }
    
    return tasks
  } catch (e) {
    console.error('Failed to parse checkpoint:', e)
    return []
  }
}

async function handleGet() {
  const tasks = parseCheckpoint()
  return Response.json({ 
    tasks,
    lastUpdated: new Date().toISOString()
  })
}

export const Route = createFileRoute('/api/activity/checkpoint')({
  server: {
    handlers: {
      GET: handleGet,
    },
  },
})
