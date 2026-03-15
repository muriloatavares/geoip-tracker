"use client"

import { type FormEvent, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { translations, type Language } from "@/lib/i18n"

interface IPSearchFormProps {
  onSearch: (ip: string) => Promise<void>
  isLoading?: boolean
  lang: Language
  onMyIp: () => void
}

/**
 * Componente de Formulário de Busca
 * Lida com a entrada de IP/Domínio, validação e submissão.
 */
export function IPSearchForm({ onSearch, isLoading = false, lang, onMyIp }: IPSearchFormProps) {
  const [ip, setIp] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const t = translations[lang]

  // Expressões regulares para validação de entrada
  const ipv4Regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/
  const ipv6Regex = /^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){1,7}:|(?:[a-fA-F\d]{1,4}:){1,6}:[a-fA-F\d]{1,4}|(?:[a-fA-F\d]{1,4}:){1,5}(?::[a-fA-F\d]{1,4}){1,2}|(?:[a-fA-F\d]{1,4}:){1,4}(?::[a-fA-F\d]{1,4}){1,3}|(?:[a-fA-F\d]{1,4}:){1,3}(?::[a-fA-F\d]{1,4}){1,4}|(?:[a-fA-F\d]{1,4}:){1,2}(?::[a-fA-F\d]{1,4}){1,5}|[a-fA-F\d]{1,4}:(?::[a-fA-F\d]{1,4}){1,6}|:(?:(?::[a-fA-F\d]{1,4}){1,7}|:)|fe80:(?::[a-fA-F\d]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])|(?:[a-fA-F\d]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(?:25[0-5]|(?:2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}$/

  // Verifica se o que foi digitado é minimamente válido para busca
  const isValid = ip.trim() && (ipv4Regex.test(ip) || ipv6Regex.test(ip) || domainRegex.test(ip))

  /**
   * Dispara a busca principal
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!ip.trim()) {
      setError("Por favor, digite um IP ou domínio válido")
      return
    }

    try {
      await onSearch(ip.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={ip}
          autoFocus
          onChange={(e) => {
            setIp(e.target.value)
            if (error) setError("")
          }}
          placeholder={t.searchPlaceholder}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-lg bg-input border premium-input transition-all disabled:opacity-50 focus:outline-none focus:ring-2 ${
            isValid 
              ? "border-accent/50 focus:ring-accent" 
              : ip.trim() 
                ? "border-red-500/50 focus:ring-red-500/30" 
                : "border-border focus:ring-accent"
          }`}
          aria-label="IP search input"
        />
      </div>

      {/* Exibição de erros de validação com animação */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="error-msg px-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:w-auto min-w-[160px] premium-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? t.searching : `🔍 ${t.searchButton}`}
        </Button>
        
        {/* Atalho para buscar o próprio IP */}
        <div className="sm:absolute sm:right-0">
          <Button
            type="button"
            onClick={onMyIp}
            disabled={isLoading}
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all cursor-pointer text-xs"
          >
            📍 {t.myIpButton}
          </Button>
        </div>
      </div>
    </form>
  )
}

/**
 * Função utilitária para preencher o input programaticamente (usado pelo histórico)
 */
export function setSearchInput(value: string) {
  const input = document.querySelector('input[aria-label="IP search input"]') as HTMLInputElement
  if (input) {
    input.value = value
    input.dispatchEvent(new Event("input", { bubbles: true }))
  }
}
