import { useState, useEffect } from 'react'
import API from '../api'

function Kiosk() {
  const [services, setServices] = useState([])
  const [ticket, setTicket] = useState(null)

  // 1. Fetch Services (Departments) from Backend when page loads
  useEffect(() => {
    API.get('/services/')
      .then(res => {
        console.log("Services loaded:", res.data)
        setServices(res.data)
      })
      .catch(err => console.error("Error fetching services:", err))
  }, [])

  // 2. Function to Issue a Token when a button is clicked
  const handleGetToken = (serviceId) => {
    API.post('/issue-token/', {
      service_id: serviceId,
      priority: 0 // Default priority
    })
    .then(res => {
      setTicket(res.data) // Save the ticket to show on screen
    })
    .catch(err => alert("Error issuing token! Check console."))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        🏥 Welcome to QueueFlow
      </h1>

      {/* Ticket Popup (Shows only if a ticket is created) */}
      {ticket && (
        <div className="bg-white text-black p-8 rounded-xl text-center shadow-2xl mb-8 border-4 border-green-500 animate-bounce">
          <p className="text-xl text-gray-600">Your Token Number</p>
          <h2 className="text-6xl font-black my-4">{ticket.number}</h2>
          <p className="text-sm text-gray-500">Please wait for your turn</p>
          <button 
            onClick={() => setTicket(null)}
            className="mt-4 text-sm underline text-blue-500 hover:text-blue-700"
          >
            Close / Next Customer
          </button>
        </div>
      )}

      {/* Service Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {services.length === 0 ? (
          <div className="col-span-2 text-center">
             <p className="text-gray-500">Loading services...</p>
             <p className="text-xs text-gray-600 mt-2">If this takes long, check if Backend is running at port 8000</p>
          </div>
        ) : (
          services.map(service => (
            <button
              key={service.id}
              onClick={() => handleGetToken(service.id)}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg flex flex-col items-center"
            >
              <span className="text-2xl font-semibold">{service.name}</span>
              <span className="text-sm text-gray-400 mt-2">Code: {service.code}</span>
            </button>
          ))
        )}
      </div>

    </div>
  )
}

export default Kiosk