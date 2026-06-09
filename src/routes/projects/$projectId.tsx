import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getTransactions, addTransaction } from '../../server/actions'
import { getMe } from '../../server/auth'

export const Route = createFileRoute('/projects/$projectId')({
  beforeLoad: async () => {
    const user = await getMe()
    if (!user.userId) throw redirect({ to: '/auth' })
  },
  component: ProjectDetails,
})

function ProjectDetails() {
  const { projectId } = Route.useParams()
  const [transactions, setTransactions] = useState<any[]>([])
  const [type, setType] = useState<'savings' | 'cost'>('savings')
  const [amount, setAmount] = useState<number | ''>('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    getTransactions({ data: { projectId } }).then(setTransactions)
  }, [projectId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amount === '') return

    await addTransaction({ data: { 
      projectId, 
      type, 
      amount: Number(amount), 
      description,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }})
    setAmount('')
    setDescription('')
    getTransactions({ data: { projectId } }).then(setTransactions)
  }

  const balance = transactions.reduce(
    (acc: number, t: any) => (t.type === 'savings' ? acc + t.amount : acc - t.amount),
    0
  )

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + transactions.map(t => `${t.description},${t.type},${t.amount},${t.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Project Details</h1>
        <button 
          onClick={handleExport}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition"
        >
          Export CSV
        </button>
      </div>
      
      <div className="bg-gray-900 rounded-3xl p-10 text-white mb-10 shadow-2xl">
        <p className="text-gray-400 font-medium mb-1">Current Balance</p>
        <p className="text-6xl font-extrabold tracking-tighter">${balance.toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Transaction</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Salary, Rent, Grocery"
              className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as any)} 
              className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="savings">💰 Savings</option>
              <option value="cost">💸 Cost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0.00"
              className="w-full border-gray-200 border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button type="submit" className="md:col-span-2 text-lg font-semibold px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md">
            Add Transaction
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 p-8 border-b border-gray-100">Transaction History</h2>
        <ul className="divide-y divide-gray-100">
          {transactions.slice().reverse().map((t: any) => (
            <li key={t.id} className="flex justify-between items-center p-8">
              <div>
                <p className="font-semibold text-gray-900 text-lg">{t.description}</p>
                <p className="text-sm text-gray-400">{t.date}</p>
              </div>
              <p className={`text-xl font-bold ${t.type === 'savings' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'savings' ? '+' : '-'}${t.amount.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
