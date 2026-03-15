"use client"

import { useState, useEffect, useRef } from "react"
import { IPSearchForm } from "@/components/ip-search-form"
import { GeolocationResultComponent } from "@/components/geolocation-result"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"
import { SkeletonLoader } from "@/components/skeleton-loader"
import { SearchHistory, addToHistory } from "@/components/search-history"
import { translations, type Language } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "sonner"
import { useApp } from "./layout"
import { Github, Instagram, Share2, Download } from "lucide-react"
import { DiscordLogo } from "@/components/discord-logo"
import { WorldClock } from "@/components/world-clock"
import { sounds } from "@/lib/audio"
import API_BASE_URL from "@/lib/api-config"

/**
 * Interface que define a estrutura dos resultados de geolocalização.
 */
interface GeolocationResult {
  query: string
  country: string
  countryCode?: string
  regionName: string
  city: string
  lat: number
  lon: number
  timezone: string
  isp: string
  continent: string
  as: string
  org: string
  hostname: string
  isVpn?: boolean
  isProxy?: boolean
  flag?: string
  currency?: string
  currencySymbol?: string
  callingCode?: string
  localTime?: string
  latency?: number;
  ping?: number;
  pingAlive?: boolean;
}

// Cache local simples para evitar buscas repetidas na mesma sessão
const resultCache = new Map<string, GeolocationResult>()

