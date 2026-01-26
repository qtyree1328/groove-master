import { memo, useState } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import {
  Loader2,
  CheckCircle,
  XCircle,
  Wrench,
  MessageSquare,
  MessageCircle,
  Bot,
} from 'lucide-react'
import type { MonitorAction } from '~/integrations/clawdbot'

interface ActionNodeProps {
  data: MonitorAction
  selected?: boolean
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const stateConfig: Record<
  MonitorAction['type'],
  {
    icon: typeof Loader2
    borderColor: string
    bgColor: string
    iconColor: string
    animate: boolean
  }
> = {
  delta: {
    icon: Loader2,
    borderColor: 'border-neon-cyan',
    bgColor: 'bg-neon-cyan/10',
    iconColor: 'text-neon-cyan',
    animate: true,
  },
  final: {
    icon: CheckCircle,
    borderColor: 'border-neon-mint',
    bgColor: 'bg-neon-mint/10',
    iconColor: 'text-neon-mint',
    animate: false,
  },
  aborted: {
    icon: XCircle,
    borderColor: 'border-neon-peach',
    bgColor: 'bg-neon-peach/10',
    iconColor: 'text-neon-peach',
    animate: false,
  },
  error: {
    icon: XCircle,
    borderColor: 'border-crab-500',
    bgColor: 'bg-crab-500/10',
    iconColor: 'text-crab-400',
    animate: false,
  },
  tool_call: {
    icon: Wrench,
    borderColor: 'border-neon-lavender',
    bgColor: 'bg-neon-lavender/10',
    iconColor: 'text-neon-lavender',
    animate: false,
  },
  tool_result: {
    icon: MessageSquare,
    borderColor: 'border-pastel-sky',
    bgColor: 'bg-pastel-sky/10',
    iconColor: 'text-pastel-sky',
    animate: false,
  },
}

const eventTypeLabels: Record<MonitorAction['eventType'], { label: string; icon: typeof MessageCircle }> = {
  chat: { label: 'Chat', icon: MessageCircle },
  agent: { label: 'Agent', icon: Bot },
  system: { label: 'System', icon: MessageSquare },
}

export const ActionNode = memo(function ActionNode({
  data,
  selected,
}: ActionNodeProps) {
  const [expanded, setExpanded] = useState(false)
  const state = stateConfig[data.type]
  const eventInfo = eventTypeLabels[data.eventType || 'chat']
  const StateIcon = state.icon
  const EventIcon = eventInfo.icon

  // Safely get content as string
  const contentStr = typeof data.content === 'string'
    ? data.content
    : data.content != null
      ? JSON.stringify(data.content)
      : null

  const truncatedContent = contentStr
    ? contentStr.length > 100
      ? contentStr.slice(0, 100) + '...'
      : contentStr
    : null

  const fullContent = contentStr

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => setExpanded(!expanded)}
      className={`
        px-3 py-2.5 rounded-lg border-2 min-w-[180px] max-w-[300px] cursor-pointer
        bg-shell-900 ${state.borderColor}
        ${selected ? 'ring-2 ring-white/30' : ''}
        transition-all duration-150 hover:bg-shell-800
      `}
      style={{
        boxShadow: selected ? '0 0 15px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Handle type="target" position={Position.Top} className="bg-shell-600! w-2! h-2! border-shell-800!" />

      {/* Header: Event type + state */}
      <div className="flex items-center gap-2 mb-1.5">
        <EventIcon size={12} className="text-shell-500" />
        <span className="font-display text-[10px] font-medium text-gray-300 uppercase tracking-wide">
          {eventInfo.label}
        </span>
        <StateIcon
          size={12}
          className={`${state.iconColor} ${state.animate ? 'animate-spin' : ''} ml-auto`}
        />
      </div>

      {/* Timestamp */}
      <div className="font-console text-[11px] text-shell-500 mb-1.5">
        <span className="text-crab-600">&gt;</span> {formatTime(data.timestamp)}
      </div>

      {data.toolName && (
        <div className="font-console text-[10px] text-neon-lavender mb-1.5">
          <span className="text-shell-500">tool:</span> {data.toolName}
        </div>
      )}

      {truncatedContent && (
        <div className="font-console text-[10px] text-gray-400 leading-relaxed whitespace-pre-wrap">
          {expanded ? fullContent : truncatedContent}
        </div>
      )}

      {expanded && data.toolArgs != null && (
        <pre className="mt-2 font-console text-[11px] text-shell-500 bg-shell-950 p-2 rounded border border-shell-800 overflow-auto max-h-32">
          {JSON.stringify(data.toolArgs, null, 2) as string}
        </pre>
      )}

      <Handle type="source" position={Position.Bottom} className="bg-shell-600! w-2! h-2! border-shell-800!" />
    </motion.div>
  )
})
