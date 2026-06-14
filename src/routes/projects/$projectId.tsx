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
    (getTransactions as any)({ data: { projectId } }).then(setTransactions)
  }, [projectId])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amount === '') return

    await (addTransaction as any)({ data: { 
      projectId, 
      type, 
      amount: Number(amount), 
      description,
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }})
    setAmount('')
    setDescription('')
    (getTransactions as any)({ data: { projectId } }).then(setTransactions)
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
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--sea-ink)]">Project Details</h1>
        <button 
          onClick={handleExport}
          className="glass-btn glass-btn-secondary px-4 py-2 text-sm focus-accessible"
        >
          Export CSV
        </button>
      </div>
      
      <div className="glass-panel p-10 mb-10 text-[var(--sea-ink)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-[var(--sea-ink-soft)] text-sm font-semibold uppercase tracking-wider mb-1">Current Balance</p>
          <p className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--sea-ink)]">
            ${balance.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            Savings: ${transactions.filter(t => t.type === 'savings').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Costs: ${transactions.filter(t => t.type === 'cost').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="glass-panel p-8 mb-10">
        <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-6">Add Transaction</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="tx-desc" className="block text-sm font-semibold text-[var(--sea-ink)] mb-1.5">Description</label>
            <input
              id="tx-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Salary, Rent, Grocery"
              className="w-full glass-input p-3.5 focus-accessible"
              required
            />
          </div>
          <div>
            <label htmlFor="tx-type" className="block text-sm font-semibold text-[var(--sea-ink)] mb-1.5">Type</label>
            <select 
              id="tx-type"
              value={type} 
              onChange={(e) => setType(e.target.value as any)} 
              className="w-full glass-input p-3.5 focus-accessible bg-[var(--foam)] text-[var(--sea-ink)]"
            >
              <option value="savings">💰 Savings</option>
              <option value="cost">💸 Cost</option>
            </select>
          </div>
          <div>
            <label htmlFor="tx-amount" className="block text-sm font-semibold text-[var(--sea-ink)] mb-1.5">Amount ($)</label>
            <input
              id="tx-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0.00"
              className="w-full glass-input p-3.5 focus-accessible"
              required
            />
          </div>
          <button type="submit" className="md:col-span-2 glass-btn glass-btn-primary py-3.5 focus-accessible">
            Add Transaction
          </button>
        </form>
      </div>

      <div className="glass-panel overflow-hidden">
        <h2 className="text-2xl font-bold text-[var(--sea-ink)] p-8 border-b border-[var(--line)]">Transaction History</h2>
        <ul className="divide-y divide-[var(--line)]">
          {transactions.slice().reverse().map((t: any) => (
            <li key={t.id} className="flex justify-between items-center p-8">
              <div>
                <p className="font-semibold text-[var(--sea-ink)] text-lg">{t.description}</p>
                <p className="text-sm text-[var(--sea-ink-soft)]">{t.date}</p>
              </div>
              <p className={`text-xl font-bold ${t.type === 'savings' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {t.type === 'savings' ? '+' : '-'}${t.amount.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
