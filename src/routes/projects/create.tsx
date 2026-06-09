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
    await createProject({ data: { name } })
    navigate({ to: '/' })
  }

  return (
    <main className="max-w-md mx-auto p-6 pt-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">New Project</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-medium text-gray-500 mb-2">Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dream Vacation"
          className="w-full text-lg border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-6"
          required
        />
        <button type="submit" className="w-full text-lg font-semibold px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition">
          Create Project
        </button>
      </form>
    </main>
  )
}
