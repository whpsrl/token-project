'use client'

import { motion } from 'framer-motion'
import { FaCheckCircle, FaClock, FaRocket } from 'react-icons/fa'

const phases = [
  {
    phase: 'Fase 1',
    title: 'Fondazione',
    status: 'completed',
    items: [
      'Concept e visione',
      'Tokenomics definite',
      'Documentazione completa',
      'Meccanismi di protezione'
    ]
  },
  {
    phase: 'Fase 2',
    title: 'Presale',
    status: 'current',
    items: [
      'Sito presale online',
      'Registrazione utenti',
      'Sistema referral attivo',
      'Raccolta fondi',
      'Acquisto equipment mining'
    ]
  },
  {
    phase: 'Fase 3',
    title: 'Lancio',
    status: 'upcoming',
    items: [
      'Deploy smart contract',
      'Creazione liquidità pool',
      'Listing su DEX',
      'Distribuzione token presale',
      'Attivazione mining'
    ]
  },
  {
    phase: 'Fase 4',
    title: 'Crescita',
    status: 'upcoming',
    items: [
      'Lancio staking',
      'Campagna marketing',
      '10.000 holder',
      'Listing aggregatori'
    ]
  }
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Roadmap
          </h2>
          <p className="text-xl text-gray-400">
            Il nostro percorso verso il futuro
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-purple-500/30 hidden md:block" />

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-8"
              >
                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    phase.status === 'completed' ? 'bg-green-500' :
                    phase.status === 'current' ? 'bg-purple-500' :
                    'bg-gray-700'
                  }`}>
                    {phase.status === 'completed' ? (
                      <FaCheckCircle className="text-white text-2xl" />
                    ) : phase.status === 'current' ? (
                      <FaRocket className="text-white text-2xl" />
                    ) : (
                      <FaClock className="text-gray-400 text-2xl" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-purple-400 font-bold">{phase.phase}</span>
                    <span className="text-2xl font-bold text-white">{phase.title}</span>
                  </div>
                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


