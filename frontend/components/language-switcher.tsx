"use client"

import { useEffect, useState } from "react"
import type { Language } from "@/lib/i18n"

interface LanguageSwitcherProps {
  onLanguageChange: (lang: Language) => void
  currentLang: Language
}

/**
 * Seletor de Idiomas (Português / Inglês).
 */
export function LanguageSwitcher({ onLanguageChange, currentLang }: LanguageSwitcherProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <select
      value={currentLang}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
  )
}
