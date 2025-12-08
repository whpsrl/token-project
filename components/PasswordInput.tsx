"use client"

import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

// ============================================================================
// PASSWORD INPUT WITH TOGGLE VISIBILITY
// Component riutilizzabile per tutti i form
// ============================================================================

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  name?: string
  autoComplete?: string
  className?: string
  error?: string
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter password',
  required = false,
  disabled = false,
  name = 'password',
  autoComplete = 'current-password',
  className = '',
  error
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 pr-12
            border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-purple-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
        />
        
        {/* Toggle Button */}
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            p-1.5 rounded-md
            text-gray-500 hover:text-gray-700 hover:bg-gray-100
            focus:outline-none focus:ring-2 focus:ring-purple-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          "
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <FaEyeSlash className="w-5 h-5" />
          ) : (
            <FaEye className="w-5 h-5" />
          )}
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// USAGE EXAMPLE 1: Simple Form
// ============================================================================

/*
import PasswordInput from '@/components/PasswordInput'

function LoginForm() {
  const [password, setPassword] = useState('')

  return (
    <form>
      <PasswordInput
        value={password}
        onChange={setPassword}
        placeholder="Enter your password"
        required
      />
    </form>
  )
}
*/

// ============================================================================
// USAGE EXAMPLE 2: Registration Form with Confirm Password
// ============================================================================

/*
import PasswordInput from '@/components/PasswordInput'

function RegisterForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: any = {}
    
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Submit...
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Password
        </label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Create a password"
          required
          autoComplete="new-password"
          error={errors.password}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">
          Confirm Password
        </label>
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
      </div>

      <button type="submit">Register</button>
    </form>
  )
}
*/

// ============================================================================
// ALTERNATIVE: Tailwind Styled Version (for your brutalist design)
// ============================================================================

export function PasswordInputBrutalist({
  value,
  onChange,
  placeholder = 'ENTER_PASSWORD',
  required = false,
  disabled = false,
  name = 'password',
  error
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full font-mono">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-14
            bg-black text-[#00ff00]
            border-2 ${error ? 'border-red-500' : 'border-[#00ff00]'}
            focus:outline-none focus:border-[#00ff00] focus:shadow-[0_0_10px_#00ff00]
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-[#00ff00]/50
            font-mono uppercase text-sm
          `}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            px-2 py-1.5
            border border-[#00ff00]
            text-[#00ff00] text-xs
            hover:bg-[#00ff00] hover:text-black
            focus:outline-none
            disabled:opacity-50
            transition-colors
            font-mono
          "
        >
          {showPassword ? '[HIDE]' : '[SHOW]'}
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500 font-mono">
          {error.toUpperCase()}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// WITHOUT LUCIDE ICONS (pure CSS version)
// ============================================================================

export function PasswordInputPure({
  value,
  onChange,
  placeholder = 'Enter password',
  required = false,
  disabled = false,
  name = 'password',
  error
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`
            w-full px-4 py-3 pr-24
            border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-purple-500
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
        />
        
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            px-3 py-1.5
            text-sm font-medium
            text-purple-600 hover:text-purple-700
            border border-purple-600 rounded
            hover:bg-purple-50
            focus:outline-none focus:ring-2 focus:ring-purple-500
            disabled:opacity-50
            transition-colors
          "
        >
          {showPassword ? 'Nascondi' : 'Mostra'}
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
