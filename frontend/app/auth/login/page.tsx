'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/api/auth'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(formData.email, formData.password)
      toast.success('Login completato!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Errore nel login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">
              Accedi
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? 'Accesso...' : 'Accedi'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm">
              Non hai un account?{' '}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300">
                Registrati
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

