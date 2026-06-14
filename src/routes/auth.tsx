import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { register, login } from '../server/auth'

export const Route = createFileRoute('/auth')({ component: AuthPage })

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      await (login as any)({ data: { email, password } })
    } else {
      await (register as any)({ data: { email, password } })
      setIsLogin(true)
      return
    }
    window.location.href = '/'
  }

  return (
    <main className="max-w-md mx-auto p-6 pt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--sea-ink)] mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          {isLogin ? 'Sign in to access your savings dashboard' : 'Start tracking your financial goals today'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 flex flex-col gap-6">
        <div>
          <label htmlFor="email-input" className="block text-sm font-semibold text-[var(--sea-ink)] mb-1.5">
            Email Address
          </label>
          <input
            id="email-input"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full glass-input p-3.5 focus-accessible"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password-input" className="block text-sm font-semibold text-[var(--sea-ink)] mb-1.5">
            Password
          </label>
          <input
            id="password-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full glass-input p-3.5 focus-accessible"
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        <button
          type="submit"
          className="w-full glass-btn glass-btn-primary py-3.5 focus-accessible"
        >
          {isLogin ? 'Sign In' : 'Register'}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-sm font-medium text-[var(--lagoon)] hover:underline focus-accessible py-1"
        >
          {isLogin ? "New to Savings App? Register" : "Already have an account? Sign In"}
        </button>
      </form>
    </main>
  )
}
