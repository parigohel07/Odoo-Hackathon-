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
import { RedirectIfAuthed, RequireAuth } from './common/authGuards'

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <TripsProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <RedirectIfAuthed>
                    <Login />
                  </RedirectIfAuthed>
                }
              />
              <Route
                path="/register"
                element={
                  <RedirectIfAuthed>
                    <Register />
                  </RedirectIfAuthed>
                }
              />
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/trips"
                element={
                  <RequireAuth>
                    <MyTrips />
                  </RequireAuth>
                }
              />
              <Route
                path="/trips/new"
                element={
                  <RequireAuth>
                    <CreateTrip />
                  </RequireAuth>
                }
              />
              <Route
                path="/trips/:id"
                element={
                  <RequireAuth>
                    <TripDetail />
                  </RequireAuth>
                }
              />
              <Route
                path="/trips/:id/edit"
                element={
                  <RequireAuth>
                    <ItineraryBuilder />
                  </RequireAuth>
                }
              />
              <Route
                path="/explore"
                element={
                  <RequireAuth>
                    <Explore />
                  </RequireAuth>
                }
              />
              <Route
                path="/search"
                element={
                  <RequireAuth>
                    <SearchPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/budget"
                element={
                  <RequireAuth>
                    <Budget />
                  </RequireAuth>
                }
              />
              <Route
                path="/calendar"
                element={
                  <RequireAuth>
                    <CalendarTimeline />
                  </RequireAuth>
                }
              />
              <Route path="/share/:id" element={<ShareTrip />} />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/settings"
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Placeholder />} />
            </Routes>
          </BrowserRouter>
        </TripsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
