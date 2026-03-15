"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface WorldClockProps {
  timezone: string
}

export function WorldClock({ timezone }: WorldClockProps) {
  const [time, setTime] = useState<string>("")
  const [isDay, setIsDay] = useState(true)

  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date()
        const options: Intl.DateTimeFormatOptions = {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }
        const timeString = new Intl.DateTimeFormat("en-GB", options).format(now)
        setTime(timeString)

        // Determina se é dia (entre 6h e 18h)
        const hour = parseInt(timeString.split(":")[0])
        setIsDay(hour >= 6 && hour < 18)
      } catch (e) {
        console.error("Erro na sincronização do relógio:", e)
      }
    }

    updateClock()
    const timer = setInterval(updateClock, 1000)
    return () => clearInterval(timer)
  }, [timezone])

  if (!time) return null

  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl border backdrop-blur-md transition-all duration-700 ${
      isDay 
        ? "bg-amber-500/5 border-amber-500/20 text-amber-200" 
        : "bg-indigo-500/5 border-indigo-500/20 text-indigo-200"
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <Clock className={`w-4 h-4 ${isDay ? "animate-pulse text-amber-400" : "text-indigo-400"}`} />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Horário Local</span>
      </div>
      <div className="text-3xl font-mono font-bold tracking-tighter">
        {time}
      </div>
      <div className="text-[10px] mt-1 opacity-50 font-medium">
        {timezone.replace("_", " ")}
      </div>
    </div>
  )
}
