import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Kiosk from './pages/Kiosk'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar (Top Right) */}
      <div className="absolute top-0 right-0 p-4 space-x-4 text-white z-50">
        <Link to="/" className="underline hover:text-blue-300">Kiosk</Link>
        <Link to="/dashboard" className="underline hover:text-blue-300">Staff</Link>
      </div>

      {/* The Router Switches between pages based on the URL */}
      <Routes>
        <Route path="/" element={<Kiosk />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App