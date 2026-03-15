"use client"

import { useEffect, useRef, useState } from "react"
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Navigation } from "lucide-react"
import { useApp } from "@/app/layout"

interface LocationMapProps {
  lat: number
  lon: number
  city: string
  country: string
}

export function LocationMap({ lat, lon, city, country }: LocationMapProps) {
  const { userLocation } = useApp()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    // Carrega o CSS do Leaflet
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link")
      link.id = "leaflet-css"
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      document.head.appendChild(link)
    }

    const loadMap = async () => {
      if (!(window as any).L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script")
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          script.onload = () => resolve()
          document.head.appendChild(script)
        })
      }

      const L = (window as any).L
      if (mapInstanceRef.current) mapInstanceRef.current.remove()

      const map = L.map(mapRef.current, {
        zoomControl: false, 
      }).setView([lat, lon], 10)
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map)

      // Marcador do Destino
      L.marker([lat, lon]).addTo(map).bindPopup(`<b>${city}</b><br>${country}`).openPopup()

      // Desenho da Rota (Traçado)
      if (userLocation && (userLocation.lat !== lat || userLocation.lon !== lon)) {
        const sourceLoc = [userLocation.lat, userLocation.lon]
        const targetLoc = [lat, lon]
        
        // Adiciona marcador da origem
        L.circleMarker(sourceLoc, {
          radius: 8,
          fillColor: "#7700FF",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map).bindPopup("Sua Localização")

        // Curva simples entre os pontos
        const latlngs = [sourceLoc, targetLoc]
        const polyline = L.polyline(latlngs, {
          color: '#7700FF',
          weight: 4,
          opacity: 0.6,
          dashArray: '10, 10',
          lineJoin: 'round'
        }).addTo(map)

        // Ajusta o foco para mostrar ambos os pontos
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] })
      }
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [lat, lon, city, country, userLocation])

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)
  const zoomIn = () => mapInstanceRef.current?.zoomIn()
  const zoomOut = () => mapInstanceRef.current?.zoomOut()

  return (
    <div className={`relative transition-all duration-500 ease-in-out ${isFullscreen ? 'fixed inset-4 z-50 bg-background shadow-2xl' : 'w-full h-64 md:h-80'}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden border border-border" 
        style={{ zIndex: 0 }} 
      />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button 
          onClick={toggleFullscreen}
          className="p-2 bg-card/80 backdrop-blur-md rounded-lg border border-border hover:bg-muted transition-all shadow-lg"
          title={isFullscreen ? "Minimizar" : "Tela Cheia"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        <button 
          onClick={zoomIn}
          className="p-2 bg-card/80 backdrop-blur-md rounded-lg border border-border hover:bg-muted transition-all shadow-lg"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onClick={zoomOut}
          className="p-2 bg-card/80 backdrop-blur-md rounded-lg border border-border hover:bg-muted transition-all shadow-lg"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" onClick={toggleFullscreen} />
      )}
    </div>
  )
}
