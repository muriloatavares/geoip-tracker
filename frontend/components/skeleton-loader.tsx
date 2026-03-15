import { motion } from "framer-motion"

export function SkeletonLoader() {
  // Neural frequency timing: fast-slow-fast irregular pulse
  const neuralPulse = {
    opacity: [0.3, 0.8, 0.4, 0.9, 0.35, 0.6, 0.3],
    scale: [1, 1.01, 1, 1.02, 1, 1.01, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as any,
      times: [0, 0.1, 0.25, 0.45, 0.6, 0.85, 1]
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Map skeleton with neural pulse */}
      <motion.div 
        animate={neuralPulse}
        className="w-full h-64 md:h-80 rounded-lg bg-muted/40 border border-border/50 shadow-inner" 
      />

      {/* Result cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative overflow-hidden rounded-lg bg-muted/20 border border-border/50 p-4 space-y-2"
          >
            <motion.div 
              animate={neuralPulse}
              className="h-3 w-20 bg-muted/50 rounded mb-2" 
            />
            <motion.div 
              animate={neuralPulse}
              className="h-5 w-32 bg-muted/50 rounded" 
            />
            
            {/* Shimmer sweep with neural timing */}
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: Math.random() * 2
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -skew-x-12"
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
