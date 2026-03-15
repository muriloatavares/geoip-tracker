"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { sounds } from "@/lib/audio"

/**
 * Seletor de Temas Premium (Claro / Escuro / Sistema).
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Garante que o componente está montado para evitar erros de hidratação no Next.js
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="theme-switcher-premium">
      <button
        onClick={() => setTheme("light")}
        className={`theme-option ${theme === "light" ? "active" : ""}`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5 sm:mr-1" />
        <span className="hidden sm:inline">Light</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`theme-option ${theme === "dark" ? "active" : ""}`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5 sm:mr-1" />
        <span className="hidden sm:inline">Dark</span>
      </button>
      <button
        onClick={() => {
          setTheme("system")
          sounds.playClick()
        }}
        className={`theme-option ${theme === "system" ? "active" : ""}`}
        title="System Auto"
      >
        <Monitor className="w-3.5 h-3.5 sm:mr-1" />
        <span className="hidden sm:inline">Auto</span>
      </button>
    </div>
  )
}
