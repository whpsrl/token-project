'use client'

import { motion } from 'framer-motion'
import { FaShieldAlt, FaChartLine, FaLock, FaCoins } from 'react-icons/fa'

const features = [
  {
    icon: FaShieldAlt,
    title: 'Protezione Massima',
    description: 'Regole nel codice per proteggere i piccoli investitori. Max acquisto, limiti vendita, team locked 9+ anni.'
  },
  {
    icon: FaChartLine,
    title: 'Valore Reale',
    description: '€10.000/mese di attività produttiva che alimenta la liquidità. Non speculazione, produzione.'
  },
  {
    icon: FaLock,
    title: 'Team Bloccato',
    description: 'I token del team sono locked per 1 anno, poi solo 1% al mese. Tempo totale sblocco: 9+ anni.'
  },
  {
    icon: FaCoins,
    title: 'Meritocrazia',
    description: 'Vuoi di più? Lavora. Referral, staking, rank. Chi contribuisce viene premiato.'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Perché Freepple è Diverso
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <feature.icon className="text-4xl text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


