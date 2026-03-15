"use client"

import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { LocationMap } from "@/components/location-map"
import { getFlagEmoji, getFlagUrl } from "@/lib/country-flags"
import { translations, type Language } from "@/lib/i18n"
import { useEffect, useState } from "react"
import { Share2, Download, Copy, FileJson, FileSpreadsheet, Info, Database, Calendar, UserCheck, Mail, ChevronRight, X } from "lucide-react"

/**
 * Estrutura de dados recebida da API de Geolocalização
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
  securityData?: {
    isCrawler?: boolean
    isSpam?: boolean
    isTor?: boolean
    isBot?: boolean
    threatLevel?: string
  }
  latency?: number;
  ping?: number;
  pingAlive?: boolean;
  whois?: {
    owner: string
    creationDate: string
    abuseEmail: string
    registrar: string
    fields?: Record<string, string | string[]>
    raw?: string
  }
}

interface GeolocationResultProps {
  data: GeolocationResult
  lang: Language
  livePing?: number
}

// Interface auxiliar para os cards de exibição
interface ResultItem {
  label: string
  value: string | number | undefined
  emoji: string
  className?: string
  flagUrl?: string
  isLive?: boolean
}

/**
 * Componente que exibe os detalhes de geolocalização processados.
 */
export function GeolocationResultComponent({ data, lang, livePing }: GeolocationResultProps) {
  const t = translations[lang]
  const [showAllFields, setShowAllFields] = useState(false)
  const flagEmoji = getFlagEmoji(data.country)
  const flagUrl = getFlagUrl(data.country)

  /**
   * Copia um resumo amigável dos dados para a área de transferência
   */
  const handleCopy = () => {
    const text = `
🌐 IP: ${data.query}
${data.flag || flagEmoji} País: ${data.country}
🗺️ Região: ${data.regionName}
🏙️ Cidade: ${data.city}
🌍 Continente: ${data.continent}
🕐 Fuso Horário: ${data.timezone}
🕙 Hora Local: ${data.localTime}
📍 Coordenadas: ${data.lat}, ${data.lon}
📡 Provedor (ISP): ${data.isp}
🔢 ASN: ${data.as}
🏢 Organização: ${data.org}
💻 Hostname: ${data.hostname}
💰 Moeda: ${data.currency} (${data.currencySymbol})
📞 DDI: +${data.callingCode}
🔒 Segurança: ${data.isVpn ? "VPN Detectada" : data.isProxy ? "Proxy Detectado" : "Conexão Limpa"}
    `.trim()

    navigator.clipboard.writeText(text)
    toast.success(t.copied)
  }

  /**
   * Exporta os dados em formato JSON
   */
  const handleExportJson = () => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ip-data-${data.query}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Exporta os dados em formato CSV para planilhas
   */
  const handleExportCsv = () => {
    const headers = Object.keys(data).join(",")
    const values = Object.values(data)
      .map((v) => `"${v}"`)
      .join(",")
    const csv = `${headers}\n${values}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ip-data-${data.query}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  /**
   * Gera um link de compartilhamento para este IP específico
   */
  const handleShare = () => {
    const shareUrl = `${window.location.origin}?ip=${data.query}`
    navigator.clipboard.writeText(shareUrl)
    toast.success(t.linkCopied)
  }

  // Prepara os itens que serão exibidos nos cards
  const resultItems: ResultItem[] = [
    { label: t.ip, value: data.query, emoji: "🌐" },
    {
      label: t.country,
      value: data.country,
      emoji: data.flag || flagEmoji,
      flagUrl: flagUrl,
    },
    { label: t.region, value: data.regionName, emoji: "🗺️" },
    { label: t.city, value: data.city, emoji: "🏙️" },
    { label: t.continent, value: data.continent, emoji: "🌍" },
    { label: t.timezone, value: data.timezone, emoji: "🕐" },
    { label: t.localTime, value: data.localTime, emoji: "🕙" },
    {
      label: t.coordinates,
      value: `${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`,
      emoji: "📍",
    },
    { label: t.isp, value: data.isp, emoji: "📡" },
    { label: t.asn, value: data.as, emoji: "🔢" },
    { label: t.organization, value: data.org, emoji: "🏢" },
    { label: t.hostname, value: data.hostname, emoji: "💻" },
    { 
      label: t.currency, 
      value: data.currency ? `${data.currency} ${data.currencySymbol ? `(${data.currencySymbol})` : ""}` : t.notAvailable, 
      emoji: "💰" 
    },
    { 
      label: t.callingCode, 
      value: data.callingCode ? `+${data.callingCode}` : t.notAvailable, 
      emoji: "📞" 
    },
  ]

  // Adiciona a latência/ping se estiver disponível
  const displayLatency = livePing !== undefined ? livePing : (data.ping !== undefined ? data.ping : data.latency)
  if (displayLatency !== undefined) {
    let latencyColor = "text-green-500"
    if (displayLatency > 500) latencyColor = "text-red-500"
    else if (displayLatency > 200) latencyColor = "text-yellow-500"

    resultItems.push({
      label: data.ping !== undefined || livePing !== undefined ? t.ispPing : t.connectionSpeed,
      value: `${displayLatency} ms`,
      emoji: "⚡",
      className: latencyColor,
      isLive: livePing !== undefined
    })
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-4"
    >
      {/* Visualização de Mapa Interativo */}
      <div className="rounded-xl overflow-hidden border border-border shadow-lg">
        <LocationMap lat={data.lat} lon={data.lon} city={data.city} country={data.country} />
      </div>

      {/* Grid de Informações Detalhadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {resultItems.map((item, index) => (
          <motion.div 
            key={item.label} 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(119, 0, 255, 0.1)" }}
            onClick={() => {
              if (item.label === t.coordinates) {
                // Abre o Google Maps ao clicar nas coordenadas
                window.open(`https://www.google.com/maps/search/?api=1&query=${data.lat},${data.lon}`, '_blank')
              }
            }}
            className={`rounded-lg bg-card/50 backdrop-blur-xl border border-border p-4 transition-colors hover:bg-card/80 hover:border-accent/30 group ${item.label === t.coordinates ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5 group-hover:text-accent transition-colors">
              {item.flagUrl ? (
                <motion.img 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  src={item.flagUrl} 
                  alt={item.label} 
                  className="w-5 h-auto inline-block rounded-sm shadow-sm" 
                />
              ) : (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.3, rotate: -10 }}
                  className="inline-block"
                >
                  {item.emoji}
                </motion.span>
              )}
              <span className="font-medium tracking-wider">{item.label}</span>
              
              {/* Indicador de Ping em Tempo Real */}
              {item.isLive && (
                <motion.span 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-accent w-1.5 h-1.5 rounded-full"
                  title="Monitoramento em tempo real"
                />
              )}
            </div>
            <div className={`mt-1 font-medium truncate ${item.className || "text-foreground"}`}>
              {item.label === t.localTime ? (
                <LiveClock initialTime={data.localTime || ""} />
              ) : (
                item.value
              )}
            </div>
          </motion.div>
        ))}
      </div>


      {/* Seção de Inteligência WHOIS (Proprietário do IP) */}
      <AnimatePresence>
        {data.whois && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-primary/20 p-6 space-y-4 bg-primary/5 backdrop-blur-xl shadow-[0_0_30px_rgba(119,0,255,0.05)] border-dashed"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">{t.whoisTitle}</h3>
                  <p className="text-xs text-muted-foreground">Informações de Registro e Propriedade de Rede</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors">
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t.whoisOwner}</p>
                  <p className="text-sm font-bold text-foreground">{data.whois.owner}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t.whoisCreated}</p>
                  <p className="text-sm font-bold text-foreground">{data.whois.creationDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t.whoisAbuse}</p>
                  <p className="text-sm font-bold text-foreground break-all">{data.whois.abuseEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{t.whoisRegistrar}</p>
                  <p className="text-sm font-bold text-foreground">{data.whois.registrar}</p>
                </div>
              </div>
            </div>

            {/* Todos os Campos WHOIS Parseados */}
            {data.whois.fields && Object.keys(data.whois.fields).length > 0 && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowAllFields(!showAllFields)}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <ChevronRight className={`w-3 h-3 transition-transform ${showAllFields ? 'rotate-90' : ''}`} />
                  {showAllFields ? (lang === 'pt' ? 'Ocultar Campos' : 'Hide Fields') : (lang === 'pt' ? `Mostrar Todos os Campos (${Object.keys(data.whois.fields).length})` : `Show All Fields (${Object.keys(data.whois.fields).length})`)}
                </button>

                <AnimatePresence>
                  {showAllFields && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                        {Object.entries(data.whois.fields).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors"
                          >
                            <div className="p-2 rounded-lg bg-primary/5 group-hover:bg-primary/20 transition-colors">
                              <Database className="w-4 h-4 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{key}</p>
                              <p className="text-sm font-bold text-foreground break-all">
                                {Array.isArray(value) ? value.join(' | ') : value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Botões de Ação Final */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        <Button onClick={handleCopy} variant="outline" className="flex-1 sm:flex-initial min-w-[120px] bg-transparent cursor-pointer hover:bg-accent/10 hover:border-accent gap-2 premium-button">
          <Copy className="w-4 h-4" /> {t.copy}
        </Button>
        <Button onClick={handleExportJson} variant="outline" className="flex-1 sm:flex-initial min-w-[120px] bg-transparent cursor-pointer hover:bg-accent/10 hover:border-accent gap-2 premium-button">
          <FileJson className="w-4 h-4" /> {t.exportJson}
        </Button>
        <Button onClick={handleExportCsv} variant="outline" className="flex-1 sm:flex-initial min-w-[120px] bg-transparent cursor-pointer hover:bg-accent/10 hover:border-accent gap-2 premium-button">
          <FileSpreadsheet className="w-4 h-4" /> {t.exportCsv}
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1 sm:flex-initial min-w-[120px] bg-transparent cursor-pointer hover:bg-accent/10 hover:border-accent gap-2 premium-button">
          <Share2 className="w-4 h-4" /> {t.share}
        </Button>
      </motion.div>
    </motion.div>
  )
}

/**
 * Pequeno relógio que avança os segundos localmente para dar vida à interface.
 */
function LiveClock({ initialTime }: { initialTime: string }) {
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    if (!initialTime) return
    setTime(initialTime)

    const interval = setInterval(() => {
      setTime(prev => {
        try {
          const parts = prev.split(' ');
          const hms = parts[0];
          const ampm = parts[1];
          
          let [h, m, s] = hms.split(':').map(Number);
          if (isNaN(h) || isNaN(m) || isNaN(s)) return prev;

          s++;
          if (s >= 60) { s = 0; m++; }
          if (m >= 60) { m = 0; h++; }
          
          if (ampm) {
            if (h > 12) h = 1;
          } else {
            if (h >= 24) h = 0;
          }

          const pad = (n: number) => n.toString().padStart(2, '0');
          return `${pad(h)}:${pad(m)}:${pad(s)}${ampm ? ' ' + ampm : ''}`;
        } catch {
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime]);

  return <span>{time}</span>
}
