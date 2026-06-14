import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { register, login } from '../server/auth'

export const Route = createFileRoute('/auth')({ component: AuthPage })

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      await login({ data: { email, password } })
    } else {
      await register({ data: { email, password } })
      setIsLogin(true)
      return
    }
    window.location.href = '/'
  }

  return (
    <main className="max-w-md mx-auto p-6 pt-12">
      <h1 className="text-3xl font-extrabold mb-8">{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-xl p-4 mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-xl p-4 mb-6" required />
        <button type="submit" className="w-full bg-gray-900 text-white rounded-xl p-4 font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</button>
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-sm text-gray-500">
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </form>
    </main>
  )
}
