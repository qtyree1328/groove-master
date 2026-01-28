import { createFileRoute } from '@tanstack/react-router'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { homedir } from 'os'

async function handleGet({ request }: { request: Request }) {
  const url = new URL(request.url)
  const jobId = url.searchParams.get('id')
  
  if (!jobId) {
    return Response.json({ error: 'Job ID required' }, { status: 400 })
  }
  
  const coverLetterPath = join(homedir(), `.clawdbot/job-hunter/cover_letters/${jobId}.md`)
  
  if (!existsSync(coverLetterPath)) {
    return Response.json({ content: null, exists: false })
  }
  
  try {
    const content = readFileSync(coverLetterPath, 'utf8')
    // Remove the header/metadata from the markdown
    const cleaned = content
      .replace(/^#.*\n/gm, '')  // Remove h1 headers
      .replace(/\*\*Tone:\*\*.*\n/g, '')  // Remove tone line
      .replace(/---\n/g, '')  // Remove hr
      .trim()
    
    return Response.json({ content: cleaned, exists: true })
  } catch (e) {
    return Response.json({ error: 'Failed to read cover letter' }, { status: 500 })
  }
}

async function handlePost({ request }: { request: Request }) {
  try {
    const body = await request.json()
    const { id, content } = body
    
    if (!id || typeof content !== 'string') {
      return Response.json({ error: 'ID and content required' }, { status: 400 })
    }
    
    const coverLetterPath = join(homedir(), `.clawdbot/job-hunter/cover_letters/${id}.md`)
    const dir = dirname(coverLetterPath)
    
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    
    writeFileSync(coverLetterPath, content, 'utf8')
    
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ error: 'Failed to save cover letter' }, { status: 500 })
  }
}

export const Route = createFileRoute('/api/jobs/cover-letter')({
  server: {
    handlers: {
      GET: handleGet,
      POST: handlePost,
    },
  },
})
