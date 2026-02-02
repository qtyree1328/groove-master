import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/krill/')({
  component: KrillDashboard,
})

const MAPBOX_TOKEN = 'pk.eyJ1IjoicXR5cmVlIiwiYSI6ImNtaHl5eHNmeDBoY3oybXEwNTIxNGgxYmsifQ.VqoAKKHQxQX-lNNPwVKHmw'

// San Diego study area bounds
const STUDY_AREA = {
  center: [-118.5, 32.8],
  zoom: 7,
  bounds: {
    north: 34.5,
    south: 31.5,
    east: -116.5,
    west: -121.0
  }
}

// Sentinel-3 OLCI bands for krill detection
const OLCI_BANDS = [
  { band: 'Oa04', nm: 490, use: 'Chlorophyll absorption' },
  { band: 'Oa05', nm: 510, use: 'Krill absorption peak' },
  { band: 'Oa06', nm: 560, use: 'Reference (green)' },
  { band: 'Oa07', nm: 620, use: 'Krill reflectance' },
  { band: 'Oa08', nm: 665, use: 'Chlorophyll fluorescence' },
]

// Krill spectral signature
const KRILL_SIGNATURE = {
  absorption: '500-550nm (astaxanthin)',
  reflectance: '600-700nm (red coloration)',
  indicator: 'Ratio Oa07/Oa05 > 1.2 suggests krill'
}

