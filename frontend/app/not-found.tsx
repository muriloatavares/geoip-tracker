"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Home, Search, ShieldAlert, ArrowLeft } from "lucide-react"
import { useApp } from "./layout"
import { translations, type Language } from "@/lib/i18n"

/**
 * Custom 404 Page (Not Found)
 * Features a premium design with glassmorphism, animations, and quick navigation.
 * Now fully bilingual.
 */
export default function NotFound() {
  const { lang } = useApp()
  const t = translations[lang as Language]

  return (
    <main className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-8 p-8 md:p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border border-white/5 shadow-2xl"
      >
        {/* Animated Icon */}
        <div className="flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
              y: [0, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="p-6 rounded-3xl bg-primary/10 text-primary"
          >
            <ShieldAlert className="w-16 h-16" />
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40"
          >
            {t.nfTitle}
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold tracking-tight"
          >
            {t.nfSubtitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground"
          >
            {t.nfDescription}
          </motion.p>
        </div>

        {/* Navigation Button */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <Home className="w-5 h-5" />
            {t.nfReturnHome}
          </Link>
        </motion.div>

        {/* Footer Hint */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.7 }}
          className="text-xs font-mono flex items-center justify-center gap-2 text-muted-foreground"
        >
          <Search className="w-3 h-3" />
          <span>{t.nfErrorCode}</span>
        </motion.div>
      </motion.div>
    </main>
  )
}
