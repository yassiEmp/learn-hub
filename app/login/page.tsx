"use client"
import React, { Suspense, useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { signIn, signUp } from '@/lib/auth-client'
import FloatingParticle from '@/components/FloatingParticle'
import { SocialLoginButtons } from '@/components/SocialLoginButtons'

const GOOGLE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === 'true'
const MIN_PASSWORD = 8

type AuthErr = { code?: string; message?: string; status?: number } | null | undefined

function describeAuthError(error: AuthErr, isLogin: boolean): string {
  switch (error?.code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
    case 'INVALID_PASSWORD':
    case 'USER_NOT_FOUND':
      return 'That email and password don’t match. Check them and try again.'
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return 'An account with this email already exists. Sign in instead.'
    case 'PASSWORD_TOO_SHORT':
      return `Your password must be at least ${MIN_PASSWORD} characters.`
    case 'PASSWORD_TOO_LONG':
      return 'That password is too long. Please use a shorter one.'
    case 'INVALID_EMAIL':
      return 'Please enter a valid email address.'
    case 'EMAIL_NOT_VERIFIED':
      return 'Please verify your email before signing in.'
  }
  if (error?.status === 429) return 'Too many attempts. Please wait a minute and try again.'
  if (error?.message) return error.message
  return isLogin ? 'We couldn’t sign you in. Please try again.' : 'We couldn’t create your account. Please try again.'
}

/** Only allow in-app relative redirects. */
function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/create'
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const inputClass =
  'block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 font-geist-mono disabled:opacity-60'

const LoginForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, loading: authLoading, refresh } = useAuth()

  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = safeNext(searchParams.get('next'))

  // Already signed in → straight into the app
  useEffect(() => {
    if (!authLoading && user) router.replace(next)
  }, [user, authLoading, router, next])

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError(null)
    setPassword('')
  }

  const handleGoogle = async () => {
    setError(null)
    setGoogleLoading(true)
    try {
      const { error } = await signIn.social({ provider: 'google', callbackURL: next })
      if (error) {
        setError(describeAuthError(error, true))
        setGoogleLoading(false)
      }
      // On success the browser is redirected to Google.
    } catch {
      setError('Google sign-in is unavailable right now. Please use email instead.')
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanEmail = email.trim().toLowerCase()
    if (!isLogin && !fullName.trim()) return setError('Please tell us your name.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setError('Please enter a valid email address.')
    if (!password) return setError('Please enter your password.')
    if (!isLogin && password.length < MIN_PASSWORD)
      return setError(`Your password must be at least ${MIN_PASSWORD} characters.`)

    setSubmitting(true)
    try {
      const { error } = isLogin
        ? await signIn.email({ email: cleanEmail, password })
        : await signUp.email({ name: fullName.trim(), email: cleanEmail, password })

      if (error) {
        setError(describeAuthError(error, isLogin))
        setSubmitting(false)
        return
      }
      await refresh()
      router.replace(isLogin ? next : '/create')
    } catch {
      setError('Network error. Check your connection and try again.')
      setSubmitting(false)
    }
  }

  const busy = submitting || googleLoading

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="w-full h-full absolute top-0 left-0 overflow-hidden">
        <FloatingParticle />
      </div>
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md w-full space-y-8">
          <motion.div className="text-center" variants={itemVariants}>
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-syne font-medium text-white">flashmind</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-syne font-medium text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-white/60 font-geist-mono text-sm">
              {isLogin ? 'Sign in to keep learning' : 'Turn anything into a course in a minute'}
            </p>
          </motion.div>

          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8"
            variants={itemVariants}
          >
            {GOOGLE_ENABLED && (
              <>
                <SocialLoginButtons
                  onGoogleLogin={handleGoogle}
                  loading={googleLoading}
                  disabled={submitting}
                  isLogin={isLogin}
                />
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-black text-white/50 font-geist-mono">or with email</span>
                  </div>
                </div>
              </>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-geist-mono text-white/70 mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={busy}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-geist-mono text-white/70 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={busy}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-geist-mono text-white/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={busy}
                    className={`${inputClass} pr-10`}
                    placeholder={isLogin ? 'Your password' : `At least ${MIN_PASSWORD} characters`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 text-sm font-geist-mono border rounded-xl p-3 text-red-400 bg-red-400/10 border-red-400/20"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    {error}
                    {error.includes('already exists') && !isLogin && (
                      <button type="button" onClick={switchMode} className="block mt-1 underline text-red-300">
                        Go to sign in
                      </button>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={switchMode}
                disabled={busy}
                className="text-white/60 hover:text-white font-geist-mono text-sm transition-colors disabled:opacity-50"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </motion.div>

          <motion.div className="text-center" variants={itemVariants}>
            <Link href="/" className="text-white/50 hover:text-white/70 font-geist-mono text-sm transition-colors">
              ← Back to home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  )
}
