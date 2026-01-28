import { createFileRoute } from '@tanstack/react-router'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

async function handleGet() {
  const filePath = join(homedir(), 'clawd/projects/project-ideas.md')
  
  if (!existsSync(filePath)) {
    return Response.json({ projects: [] })
  }
  
  try {
    const content = readFileSync(filePath, 'utf8')
    
    // Parse the markdown into projects
    const projects: any[] = []
    const sections = content.split(/### \d+\.\s+\*\*/)
    
    for (const section of sections.slice(1)) {
      const lines = section.split('\n')
      const nameMatch = lines[0]?.match(/^(.+?)\*\*/)
      if (!nameMatch) continue
      
      const name = nameMatch[1].trim()
      const descMatch = section.match(/- \*\*Tech:\*\*(.+)/s)
      const techLine = section.match(/- \*\*Tech:\*\*\s*(.+)/)
      const tech = techLine ? techLine[1].split(',').map(t => t.trim()) : []
      
      // Get description - first paragraph after name
      const descLines = lines.slice(1).filter(l => l.trim() && !l.startsWith('-'))
      const description = descLines[0]?.trim() || ''
      
      // Determine priority based on section
      let priority = 'medium'
      if (content.indexOf(name) < content.indexOf('## 🌿')) {
        priority = 'high'
      }
      
      projects.push({
        name,
        description,
        tech,
        priority,
        status: 'idea'
      })
    }
    
    return Response.json({ projects: projects.slice(0, 15) })
  } catch (e) {
    return Response.json({ projects: [], error: String(e) })
  }
}

export const Route = createFileRoute('/api/projects')({
  server: {
    handlers: {
      GET: handleGet,
    },
  },
})
