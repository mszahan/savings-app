import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { logout, getMe } from '../server/auth'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/auth'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3">
        <Link to="/" className="text-xl font-bold text-gray-900 no-underline">
          Savings App
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user?.userId ? (
            <button onClick={handleLogout} className="text-sm font-semibold text-gray-600">Logout</button>
          ) : (
            <Link to="/auth" className="text-sm font-semibold text-gray-900">Login</Link>
          )}
        </div>
      </nav>
    </header>
  )
}
