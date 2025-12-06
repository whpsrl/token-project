'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const data = [
  { name: 'Presale', value: 20, color: '#9333ea' },
  { name: 'Staking', value: 18, color: '#a855f7' },
  { name: 'Liquidity Reserve', value: 13, color: '#c084fc' },
  { name: 'Referral', value: 12, color: '#d8b4fe' },
  { name: 'Team (locked)', value: 10, color: '#e9d5ff' },
  { name: 'Airdrop', value: 8, color: '#f3e8ff' },
  { name: 'Liquidità DEX', value: 7, color: '#faf5ff' },
  { name: 'Marketing', value: 7, color: '#fef3c7' },
  { name: 'Reserve', value: 5, color: '#fde68a' },
]

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tokenomics
          </h2>
          <p className="text-xl text-gray-400">
            1.000.000.000 FRP - Distribuzione Trasparente
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Grafico */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 rounded-2xl p-8"
          >
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lista */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-white font-medium">{item.name}</span>
                </div>
                <span className="text-purple-400 font-bold">{item.value}%</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

