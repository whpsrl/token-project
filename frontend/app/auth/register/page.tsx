'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { register } from '@/lib/api/auth'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref') || ''

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    cognome: '',
    cellulare: '',
    referralCode: referralCode
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register(
        formData.email,
        formData.password,
        formData.nome,
        formData.cognome,
        formData.referralCode || undefined
      )
      toast.success('Registrazione completata! Verifica la tua email.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Errore nella registrazione')
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
              Registrati
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cognome}
                  onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email *
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
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cellulare (facoltativo)
                </label>
                <input
                  type="tel"
                  value={formData.cellulare}
                  onChange={(e) => setFormData({ ...formData, cellulare: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
                />
              </div>

              {referralCode && (
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <p className="text-sm text-gray-300">
                    Sei stato invitato da: <span className="font-semibold text-purple-400">{referralCode}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? 'Registrazione...' : 'Registrati'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-400 text-sm">
              Hai già un account?{' '}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

