'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-950/50 to-fuchsia-950/30 border-2 border-violet-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-violet-500/20"
        >
          <h1 className="text-4xl md:text-5xl font-black mb-6">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduzione</h2>
              <p>
                Freepple ("noi", "nostro", "ci") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. 
                Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo le tue informazioni quando utilizzi 
                il nostro servizio di presale di token FRP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Dati che Raccogliamo</h2>
              <p>Raccogliamo i seguenti tipi di dati personali:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dati di identificazione:</strong> Nome, cognome, email</li>
                <li><strong>Dati blockchain:</strong> Indirizzo wallet (Polygon)</li>
                <li><strong>Dati di registrazione:</strong> Codice referral, data di registrazione</li>
                <li><strong>Dati tecnici:</strong> Indirizzo IP, user agent, timestamp</li>
                <li><strong>Dati di pagamento:</strong> Importo, metodo di pagamento, hash transazione (se applicabile)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Come Utilizziamo i Tuoi Dati</h2>
              <p>Utilizziamo i tuoi dati personali per:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Processare la tua registrazione alla presale</li>
                <li>Gestire i pagamenti e le transazioni</li>
                <li>Calcolare e distribuire i token FRP</li>
                <li>Gestire il programma referral</li>
                <li>Inviare comunicazioni importanti sul progetto</li>
                <li>Rispettare obblighi legali e normativi</li>
                <li>Prevenire frodi e abusi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Base Legale per il Trattamento</h2>
              <p>
                Trattiamo i tuoi dati personali sulla base di:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consenso:</strong> Quando accetti questa Privacy Policy</li>
                <li><strong>Esecuzione del contratto:</strong> Per fornirti i servizi richiesti</li>
                <li><strong>Obblighi legali:</strong> Per rispettare le normative applicabili</li>
                <li><strong>Interessi legittimi:</strong> Per prevenire frodi e migliorare i nostri servizi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Condivisione dei Dati</h2>
              <p>Non vendiamo i tuoi dati personali. Condividiamo i tuoi dati solo con:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Fornitori di servizi:</strong> Supabase (database), Vercel (hosting), servizi di pagamento</li>
                <li><strong>Autorità competenti:</strong> Se richiesto dalla legge</li>
                <li><strong>Partner blockchain:</strong> Per l'esecuzione delle transazioni on-chain</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Sicurezza dei Dati</h2>
              <p>
                Implementiamo misure di sicurezza tecniche e organizzative appropriate per proteggere i tuoi dati personali, 
                inclusi crittografia, accesso limitato e monitoraggio continuo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. I Tuoi Diritti</h2>
              <p>Hai il diritto di:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Accedere ai tuoi dati personali</li>
                <li>Correggere dati inesatti</li>
                <li>Richiedere la cancellazione dei tuoi dati</li>
                <li>Opporti al trattamento dei tuoi dati</li>
                <li>Richiedere la portabilità dei dati</li>
                <li>Revocare il consenso in qualsiasi momento</li>
              </ul>
              <p className="mt-4">
                Per esercitare questi diritti, contattaci a: <a href="mailto:privacy@freepple.xyz" className="text-violet-400 hover:underline">privacy@freepple.xyz</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Conservazione dei Dati</h2>
              <p>
                Conserviamo i tuoi dati personali solo per il tempo necessario agli scopi per cui sono stati raccolti, 
                o come richiesto dalla legge. I dati relativi alle transazioni blockchain sono conservati permanentemente 
                sulla blockchain pubblica.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookie e Tecnologie Simili</h2>
              <p>
                Utilizziamo cookie e tecnologie simili per migliorare l'esperienza utente, analizzare l'utilizzo del sito 
                e personalizzare i contenuti. Puoi gestire le preferenze dei cookie tramite le impostazioni del browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Modifiche a Questa Privacy Policy</h2>
              <p>
                Possiamo aggiornare questa Privacy Policy di tanto in tanto. Ti notificheremo eventuali modifiche 
                significative pubblicando la nuova Privacy Policy su questa pagina e aggiornando la data di "Ultimo aggiornamento".
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contatti</h2>
              <p>
                Per domande su questa Privacy Policy o sul trattamento dei tuoi dati personali, contattaci:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>Email: <a href="mailto:privacy@freepple.xyz" className="text-violet-400 hover:underline">privacy@freepple.xyz</a></li>
                <li>Supporto: <a href="mailto:team@freepple.xyz" className="text-violet-400 hover:underline">team@freepple.xyz</a></li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              ← Torna alla Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

