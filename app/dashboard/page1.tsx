'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/navigation'
import DashboardStats from '@/components/dashboard/DashboardStats'
import ReferralSection from '@/components/dashboard/ReferralSection'
import PresaleStatus from '@/components/dashboard/PresaleStatus'
import AirdropProgress from '@/components/dashboard/AirdropProgress'
import Navbar from '@/components/layout/Navbar'
import { getCurrentUser } from '@/lib/api/auth'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      setUser(currentUser)
    } catch (error) {
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Caricamento...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">Dashboard</h1>
            <p className="text-gray-400 mb-8">Connetti il tuo wallet per accedere</p>
            <ConnectButton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-white">La Tua Dashboard</h1>
        
        <div className="grid gap-6">
          <DashboardStats />
          <PresaleStatus />
          <ReferralSection />
          <AirdropProgress />
        </div>
      </div>
    </div>
  )
}

