import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'

export const Route = createFileRoute('/sketch/')({
  component: SketchPage,
})

interface SketchFeature {
  id: string
  name: string
  type: 'polygon' | 'rectangle' | 'circle' | 'marker' | 'polyline'
  coordinates: any
  properties: {
    area?: number // sq meters
    perimeter?: number // meters
    radius?: number // for circles
  }
  createdAt: string
}

interface Sketch {
  id: string
  name: string
  features: SketchFeature[]
  createdAt: string
  updatedAt: string
}

function SketchPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const drawnItemsRef = useRef<any>(null)
  
  const [sketches, setSketches] = useState<Sketch[]>([])
  const [activeSketch, setActiveSketch] = useState<Sketch | null>(null)
  const [geojsonOutput, setGeojsonOutput] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [newSketchName, setNewSketchName] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [totalArea, setTotalArea] = useState<number>(0)
  const [mapReady, setMapReady] = useState(false)

  // Load saved sketches
  useEffect(() => {
    const saved = localStorage.getItem('quick-sketches')
    if (saved) {
      try {
        setSketches(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet-draw')
      
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [39.8283, -98.5795], // Center of US
        zoom: 4,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      // Add satellite toggle
      const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      })

      L.control.layers({
        'Light': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map),
        'Satellite': satellite,
        'Dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'),
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      }).addTo(map)

      const drawnItems = new L.FeatureGroup()
      map.addLayer(drawnItems)
      drawnItemsRef.current = drawnItems

      const drawControl = new (L as any).Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polygon: {
            shapeOptions: {
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.2,
            },
          },
          rectangle: {
            shapeOptions: {
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.2,
            },
          },
          circle: {
            shapeOptions: {
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.2,
            },
          },
          polyline: {
            shapeOptions: {
              color: '#ef4444',
            },
          },
          marker: true,
          circlemarker: false,
        },
      })
      map.addControl(drawControl)

      // Track cursor position
      map.on('mousemove', (e: any) => {
        setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
      })

      // Handle draw events
      map.on('draw:created', (e: any) => {
        const layer = e.layer
        drawnItems.addLayer(layer)
        updateGeoJSON()
      })

      map.on('draw:edited', () => updateGeoJSON())
      map.on('draw:deleted', () => updateGeoJSON())

      mapInstanceRef.current = map
      setMapReady(true)
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const updateGeoJSON = useCallback(() => {
    if (!drawnItemsRef.current) return

    const geojson = drawnItemsRef.current.toGeoJSON()
    
    // Calculate areas
    let total = 0
    geojson.features.forEach((feature: any) => {
      if (feature.geometry.type === 'Polygon') {
        const area = calculatePolygonArea(feature.geometry.coordinates[0])
        feature.properties = feature.properties || {}
        feature.properties.area_sq_m = Math.round(area)
        feature.properties.area_sq_km = (area / 1000000).toFixed(4)
        feature.properties.area_acres = (area / 4046.86).toFixed(2)
        total += area
      }
    })
    
    setTotalArea(total)
    setGeojsonOutput(JSON.stringify(geojson, null, 2))
  }, [])

  // Calculate polygon area using Shoelace formula (approximation for small areas)
  const calculatePolygonArea = (coords: number[][]) => {
    // Convert to meters using approximate conversion at mid-latitude
    const midLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length
    const metersPerDegreeLat = 111320
    const metersPerDegreeLng = 111320 * Math.cos(midLat * Math.PI / 180)
    
    // Shoelace formula
    let area = 0
    for (let i = 0; i < coords.length - 1; i++) {
      const x1 = coords[i][0] * metersPerDegreeLng
      const y1 = coords[i][1] * metersPerDegreeLat
      const x2 = coords[i + 1][0] * metersPerDegreeLng
      const y2 = coords[i + 1][1] * metersPerDegreeLat
      area += x1 * y2 - x2 * y1
    }
    return Math.abs(area / 2)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(geojsonOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadGeoJSON = () => {
    const blob = new Blob([geojsonOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sketch-${Date.now()}.geojson`
    a.click()
    URL.revokeObjectURL(url)
  }

  const saveSketch = () => {
    if (!newSketchName.trim()) return
    
    const geojson = JSON.parse(geojsonOutput || '{"features":[]}')
    const sketch: Sketch = {
      id: Date.now().toString(),
      name: newSketchName.trim(),
      features: geojson.features.map((f: any, i: number) => ({
        id: `${Date.now()}-${i}`,
        name: `Feature ${i + 1}`,
        type: f.geometry.type.toLowerCase(),
        coordinates: f.geometry.coordinates,
        properties: f.properties || {},
        createdAt: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const updated = [...sketches, sketch]
    setSketches(updated)
    localStorage.setItem('quick-sketches', JSON.stringify(updated))
    setNewSketchName('')
    setShowSaveModal(false)
    setActiveSketch(sketch)
  }

  const loadSketch = async (sketch: Sketch) => {
    if (!drawnItemsRef.current || !mapInstanceRef.current) return
    
    const L = (await import('leaflet')).default
    drawnItemsRef.current.clearLayers()
    
    const geojson = {
      type: 'FeatureCollection',
      features: sketch.features.map(f => ({
        type: 'Feature',
        geometry: {
          type: f.type.charAt(0).toUpperCase() + f.type.slice(1),
          coordinates: f.coordinates,
        },
        properties: f.properties,
      })),
    }
    
    const geoLayer = L.geoJSON(geojson as any)
    geoLayer.eachLayer((layer: any) => {
      drawnItemsRef.current.addLayer(layer)
    })
    
    if (geoLayer.getBounds().isValid()) {
      mapInstanceRef.current.fitBounds(geoLayer.getBounds(), { padding: [50, 50] })
    }
    
    setActiveSketch(sketch)
    updateGeoJSON()
  }

  const deleteSketch = (id: string) => {
    const updated = sketches.filter(s => s.id !== id)
    setSketches(updated)
    localStorage.setItem('quick-sketches', JSON.stringify(updated))
    if (activeSketch?.id === id) {
      setActiveSketch(null)
      drawnItemsRef.current?.clearLayers()
      setGeojsonOutput('')
      setTotalArea(0)
    }
  }

  const clearMap = () => {
    drawnItemsRef.current?.clearLayers()
    setGeojsonOutput('')
    setTotalArea(0)
    setActiveSketch(null)
  }

  const formatArea = (sqMeters: number) => {
    if (sqMeters >= 1000000) {
      return `${(sqMeters / 1000000).toFixed(2)} km²`
    } else if (sqMeters >= 10000) {
      return `${(sqMeters / 10000).toFixed(2)} ha`
    } else {
      return `${Math.round(sqMeters).toLocaleString()} m²`
    }
  }

  const goToLocation = async () => {
    const input = prompt('Enter coordinates (lat, lng) or place name:')
    if (!input || !mapInstanceRef.current) return
    
    // Try parsing as coordinates
    const coordMatch = input.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/)
    if (coordMatch) {
      mapInstanceRef.current.setView([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])], 12)
      return
    }
    
    // Try geocoding
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}`)
      const data = await res.json()
      if (data.length > 0) {
        mapInstanceRef.current.setView([parseFloat(data[0].lat), parseFloat(data[0].lon)], 12)
      }
    } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-[1000]">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-slate-600">← Hub</Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              <h1 className="text-xl font-semibold text-slate-900">Quick Sketch</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {cursorCoords && (
              <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {cursorCoords.lat.toFixed(6)}, {cursorCoords.lng.toFixed(6)}
              </div>
            )}
            {totalArea > 0 && (
              <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Total: {formatArea(totalArea)}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          {/* Actions */}
          <div className="p-4 border-b border-slate-200 space-y-2">
            <div className="flex gap-2">
              <button
                onClick={goToLocation}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
              >
                🔍 Go to Location
              </button>
              <button
                onClick={clearMap}
                className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveModal(true)}
                disabled={!geojsonOutput || geojsonOutput === '{"type":"FeatureCollection","features":[]}'}
                className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Save Sketch
              </button>
            </div>
          </div>

          {/* Saved Sketches */}
          <div className="flex-1 overflow-auto p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Saved Sketches</h3>
            {sketches.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No saved sketches yet.<br/>Draw shapes and save them!
              </p>
            ) : (
              <div className="space-y-2">
                {sketches.map(sketch => (
                  <div
                    key={sketch.id}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      activeSketch?.id === sketch.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => loadSketch(sketch)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{sketch.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {sketch.features.length} feature{sketch.features.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSketch(sketch.id)
                        }}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GeoJSON Output */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-700">GeoJSON Output</h3>
              <div className="flex gap-1">
                <button
                  onClick={copyToClipboard}
                  disabled={!geojsonOutput}
                  className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition disabled:opacity-50"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadGeoJSON}
                  disabled={!geojsonOutput}
                  className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition disabled:opacity-50"
                >
                  Download
                </button>
              </div>
            </div>
            <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs overflow-auto max-h-48 font-mono">
              {geojsonOutput || '{\n  "type": "FeatureCollection",\n  "features": []\n}'}
            </pre>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000]">
            <h4 className="font-semibold mb-2 text-slate-700">Drawing Tools</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-sm opacity-70"></span>
                <span>Polygon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-500 rounded-sm opacity-70"></span>
                <span>Rectangle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-500 rounded-full opacity-70"></span>
                <span>Circle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-red-500"></span>
                <span>Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">📍</span>
                <span>Marker</span>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs z-[1000] max-w-xs">
            <h4 className="font-semibold mb-2 text-slate-700">Quick Tips</h4>
            <ul className="space-y-1 text-slate-600">
              <li>• Use toolbar at top-left to draw</li>
              <li>• Click edit icon to modify shapes</li>
              <li>• Click trash icon to delete shapes</li>
              <li>• GeoJSON updates automatically</li>
              <li>• Area calculated for polygons</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Save Sketch</h3>
            <input
              type="text"
              placeholder="Sketch name..."
              value={newSketchName}
              onChange={(e) => setNewSketchName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && saveSketch()}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowSaveModal(false)
                  setNewSketchName('')
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={saveSketch}
                disabled={!newSketchName.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css" />
    </div>
  )
}
