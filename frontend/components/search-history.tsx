import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { translations, type Language } from "@/lib/i18n"
import { Pin, PinOff, Trash2 } from "lucide-react"

interface SearchHistoryProps {
  onSelect: (ip: string) => void
  lang: Language
}

interface HistoryItem {
  ip: string
  pinned: boolean
}

/**
 * Componente de Histórico de Buscas
 * Exibe os IPs pesquisados recentemente e permite fixá-los (pin).
 */
export function SearchHistory({ onSelect, lang }: SearchHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const t = translations[lang]

  useEffect(() => {
    loadHistory()
  }, [])

  // Carrega o histórico salvo no navegador (localStorage)
  const loadHistory = () => {
    const stored = localStorage.getItem("ip-search-history-v5")
    if (stored) {
      setHistory(JSON.parse(stored))
    }
  }

  /**
   * Fixa ou desfixa um item no topo do histórico
   */
  const togglePin = (ip: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newHistory = history.map(item => 
      item.ip === ip ? { ...item, pinned: !item.pinned } : item
    )
    
    // Mantém os fixados sempre no topo
    const sorted = [...newHistory].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
    setHistory(sorted)
    localStorage.setItem("ip-search-history-v5", JSON.stringify(sorted))
  }

  /**
   * Remove todos os itens do histórico, exceto os que estiverem fixados
   */
  const clearHistory = () => {
    const pinnedItems = history.filter(item => item.pinned)
    setHistory(pinnedItems)
    localStorage.setItem("ip-search-history-v5", JSON.stringify(pinnedItems))
  }

  // Se não houver nada para mostrar, o componente fica invisível
  if (history.length === 0) {
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="space-y-3 overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
          <Pin className="w-3 h-3" />
          {t.historyTitle}
        </p>
        <button
          onClick={clearHistory}
          className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          {t.historyClear}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence mode="popLayout">
          {history.slice(0, 8).map((item) => (
            <motion.div
              key={item.ip}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <button
                onClick={() => onSelect(item.ip)}
                className={`pl-3 ${item.pinned ? 'pr-8' : 'pr-3'} py-1.5 text-sm rounded-full transition-all border flex items-center gap-2 cursor-pointer
                  ${item.pinned 
                    ? 'bg-accent/20 border-accent/40 text-accent-foreground font-medium shadow-[0_0_15px_rgba(123,95,255,0.2)]' 
                    : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {item.ip}
                {item.pinned && <Pin className="w-3 h-3 absolute right-3 text-accent" />}
              </button>
              
              {/* Botão flutuante para fixar/desfixar item */}
              <button
                onClick={(e) => togglePin(item.ip, e)}
                className={`absolute -top-2 -right-1 p-1 rounded-full bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted cursor-pointer z-10
                  ${item.pinned ? 'text-accent' : 'text-muted-foreground'}`}
                title={item.pinned ? "Remover fixado" : "Fixar no topo"}
              >
                {item.pinned ? <PinOff className="w-2.5 h-2.5" /> : <Pin className="w-2.5 h-2.5" />}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/**
 * Função global para adicionar um novo IP ao histórico localmente
 */
export function addToHistory(ip: string) {
  const stored = localStorage.getItem("ip-search-history-v5")
  let history: HistoryItem[] = stored ? JSON.parse(stored) : []

  const existing = history.find(h => h.ip === ip)
  const isPinned = existing?.pinned || false

  // Se já existir, removemos a versão antiga para recolocá-la no topo
  history = history.filter((h) => h.ip !== ip)
  
  // Adiciona o novo item
  history.unshift({ ip, pinned: isPinned })

  // Reordena: fixados primeiro
  history.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))

  // Limita o histórico a um máximo de 20 itens para evitar sobrecarga no armazenamento local.
  history = history.slice(0, 20)

  // Salva o histórico atualizado de volta no localStorage.
  localStorage.setItem("ip-search-history-v5", JSON.stringify(history))
}
