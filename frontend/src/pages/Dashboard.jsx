import { useState, useEffect } from 'react'
import API from '../api'

function Dashboard() {
  const [tickets, setTickets] = useState([])

  const fetchQueue = () => {
    API.get('/queue/').then(res => setTickets(res.data))
  }

  // Auto-refresh queue every 3 seconds
  useEffect(() => {
    fetchQueue()
    const interval = setInterval(fetchQueue, 3000)
    return () => clearInterval(interval)
  }, [])

  const updateStatus = (id, status) => {
    API.put(`/tokens/${id}/update?status=${status}`)
       .then(() => fetchQueue()) // Refresh list after update
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff Dashboard 👨‍💼</h1>
      
      <div className="grid gap-4">
        {tickets.map(token => (
          <div key={token.id} className="bg-white p-4 rounded shadow flex justify-between items-center border-l-4 border-blue-500">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{token.number}</h2>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                token.status === 'serving' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {token.status.toUpperCase()}
              </span>
            </div>
            <div className="space-x-2">
              {token.status !== 'serving' && (
                <button onClick={() => updateStatus(token.id, 'serving')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Call
                </button>
              )}
              <button onClick={() => updateStatus(token.id, 'completed')} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">
                Done
              </button>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <p className="text-gray-500 italic">No pending tickets in the queue.</p>}
      </div>
    </div>
  )
}

export default Dashboard