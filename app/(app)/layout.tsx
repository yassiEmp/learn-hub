'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/login')
    }
  }, [user, loading, isConfigured, router])
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-white/60 font-geist-mono">Loading...</p>
        </motion.div>
      </div>
    )
  }
  
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-full bg-orange-400/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-2xl font-syne font-medium text-white mb-4">
            Setup Required
          </h2>
          <p className="text-white/70 font-geist-mono mb-6 leading-relaxed">
            Authentication is not configured. Please set up your Supabase credentials in the environment variables.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300"
          >
            <span>Go Home</span>
          </Link>
        </motion.div>
      </div>
    )
  }
  
  if (!user) {
    return null // Redirecting
  }
  
  return <>{children}</>
}
