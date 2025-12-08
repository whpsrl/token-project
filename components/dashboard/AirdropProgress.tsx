'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaCircle } from 'react-icons/fa'
import { getCurrentUser } from '@/lib/api/auth'
import { getAirdropProgress, completeAirdropTask } from '@/lib/api/airdrop'
import toast from 'react-hot-toast'

interface AirdropProgressProps {
  userId?: string
}

export default function AirdropProgress({ userId }: AirdropProgressProps) {
  const [tasks, setTasks] = useState<any[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxPoints] = useState(1000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAirdropProgress()
  }, [userId])

  const loadAirdropProgress = async () => {
    try {
      let currentUserId = userId
      if (!currentUserId) {
        const user = await getCurrentUser()
        if (!user) return
        currentUserId = user.id
      }

      const progress = await getAirdropProgress(currentUserId)
      setTasks(progress.tasks)
      setTotalPoints(progress.totalPoints)
    } catch (error) {
      console.error('Error loading airdrop progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteTask = async (taskType: string) => {
    try {
      let currentUserId = userId
      if (!currentUserId) {
        const user = await getCurrentUser()
        if (!user) return
        currentUserId = user.id
      }

      await completeAirdropTask(currentUserId, taskType)
      toast.success('Task completato!')
      loadAirdropProgress()
    } catch (error: any) {
      toast.error(error.message || 'Errore nel completare il task')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-white">Airdrop Progress</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Completato</span>
          <span className="text-white font-semibold">{totalPoints} / {maxPoints} FRP</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(totalPoints / maxPoints) * 100}%` }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full"
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              task.completed
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-gray-900/50 border-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {task.completed ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaCircle className="text-gray-500" />
              )}
              <span className="text-white">{task.label}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-purple-400 font-semibold">+{task.points} FRP</span>
              {!task.completed && (
                <button
                  onClick={() => handleCompleteTask(task.type)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-semibold transition-colors"
                >
                  Completa
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPoints === maxPoints && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-400 font-semibold">
            ✅ Airdrop completato! I token saranno distribuiti al lancio.
          </p>
        </div>
      )}
    </motion.div>
  )
}

