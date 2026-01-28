import { createFileRoute, Link } from '@tanstack/react-router'
import { CrabIdleAnimation } from '~/components/ani'

export const Route = createFileRoute('/crabwalk/')({
  component: CrabwalkPage,
})

function CrabwalkPage() {
  return (
    <div className="min-h-screen bg-shell-950 texture-grid relative overflow-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/" className="text-sm text-gray-400 hover:text-white">← Hub</Link>
      </div>

      {/* Decorative background */}
      <div className="absolute inset-0 bg-linear-to-br from-crab-950/20 via-transparent to-shell-950" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-crab-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      {/* Main content */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl">
          {/* Animated crab */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="crab-icon-glow">
                <CrabIdleAnimation className="w-32 h-32" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-arcade text-4xl md:text-5xl text-crab-400 glow-red mb-6 leading-tight">
            CRABWALK
          </h1>

          {/* Subtitle */}
          <p className="font-console font-bold text-lg text-gray-400 mb-4 tracking-wide uppercase">
            Open-Source Clawdbot Companion
          </p>

          {/* Description */}
          <div className="font-console text-sm text-shell-500 mb-10 max-w-md mx-auto">
            <span className="text-crab-600">&gt;</span> Real-time AI agent activity monitoring<br />
            <span className="text-crab-600">&gt;</span> Session tracking & action visualization<br />
            <span className="text-crab-600">&gt;</span> Multi-platform gateway interface
          </div>

          {/* CTA */}
          <Link to="/monitor" className="btn-retro inline-block rounded-lg font-black!">
            Launch Monitor
          </Link>

          {/* Decorative line */}
          <div className="mt-16 h-px bg-linear-to-r from-transparent via-crab-700/50 to-transparent max-w-xs mx-auto" />

          {/* Version badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 bg-shell-900/80 rounded-full">
            <span className="w-2 h-2 rounded-full bg-neon-mint animate-pulse" />
            <span className="font-console font-bold text-[11px] uppercase text-shell-500">
              system online • v1.0
            </span>
          </div>

          {/* Links */}
          <div className="mt-6 flex items-center justify-center gap-6 font-console text-sm">
            <a
              href="https://github.com/luccast/crabwalk"
              target="_blank"
              rel="noreferrer"
              className="text-shell-500 hover:text-crab-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
