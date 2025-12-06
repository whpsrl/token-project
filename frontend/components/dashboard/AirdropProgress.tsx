'use client'

import { motion } from 'framer-motion'
import { FaCheckCircle, FaCircle } from 'react-icons/fa'
import { FaXTwitter, FaTelegram } from 'react-icons/fa6'

const tasks = [
  { id: 'email', label: 'Email verificata + Wallet', points: 500, completed: false },
  { id: 'twitter', label: 'Segui @FreeppleToken su X', points: 150, completed: false },
  { id: 'like', label: 'Like al post fissato', points: 50, completed: false },
  { id: 'retweet', label: 'Retweet post fissato', points: 100, completed: false },
  { id: 'telegram', label: 'Telegram + Verifica Bot', points: 200, completed: false },
]

export default function AirdropProgress() {
  const totalPoints = tasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0)
  const maxPoints = 1000

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
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-semibold transition-colors">
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

