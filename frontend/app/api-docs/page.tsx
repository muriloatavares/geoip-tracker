"use client"

import { translations, type Language } from "@/lib/i18n"
import { motion } from "framer-motion"
import { Code2, Terminal, Cpu, ShieldCheck, Globe, ArrowRight, Github, Activity } from "lucide-react"
import Link from "next/link"
import { useApp } from "../layout"
import API_BASE_URL from "@/lib/api-config"

export default function ApiDocs() {
  const { lang, setLang } = useApp()
  const t = translations[lang as Language]

  const jsonSnippet = `{
  "status": "success",
  "query": "1.1.1.1",
  "country": "Australia",
  "countryCode": "AU",
  "city": "Sydney",
  "lat": -33.8688,
  "lon": 151.2093,
  "timezone": "Australia/Sydney",
  "isp": "Cloudflare, Inc.",
  "ping": 12,
  "pingAlive": true,
  "latency": 45,
  "weather": {
    "temp": 22,
    "condition": "clear",
    "description": "Clear Sky"
  },
  "localTime": "12:00:00 PM"
}`

  const githubJsonSnippet = `{
  "profile": {
    "login": "torvalds",
    "name": "Linus Torvalds",
    "bio": "The silicon forest",
    "followers": 208544,
    "public_repos": 7,
    "created_at": "2011-09-03T15:26:22Z"
  },
  "stack": {
    "top_languages": [["C", 5], ["Shell", 2]],
    "distribution": { "C": 71.43, "Shell": 28.57 }
  },
  "top_repos": [
    { "name": "linux", "stars": 182345, "forks": 52134 }
  ],
  "activity": {
    "years_active": 12.5,
    "repo_density": 0.56
  }
}`

  const curlSnippet = `curl "${API_BASE_URL}/geolocation?ip=1.1.1.1"`
  const jsSnippet = `const res = await fetch("${API_BASE_URL}/geolocation?ip=1.1.1.1");
const data = await res.json();
console.log(data.country); // Australia\``

  return (
    <main className="min-h-screen flex flex-col bg-transparent overflow-x-hidden">

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12 md:pt-32 md:pb-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50 tracking-tight">
              {t.apiTitle}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              {t.apiSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar/Quick Links - Mobile Dropdown / Desktop Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-card/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon space-y-4 md:space-y-6">
                  <h3 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary/80 dark:text-primary">{t.apiAuth}</h3>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-xs md:text-sm text-foreground/80">
                      {t.apiNoAuth}
                    </p>
                  </div>
                  
                  <hr className="border-white/5" />
                  
                  <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                    {[
                      { href: "#endpoint", icon: Terminal, label: t.apiEndpoint },
                      { href: "#params", icon: Cpu, label: t.apiParams },
                      { href: "#ping", icon: Terminal, label: "Ping" },
                      { href: "#github", icon: Github, label: "GitHub OSINT" },
                      { href: "#health", icon: Activity, label: t.apiHealthTitle },
                      { href: "#response", icon: Code2, label: t.apiResponse }
                    ].map((item) => (
                      <a 
                        key={item.href}
                        href={item.href} 
                        className="flex items-center shrink-0 lg:shrink gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-primary/10 text-xs md:text-sm font-medium transition-colors group"
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="whitespace-nowrap">{item.label}</span>
                        <ArrowRight className="hidden lg:block w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-auto" />
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Endpoint Section */}
              <section id="endpoint" className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">{t.apiGetIp}</h2>
                </div>
                
                <p className="text-muted-foreground">{t.apiDescription}</p>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-black/40 border-black/5 dark:border-white/5 font-mono text-sm shadow-inner">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-green-500/20 text-emerald-700 dark:text-green-400 font-bold uppercase">GET</span>
                  <span className="text-foreground/80 break-all">/api/geolocation</span>
                </div>

                <div id="params" className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg">{t.apiParams}</h3>
                  <div className="overflow-x-auto rounded-2xl border border-white/5">
                    <table className="w-full text-sm text-left min-w-[400px]">
                      <thead className="bg-muted/50 dark:bg-white/5 text-foreground font-bold">
                        <tr>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableParam}</th>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableType}</th>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableRequired}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        <tr>
                          <td className="px-4 py-3 font-mono text-indigo-600 dark:text-primary">ip</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-muted-foreground">string</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-muted-foreground">{t.apiNo}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground pl-1 italic">
                    * {t.apiParamIp}
                  </p>
                </div>
              </section>

              {/* Ping Endpoint Section */}
              <section id="ping" className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">{t.apiPingTitle}</h2>
                </div>
                
                <p className="text-sm md:text-base text-muted-foreground">{t.apiPingDescription}</p>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-black/40 border-black/5 dark:border-white/5 font-mono text-xs md:text-sm shadow-inner overflow-x-auto">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-green-500/20 text-emerald-700 dark:text-green-400 font-bold uppercase">GET</span>
                  <span className="text-foreground/80 whitespace-nowrap">/api/ping</span>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg">{t.apiParams}</h3>
                  <div className="overflow-x-auto rounded-2xl border border-white/5">
                    <table className="w-full text-sm text-left min-w-[400px]">
                      <thead className="bg-muted/50 dark:bg-white/5 text-foreground font-bold">
                        <tr>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableParam}</th>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableType}</th>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableRequired}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        <tr>
                          <td className="px-4 py-3 font-mono text-indigo-600 dark:text-primary">host</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-muted-foreground">string</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-muted-foreground">{t.apiYes}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground pl-1 italic">
                    * {t.apiPingParamHost}
                  </p>
                </div>
              </section>

              {/* GitHub OSINT Endpoint Section */}
              <section id="github" className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Github className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">{t.apiGithubTitle}</h2>
                </div>
                
                <p className="text-sm md:text-base text-muted-foreground">{t.apiGithubDescription}</p>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-black/40 border-black/5 dark:border-white/5 font-mono text-xs md:text-sm shadow-inner overflow-x-auto">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-green-500/20 text-emerald-700 dark:text-green-400 font-bold uppercase">GET</span>
                  <span className="text-foreground/80 whitespace-nowrap">/api/github</span>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg">{t.apiParams}</h3>
                  <div className="overflow-x-auto rounded-2xl border border-white/5">
                    <table className="w-full text-sm text-left min-w-[400px]">
                      <thead className="bg-muted/50 dark:bg-white/5 text-foreground font-bold">
                        <tr>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableParam}</th>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableType}</th>
                          <th className="px-4 py-3 border-b border-black/5 dark:border-white/5">{t.apiTableRequired}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5 dark:divide-white/5">
                        <tr>
                          <td className="px-4 py-3 font-mono text-indigo-600 dark:text-primary">username</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-muted-foreground">string</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-muted-foreground">{t.apiYes}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground pl-1 italic">
                    * {t.apiGithubParamUsername}
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg">{t.apiResponse}</h3>
                  <div className="bg-muted/30 dark:bg-black/80 rounded-2xl border-black/5 dark:border-white/5 p-4 md:p-6 overflow-x-auto shadow-inner">
                    <pre className="text-xs md:text-sm font-mono text-cyan-700 dark:text-cyan-400">
                      <code>{githubJsonSnippet}</code>
                    </pre>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/github-intelligence" className="inline-flex items-center gap-2 text-primary hover:underline font-bold">
                    <Github className="w-4 h-4" /> Investigar com a ferramenta interativa <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>


              {/* Health Endpoint Section */}
              <section id="health" className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">{t.apiHealthTitle}</h2>
                </div>
                
                <p className="text-sm md:text-base text-muted-foreground">{t.apiHealthDescription}</p>
                
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 dark:bg-black/40 border-black/5 dark:border-white/5 font-mono text-xs md:text-sm shadow-inner overflow-x-auto">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/10 dark:bg-green-500/20 text-emerald-700 dark:text-green-400 font-bold uppercase">GET</span>
                  <span className="text-foreground/80 whitespace-nowrap">/api/health</span>
                </div>
                
                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg">{t.apiResponse}</h3>
                  <div className="bg-muted/30 dark:bg-black/80 rounded-2xl border-black/5 dark:border-white/5 p-4 md:p-6 overflow-x-auto shadow-inner">
                    <pre className="text-xs md:text-sm font-mono text-cyan-700 dark:text-cyan-400">
                      <code>{`{
  "status": "ok",
  "message": "Sistema operacional e respondendo.",
  "timestamp": "2024-03-20T12:00:00Z",
  "version": "1.0.0",
  "uptime": 1234.56
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Response Section */}
              <section id="response" className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold">{t.apiResponse}</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 dark:bg-black/80 rounded-2xl border-black/5 dark:border-white/5 p-4 md:p-6 overflow-x-auto shadow-inner">
                    <pre className="text-xs md:text-sm font-mono text-cyan-700 dark:text-cyan-400">
                      <code>{jsonSnippet}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Examples Section */}
              <section id="examples" className="space-y-6">
                 <h2 className="text-xl md:text-2xl font-bold px-2">{t.apiExamples}</h2>
                 <div className="grid grid-cols-1 gap-6">
                   <div className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-6 space-y-4">
                     <p className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">{t.apiCurl}</p>
                     <div className="bg-muted/40 dark:bg-black/80 rounded-2xl p-4 font-mono text-[10px] md:text-xs text-emerald-700 dark:text-green-400 border border-black/5 dark:border-white/10 break-all shadow-inner">
                       {curlSnippet}
                     </div>
                   </div>

                   <div className="bg-card/80 backdrop-blur-2xl rounded-3xl border border-black/5 dark:border-white/10 shadow-sm dark:shadow-neon p-6 space-y-4">
                     <p className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">{t.apiJS}</p>
                     <div className="bg-muted/40 dark:bg-black/80 rounded-2xl p-4 font-mono text-[10px] md:text-xs text-primary/80 dark:text-primary border border-black/5 dark:border-white/10 overflow-x-auto shadow-inner">
                       <pre><code>{jsSnippet}</code></pre>
                     </div>
                   </div>
                 </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="border-t border-border/50 py-12 text-center mt-auto">
        <p className="text-sm text-muted-foreground">{t.footer}</p>
      </footer>
    </main>
  )
}
