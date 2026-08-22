import { useState } from 'react'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Button from '../../common/Button'
import Input from '../../common/Input'
import { mockLogin } from '../../data/mockData'
import { setSession } from '../../common/session'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const update = (field) => (event) => {
    const value = field === 'remember' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
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
    try {
      await mockLogin(form)
      setSession({ email: form.email.trim() })
      navigate('/')
    } catch (error) {
      setErrors({ password: error.message })
    } finally {
      setLoading(false)
    }
  }

  const passwordTrailing = (
    <button
      type="button"
      onClick={() => setShowPassword((show) => !show)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      className="cursor-pointer rounded-lg p-1.5 text-ink-muted transition-colors hover:text-primary"
    >
      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  )

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep planning your next adventure.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
            <Link to="/register" className="-mb-1 text-xs font-medium text-primary hover:underline">
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

        <Button type="submit" loading={loading} className="w-full">
          <LogIn className="size-4" aria-hidden />
          Sign in
        </Button>

        <p className="rounded-xl bg-surface-2 px-4 py-3 text-center text-xs leading-relaxed text-ink-muted">
          Demo mode — any email and a 6+ character password will sign you in.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        New to GlobeTrotter?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
