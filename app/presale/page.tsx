'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PresalePage() {
  // Stats per social proof
  const [stats, setStats] = useState({
    raised: 78500,
    participants: 157,
    timeLeft: {
      days: 15,
      hours: 8,
      minutes: 34,
      seconds: 22
    }
  })

  // Countdown animato
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        timeLeft: {
          ...prev.timeLeft,
          seconds: prev.timeLeft.seconds > 0 ? prev.timeLeft.seconds - 1 : 59
        }
      }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const progress = (stats.raised / 150000) * 100

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black">FREEPPLE</Link>
          <div className="flex gap-4">
            <Link href="/whitepaper" className="text-sm text-gray-400 hover:text-white transition-colors">Whitepaper</Link>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Info & Social Proof */}
          <div className="space-y-8">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-400">Presale Live • Posti Limitati</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                Diventa<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  Fondatore
                </span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                €500 per tutti. Nessun VIP, nessun pacchetto speciale.<br />
                Solo <span className="text-violet-400 font-bold">200-300 posti</span> disponibili.
              </p>
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-violet-950/50 to-fuchsia-950/30 border border-violet-500/20 rounded-2xl p-8"
            >
              <div className="text-center mb-6">
                <div className="text-sm text-gray-400 mb-2">Presale termina tra:</div>
                <div className="flex justify-center gap-4">
                  {Object.entries(stats.timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center">
                      <div className="bg-black/50 border border-violet-500/30 rounded-xl px-4 py-3 min-w-[70px]">
                        <div className="text-3xl font-black text-violet-400">{String(value).padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 capitalize">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Raccolto</span>
                  <span className="font-bold text-violet-400">€{stats.raised.toLocaleString()} / €150.000</span>
                </div>
                <div className="h-3 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {stats.participants}/300 fondatori • {(300 - stats.participants)} posti rimasti
                </div>
              </div>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold mb-4">Cosa Ricevi:</h3>
              
              {[
                { icon: '🎟️', title: '600.000 FRP Token', desc: '500K base + 100K bonus early bird (+20%)' },
                { icon: '👑', title: 'Status Fondatore', desc: 'Badge speciale + accesso esclusivo governance' },
                { icon: '💎', title: 'Prezzo Migliore', desc: '€0.001 per FRP (listing a €0.003-0.005)' },
                { icon: '🎁', title: 'Bonus Referral', desc: '+3% su ogni amico invitato (fino a +30%)' },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <div className="text-3xl">{benefit.icon}</div>
                  <div>
                    <div className="font-bold text-lg">{benefit.title}</div>
                    <div className="text-sm text-gray-400">{benefit.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-950/30 to-emerald-900/20 border border-green-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 border-2 border-black" />
                  ))}
                </div>
                <div className="text-sm text-gray-400">+157 fondatori hanno già partecipato</div>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-300 italic">
                  "Finalmente un progetto che protegge davvero i piccoli investitori. In 1 ora già 50 posti venduti!"
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Marco R. • Fondatore #42</span>
                  <span>2 ore fa</span>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: '🔒', text: 'Smart Contract Verificato' },
                { icon: '✅', text: 'Audit in Corso' },
                { icon: '💯', text: 'Team Doxxed' },
              ].map((item, i) => (
                <div key={i} className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-xs text-gray-400">{item.text}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column - CTA Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-gradient-to-br from-violet-950/50 to-fuchsia-950/30 border-2 border-violet-500/30 rounded-3xl p-8 shadow-2xl shadow-violet-500/20">
              {/* Price Header */}
              <div className="text-center mb-8">
                <div className="inline-block px-4 py-2 bg-violet-500/20 rounded-full mb-4">
                  <span className="text-sm font-medium text-violet-300">Investimento Unico</span>
                </div>
                <div className="text-6xl font-black mb-2">€500</div>
                <div className="text-gray-400">Pagamento una tantum • No fees nascoste</div>
              </div>

              {/* What You Get */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <span className="text-2xl">🎟️</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">600.000 FRP Token</div>
                    <div className="text-xs text-gray-500">500K + 100K bonus</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <span className="text-2xl">👑</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Status Fondatore</div>
                    <div className="text-xs text-gray-500">Badge + governance</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/30 rounded-xl">
                  <span className="text-2xl">💎</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Prezzo Migliore</div>
                    <div className="text-xs text-gray-500">€0.001 (listing €0.003-0.005)</div>
                  </div>
                </div>
              </div>

              {/* Main CTA Button */}
              <Link
                href="/auth/register"
                className="block w-full py-5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 hover:from-violet-500 hover:via-fuchsia-400 hover:to-purple-500 rounded-xl font-black text-lg text-center transition-all duration-300 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-95"
              >
                Registrati Ora →
              </Link>

              {/* Payment Info */}
              <div className="mt-6 text-center space-y-2">
                <div className="text-sm text-gray-400">
                  Dopo la registrazione riceverai le istruzioni di pagamento
                </div>
                <div className="flex justify-center gap-4 text-xs text-gray-500">
                  <span>💳 Carta</span>
                  <span>₿ Crypto</span>
                  <span>🏦 Bonifico</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-3 text-sm text-gray-500">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Registrazione Sicura • Dati Crittografati</span>
              </div>
            </div>

            {/* Urgency Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-center"
            >
              <div className="text-sm text-red-400 font-medium">
                ⚠️ Solo {300 - stats.participants} posti rimasti
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Ultimi 143 posti in 48 ore • Media 3 fondatori/ora
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-black text-center mb-12">Domande Frequenti</h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Quando riceverò i token?',
                a: 'I token verranno distribuiti entro 48 ore dal listing DEX, previsto per Marzo 2025. Riceverai email di conferma con tutti i dettagli.'
              },
              {
                q: 'Posso investire più di €500?',
                a: 'No. La presale è limitata a €500 per persona per garantire distribuzione equa. Nessun vantaggio per whale.'
              },
              {
                q: 'Cosa succede se la presale non raggiunge il target?',
                a: 'Se non raggiungiamo almeno €75.000 (50% del target), tutti i fondi verranno rimborsati automaticamente.'
              },
              {
                q: 'È sicuro? Come funziona il pagamento?',
                a: 'Dopo la registrazione ricevi istruzioni via email. Puoi pagare con carta, crypto o bonifico. Fondi custoditi in smart contract verificato.'
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden transition-all">
                <summary className="cursor-pointer p-6 font-bold text-lg flex justify-between items-center">
                  {faq.q}
                  <span className="text-violet-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="inline-block px-8 py-3 bg-violet-950/50 border border-violet-500/30 rounded-full mb-6">
            <span className="text-violet-400 font-medium">FREE THE PEOPLE. FREE THE FUTURE.</span>
          </div>
          
          <p className="text-gray-500 max-w-2xl mx-auto">
            Non investire più di quanto puoi permetterti di perdere • DYOR sempre • 
            Le crypto sono investimenti ad alto rischio
          </p>
        </motion.div>
      </div>
    </div>
  )
}
