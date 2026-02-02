import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/krill/')({
  component: KrillDashboard,
})

// CCAMLR Division markers
const divisions = [
  { name: '48.1 - Antarctic Peninsula', lat: -64, lng: -62 },
  { name: '48.2 - South Orkney Islands', lat: -61, lng: -45 },
  { name: '48.3 - South Georgia', lat: -54, lng: -37 },
]

// Key survey sites
const sites = [
  { name: 'Cape Shirreff', lat: -62.47, lng: -60.77 },
  { name: 'Bransfield Strait', lat: -63, lng: -58 },
  { name: 'South Georgia', lat: -54.25, lng: -36.5 },
]

function KrillDashboard() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      const map = L.map(mapRef.current!, {
        center: [-62, -58],
        zoom: 4,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 12,
      }).addTo(map)

      // CCAMLR Divisions
      divisions.forEach(d => {
        L.circleMarker([d.lat, d.lng], {
          radius: 15,
          fillColor: '#ff6b6b',
          color: '#ff6b6b',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.3,
        }).addTo(map).bindPopup(`<b>${d.name}</b><br>CCAMLR Division`)
      })

      // Survey sites
      sites.forEach(s => {
        L.circleMarker([s.lat, s.lng], {
          radius: 8,
          fillColor: '#4ecdc4',
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map).bindPopup(`<b>${s.name}</b><br>Key Survey Site`)
      })

      mapInstanceRef.current = map
    }

    initMap()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/80 border-b border-crab-600/30 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white">← Hub</Link>
            <h1 className="text-xl font-bold text-crab-400">🦐 Krill Detection Dashboard</h1>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
            Awaiting Study Area Confirmation
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Project Status */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h3 className="text-sm font-semibold text-crab-400 uppercase tracking-wide mb-4">📊 Project Status</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">S3</div>
                  <div className="text-xs text-slate-500 mt-1">Satellite</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">300m</div>
                  <div className="text-xs text-slate-500 mt-1">Resolution</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">7</div>
                  <div className="text-xs text-slate-500 mt-1">OLCI Bands</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400">~2d</div>
                  <div className="text-xs text-slate-500 mt-1">Revisit</div>
                </div>
              </div>
            </div>

            {/* Spectral Signature */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h3 className="text-sm font-semibold text-crab-400 uppercase tracking-wide mb-4">🔬 Spectral Signature</h3>
              <p className="text-xs text-slate-400 mb-3">
                Krill (astaxanthin pigment):<br/>
                <span className="text-red-400">Absorbs 500-550nm</span> • 
                <span className="text-emerald-400"> Reflects 600-700nm</span>
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { band: 'Oa04', nm: '490 nm' },
                  { band: 'Oa05', nm: '510 nm' },
                  { band: 'Oa06', nm: '560 nm' },
                  { band: 'Oa07', nm: '620 nm' },
                  { band: 'Oa08', nm: '665 nm' },
                ].map(b => (
                  <div key={b.band} className="flex justify-between py-1 border-b border-slate-800 last:border-0">
                    <span className="text-emerald-400 font-mono">{b.band}</span>
                    <span className="text-slate-500">{b.nm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h3 className="text-sm font-semibold text-crab-400 uppercase tracking-wide mb-4">📋 Next Steps</h3>
              <div className="space-y-2 text-sm">
                {[
                  'Confirm study area with Quintin',
                  'Select date range for imagery',
                  'Verify ground truth data access',
                  'Review spectral approach',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-400">
                    <span className="text-slate-600">○</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
              <h3 className="text-sm font-semibold text-crab-400 uppercase tracking-wide mb-4">📚 Data Sources</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <p><span className="text-emerald-400 font-semibold">GEE:</span> COPERNICUS/S3/OLCI</p>
                <p><span className="text-emerald-400 font-semibold">CCAMLR:</span> Survey divisions 48.1-48.3</p>
                <p><span className="text-emerald-400 font-semibold">Areas:</span> Cape Shirreff, Bransfield Strait, South Georgia</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-400">Antarctic Study Area</span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-red-400/60"></span> CCAMLR Divisions
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-emerald-400"></span> Survey Sites
                  </span>
                </div>
              </div>
              <div ref={mapRef} className="h-[600px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
