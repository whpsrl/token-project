'use client'

import { motion } from 'framer-motion'
import { FaRocket, FaUsers } from 'react-icons/fa'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Diventa Fondatore
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            €500 per tutti. 200-300 fondatori cercati.
            <br />
            Insieme, dal primo giorno.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/presale"
              className="group px-8 py-4 bg-white text-purple-900 rounded-full font-semibold hover:scale-105 transition-transform duration-200 shadow-lg flex items-center gap-2"
            >
              <FaRocket />
              Partecipa alla Presale
            </Link>
            
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full font-semibold text-white hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <FaUsers />
              Vai alla Dashboard
            </Link>
          </div>

          <p className="text-lg text-gray-400 italic">
            "Free the People. Free the Future."
          </p>
        </motion.div>
      </div>
    </section>
  )
}


