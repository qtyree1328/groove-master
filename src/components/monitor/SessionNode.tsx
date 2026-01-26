import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { motion } from 'framer-motion'
import { Users, User } from 'lucide-react'
import { StatusIndicator } from './StatusIndicator'
import type { MonitorSession } from '~/integrations/clawdbot'

interface SessionNodeProps {
  data: MonitorSession
  selected?: boolean
}

const platformIcons: Record<string, string> = {
  whatsapp: '💬',
  telegram: '✈️',
  discord: '🎮',
  slack: '💼',
}

export const SessionNode = memo(function SessionNode({
  data,
  selected,
}: SessionNodeProps) {
  const platformIcon = platformIcons[data.platform] ?? '📱'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        px-4 py-3 rounded-lg border-2 min-w-[180px]
        bg-shell-900 text-white
        ${selected ? 'border-crab-500' : 'border-shell-600'}
        ${data.status === 'thinking' ? 'border-neon-peach' : ''}
        transition-all duration-150 hover:bg-shell-800
      `}
      style={{
        boxShadow: selected
          ? '0 0 20px rgba(239, 68, 68, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Handle type="target" position={Position.Top} className="bg-crab-500! w-3! h-3! border-2! border-shell-900!" />

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{platformIcon}</span>
        <span className="font-display text-xs font-semibold uppercase tracking-wide text-gray-200">
          {data.platform}
        </span>
        <StatusIndicator status={data.status} size="sm" />
      </div>

      <div className="flex items-center gap-2 mb-2">
        {data.isGroup ? (
          <Users size={12} className="text-shell-500" />
        ) : (
          <User size={12} className="text-shell-500" />
        )}
        <span className="font-display text-[11px] text-gray-300 truncate max-w-[120px]">
          {data.recipient}
        </span>
      </div>

      <div className="font-console text-[11px] text-shell-500 truncate">
        <span className="text-crab-600">&gt;</span> {data.agentId}
      </div>

      <Handle type="source" position={Position.Bottom} className="bg-crab-500! w-3! h-3! border-2! border-shell-900!" />
    </motion.div>
  )
})
