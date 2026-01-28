import { createFileRoute } from '@tanstack/react-router'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const COMPANIES_PATH = join(homedir(), '.clawdbot/job-hunter/companies.json')

async function handleGet() {
  try {
    if (!existsSync(COMPANIES_PATH)) {
      return Response.json({ version: 1, lastUpdated: null, companies: [] })
    }
    const data = JSON.parse(readFileSync(COMPANIES_PATH, 'utf8'))
    return Response.json(data)
  } catch (e) {
    return Response.json({ error: 'Failed to read companies' }, { status: 500 })
  }
}

async function handlePost({ request }: { request: Request }) {
  try {
    const body = await request.json()
    const data = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      companies: body.companies || []
    }
    writeFileSync(COMPANIES_PATH, JSON.stringify(data, null, 2))
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ error: 'Failed to save companies' }, { status: 500 })
  }
}

export const Route = createFileRoute('/api/jobs/companies')({
  server: {
    handlers: {
      GET: handleGet,
      POST: handlePost,
    },
  },
})
