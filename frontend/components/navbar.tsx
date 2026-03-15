"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ThemeSwitcher } from "./theme-switcher"
import { LanguageSwitcher } from "./language-switcher"
import { translations, type Language } from "@/lib/i18n"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { Shield, History, Activity, Github, Menu, X, ArrowRight } from "lucide-react"
import API_BASE_URL from "@/lib/api-config"

interface NavbarProps {
  lang: Language
  onLanguageChange: (lang: Language) => void
}

/**
 * Componente de Navegação Principal (Navbar)
 * Gerencia o menu desktop, o menu mobile expansível e o status do sistema em tempo real.
 */
export function Navbar({ lang, onLanguageChange }: NavbarProps) {
  // Estados para monitoramento da saúde da API
  const [apiStatus, setApiStatus] = useState<"online" | "offline" | "checking">("checking")
  const [latency, setLatency] = useState<number | null>(null)
  
  // Controle do menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const checkingRef = useRef(false)
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t = translations[lang]

  /**
   * Verifica a conectividade com o servidor de backend
   */
  const checkStatus = useCallback(async (signal: AbortSignal) => {
    if (checkingRef.current || signal.aborted) return
    checkingRef.current = true

    try {
      const res = await fetch(`${API_BASE_URL}/ping`, { cache: "no-store", signal })
      if (!res.ok) throw new Error("Ping API error")
      const data = await res.json()

      if (!signal.aborted) {
        if (data.alive) {
          setApiStatus("online")
          setLatency(data.latency)
        } else {
          setApiStatus("offline")
          setLatency(null)
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError' && !signal.aborted) {
        setApiStatus("offline")
        setLatency(null)
      }
    } finally {
      checkingRef.current = false
      if (!signal.aborted) {
        // Agenda a próxima verificação para dali 15 segundos
        timeoutIdRef.current = setTimeout(() => checkStatus(signal), 15000)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    checkStatus(controller.signal)
    return () => {
      controller.abort()
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current)
    }
  }, [checkStatus])

  // Define as cores e textos do indicador de status baseado no estado atual
  const statusConfig = useMemo(() => {
    switch (apiStatus) {
      case "online":
        return {
          statusColor: "text-green-500",
          statusBg: "bg-green-500/10 border-green-500/20",
          ledBg: "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]",
          label: "ONLINE"
        }
      case "offline":
        return {
          statusColor: "text-red-500",
          statusBg: "bg-red-500/10 border-red-500/20",
          ledBg: "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]",
          label: "OFFLINE"
        }
      default:
        return {
          statusColor: "text-yellow-500",
          statusBg: "bg-yellow-500/10 border-yellow-500/20",
          ledBg: "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]",
          label: "CHECKING"
        }
    }
  }, [apiStatus])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-between w-full max-w-5xl px-4 py-2 bg-background/40 backdrop-blur-xl border border-white/5 rounded-full shadow-2xl pointer-events-auto"
      >
        <div className="flex items-center gap-4">
          {/* Logo principal com link para home */}
          <Link href="/" aria-label="Home" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center h-8 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/assets/logo.svg"
                alt="GeoIP Intelligence Tool"
                width={120}
                height={32}
                className="object-contain w-auto h-full"
                priority
              />
            </div>
          </Link>

          {/* Indicador de Status do Sistema (LED e Latência) */}
          <div
            aria-live="polite"
            className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border transition-colors duration-500 ${statusConfig.statusBg}`}
          >
            <motion.div
              whileHover={{ scale: 1.2 }}
              animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${statusConfig.ledBg}`}
            />
            <div className="flex flex-col items-start leading-[1.1] gap-0">
              <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors duration-500 ${statusConfig.statusColor}`}>
                {statusConfig.label}
              </span>
              <AnimatePresence mode="wait">
                {latency !== null ? (
                  <motion.span
                    key="latency"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    className="text-[8px] font-medium text-muted-foreground/60 tabular-nums uppercase"
                  >
                    PING {latency}ms
                  </motion.span>
                ) : (
                  apiStatus === "checking" && (
                    <motion.span
                      key="checking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[8px] font-medium text-muted-foreground/40"
                    >
                      ...
                    </motion.span>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Menu para Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-6 mr-4 text-sm font-medium text-muted-foreground">
            <Link href="/api-docs" className="hover:text-primary transition-colors duration-200 font-bold tracking-tight flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              API
            </Link>
            <Link href="/github-intelligence" className="hover:text-primary transition-colors duration-200 font-bold tracking-tight flex items-center gap-1.5">
              <Github className="w-3 h-3" />
              Github
            </Link>
          </div>

          {/* Troca de Tema e Idioma */}
          <div className="flex items-center gap-2 border-l border-border/50 pl-4 h-8">
            <ThemeSwitcher />
            <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
          </div>
        </div>

        {/* Botão para abrir o menu mobile */}
        <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-primary/10 text-primary border border-primary/20 cursor-pointer active:scale-90 transition-transform"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
        </div>
      </motion.div>

      {/* Overlay do Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Fundo escurecido para foco no menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-md z-40 md:hidden pointer-events-auto"
            />
            
            {/* Conteúdo do Menu Mobile (Card centralizado) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-20 left-4 right-4 z-50 p-1 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col md:hidden overflow-hidden"
            >
                <div className="p-6 space-y-6">
                    {/* Links de navegação mobile */}
                    <div className="flex flex-col gap-3">
                        <Link 
                            href="/api-docs" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-4 rounded-3xl bg-white/5 hover:bg-primary/10 border border-white/5 transition-all group active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="font-bold">{t.navApi}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                        <Link 
                            href="/github-intelligence" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center justify-between p-4 rounded-3xl bg-white/5 hover:bg-primary/10 border border-white/5 transition-all group active:scale-95"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Github className="w-5 h-5" />
                                </div>
                                <span className="font-bold">Github OSINT</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    </div>

                    {/* Status do Sistema no Mobile */}
                    <div className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${statusConfig.ledBg} animate-pulse`} />
                            <div className="flex flex-col">
                                <span className="text-xs font-black uppercase tracking-widest leading-none">{statusConfig.label}</span>
                                <span className="text-[10px] text-muted-foreground uppercase mt-1">{t.systemStatus}</span>
                            </div>
                        </div>
                        {latency !== null && (
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-muted-foreground">
                                {latency}{t.msLatency}
                            </div>
                        )}
                    </div>

                    {/* Controles de Tema e Idioma Mobile */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-2 p-4 rounded-3xl bg-white/5 border border-white/5 items-center">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{t.theme}</span>
                            <ThemeSwitcher />
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-3xl bg-white/5 border border-white/5 items-center">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{t.language}</span>
                            <LanguageSwitcher currentLang={lang} onLanguageChange={onLanguageChange} />
                        </div>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}