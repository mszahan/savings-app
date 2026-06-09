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
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Projects</h1>
        <Link
          to="/projects/create"
          className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-sm"
        >
          + New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/$projectId`}
            params={{ projectId: project.id }}
            className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{project.name}</h2>
          </Link>
        ))}
      </div>
    </main>
  )
}

