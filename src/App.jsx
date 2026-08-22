import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Placeholder />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