export default function Home() {
  const { lang, setLang, country, setCountry, countryCode, setCountryCode, userLocation, setUserLocation } = useApp()
  const [result, setResult] = useState<GeolocationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [historyKey, setHistoryKey] = useState(0)
  const [livePing, setLivePing] = useState<number | undefined>(undefined)
  const t = translations[lang as Language]

  // Função para copiar o link atual e compartilhar
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      sounds.playSuccess()
      toast.success("Link copiado para a área de transferência!")
      triggerSuccessFeedback()
    }
  }

  // Exportação dos dados da consulta para JSON
  const handleExport = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ip-report-${result.query}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    sounds.playSuccess()
    toast.success("Relatório exportado com sucesso!")
    triggerSuccessFeedback()
  }

  // Efeito visual de brilho ao concluir uma ação com sucesso
  const [showSuccessGlow, setShowSuccessGlow] = useState(false)
  const triggerSuccessFeedback = () => {
    setShowSuccessGlow(true)
    setTimeout(() => setShowSuccessGlow(false), 1000)
  }

  // Verifica se existe um IP na URL ao carregar a página (compartilhamento)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedIp = params.get("ip")
    if (sharedIp) {
      handleSearch(sharedIp)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setResult(null)
        setCountry("")
        setError("")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Atualiza o Favicon dinamicamente com a bandeira do país buscado
  useEffect(() => {
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    
    if (result && result.flag) {
      const canvas = document.createElement("canvas")
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.font = "28px serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(result.flag, 16, 18)
        link.href = canvas.toDataURL("image/png")
      }
    } else {
      link.href = "/favicon.ico"
    }
    
    document.getElementsByTagName('head')[0].appendChild(link)
  }, [result])

  /**
   * Realiza a busca de geolocalização por IP ou Domínio
   */
  const handleSearch = async (ip: string) => {
    setLoading(true)
    setError("")

    // Verifica se já temos o resultado no cache local
    if (resultCache.has(ip)) {
      const data = resultCache.get(ip)!
      setResult(data)
      setCountry(data.country)
      setCountryCode(data.countryCode || "")
      setLoading(false)
      return
    }

    try {
      const startTime = Date.now()
      const response = await fetch(`${API_BASE_URL}/geolocation?ip=${encodeURIComponent(ip)}`)
      const data = await response.json()
      
      // Cálculo manual da latência da requisição HTTP inicial
      const latency = Date.now() - startTime
      data.latency = latency

      if (!response.ok) {
        throw new Error(data.message || "Falha ao buscar dados de geolocalização")
      }

      // Busca secundária de Ping TCP para maior precisão de rede
      try {
        const pingResponse = await fetch(`${API_BASE_URL}/ping?host=${encodeURIComponent(ip)}`, {
          cache: "no-store"
        })
        if (pingResponse.ok) {
          const pingData = await pingResponse.json()
          data.ping = pingData.latency
          data.pingAlive = pingData.alive
        }
      } catch (pingErr) {
        console.error("Erro no Ping:", pingErr)
      }

      // Salva no cache e atualiza o histórico
      resultCache.set(ip, data)
      addToHistory(ip)
      setHistoryKey((k) => k + 1)

      setResult(data)
      setLivePing(data.ping || data.latency)
      setCountry(data.country)
      setCountryCode(data.countryCode || "")

      // Atualiza a URL sem recarregar a página
      const url = new URL(window.location.href)
      url.searchParams.set("ip", ip)
      window.history.pushState({}, "", url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Busca os dados do próprio usuário ("Meu IP")
   */
  const handleMyIp = async () => {
    setLoading(true)
    setError("")

    try {
      let detectedIp = "me"
      try {
        // Tentamos descobrir o IP público vi ipify antes de consultar o nosso backend
        const ipRes = await fetch("https://api.ipify.org?format=json")
        const ipData = await ipRes.json()
        if (ipData.ip) {
          detectedIp = ipData.ip
        }
      } catch {
        // Se falhar, o backend 'me' lidará com isso usando os headers da requisição
      }

      const startTime = Date.now()
      const response = await fetch(`${API_BASE_URL}/geolocation?ip=${encodeURIComponent(detectedIp)}`)
      const data = await response.json()
      
      const latency = Date.now() - startTime
      data.latency = latency

      if (!response.ok) {
        throw new Error(data.message || "Falha ao detectar seu IP")
      }

      if (data.ip) {
        try {
          const pingResponse = await fetch(`${API_BASE_URL}/ping?host=${encodeURIComponent(data.ip)}`, {
            cache: "no-store"
          })
          if (pingResponse.ok) {
            const pingData = await pingResponse.json()
            data.ping = pingData.latency
            data.pingAlive = pingData.alive
          }
        } catch (pingErr) {
          console.error("Erro no Ping (My IP):", pingErr)
        }
      }

      resultCache.set(data.query, data)
      addToHistory(data.query)
      setHistoryKey((k) => k + 1)
      setResult(data)
      setLivePing(data.ping || data.latency)
      setCountry(data.country)
      setCountryCode(data.countryCode || "")
      setUserLocation({ lat: data.lat, lon: data.lon })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao detectar seu IP")
    } finally {
      setLoading(false)
    }
  }

  const handleHistorySelect = (ip: string) => {
    handleSearch(ip)
  }

  /**
   * Logística de Polling para o Ping em tempo real
   * Mantém a latência atualizada enquanto o resultado estiver visível.
   */
  useEffect(() => {
    if (!result || !result.query || loading) {
      setLivePing(undefined)
      return
    }

    const resultIp = result?.query
    const controller = new AbortController()
    const checkingRef = { current: false }
    let timeoutId: ReturnType<typeof setTimeout>

    const pollPing = async () => {
      if (checkingRef.current || !resultIp) return
      
      try {
        checkingRef.current = true
        const pingRes = await fetch(`${API_BASE_URL}/ping?host=${encodeURIComponent(resultIp)}`, {
          cache: "no-store",
          signal: controller.signal
        })
        if (!pingRes.ok) throw new Error("Erro na API de Ping")
        const pingData = await pingRes.json()
        if (pingData.alive) {
          setLivePing(pingData.latency)
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Monitoramento de ping falhou:", err)
        }
      } finally {
        checkingRef.current = false
        if (!controller.signal.aborted) {
          timeoutId = setTimeout(pollPing, 2000)
        }
      }
    }

    pollPing()

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [result?.query, loading])

  return (
    <main className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">
      {/* Overlay de feedback de sucesso */}
      <AnimatePresence>
        {showSuccessGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none bg-accent shadow-[inset_0_0_100px_rgba(123,95,255,1)]"
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-6 md:pt-32 md:pb-12 flex flex-col items-center">
        <div className="w-full space-y-4 md:space-y-8">
          {/* Cabeçalho principal */}
          <div className="text-center space-y-2 md:mb-4">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance tracking-tight leading-tight px-2">{t.title}</h2>
            <p className="text-sm sm:text-lg text-muted-foreground text-balance px-4">{t.subtitle}</p>
          </div>

          {/* Container principal de conteúdo */}
          <div className="rounded-2xl md:rounded-3xl bg-card/50 backdrop-blur-xl border border-border p-4 sm:p-8 space-y-6 shadow-2xl">
            <IPSearchForm 
              onSearch={handleSearch} 
              isLoading={loading} 
              lang={lang as Language} 
              onMyIp={handleMyIp} 
            />

            {/* Histórico de buscas recentes */}
            <div id="history" className="pt-2 border-t border-border/50">
              <div key={historyKey}>
                <SearchHistory onSelect={handleHistorySelect} lang={lang as Language} />
              </div>
            </div>

            {/* Exibição condicional de resultados, erros e loading */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-lg bg-red-950/20 border border-red-900/30 text-red-300 text-sm overflow-hidden"
                >
                  <p className="font-medium">{t.error}</p>
                  <p>{error}</p>
                </motion.div>
              )}

              {loading && !result && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SkeletonLoader />
                </motion.div>
              )}

              {result && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
                  <GeolocationResultComponent 
                    data={result} 
                    lang={lang as Language} 
                    livePing={livePing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Rodapé com links sociais */}
      <footer className="border-t border-border py-12 text-center space-y-6">
        <p className="text-sm text-muted-foreground">{t.footer}</p>
        <div className="flex justify-center items-center gap-6">
          <a 
            href="https://github.com/muriloatavares" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-card/30 border border-border hover:border-primary/50 hover:text-primary transition-all duration-300 premium-social"
            title="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a 
            href="https://www.instagram.com/muriloatavares/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-card/30 border border-border hover:border-pink-500/50 hover:text-pink-500 transition-all duration-300 premium-social"
            title="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <button 
            onClick={() => {
              navigator.clipboard.writeText("muriloatavares_")
              sounds.playSuccess()
              toast.success("Usuário do Discord copiado!")
            }}
            className="p-3 rounded-full bg-card/30 border border-border hover:border-indigo-500/50 hover:text-indigo-500 transition-all duration-300 cursor-pointer active:scale-95 premium-social"
            title="Copiar usuário do Discord"
          >
            <DiscordLogo className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </main>
  )
}
