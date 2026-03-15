"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Github, Star, GitFork, BookOpen, Calendar, MapPin, Link as LinkIcon, Twitter, Users, Code, Activity, Loader2, ArrowLeft, Cpu } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import API_BASE_URL from "@/lib/api-config"

interface GitHubOSINTData {
  profile: {
    login: string
    name: string
    bio: string
    company: string
    blog: string
    location: string
    followers: number
    following: number
    public_repos: number
    avatar_url: string
    created_at: string
    twitter: string
  }
  stack: {
    top_languages: [string, number][]
    distribution: Record<string, number>
  }
  top_repos: {
    name: string
    stars: number
    forks: number
    language: string
    description: string
    url: string
  }[]
  activity: {
    years_active: number
    repo_density: number
  }
}

export default function GitHubIntelligencePage() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<GitHubOSINTData | null>(null)
  const [error, setError] = useState("")

  const handleSearch = async (e: any) => {
    e.preventDefault()
    if (!username.trim()) return

    setLoading(true)
    setError("")
    setData(null)

    try {
      const res = await fetch(`${API_BASE_URL}/github?username=${encodeURIComponent(username.trim())}`)
      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch GitHub data")
      }

      setData(result)
      toast.success("Intelligence report generated!")
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-transparent text-foreground">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to GeoIP Tracker
              </Link>
              <Link href="/api-docs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Cpu className="w-4 h-4" /> API Documentation
              </Link>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">GitHub <span className="text-primary">Intelligence</span></h1>
            <p className="text-muted-foreground">Advanced OSINT tool for developer profiling and tech stack analysis.</p>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-auto flex gap-2">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Enter username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card/50 backdrop-blur-xl border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button
              disabled={loading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
              {loading ? "Analyzing..." : "Trace"}
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 text-red-300 text-center"
            >
              {error}
            </motion.div>
          )}

          {data && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Profile Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-1 space-y-6"
              >
                <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <img src={data.profile.avatar_url} alt={data.profile.login} className="w-32 h-32 rounded-3xl border-4 border-primary/20 shadow-2xl shadow-primary/10" />
                    <div>
                      <h2 className="text-2xl font-bold">{data.profile.name || data.profile.login}</h2>
                      <p className="text-primary font-mono text-sm">@{data.profile.login}</p>
                    </div>
                  </div>

                  <p className="text-sm text-balance text-muted-foreground leading-relaxed">
                    {data.profile.bio || "No biography provided."}
                  </p>

                  <div className="space-y-3">
                    {data.profile.location && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 text-primary" /> {data.profile.location}
                      </div>
                    )}
                    {data.profile.blog && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <LinkIcon className="w-4 h-4 text-primary" /> 
                        <a href={data.profile.blog} target="_blank" className="hover:text-primary truncate transition-colors">{data.profile.blog}</a>
                      </div>
                    )}
                    {data.profile.twitter && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Twitter className="w-4 h-4 text-primary" /> 
                        <a href={`https://twitter.com/${data.profile.twitter}`} target="_blank" className="hover:text-primary transition-colors">@{data.profile.twitter}</a>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" /> Active since {new Date(data.profile.created_at).getFullYear()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 text-center">
                    <div>
                      <p className="text-2xl font-bold">{data.profile.followers}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{data.profile.public_repos}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Repos</p>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 overflow-hidden">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Activity Status</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Account Age</span>
                      <span className="font-mono text-primary">{data.activity.years_active} Years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Repo Density</span>
                      <span className="font-mono text-primary">{data.activity.repo_density} / yr</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:col-span-2 space-y-6"
              >
                {/* Tech Stack */}
                <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Code className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Technology Stack</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {data.stack.top_languages.map(([lang, count]) => (
                        <div key={lang} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span>{lang}</span>
                            <span className="text-muted-foreground">{data.stack.distribution[lang]}%</span>
                          </div>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${data.stack.distribution[lang]}%` }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 content-start">
                      {Object.entries(data.stack.distribution).slice(0, 10).map(([lang, pct]) => (
                        <span key={lang} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Repositories */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Elite Repositories</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {data.top_repos.map((repo, i) => (
                      <motion.a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-card/50 backdrop-blur-xl border border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <h4 className="font-bold group-hover:text-primary transition-colors">{repo.name}</h4>
                             {repo.language && (
                               <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase font-semibold">
                                 {repo.language}
                               </span>
                             )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-md">{repo.description || "No description provided."}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 sm:mt-0 text-sm font-mono">
                          <div className="flex items-center gap-1.5 text-yellow-500/80">
                            <Star className="w-4 h-4 fill-yellow-500/20" /> {repo.stars}
                          </div>
                          <div className="flex items-center gap-1.5 text-blue-500/80">
                            <GitFork className="w-4 h-4" /> {repo.forks}
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  )
}
