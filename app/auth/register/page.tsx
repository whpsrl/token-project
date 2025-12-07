'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'

export default function RegisterPage() {
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    walletAddress: '',
    referralCode: '',
    acceptTerms: false,
    acceptPrivacy: false,
    newsletter: true,
    // Honeypot (campo nascosto per bot)
    website: ''
  })

  // UI state
  const [step, setStep] = useState(1) // 1, 2, 3 (multi-step form)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaReady, setCaptchaReady] = useState(false)

  // Rate limiting (client-side base)
  const [submitAttempts, setSubmitAttempts] = useState(0)
  const [lastSubmitTime, setLastSubmitTime] = useState(0)

  // Carica parametri URL (referral code)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }))
    }
  }, [])

  // reCAPTCHA ready
  const handleCaptchaLoad = () => {
    setCaptchaReady(true)
  }

  // Validazione email
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Validazione wallet Ethereum/Polygon
  const validateWallet = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  // Validazione form per step
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'Nome obbligatorio'
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'Nome troppo corto'
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Cognome obbligatorio'
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'Cognome troppo corto'
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email obbligatoria'
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Email non valida'
      }
    }

    if (currentStep === 2) {
      if (!formData.walletAddress.trim()) {
        newErrors.walletAddress = 'Wallet address obbligatorio'
      } else if (!validateWallet(formData.walletAddress)) {
        newErrors.walletAddress = 'Wallet address non valido (deve iniziare con 0x)'
      }
    }

    if (currentStep === 3) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Devi accettare i termini e condizioni'
      }
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = 'Devi accettare la privacy policy'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Vai a step successivo
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  // Torna a step precedente
  const prevStep = () => {
    setStep(step - 1)
    setErrors({})
  }

  // Submit finale
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validazione finale
    if (!validateStep(3)) return

    // ANTIBOT: Honeypot check
    if (formData.website !== '') {
      console.warn('Bot detected: honeypot filled')
      return // Bot rilevato, non fare nulla (silenzioso)
    }

    // ANTIBOT: Rate limiting
    const now = Date.now()
    if (now - lastSubmitTime < 3000) { // Min 3 sec tra submit
      setErrors({ submit: 'Troppo veloce! Aspetta qualche secondo.' })
      return
    }

    if (submitAttempts >= 3) {
      setErrors({ submit: 'Troppi tentativi. Riprova tra 5 minuti.' })
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // ANTIBOT: Get reCAPTCHA token
      if (typeof window !== 'undefined' && window.grecaptcha && captchaReady) {
        const token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
          { action: 'submit_registration' }
        )
        setCaptchaToken(token)
      }

      // Invia al backend
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          captchaToken: captchaToken,
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la registrazione')
      }

      // Successo!
      setShowSuccess(true)
      setSubmitAttempts(0)
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        walletAddress: '',
        referralCode: '',
        acceptTerms: false,
        acceptPrivacy: false,
        newsletter: true,
        website: ''
      })
      setStep(1)

    } catch (error: any) {
      console.error('Registration error:', error)
      setErrors({ submit: error.message || 'Errore durante la registrazione. Riprova.' })
      setSubmitAttempts(prev => prev + 1)
    } finally {
      setIsSubmitting(false)
      setLastSubmitTime(Date.now())
    }
  }

  return (
    <>
      {/* Google reCAPTCHA v3 */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        onLoad={handleCaptchaLoad}
      />

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
              <Link href="/presale" className="text-sm text-gray-400 hover:text-white transition-colors">← Torna alla Presale</Link>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-gray-800 text-gray-600'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      step > s ? 'bg-violet-600' : 'bg-gray-800'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span className={step >= 1 ? 'text-violet-400 font-medium' : ''}>Dati Personali</span>
              <span className={step >= 2 ? 'text-violet-400 font-medium' : ''}>Wallet</span>
              <span className={step >= 3 ? 'text-violet-400 font-medium' : ''}>Conferma</span>
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-violet-950/50 to-fuchsia-950/30 border-2 border-violet-500/30 rounded-3xl p-8 shadow-2xl shadow-violet-500/20"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black mb-3">Registrazione Presale</h1>
              <p className="text-gray-400">
                {step === 1 && "Inserisci i tuoi dati personali"}
                {step === 2 && "Connetti il tuo wallet Polygon"}
                {step === 3 && "Conferma e completa la registrazione"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Dati Personali */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`w-full px-4 py-3 bg-black/50 border ${
                          errors.firstName ? 'border-red-500' : 'border-violet-500/30'
                        } rounded-xl focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all`}
                        placeholder="Mario"
                      />
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Cognome <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`w-full px-4 py-3 bg-black/50 border ${
                          errors.lastName ? 'border-red-500' : 'border-violet-500/30'
                        } rounded-xl focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all`}
                        placeholder="Rossi"
                      />
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-black/50 border ${
                        errors.email ? 'border-red-500' : 'border-violet-500/30'
                      } rounded-xl focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all`}
                      placeholder="mario.rossi@email.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Riceverai le istruzioni di pagamento a questa email
                    </p>
                  </div>

                  {/* HONEYPOT (nascosto dai CSS) */}
                  <div className="hidden" aria-hidden="true">
                    <label>Website</label>
                    <input
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-bold transition-all"
                    >
                      Continua →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Wallet */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Wallet Address (Polygon) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                      className={`w-full px-4 py-3 bg-black/50 border ${
                        errors.walletAddress ? 'border-red-500' : 'border-violet-500/30'
                      } rounded-xl focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono text-sm`}
                      placeholder="0x..."
                    />
                    {errors.walletAddress && (
                      <p className="mt-2 text-sm text-red-400">{errors.walletAddress}</p>
                    )}
                    <div className="mt-3 p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">ℹ️</div>
                        <div className="text-sm text-gray-300 leading-relaxed">
                          <p className="font-bold text-blue-400 mb-2">Importante:</p>
                          <ul className="space-y-1 list-disc list-inside">
                            <li>I token FRP verranno inviati a questo indirizzo dopo il listing</li>
                            <li>Assicurati sia un wallet su rete <span className="text-violet-400 font-bold">Polygon</span></li>
                            <li>Non usare indirizzi di exchange centralizzati</li>
                            <li>Verifica attentamente l'indirizzo prima di confermare</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Codice Referral (opzionale)
                    </label>
                    <input
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-violet-500/30 rounded-xl focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder="es: 0xABC123"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Se qualcuno ti ha invitato, inserisci qui il suo codice referral (+20% bonus)
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-3 border border-violet-500/30 hover:border-violet-500 rounded-xl font-bold transition-all"
                    >
                      ← Indietro
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl font-bold transition-all"
                    >
                      Continua →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Conferma */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Riepilogo */}
                  <div className="bg-black/30 rounded-2xl p-6 space-y-3">
                    <h3 className="font-bold text-lg mb-4">Riepilogo Registrazione</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nome:</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wallet:</span>
                        <span className="font-mono text-xs">{formData.walletAddress.slice(0, 10)}...{formData.walletAddress.slice(-8)}</span>
                      </div>
                      {formData.referralCode && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Referral:</span>
                          <span className="text-green-400 font-medium">✓ Bonus +20%</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Investimento:</span>
                        <span className="text-2xl font-black text-violet-400">€500</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-400">Token ricevuti:</span>
                        <span className="text-xl font-bold text-green-400">
                          {formData.referralCode ? '600.000' : '500.000'} FRP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Privacy */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-violet-500/30 bg-black/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                      <label className="text-sm text-gray-300 leading-relaxed">
                        Ho letto e accetto i{' '}
                        <Link href="/terms" className="text-violet-400 hover:underline" target="_blank">
                          termini e condizioni
                        </Link>
                        {' '}e il{' '}
                        <Link href="/whitepaper" className="text-violet-400 hover:underline" target="_blank">
                          whitepaper
                        </Link>
                        . Sono consapevole dei rischi associati agli investimenti in criptovalute.
                        <span className="text-red-400"> *</span>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-400">{errors.acceptTerms}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.acceptPrivacy}
                        onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-violet-500/30 bg-black/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                      <label className="text-sm text-gray-300 leading-relaxed">
                        Accetto la{' '}
                        <Link href="/privacy" className="text-violet-400 hover:underline" target="_blank">
                          privacy policy
                        </Link>
                        {' '}e il trattamento dei miei dati personali.
                        <span className="text-red-400"> *</span>
                      </label>
                    </div>
                    {errors.acceptPrivacy && (
                      <p className="text-sm text-red-400">{errors.acceptPrivacy}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.newsletter}
                        onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-violet-500/30 bg-black/50 focus:ring-2 focus:ring-violet-500/20"
                      />
                      <label className="text-sm text-gray-300 leading-relaxed">
                        Voglio ricevere aggiornamenti sul progetto via email (opzionale)
                      </label>
                    </div>
                  </div>

                  {/* Error message */}
                  {errors.submit && (
                    <div className="p-4 bg-red-950/30 border border-red-500/30 rounded-xl">
                      <p className="text-sm text-red-400">{errors.submit}</p>
                    </div>
                  )}

                  {/* reCAPTCHA notice */}
                  <div className="text-xs text-gray-600 text-center">
                    Questo sito è protetto da reCAPTCHA e si applicano la{' '}
                    <a href="https://policies.google.com/privacy" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                    {' '}e i{' '}
                    <a href="https://policies.google.com/terms" className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      Termini di Servizio
                    </a>
                    {' '}di Google.
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="px-8 py-3 border border-violet-500/30 hover:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold transition-all"
                    >
                      ← Indietro
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !captchaReady}
                      className="px-12 py-4 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-purple-600 hover:from-violet-500 hover:via-fuchsia-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl font-black text-lg transition-all shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Invio...
                        </span>
                      ) : (
                        'Completa Registrazione'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Info Cards */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm font-medium">Dati Sicuri</div>
              <div className="text-xs text-gray-500 mt-1">Crittografati end-to-end</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium">Processo Veloce</div>
              <div className="text-xs text-gray-500 mt-1">Istruzioni in 5 minuti</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm font-medium">Supporto H24</div>
              <div className="text-xs text-gray-500 mt-1">team@freepple.xyz</div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-green-950/90 to-emerald-900/80 border-2 border-green-500/50 rounded-3xl p-8 max-w-md text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-3xl font-black mb-3">Registrazione Completata! 🎉</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Controlla la tua email <span className="text-green-400 font-bold">{formData.email}</span> per le istruzioni di pagamento.
              </p>

              <div className="bg-black/30 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-bold mb-2">Prossimi Step:</h4>
                <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                  <li>Riceverai email con link pagamento</li>
                  <li>Scegli metodo (carta, crypto, bonifico)</li>
                  <li>Completa pagamento €500</li>
                  <li>Conferma automatica entro 24h</li>
                </ol>
              </div>
              
              <button
                onClick={() => {
                  setShowSuccess(false)
                  window.location.href = '/dashboard'
                }}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-all w-full"
              >
                Vai alla Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  )
}

// TypeScript: definizione window.grecaptcha
declare global {
  interface Window {
    grecaptcha: any
  }
}
