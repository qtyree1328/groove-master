import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'

export const Route = createFileRoute('/ocean/')({
  component: OceanMonitorPage,
})

// NASA GIBS ocean-focused layers
const OCEAN_LAYERS = [
  {
    id: 'MODIS_Aqua_Chlorophyll_A',
    name: 'Chlorophyll-a',
    description: 'Ocean productivity indicator — high values = phytoplankton blooms',
    unit: 'mg/m³',
    format: 'png',
    colorbar: ['#000080', '#0000ff', '#00ff00', '#ffff00', '#ff0000'],
    legend: ['Low', '', 'Medium', '', 'High'],
  },
  {
    id: 'MODIS_Aqua_Sea_Surface_Temp_Day',
    name: 'Sea Surface Temperature (Day)',
    description: 'Daytime ocean surface temperature from MODIS Aqua',
    unit: '°C',
    format: 'png',
    colorbar: ['#000080', '#0000ff', '#00ffff', '#ffff00', '#ff0000'],
    legend: ['Cold', '', 'Moderate', '', 'Warm'],
  },
  {
    id: 'MODIS_Aqua_Sea_Surface_Temp_Night',
    name: 'Sea Surface Temperature (Night)',
    description: 'Nighttime ocean surface temperature',
    unit: '°C',
    format: 'png',
    colorbar: ['#000080', '#0000ff', '#00ffff', '#ffff00', '#ff0000'],
    legend: ['Cold', '', 'Moderate', '', 'Warm'],
  },
  {
    id: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
    name: 'SST (MUR Composite)',
    description: 'Multi-sensor SST analysis, 1km resolution',
    unit: '°C',
    format: 'png',
    colorbar: ['#000080', '#0000ff', '#00ffff', '#ffff00', '#ff0000'],
    legend: ['Cold', '', 'Moderate', '', 'Warm'],
  },
  {
    id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
    name: 'True Color (Context)',
    description: 'Natural color imagery for reference',
    unit: '',
    format: 'jpg',
    colorbar: [],
    legend: [],
  },
]

// Whale feeding ground presets
const STUDY_AREAS = [
  {
    name: 'Monterey Bay',
    lat: 36.8,
    lng: -122.0,
    zoom: 8,
    notes: 'Major upwelling zone, humpback & blue whale feeding ground',
  },
  {
    name: 'Channel Islands',
    lat: 34.0,
    lng: -119.5,
    zoom: 8,
    notes: 'Blue whale aggregation area, krill hotspot',
  },
  {
    name: 'Gulf of Maine',
    lat: 43.5,
    lng: -68.5,
    zoom: 7,
    notes: 'North Atlantic right whale critical habitat',
  },
  {
    name: 'Stellwagen Bank',
    lat: 42.4,
    lng: -70.3,
    zoom: 9,
    notes: 'Humpback whale sanctuary, high productivity',
  },
  {
    name: 'Baja California',
    lat: 27.5,
    lng: -114.5,
    zoom: 7,
    notes: 'Gray whale breeding lagoons, upwelling coast',
  },
  {
    name: 'Southeast Alaska',
    lat: 57.5,
    lng: -135.0,
    zoom: 7,
    notes: 'Humpback feeding aggregation, cold nutrient-rich waters',
  },
  {
    name: 'Hawaiian Islands',
    lat: 20.5,
    lng: -157.0,
    zoom: 7,
    notes: 'Humpback breeding ground (winter)',
  },
  {
    name: 'Antarctic Peninsula',
    lat: -64.5,
    lng: -62.0,
    zoom: 6,
    notes: 'Krill swarms, humpback & minke feeding',
  },
]

// Get date string for N days ago
const getDateString = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

function OceanMonitorPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layerRef = useRef<any>(null)
  const secondLayerRef = useRef<any>(null)
  
  const [selectedArea, setSelectedArea] = useState(STUDY_AREAS[0])
  const [primaryLayer, setPrimaryLayer] = useState(OCEAN_LAYERS[0]) // Chlorophyll
  const [secondaryLayer, setSecondaryLayer] = useState<typeof OCEAN_LAYERS[0] | null>(OCEAN_LAYERS[1]) // SST
  const [showSecondary, setShowSecondary] = useState(false)
  const [secondaryOpacity, setSecondaryOpacity] = useState(0.5)
  const [selectedDate, setSelectedDate] = useState(getDateString(1))
  const [mapReady, setMapReady] = useState(false)
  const [comparing, setComparing] = useState(false)
  const [compareDate, setCompareDate] = useState(getDateString(8))

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      
      const map = L.map(mapRef.current!, {
        center: [selectedArea.lat, selectedArea.lng],
        zoom: selectedArea.zoom,
        zoomControl: true,
      })

      // Dark ocean basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19,
      }).addTo(map)

      // Add GIBS layer
      const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${primaryLayer.id}/default/${selectedDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${primaryLayer.format}`
      
      const gibsLayer = L.tileLayer(gibsUrl, {
        maxZoom: 9,
        opacity: 0.85,
        attribution: 'NASA GIBS',
      }).addTo(map)

      layerRef.current = gibsLayer
      mapInstanceRef.current = map
      setMapReady(true)
    }

    initMap()
  }, [])

  // Update layer when selection changes
  const updateLayer = useCallback((layer: typeof OCEAN_LAYERS[0], date: string, layerRefToUse: any, opacity: number = 0.85) => {
    if (!mapInstanceRef.current || !layerRefToUse.current) return
    
    const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer.id}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${layer.format}`
    layerRefToUse.current.setUrl(gibsUrl)
    layerRefToUse.current.setOpacity(opacity)
  }, [])

  useEffect(() => {
    if (mapReady) {
      updateLayer(primaryLayer, selectedDate, layerRef)
    }
  }, [primaryLayer, selectedDate, mapReady, updateLayer])

  // Handle secondary layer
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return
    
    const initSecondary = async () => {
      const L = (await import('leaflet')).default
      
      if (showSecondary && secondaryLayer) {
        if (!secondLayerRef.current) {
          const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${secondaryLayer.id}/default/${selectedDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.${secondaryLayer.format}`
          const newLayer = L.tileLayer(gibsUrl, {
            maxZoom: 9,
            opacity: secondaryOpacity,
            attribution: 'NASA GIBS',
          }).addTo(mapInstanceRef.current)
          secondLayerRef.current = newLayer
        } else {
          updateLayer(secondaryLayer, selectedDate, secondLayerRef, secondaryOpacity)
        }
      } else if (secondLayerRef.current) {
        mapInstanceRef.current.removeLayer(secondLayerRef.current)
        secondLayerRef.current = null
      }
    }
    
    initSecondary()
  }, [showSecondary, secondaryLayer, secondaryOpacity, selectedDate, mapReady, updateLayer])

  // Navigate to study area
  const goToArea = (area: typeof STUDY_AREAS[0]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([area.lat, area.lng], area.zoom)
    }
    setSelectedArea(area)
  }

  // Quick date buttons
  const quickDates = [
    { label: 'Yesterday', days: 1 },
    { label: '3 days ago', days: 3 },
    { label: '1 week ago', days: 7 },
    { label: '2 weeks ago', days: 14 },
    { label: '1 month ago', days: 30 },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white">
              ← Hub
            </Link>
            <h1 className="text-xl font-bold">🌊 Ocean Conditions Monitor</h1>
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              Whale-ML Support
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-400">
              {selectedDate}
            </span>
            <a 
              href="https://worldview.earthdata.nasa.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white"
            >
              NASA Worldview →
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Study Areas */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <h3 className="font-semibold mb-3 text-slate-300 flex items-center gap-2">
                🐋 Whale Feeding Grounds
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {STUDY_AREAS.map(area => (
                  <button
                    key={area.name}
                    onClick={() => goToArea(area)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      selectedArea.name === area.name 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <div className="font-medium">{area.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{area.notes}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Layer */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <h3 className="font-semibold mb-3 text-slate-300">📡 Primary Layer</h3>
              <select
                value={primaryLayer.id}
                onChange={(e) => {
                  const layer = OCEAN_LAYERS.find(l => l.id === e.target.value)
                  if (layer) setPrimaryLayer(layer)
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
              >
                {OCEAN_LAYERS.map(layer => (
                  <option key={layer.id} value={layer.id}>{layer.name}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-2">{primaryLayer.description}</p>
              
              {/* Simple legend */}
              {primaryLayer.colorbar.length > 0 && (
                <div className="mt-3">
                  <div 
                    className="h-3 rounded"
                    style={{
                      background: `linear-gradient(to right, ${primaryLayer.colorbar.join(', ')})`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    {primaryLayer.legend.map((label, i) => (
                      <span key={i}>{label}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Layer (Overlay) */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={showSecondary}
                  onChange={(e) => setShowSecondary(e.target.checked)}
                  className="rounded border-slate-600"
                />
                <span className="font-semibold text-slate-300">🔀 Overlay Layer</span>
              </label>
              
              {showSecondary && (
                <div className="space-y-3">
                  <select
                    value={secondaryLayer?.id || ''}
                    onChange={(e) => {
                      const layer = OCEAN_LAYERS.find(l => l.id === e.target.value)
                      setSecondaryLayer(layer || null)
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
                  >
                    {OCEAN_LAYERS.filter(l => l.id !== primaryLayer.id).map(layer => (
                      <option key={layer.id} value={layer.id}>{layer.name}</option>
                    ))}
                  </select>
                  
                  <div>
                    <label className="text-xs text-slate-500">Opacity: {Math.round(secondaryOpacity * 100)}%</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={secondaryOpacity * 100}
                      onChange={(e) => setSecondaryOpacity(parseInt(e.target.value) / 100)}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Date Selection */}
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <h3 className="font-semibold mb-3 text-slate-300">📅 Date</h3>
              <input
                type="date"
                value={selectedDate}
                max={getDateString(0)}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {quickDates.map(d => (
                  <button
                    key={d.days}
                    onClick={() => setSelectedDate(getDateString(d.days))}
                    className={`px-2 py-1 text-xs rounded ${
                      selectedDate === getDateString(d.days)
                        ? 'bg-blue-600'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Whale-ML Quick Info */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-800/50">
              <h3 className="font-semibold mb-2 text-cyan-400">🧠 Whale-ML Notes</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong>High Chl-a</strong> = phytoplankton bloom → zooplankton → whale prey</li>
                <li>• <strong>SST fronts</strong> = convergence zones where prey aggregates</li>
                <li>• <strong>Upwelling</strong> = cold, nutrient-rich water → productivity</li>
                <li>• Blue whales target krill near thermal fronts</li>
                <li>• Humpbacks follow prey up cold water columns</li>
              </ul>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{selectedArea.name}</span>
                  <span className="text-sm text-slate-400">|</span>
                  <span className="text-sm text-slate-400">{primaryLayer.name}</span>
                  {showSecondary && secondaryLayer && (
                    <>
                      <span className="text-sm text-slate-400">+</span>
                      <span className="text-sm text-slate-400">{secondaryLayer.name}</span>
                    </>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  Data: NASA GIBS / MODIS Aqua
                </span>
              </div>
              <div ref={mapRef} className="h-[600px]" />
            </div>

            {/* Interpretation Guide */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <h4 className="font-semibold text-green-400 mb-2">🟢 High Productivity</h4>
                <p className="text-xs text-slate-400">
                  Bright greens/yellows in Chlorophyll-a layer indicate phytoplankton blooms. 
                  These areas likely support zooplankton → fish → whales food chain.
                </p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <h4 className="font-semibold text-blue-400 mb-2">🌡️ Temperature Fronts</h4>
                <p className="text-xs text-slate-400">
                  Sharp SST gradients indicate oceanographic fronts where currents meet. 
                  Prey often aggregates at these boundaries.
                </p>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                <h4 className="font-semibold text-cyan-400 mb-2">💨 Upwelling Zones</h4>
                <p className="text-xs text-slate-400">
                  Cold water near coast + high Chl-a = upwelling. 
                  These areas are whale feeding hotspots, especially along California coast.
                </p>
              </div>
            </div>

            {/* Data Links */}
            <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-800">
              <h3 className="font-semibold mb-3">📊 Data Sources for ML</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <a 
                  href="https://podaac.jpl.nasa.gov/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 rounded px-3 py-2 text-center"
                >
                  PO.DAAC
                  <span className="block text-xs text-slate-400">SST/Ocean</span>
                </a>
                <a 
                  href="https://oceancolor.gsfc.nasa.gov/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 rounded px-3 py-2 text-center"
                >
                  Ocean Color
                  <span className="block text-xs text-slate-400">Chlorophyll</span>
                </a>
                <a 
                  href="https://www.gbif.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 rounded px-3 py-2 text-center"
                >
                  GBIF
                  <span className="block text-xs text-slate-400">Sightings</span>
                </a>
                <a 
                  href="https://obis.org/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 rounded px-3 py-2 text-center"
                >
                  OBIS
                  <span className="block text-xs text-slate-400">Occurrences</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
