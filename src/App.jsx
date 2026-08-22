import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { TripsProvider } from './context/TripsContext'
import { UserProvider } from './context/UserContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/trips/MyTrips'
import CreateTrip from './pages/trips/CreateTrip'
import TripDetail from './pages/trips/TripDetail'
import ItineraryBuilder from './pages/trips/ItineraryBuilder'
import Explore from './pages/explore/Explore'
import SearchPage from './pages/Search'
import Budget from './pages/Budget'
import CalendarTimeline from './pages/Calendar'
import ShareTrip from './pages/ShareTrip'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TripsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/trips/new" element={<CreateTrip />} />
              <Route path="/trips/:id" element={<TripDetail />} />
              <Route path="/trips/:id/edit" element={<ItineraryBuilder />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/calendar" element={<CalendarTimeline />} />
              <Route path="/share/:id" element={<ShareTrip />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Placeholder />} />
            </Routes>
          </BrowserRouter>
        </TripsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
