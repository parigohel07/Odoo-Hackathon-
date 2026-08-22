import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { TripsProvider } from './context/TripsContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/trips/MyTrips'
import CreateTrip from './pages/trips/CreateTrip'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <ThemeProvider>
      <TripsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/trips/new" element={<CreateTrip />} />
            <Route path="*" element={<Placeholder />} />
          </Routes>
        </BrowserRouter>
      </TripsProvider>
    </ThemeProvider>
  )
}
