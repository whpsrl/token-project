"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/components/PasswordInput'

// ============================================================================
// COMPLETE REGISTRATION FORM - ALL FIXES APPLIED
// Con tutti i fix: SQL, race condition, password toggle
// ============================================================================

export default function RegisterPage() {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    wallet_address: '',
    referred_by: ''
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [successMessage, setSuccessMessage] = useState('')

  // ============================================================================
  // Validation
  // ============================================================================
  
  const validateForm = () => {
    const newErrors: any = {}
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    // Wallet validation
    if (!formData.wallet_address) {
      newErrors.wallet_address = 'Wallet address is required'
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.wallet_address)) {
      newErrors.wallet_address = 'Invalid Ethereum address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ============================================================================
  // Submit Handler
  // ============================================================================
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset messages
    setSuccessMessage('')
    setErrors({})
    
    // Validate
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      // ✅ API call (il database trigger gestisce tutto!)
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          wallet_address: formData.wallet_address,
          referred_by: formData.referred_by || null
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      
      // ✅ Success!
      setSuccessMessage('Registration successful! Check your email to verify.')
      
      // Redirect dopo 2 secondi
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (error: any) {
      console.error('Registration error:', error)
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // UI Render
  // ============================================================================
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Freepple Presale
          </h1>
          <p className="text-gray-600">
            Create your account to participate
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              className={`
                w-full px-4 py-3 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address *
            </label>
            <input
              type="text"
              value={formData.wallet_address}
              onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
              placeholder="0x..."
              required
              className={`
                w-full px-4 py-3 border rounded-lg font-mono text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-500
                ${errors.wallet_address ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.wallet_address && (
              <p className="mt-1 text-sm text-red-500">{errors.wallet_address}</p>
            )}
          </div>

          {/* Password - ✅ CON TOGGLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <PasswordInput
              value={formData.password}
              onChange={(value) => setFormData({ ...formData, password: value })}
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
              error={errors.password}
            />
            <p className="mt-1 text-xs text-gray-500">
              Min 8 characters, include uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password - ✅ CON TOGGLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <PasswordInput
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
          </div>

          {/* Referral Code (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              value={formData.referred_by}
              onChange={(e) => setFormData({ ...formData, referred_by: e.target.value.toUpperCase() })}
              placeholder="ABCD1234"
              maxLength={8}
              className="
                w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-purple-500
                uppercase font-mono text-sm
              "
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter referral code to get bonus tokens
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 px-4
              bg-purple-600 hover:bg-purple-700
              text-white font-medium rounded-lg
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ALTERNATIVE: Brutalist Style Version
// ============================================================================

export function RegisterPageBrutalist() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    wallet_address: '',
    referred_by: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('REGISTRATION_SUCCESS')
      }
    } catch (error) {
      alert('ERROR_OCCURRED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono p-4">
      <div className="max-w-2xl mx-auto">
        <div className="border-4 border-[#00ff00] p-8">
          <h1 className="text-4xl mb-8 text-center">
            FREEPPLE_REGISTRATION
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm">EMAIL:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="
                  w-full px-4 py-3 
                  bg-black text-[#00ff00]
                  border-2 border-[#00ff00]
                  focus:outline-none focus:shadow-[0_0_10px_#00ff00]
                  uppercase
                "
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">WALLET_ADDRESS:</label>
              <input
                type="text"
                value={formData.wallet_address}
                onChange={(e) => setFormData({ ...formData, wallet_address: e.target.value })}
                className="
                  w-full px-4 py-3 
                  bg-black text-[#00ff00]
                  border-2 border-[#00ff00]
                  focus:outline-none focus:shadow-[0_0_10px_#00ff00]
                  font-mono text-sm
                "
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">PASSWORD:</label>
              <PasswordInput
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                className="
                  bg-black text-[#00ff00]
                  border-2 border-[#00ff00]
                  focus:shadow-[0_0_10px_#00ff00]
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-4
                border-2 border-[#00ff00]
                hover:bg-[#00ff00] hover:text-black
                transition-colors duration-200
                disabled:opacity-50
                uppercase font-bold
              "
            >
              {loading ? '[PROCESSING...]' : '[REGISTER]'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
