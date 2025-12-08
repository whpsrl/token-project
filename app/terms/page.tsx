'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black mb-6">Termini e Condizioni</h1>
          <p className="text-gray-400 mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Accettazione dei Termini</h2>
              <p>
                Accedendo e utilizzando il servizio di presale di Freepple (FRP), accetti di essere vincolato da questi 
                Termini e Condizioni. Se non accetti questi termini, non utilizzare il nostro servizio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Descrizione del Servizio</h2>
              <p>
                Freepple offre un servizio di presale di token criptovaluta (FRP) sulla blockchain Polygon. 
                Il servizio include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Registrazione alla presale</li>
                <li>Acquisto di token FRP durante la fase di presale</li>
                <li>Programma referral</li>
                <li>Distribuzione di token dopo il listing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Requisiti di Partecipazione</h2>
              <p>Per partecipare alla presale devi:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Avere almeno 18 anni (o l'età legale nel tuo paese)</li>
                <li>Essere legalmente autorizzato a partecipare a investimenti in criptovalute</li>
                <li>Fornire informazioni accurate e complete</li>
                <li>Possedere un wallet compatibile con Polygon</li>
                <li>Comprendere i rischi associati agli investimenti in criptovalute</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Investimento e Pagamento</h2>
              <p>
                L'investimento minimo nella presale è di €500. I pagamenti possono essere effettuati tramite:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Carta di credito/debito</li>
                <li>Criptovalute (USDT, USDC su Polygon)</li>
                <li>Bonifico bancario</li>
              </ul>
              <p className="mt-4">
                <strong>Importante:</strong> I pagamenti sono finali e non rimborsabili, salvo casi eccezionali 
                previsti dalla legge o da accordi specifici.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Rischi e Avvertenze</h2>
              <p className="text-red-400 font-semibold mb-4">
                ⚠️ INVESTIRE IN CRIPTOVALUTE È MOLTO RISCHIOSO. PUOI PERDERE TUTTO IL TUO INVESTIMENTO.
              </p>
              <p>I rischi includono, ma non sono limitati a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Volatilità estrema del prezzo</li>
                <li>Possibile perdita totale dell'investimento</li>
                <li>Rischi tecnologici (hack, bug, perdita di chiavi private)</li>
                <li>Rischi normativi (cambiamenti nella regolamentazione)</li>
                <li>Rischi di liquidità (difficoltà a vendere i token)</li>
                <li>Rischi del progetto (fallimento, abbandono)</li>
              </ul>
              <p className="mt-4">
                Investi solo quello che puoi permetterti di perdere. Consulta sempre un consulente finanziario 
                indipendente prima di investire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Token FRP</h2>
              <p>
                I token FRP verranno distribuiti dopo il listing su DEX. La distribuzione avverrà all'indirizzo 
                wallet fornito durante la registrazione. Freepple non è responsabile per:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirizzi wallet errati o non validi</li>
                <li>Perdita di token dovuta a errori dell'utente</li>
                <li>Problemi con il wallet dell'utente</li>
                <li>Ritardi nella distribuzione dovuti a problemi tecnici o normativi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Programma Referral</h2>
              <p>
                Il programma referral offre commissioni per ogni referral che partecipa alla presale. 
                Le commissioni sono:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Livello 1 (referral diretto): 3%</li>
                <li>Livello 2 (referral del referral): 1%</li>
              </ul>
              <p className="mt-4">
                Freepple si riserva il diritto di modificare o terminare il programma referral in qualsiasi momento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Proibizioni</h2>
              <p>È vietato:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utilizzare il servizio per attività illegali</li>
                <li>Fornire informazioni false o fuorvianti</li>
                <li>Tentare di manipolare o aggirare le misure di sicurezza</li>
                <li>Utilizzare bot o script automatizzati</li>
                <li>Violare le leggi applicabili</li>
                <li>Trasferire il tuo account a terzi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitazione di Responsabilità</h2>
              <p>
                Freepple non sarà responsabile per:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Perdite finanziarie derivanti dall'investimento in FRP</li>
                <li>Problemi tecnici o interruzioni del servizio</li>
                <li>Errori dell'utente (indirizzi wallet errati, perdita di chiavi, ecc.)</li>
                <li>Cambiamenti normativi che influenzano il progetto</li>
                <li>Atti di terze parti (hack, frodi, ecc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Proprietà Intellettuale</h2>
              <p>
                Tutti i contenuti del sito, inclusi loghi, testi, grafica e software, sono di proprietà di Freepple 
                o dei suoi licenzianti e sono protetti da leggi sul copyright e altri diritti di proprietà intellettuale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Modifiche ai Termini</h2>
              <p>
                Freepple si riserva il diritto di modificare questi Termini e Condizioni in qualsiasi momento. 
                Le modifiche entreranno in vigore immediatamente dopo la pubblicazione. È tua responsabilità 
                rivedere periodicamente questi termini.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Risoluzione</h2>
              <p>
                Freepple si riserva il diritto di sospendere o terminare il tuo accesso al servizio in qualsiasi momento, 
                senza preavviso, per violazione di questi termini o per qualsiasi altro motivo a nostra discrezione.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Legge Applicabile</h2>
              <p>
                Questi Termini e Condizioni sono governati dalle leggi italiane. Qualsiasi controversia sarà risolta 
                dai tribunali competenti italiani.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contatti</h2>
              <p>
                Per domande su questi Termini e Condizioni, contattaci:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>Email: <a href="mailto:legal@freepple.xyz" className="text-violet-400 hover:underline">legal@freepple.xyz</a></li>
                <li>Supporto: <a href="mailto:team@freepple.xyz" className="text-violet-400 hover:underline">team@freepple.xyz</a></li>
              </ul>
            </section>

            <div className="mt-8 p-6 bg-yellow-950/30 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-200 font-semibold">
                ⚠️ AVVERTENZA: Investire in criptovalute comporta rischi significativi. 
                Non investire più di quanto puoi permetterti di perdere. Consulta sempre un consulente finanziario 
                indipendente prima di investire.
              </p>
            </div>
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

