"use client"
import React, { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Sparkles, ArrowRight, Mail, Lock, User, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import FloatingParticle from '../../components/FloatingParticle'
import { SocialLoginButtons } from '../../components/SocialLoginButtons'
import { AuthError } from '@supabase/supabase-js'

type MessageType = 'success' | 'error' | 'info'

interface Message {
  text: string
  type: MessageType
}

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<Message | null>(null)

  const { signIn, signUp, signInWithProvider, user, isConfigured } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (user && isConfigured) {
      router.push('/dashboard')
    }
  }, [user, router, isConfigured])

  // Show setup message if not configured
  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
              <div className='w-full h-full absolute top-0 left-0 overflow-hidden'>
        <FloatingParticle />
      </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
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
              Please configure your Supabase credentials to enable authentication.
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300"
            >
              <span>Go Home</span>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const getErrorMessage = (error: AuthError | { message: string }): string => {
    const errorMessage = error?.message || 'An unexpected error occurred'

    // Handle common Supabase auth errors
    switch (errorMessage) {
      case 'Invalid login credentials':
        return 'Invalid email or password. Please check your credentials and try again.'
      case 'User already registered':
        return 'An account with this email already exists. Please sign in instead.'
      case 'Email not confirmed':
        return 'Please check your email and click the confirmation link before signing in.'
      case 'Password should be at least 6 characters':
        return 'Password must be at least 6 characters long.'
      case 'Unable to validate email address: invalid format':
        return 'Please enter a valid email address.'
      case 'Signup is disabled':
        return 'Account registration is currently disabled. Please contact support.'
      case 'Email rate limit exceeded':
        return 'Too many emails sent. Please wait a few minutes before trying again.'
      case 'Too many requests':
        return 'Too many login attempts. Please wait a few minutes before trying again.'
      case 'Authentication service is not configured':
        return 'Authentication service is not available. Please try again later.'
      default:
        return errorMessage
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider)
    setMessage(null)

    try {
      const { error } = await signInWithProvider(provider)
      if (error) {
        setMessage({
          text: getErrorMessage(error),
          type: 'error'
        })
      }
    } catch (err: unknown) {
      setMessage({
        text: getErrorMessage(err as AuthError),
        type: 'error'
      })
    } finally {
      setSocialLoading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Basic validation
    if (!email || !password || (!isLogin && !fullName)) {
      setMessage({
        text: 'Please fill in all required fields.',
        type: 'error'
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({
        text: 'Password must be at least 6 characters long.',
        type: 'error'
      })
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setMessage({
            text: getErrorMessage(error),
            type: 'error'
          })
        } else {
          setMessage({
            text: 'Successfully signed in! Redirecting...',
            type: 'success'
          })
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        }
      } else {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setMessage({
            text: getErrorMessage(error),
            type: 'error'
          })
        } else {
          setMessage({
            text: 'Account created successfully! Please check your email for the confirmation link.',
            type: 'success'
          })
          // Clear form after successful signup
          setEmail('')
          setPassword('')
          setFullName('')
        }
      }
    } catch (err: unknown) {
      setMessage({
        text: getErrorMessage(err as AuthError),
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
    }
  }

  const getMessageStyles = (type: MessageType) => {
    switch (type) {
      case 'success':
        return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'error':
        return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'info':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className='w-full h-full absolute top-0 left-0 overflow-hidden'>
        <FloatingParticle />
      </div>
      {/* Large background glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div className="text-center" variants={itemVariants}>
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-syne font-medium text-white">LearnHub</span>
            </Link>

            <h2 className="text-3xl md:text-4xl font-syne font-medium text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-white/60 font-geist-mono">
              {isLogin
                ? 'Sign in to continue your learning journey'
                : 'Start your learning journey today'
              }
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8"
            variants={itemVariants}
          >
            {/* Social Login Buttons */}
            <motion.div variants={itemVariants}>
              <SocialLoginButtons
                onGoogleLogin={() => handleSocialLogin('google')}
                onFacebookLogin={() => handleSocialLogin('facebook')}
                loading={socialLoading}
                isLogin={isLogin}
              />
            </motion.div>

            {/* Divider */}
            <motion.div className="relative my-6" variants={itemVariants}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black/40 text-white/50 font-geist-mono">
                  or continue with email
                </span>
              </div>
            </motion.div>

            <form className="space-y-6 sm:p-2" onSubmit={handleSubmit}>
              {!isLogin && (
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-geist-mono text-white/70 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 font-geist-mono"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-geist-mono text-white/70 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 font-geist-mono"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-geist-mono text-white/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 font-geist-mono"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="mt-1 text-xs text-white/50 font-geist-mono">
                    Password must be at least 6 characters long
                  </p>
                )}
              </motion.div>

              {message && (
                <motion.div
                  className={`flex items-start space-x-3 text-sm font-geist-mono border rounded-xl p-3 ${getMessageStyles(message.type)}`}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getMessageIcon(message.type)}
                  </div>
                  <div className="flex-1">
                    {message.text}
                  </div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading || socialLoading !== null}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: (loading || socialLoading !== null) ? 1 : 1.02 }}
                whileTap={{ scale: (loading || socialLoading !== null) ? 1 : 0.98 }}
                variants={itemVariants}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                  />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle between login/signup */}
            <motion.div className="mt-6 text-center" variants={itemVariants}>
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setMessage(null)
                  setEmail('')
                  setPassword('')
                  setFullName('')
                }}
                className="text-white/60 hover:text-white font-geist-mono text-sm transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"
                }
              </button>
            </motion.div>

            {/* Additional help text */}
            {isLogin && (
              <motion.div className="mt-4 text-center" variants={itemVariants}>
                <p className="text-white/40 font-geist-mono text-xs">
                  Forgot your password? Contact support for assistance.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Back to home */}
          <motion.div className="text-center" variants={itemVariants}>
            <Link
              href="/"
              className="text-white/50 hover:text-white/70 font-geist-mono text-sm transition-colors"
            >
              ← Back to home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage