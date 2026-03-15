"use client"

import type React from "react"
import { useState, createContext, useContext } from "react"
import { Outfit } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { MeshBackground } from "@/components/mesh-background"
import { Navbar } from "@/components/navbar"
import "./globals.css"

/**
 * Configuração do Layout Raiz do Frontend.
 * Define a fonte Outfit, gerencia o contexto global (AppProvider) e 
 * mantém elementos persistentes como o Background Animado e a Navbar.
 */
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] })

interface AppContextType {
  country: string
  setCountry: (c: string) => void
  countryCode: string
  setCountryCode: (c: string) => void
  userLocation: { lat: number; lon: number } | null
  setUserLocation: (loc: { lat: number; lon: number }) => void
  lang: string
  setLang: (l: any) => void
}

/**
 * Contexto global para compartilhar estado entre componentes (País, Localização, Clima, Idioma).
 */
const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error("useApp must be used within AppProvider")
  return context
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [country, setCountry] = useState("")
  const [countryCode, setCountryCode] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [lang, setLang] = useState<any>("en")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppContext.Provider value={{ 
            country, setCountry, 
            countryCode, setCountryCode,
            userLocation, setUserLocation,
            lang, setLang
          }}>
            <MeshBackground country={country} countryCode={countryCode} />
            <Navbar lang={lang} onLanguageChange={setLang} />
            {children}
            <Toaster richColors closeButton position="top-center" />
          </AppContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
