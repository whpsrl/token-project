'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Hero Section - IMPATTO IMMEDIATO */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background animato */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              transform: `translateY(${scrollY * 0.5}px)`
            }}
          />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
          
          {/* Particelle fluttuanti */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-violet-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8"
          >
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-violet-300">Presale Aperta • Ultimi 300 Posti</span>
          </motion.div>

          {/* Headline POTENTE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6 leading-[0.9]"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(180deg, #ffffff 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(139, 92, 246, 0.3)',
            }}
          >
            BASTA<br />WHALE.
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-5xl font-bold mb-8 text-violet-200"
          >
            È l'Era delle Persone
          </motion.h2>

          {/* Value Proposition */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            La prima crypto che <span className="text-violet-400 font-bold">protegge davvero</span> i piccoli investitori.<br />
            Regole nel codice. Whale fuori. <span className="text-violet-400 font-bold">10.000€/mese</span> di attività reale.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/presale"
              className="group relative px-10 py-5 bg-violet-600 hover:bg-violet-500 rounded-xl font-bold text-lg transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Entra nella Presale →</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient" />
            </Link>
            
            <Link 
              href="/whitepaper"
              className="px-10 py-5 border-2 border-violet-500/30 hover:border-violet-500 rounded-xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
            >
              Leggi Whitepaper
            </Link>
          </motion.div>

          {/* Social Proof Numbers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { number: '€500', label: 'Investimento Unico' },
              { number: '€10K', label: 'Attività Mensile' },
              { number: '300', label: 'Fondatori Max' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-violet-400 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-500 font-medium">Scopri di più</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-violet-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Problem Section - TOCCA IL DOLORE */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-center">
              Le Whale Ti Hanno<br />
              <span className="text-violet-400">Fregato Abbastanza</span>
            </h2>
            <p className="text-xl text-gray-400 text-center max-w-3xl mx-auto mb-16">
              Pump & dump. Rug pull. Manipolazioni. Sempre gli stessi che vincono, sempre tu che perdi.
            </p>
          </motion.div>

          {/* Problem Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🐋',
                title: 'Whale Dominano',
                problem: 'Comprano il 20%, vendono tutto in un secondo. Tu rimani con le perdite.',
                stat: '-80% in 5 minuti'
              },
              {
                icon: '💸',
                title: 'Team Scappa',
                problem: 'Raccolgono milioni, poi svaniscono. Token team sbloccati dal primo giorno.',
                stat: '90% dei progetti'
              },
              {
                icon: '📉',
                title: 'Dump Infiniti',
                problem: 'Nessun limite alle vendite. Gli early dumpers uccidono ogni progetto.',
                stat: 'Ogni singolo giorno'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-red-950/20 border border-red-900/30 rounded-2xl p-8 hover:bg-red-950/30 transition-all duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 mb-4">{item.problem}</p>
                <div className="text-red-400 font-black text-xl">{item.stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section - RIVOLUZIONE */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-violet-950/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              Freepple Cambia<br />
              <span className="text-violet-400">Le Regole del Gioco</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Protezioni hardcoded nel contratto. Impossibili da bypassare. Per sempre.
            </p>
          </motion.div>

          {/* Solution Features - GRID ASIMMETRICA */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🛡️',
                title: 'Anti-Whale Totale',
                desc: 'Max 1% supply per wallet. Nessuna whale può dominare.',
                benefit: 'Potere distribuito equamente'
              },
              {
                icon: '⛔',
                title: 'Anti-Dump Progressivo',
                desc: 'Limiti vendita mensili: 5% → 10% → 15%. Stop ai dump istantanei.',
                benefit: 'Prezzo stabile nel tempo'
              },
              {
                icon: '🔒',
                title: 'Team Locked 9+ Anni',
                desc: '1 anno lock completo, poi solo 1%/mese. Non possono scappare.',
                benefit: 'Commitment reale, non parole'
              },
              {
                icon: '💎',
                title: 'Sell Tax Decrescente',
                desc: '10% → 1% → 0.05% in 12 mesi. Chi resta vince, chi dumpa paga.',
                benefit: 'Incentivo a holdare'
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-violet-950/40 to-violet-900/20 border border-violet-500/20 rounded-2xl p-8 hover:border-violet-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{feature.desc}</p>
                  <div className="flex items-center gap-2 text-violet-400 font-bold">
                    <span>→</span>
                    <span>{feature.benefit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Value Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <span className="text-sm font-medium text-green-400">Non Solo Speculazione</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              €10.000/Mese di<br />
              <span className="text-violet-400">Attività Reale</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Mining, trading automatico, servizi. Profitti che alimentano liquidità e staking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-950/30 to-emerald-900/20 border border-green-500/20 rounded-3xl p-12"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-black text-green-400 mb-2">€10K</div>
                <div className="text-gray-400">Entrate Mensili</div>
              </div>
              <div>
                <div className="text-5xl font-black text-green-400 mb-2">30%</div>
                <div className="text-gray-400">alla Liquidità</div>
              </div>
              <div>
                <div className="text-5xl font-black text-green-400 mb-2">70%</div>
                <div className="text-gray-400">agli Staker</div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-black/30 rounded-xl border border-green-500/10">
              <p className="text-center text-gray-300 leading-relaxed">
                <span className="text-green-400 font-bold">Valore tangibile</span> che sostiene il prezzo. <br />
                Non pump & dump, ma <span className="text-green-400 font-bold">crescita sostenibile</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Presale CTA - URGENZA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-purple-600/20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-7xl font-black mb-6">
              Diventa<br />
              <span className="text-violet-400">Fondatore</span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-4">
              €500 per tutti. Nessun VIP. Nessun pacchetto speciale.
            </p>
            
            <p className="text-xl text-violet-300 mb-12">
              Solo <span className="font-black">200-300 posti</span> disponibili
            </p>

            {/* Countdown falso ma efficace */}
            <div className="flex justify-center gap-4 mb-12">
              {[
                { value: '15', label: 'Giorni' },
                { value: '08', label: 'Ore' },
                { value: '34', label: 'Minuti' },
              ].map((time, i) => (
                <div key={i} className="bg-black/50 border border-violet-500/30 rounded-xl p-6">
                  <div className="text-4xl font-black text-violet-400 mb-1">{time.value}</div>
                  <div className="text-sm text-gray-500">{time.label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/presale"
              className="inline-block px-16 py-6 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 hover:from-violet-500 hover:via-fuchsia-400 hover:to-purple-500 rounded-2xl font-black text-2xl transition-all duration-300 shadow-2xl shadow-violet-500/50 hover:shadow-violet-500/70 hover:scale-105"
            >
              Partecipa Ora →
            </Link>

            <p className="mt-8 text-sm text-gray-500">
              Non investire più di quanto puoi permetterti di perdere • DYOR
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-black mb-2">FREEPPLE</div>
              <div className="text-sm text-gray-500">Free the People. Free the Future.</div>
            </div>
            
            <div className="flex gap-8">
              <Link href="/whitepaper" className="text-gray-400 hover:text-white transition-colors">Whitepaper</Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              <a href="https://twitter.com/freepple" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
            © 2025 Freepple. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  )
}
