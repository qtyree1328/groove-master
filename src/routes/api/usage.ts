import { createFileRoute } from '@tanstack/react-router'

// Cost estimates (Claude pricing)
const COST_PER_1M_INPUT = 3
const COST_PER_1M_OUTPUT = 15

async function handleGet({ request }: { request: Request }) {
  const url = new URL(request.url)
  const range = url.searchParams.get('range') || '24h'
  
  // Try to get real data from gateway
  try {
    const gatewayUrl = 'http://127.0.0.1:18789'
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    
    const res = await fetch(`${gatewayUrl}/api/sessions`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    }).catch(() => null)
    
    clearTimeout(timeout)
    
    if (res?.ok) {
      const data = await res.json()
      
      // Calculate usage from sessions
      let totalInput = 0
      let totalOutput = 0
      const sessions: any[] = []
      
      for (const session of (data.sessions || [])) {
        const input = session.usage?.inputTokens || 0
        const output = session.usage?.outputTokens || 0
        totalInput += input
        totalOutput += output
        
        if (input + output > 0) {
          sessions.push({
            key: session.sessionKey || session.key || 'unknown',
            channel: session.channel || 'main',
            input,
            output
          })
        }
      }
      
      const totalCost = (totalInput / 1000000 * COST_PER_1M_INPUT) + (totalOutput / 1000000 * COST_PER_1M_OUTPUT)
      
      return Response.json({
        totalInput,
        totalOutput,
        totalCost,
        sessions: sessions.sort((a, b) => (b.input + b.output) - (a.input + a.output)).slice(0, 10)
      })
    }
  } catch (e) {
    // Fall through to mock data
  }
  
  // Return placeholder if no gateway data
  return Response.json({
    totalInput: 0,
    totalOutput: 0,
    totalCost: 0,
    sessions: []
  })
}

export const Route = createFileRoute('/api/usage')({
  server: {
    handlers: {
      GET: handleGet,
    },
  },
})