function KrillDashboard() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showWhaleData, setShowWhaleData] = useState(true)
  const [showSatellite, setShowSatellite] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
  })
  const [whaleCount, setWhaleCount] = useState<number | null>(null)
  const [hoveredFeature, setHoveredFeature] = useState<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')
      
      mapboxgl.accessToken = MAPBOX_TOKEN

      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        center: STUDY_AREA.center as [number, number],
        zoom: STUDY_AREA.zoom,
      })

      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.addControl(new mapboxgl.ScaleControl(), 'bottom-right')

      map.on('load', () => {
        // Add NASA GIBS MODIS layer
        map.addSource('gibs-modis', {
          type: 'raster',
          tiles: [
            `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${selectedDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`
          ],
          tileSize: 256,
          attribution: 'NASA GIBS'
        })

        map.addLayer({
          id: 'gibs-layer',
          type: 'raster',
          source: 'gibs-modis',
          paint: {
            'raster-opacity': 0.7
          }
        }, 'aeroway-line')

        // Add blue whale data source
        map.addSource('blue-whale', {
          type: 'vector',
          url: 'mapbox://qtyree.d8ugc52g'
        })

        // Blue whale heatmap layer
        map.addLayer({
          id: 'whale-heat',
          type: 'heatmap',
          source: 'blue-whale',
          'source-layer': 'Blue_whale_gbif_2005-2025_fin-9os5to',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(0,0,255,0)',
              0.2, 'rgba(0,100,255,0.5)',
              0.4, 'rgba(0,200,255,0.7)',
              0.6, 'rgba(100,255,200,0.8)',
              0.8, 'rgba(255,255,100,0.9)',
              1, 'rgba(255,100,50,1)'
            ],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
            'heatmap-opacity': 0.8
          }
        })

        // Blue whale points layer (visible at higher zoom)
        map.addLayer({
          id: 'whale-points',
          type: 'circle',
          source: 'blue-whale',
          'source-layer': 'Blue_whale_gbif_2005-2025_fin-9os5to',
          minzoom: 8,
          paint: {
            'circle-radius': 6,
            'circle-color': '#00aaff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
            'circle-opacity': 0.8
          }
        })

        // Study area outline
        map.addSource('study-area', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [STUDY_AREA.bounds.west, STUDY_AREA.bounds.north],
                [STUDY_AREA.bounds.east, STUDY_AREA.bounds.north],
                [STUDY_AREA.bounds.east, STUDY_AREA.bounds.south],
                [STUDY_AREA.bounds.west, STUDY_AREA.bounds.south],
                [STUDY_AREA.bounds.west, STUDY_AREA.bounds.north],
              ]]
            }
          }
        })

        map.addLayer({
          id: 'study-area-outline',
          type: 'line',
          source: 'study-area',
          paint: {
            'line-color': '#ff6b6b',
            'line-width': 3,
            'line-dasharray': [3, 2]
          }
        })

        // Count whale observations
        map.on('sourcedata', (e) => {
          if (e.sourceId === 'blue-whale' && e.isSourceLoaded) {
            const features = map.querySourceFeatures('blue-whale', {
              sourceLayer: 'Blue_whale_gbif_2005-2025_fin-9os5to'
            })
            setWhaleCount(features.length)
          }
        })

        // Hover interaction
        map.on('mousemove', 'whale-points', (e) => {
          if (e.features && e.features.length > 0) {
            setHoveredFeature(e.features[0].properties)
            map.getCanvas().style.cursor = 'pointer'
          }
        })

        map.on('mouseleave', 'whale-points', () => {
          setHoveredFeature(null)
          map.getCanvas().style.cursor = ''
        })

        setMapLoaded(true)
      })

      mapInstanceRef.current = map
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update satellite date
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return
    const map = mapInstanceRef.current
    
    const source = map.getSource('gibs-modis')
    if (source) {
      source.setTiles([
        `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${selectedDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`
      ])
    }
  }, [selectedDate, mapLoaded])

  // Toggle layers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return
    const map = mapInstanceRef.current
    
    if (map.getLayer('whale-heat')) {
      map.setLayoutProperty('whale-heat', 'visibility', showWhaleData ? 'visible' : 'none')
    }
    if (map.getLayer('whale-points')) {
      map.setLayoutProperty('whale-points', 'visibility', showWhaleData ? 'visible' : 'none')
    }
  }, [showWhaleData, mapLoaded])

  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return
    const map = mapInstanceRef.current
    
    if (map.getLayer('gibs-layer')) {
      map.setLayoutProperty('gibs-layer', 'visibility', showSatellite ? 'visible' : 'none')
    }
  }, [showSatellite, mapLoaded])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur border-b border-crab-600/30 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white">← Hub</Link>
            <h1 className="text-xl font-bold text-crab-400">🦐 Krill Detection — San Diego Coast</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
              Sentinel-3 OLCI + GBIF Blue Whale Data
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 overflow-y-auto p-4 space-y-4">
          {/* Study Area Info */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">📍 Study Area</h3>
            <p className="text-slate-300 text-sm mb-2">Southern California Bight</p>
            <p className="text-xs text-slate-500 font-mono">
              {STUDY_AREA.bounds.south}°N to {STUDY_AREA.bounds.north}°N<br/>
              {Math.abs(STUDY_AREA.bounds.west)}°W to {Math.abs(STUDY_AREA.bounds.east)}°W
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Key feeding ground for blue whales during summer upwelling season
            </p>
          </div>

          {/* Layer Controls */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">🗺️ Layers</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showSatellite} 
                  onChange={(e) => setShowSatellite(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-crab-500"
                />
                <span className="text-sm text-slate-300">MODIS Satellite Imagery</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showWhaleData} 
                  onChange={(e) => setShowWhaleData(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-crab-500"
                />
                <span className="text-sm text-slate-300">Blue Whale Observations</span>
              </label>
            </div>
          </div>

          {/* Date Selector */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">📅 Satellite Date</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
            />
            <p className="text-xs text-slate-500 mt-2">NASA MODIS Terra true color</p>
          </div>

          {/* Whale Data Stats */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">🐋 Blue Whale Data</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {whaleCount !== null ? whaleCount.toLocaleString() : '—'}
                </div>
                <div className="text-xs text-slate-500">Observations</div>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-400">2005-25</div>
                <div className="text-xs text-slate-500">Date Range</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Source: GBIF via Whale Watchers Atlas</p>
          </div>

          {/* Spectral Signature */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">🔬 Krill Spectral Signature</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-red-400">Absorption</span>
                <span className="text-slate-400">{KRILL_SIGNATURE.absorption}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-400">Reflectance</span>
                <span className="text-slate-400">{KRILL_SIGNATURE.reflectance}</span>
              </div>
              <div className="mt-2 p-2 bg-slate-900 rounded text-slate-300">
                💡 {KRILL_SIGNATURE.indicator}
              </div>
            </div>
          </div>

          {/* OLCI Bands */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">📡 Sentinel-3 OLCI Bands</h3>
            <div className="space-y-2">
              {OLCI_BANDS.map(b => (
                <div key={b.band} className="flex justify-between text-xs py-1 border-b border-slate-700 last:border-0">
                  <span className="text-emerald-400 font-mono">{b.band}</span>
                  <span className="text-slate-500">{b.nm}nm</span>
                  <span className="text-slate-400">{b.use}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <h3 className="text-sm font-bold text-crab-400 uppercase tracking-wide mb-3">📋 Methodology</h3>
            <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
              <li>Map blue whale density as krill indicator</li>
              <li>Identify high-density feeding areas</li>
              <li>Acquire OLCI imagery for target dates</li>
              <li>Calculate band ratios (Oa07/Oa05)</li>
              <li>Validate against whale sighting patterns</li>
            </ol>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="absolute inset-0" />
          
          {/* Hover tooltip */}
          {hoveredFeature && (
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 z-10">
              <p className="text-sm font-bold text-white">Blue Whale Sighting</p>
              {hoveredFeature.eventDate && (
                <p className="text-xs text-slate-400">Date: {hoveredFeature.eventDate}</p>
              )}
              {hoveredFeature.year && (
                <p className="text-xs text-slate-400">Year: {hoveredFeature.year}</p>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-8 left-4 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 z-10">
            <p className="text-xs font-bold text-slate-300 mb-2">Blue Whale Density</p>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(0,100,255,0.7)' }}></div>
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(0,200,255,0.8)' }}></div>
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(100,255,200,0.9)' }}></div>
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,100,0.9)' }}></div>
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,100,50,1)' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
