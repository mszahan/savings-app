import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { createProject } from '../../server/actions'
import { getMe } from '../../server/auth'

export const Route = createFileRoute('/projects/create')({ 
  beforeLoad: async () => {
    const user = await getMe()
    if (!user.userId) throw redirect({ to: '/auth' })
  },
  component: CreateProject 
})

function CreateProject() {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await (createProject as any)({ data: { name } })
    navigate({ to: '/' })
  }

  return (
    <main className="max-w-md mx-auto p-6 pt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--sea-ink)] mb-2">
          New Project
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          Create a space to track your savings goals and costs
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 flex flex-col gap-6">
        <div>
          <label htmlFor="project-name-input" className="block text-sm font-semibold text-[var(--sea-ink)] mb-1.5">
            Project Name
          </label>
          <input
            id="project-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dream Vacation, Rainy Day Fund"
            className="w-full glass-input p-3.5 focus-accessible"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full glass-btn glass-btn-primary py-3.5 focus-accessible"
        >
          Create Project
        </button>
      </form>
    </main>
  )
}
