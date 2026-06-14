import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getProjects } from '../server/actions'
import { getMe } from '../server/auth'

export const Route = createFileRoute('/')({ 
  beforeLoad: async () => {
    const user = await getMe()
    if (!user.userId) throw redirect({ to: '/auth' })
  },
  component: Dashboard 
})

function Dashboard() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    getProjects().then(setProjects)
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-6 pt-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--sea-ink)]">Projects</h1>
        <Link
          to="/projects/create"
          className="glass-btn glass-btn-primary px-5 py-2.5 text-sm focus-accessible"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel p-12 text-center flex flex-col items-center gap-4">
          <span className="text-4xl">📁</span>
          <h2 className="text-xl font-bold text-[var(--sea-ink)]">No Projects Yet</h2>
          <p className="text-sm text-[var(--sea-ink-soft)] max-w-sm">
            Create your first savings project to start tracking your goals and logging transactions.
          </p>
          <Link
            to="/projects/create"
            className="glass-btn glass-btn-primary px-5 py-2 text-sm focus-accessible"
          >
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/$projectId`}
              params={{ projectId: project.id }}
              className="glass-panel group p-6 block hover:-translate-y-1 transition-all duration-200 focus-accessible no-underline"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon)] transition-colors mb-1">
                    {project.name}
                  </h2>
                  <p className="text-xs font-medium text-[var(--sea-ink-soft)] uppercase tracking-wider">
                    Savings Goal
                  </p>
                </div>
                <span className="text-xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

