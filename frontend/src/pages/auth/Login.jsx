import { useState } from 'react'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Button from '../../common/Button'
import Input from '../../common/Input'

const SESSION_KEY = 'globetrotter-session'
const USER_KEY = 'globetrotter-user'
const TOKEN_KEY = 'globetrotter-access-token'

export default function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    remember: true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const update = (field) => (event) => {
    const value =
      field === 'remember'
        ? event.target.checked
        : event.target.value

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }))
  }

  const validate = () => {
    const next = {}

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }

    if (form.password.length < 6) {
      next.password = 'Password must be at least 6 characters.'
    }

    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const next = validate()

    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Login failed. Please check your email and password.',
        )
      }

      // Store the user returned by FastAPI/Supabase.
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(data.user),
      )

      // Store the Supabase access token.
      if (data.access_token) {
        localStorage.setItem(
          TOKEN_KEY,
          data.access_token,
        )
      }

      // Create the session expected by RequireAuth.
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          user: data.user,
          id: data.user?.id,
          username: data.user?.username,
          email: data.user?.email || form.email.trim(),
          access_token: data.access_token,
          signedInAt: new Date().toISOString(),
        }),
      )

      // Login is complete.
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Login error:', error)

      setErrors({
        password:
          error.message ||
          'Unable to connect to the server.',
      })
    } finally {
      setLoading(false)
    }
  }

  const passwordTrailing = (
    <button
      type="button"
      onClick={() => setShowPassword((show) => !show)}
      aria-label={
        showPassword ? 'Hide password' : 'Show password'
      }
      className="cursor-pointer rounded-lg p-1.5 text-ink-muted transition-colors hover:text-primary"
    >
      {showPassword ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </button>
  )

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to keep planning your next adventure."
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
        />

        <div>
          <div className="flex items-center justify-between">
            <span />

            <Link
              to="/register"
              className="-mb-1 text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-1.5"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            trailing={passwordTrailing}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted select-none">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={update('remember')}
            className="size-4 cursor-pointer rounded border-line accent-lav-500"
          />
          Remember me
        </label>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          <LogIn className="size-4" aria-hidden />
          Sign in
        </Button>

        <p className="rounded-xl bg-surface-2 px-4 py-3 text-center text-xs leading-relaxed text-ink-muted">
          Sign in securely using your GlobeTrotter account.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        New to GlobeTrotter?{' '}

        <Link
          to="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}