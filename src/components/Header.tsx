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
    <header role="banner" className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl px-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-3.5">
        <Link to="/" className="text-xl font-bold tracking-tight text-[var(--sea-ink)] hover:opacity-80 transition no-underline whitespace-nowrap flex-shrink-0">
           Savings App
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ThemeToggle />
          {user?.userId ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <span className="hidden sm:inline-flex text-sm font-medium text-[var(--sea-ink-soft)] px-3.5 py-1.5 rounded-full bg-[var(--chip-bg)] border border-[var(--chip-line)] max-w-[120px] md:max-w-[280px] truncate" title={user.email}>
                {user.email}
              </span>
              <button 
                onClick={handleLogout} 
                className="glass-btn glass-btn-secondary px-3.5 py-1.5 text-sm whitespace-nowrap flex-shrink-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="glass-btn glass-btn-primary px-4 py-1.5 text-sm whitespace-nowrap flex-shrink-0"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
