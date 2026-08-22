import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout'
import Button from '../../common/Button'
import Input from '../../common/Input'
import { mockRegister } from '../../data/mockData'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const update = (field) => (event) => {
    const value = field === 'agree' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    if (!form.agree) next.agree = 'Please accept the terms to continue.'
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
      await mockRegister(form)
      navigate('/')
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
    <AuthLayout
      title="Create your account"
      subtitle="Join GlobeTrotter and start sketching your next journey."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Input
          label="Full name"
          icon={UserRound}
          placeholder="Aarav Mehta"
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          error={errors.name}
        />

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
            <span className="-mb-1 text-xs text-ink-muted">Min. 6 characters</span>
          </div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="••••••••"
            autoComplete="new-password"
            className="mt-1.5"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            trailing={passwordTrailing}
          />
        </div>

        <Input
          label="Confirm password"
          type={showPassword ? 'text' : 'password'}
          icon={Lock}
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirm}
          onChange={update('confirm')}
          error={errors.confirm}
        />

        <div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-muted select-none">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={update('agree')}
              className="mt-0.5 size-4 cursor-pointer rounded border-line accent-candy-500"
            />
            I agree to the Terms of Service and Privacy Policy.
          </label>
          {errors.agree && (
            <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
              {errors.agree}
            </p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
