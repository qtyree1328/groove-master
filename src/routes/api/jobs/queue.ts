import { createFileRoute } from '@tanstack/react-router'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const QUEUE_PATH = join(homedir(), '.clawdbot/job-hunter/jobs_queue.json')

async function handleGet() {
  try {
    if (!existsSync(QUEUE_PATH)) {
      return Response.json({ version: 1, lastScan: null, jobs: [] })
    }
    const data = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'))
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: 'Failed to read queue' }, { status: 500 })
  }
}

export const Route = createFileRoute('/api/jobs/queue')({
  server: {
    handlers: {
      GET: handleGet,
    },
  },
})
