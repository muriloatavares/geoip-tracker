"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MeshBackgroundProps {
  country?: string
  countryCode?: string
}

const countryPalettes: Record<string, string[]> = {
  "Brazil": ["#009739", "#FEDD00", "#012169", "#ffffff"],
  "United States": ["#B22234", "#3C3B6E", "#ffffff", "#f1f1f1"],
  "United Kingdom": ["#012169", "#C8102E", "#ffffff", "#f1f1f1"],
  "Germany": ["#000000", "#DD0000", "#FFCE00", "#f1f1f1"],
  "France": ["#002654", "#ffffff", "#ED2939", "#f1f1f1"],
  "Japan": ["#BC002D", "#ffffff", "#f1f1f1", "#e1e1e1"],
  "China": ["#EE1C25", "#FFFF00", "#f1f1f1", "#e1e1e1"],
  "Default": ["#7700FF", "#00C2FF", "#FF00E5", "#00FFAB"],
}

const nordicCountries = ["NO", "SE", "FI", "IS", "DK"]
const auroraPalette = ["#00ff87", "#60efff", "#ff1b6b", "#45cafc"]

/**
 * Componente de Fundo Dinâmico (Mesh Background).
 * Gera um fundo animado com gradientes radiais que mudam de cor 
 * baseados no país da busca.
 */
export function MeshBackground({ country, countryCode }: MeshBackgroundProps) {
  const [colors, setColors] = useState(countryPalettes["Default"])
  const [isAurora, setIsAurora] = useState(false)

  useEffect(() => {
    if (countryCode && nordicCountries.includes(countryCode)) {
      setColors(auroraPalette)
      setIsAurora(true)
    } else if (country && countryPalettes[country]) {
      setColors(countryPalettes[country])
      setIsAurora(false)
    } else {
      setColors(countryPalettes["Default"])
      setIsAurora(false)
    }
  }, [country, countryCode])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Base Layer */}
      <div className="absolute inset-0 bg-background transition-colors duration-1000" />
      
      {/* Animated Mesh Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={colors.join(",")}
          initial={{ opacity: 0 }}
          animate={{ opacity: isAurora ? 0.4 : 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 blur-[100px] opacity-60"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, ${colors[0]} 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, ${colors[1]} 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, ${colors[2]} 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${colors[3]} 0%, transparent 50%)
              `,
              backgroundSize: '200% 200%',
              animation: isAurora ? 'aurora-pulse 20s ease-in-out infinite alternate' : 'mesh-pulse 15s ease-in-out infinite alternate'
            }}
          />
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        @keyframes mesh-pulse {
          0% { background-position: 0% 0%; transform: scale(1); }
          100% { background-position: 100% 100%; transform: scale(1.1); }
        }
        @keyframes aurora-pulse {
          0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
          100% { background-position: 100% 50%; filter: hue-rotate(45deg); }
        }
      `}</style>
    </div>
  )
}
