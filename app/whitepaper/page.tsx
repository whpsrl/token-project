'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

export default function WhitepaperBrutalist() {
  const [activeSection, setActiveSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll()
  
  const sections = [
    { id: 'intro', title: 'EXECUTIVE_SUMMARY' },
    { id: 'problem', title: 'THE_PROBLEM' },
    { id: 'solution', title: 'THE_SOLUTION' },
    { id: 'tokenomics', title: 'TOKENOMICS' },
    { id: 'roi', title: 'ROI_CALC' },
    { id: 'roadmap', title: 'ROADMAP' },
    { id: 'security', title: 'SECURITY' },
    { id: 'faq', title: 'FAQ' },
  ]

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 300
      const sectionEls = sections.map(s => document.getElementById(s.id))
      
      sectionEls.forEach((el, i) => {
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(i)
        }
      })
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const downloadPDF = () => {
    window.open('/docs/freepple-whitepaper-v3.pdf', '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono overflow-x-hidden">
      {/* Cursor follower */}
      <motion.div
        className="fixed w-2 h-2 bg-[#00ff00] rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/10 z-50">
        <motion.div
          className="h-full bg-[#00ff00]"
          style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-[#00ff00]/30 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter hover:text-white transition-colors">
            [FREEPPLE]
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all"
            >
              [PDF↓]
            </button>
            <Link
              href="/presale"
              className="px-3 py-1.5 bg-[#00ff00] text-black hover:bg-white transition-all font-bold"
            >
              [JOIN_PRESALE]
            </Link>
          </div>
        </div>
      </header>

      {/* Side Nav */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:block z-30">
        <div className="space-y-1">
          {sections.map((section, i) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`block text-xs transition-all ${
                activeSection === i
                  ? 'text-[#00ff00] font-bold'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {String(i).padStart(2, '0')}_{section.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-20 pb-20">
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-5xl w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4 text-sm text-white/50">
                [v3.0_DEC_2024]
              </div>
              
              <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none">
                FREEPPLE<br />
                <span className="text-white">WHITEPAPER</span>
              </h1>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="border border-[#00ff00]/30 p-6">
                  <div className="text-xs text-white/50 mb-2">[MISSION]</div>
                  <p className="text-lg leading-relaxed">
                    DEMOCRATIZZARE_IL_CRYPTO<br />
                    PROTEGGERE_I_PICCOLI<br />
                    ELIMINARE_LE_WHALE
                  </p>
                </div>

                <div className="border border-[#00ff00]/30 p-6">
                  <div className="text-xs text-white/50 mb-2">[SPECS]</div>
                  <div className="text-sm space-y-1">
                    <div>TOKEN: FRP</div>
                    <div>CHAIN: POLYGON</div>
                    <div>SUPPLY: 1B</div>
                    <div>MAX_WALLET: 1%</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <div className="px-4 py-2 border border-[#00ff00]">[ANTI_WHALE]</div>
                <div className="px-4 py-2 border border-[#00ff00]">[TEAM_LOCKED_9Y]</div>
                <div className="px-4 py-2 border border-[#00ff00]">[REAL_VALUE]</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Executive Summary */}
        <Section id="intro" num="01" title="EXECUTIVE_SUMMARY">
          <Grid>
            <GridItem span={2}>
              <Alert type="error">
                IL_MERCATO_CRYPTO_E_ROTTO_<br />
                WHALE_20%_SUPPLY_<br />
                TEAM_SCAPPA_DOPO_LAUNCH_<br />
                SEMPRE_TU_CHE_PERDI_
              </Alert>
            </GridItem>

            <GridItem>
              <h3 className="text-2xl font-black mb-4">[SOLUZIONE]</h3>
              <p className="leading-relaxed">
                FREEPPLE = SMART_CONTRACT con regole HARDCODED impossibili da bypassare.
                Non promesse. Solo matematica on-chain.
              </p>
            </GridItem>

            <GridItem>
              <Metric label="MAX_WALLET" value="1%" />
              <Metric label="TEAM_LOCK" value="9+ ANNI" />
              <Metric label="PROFITTI" value="€10K/MESE" />
            </GridItem>
          </Grid>

          <DataTable
            headers={['FEATURE', 'TRADITIONAL', 'FREEPPLE']}
            rows={[
              ['MAX_WALLET', 'UNLIMITED', '1% SUPPLY'],
              ['TEAM_LOCK', '3-6 MONTHS', '9+ YEARS'],
              ['SELL_LIMITS', 'NONE', '5%→10%→15% MONTHLY'],
              ['VALUE', 'ZERO (HYPE)', '€10K/MONTH REAL'],
            ]}
          />
        </Section>

        {/* Problem */}
        <Section id="problem" num="02" title="THE_PROBLEM">
          <Grid>
            <GridItem span={2}>
              <h3 className="text-3xl font-black mb-6">[MANIPULATION_CYCLE]</h3>
              
              <Timeline
                phases={[
                  {
                    label: 'PRE_LAUNCH',
                    items: [
                      'WHALE accumula 10-30% supply',
                      'TEAM alloca 20-40% per sé',
                      'Promesse "HOLD FOREVER"',
                    ]
                  },
                  {
                    label: 'LAUNCH',
                    items: [
                      'PUMP artificiale via FOMO',
                      'WHALE vende gradualmente',
                      'Retail compra al TOP',
                    ]
                  },
                  {
                    label: 'DUMP',
                    items: [
                      'TEAM vende tutto in 24-48h',
                      'WHALE liquida posizione',
                      '-80% IN GIORNI → PROJECT_DEAD',
                    ]
                  },
                ]}
              />
            </GridItem>
          </Grid>

          <Grid>
            <CaseStudy name="SAFEMOON" result="-95%" issue="TEAM DUMP $200M" />
            <CaseStudy name="SAITAMA" result="$0" issue="RUG PULL TOTAL" />
            <CaseStudy name="EVERGROW" result="-80%" issue="TAX 14% KILLED VOL" />
          </Grid>
        </Section>

        {/* Solution */}
        <Section id="solution" num="03" title="THE_SOLUTION">
          <Grid>
            <GridItem span={2}>
              <Alert type="success">
                CODICE_IMMUTABILE = ZERO_TRUST_NECESSARIO
              </Alert>
            </GridItem>

            <FeatureBlock
              icon="[🛡️]"
              title="ANTI_WHALE_ABSOLUTE"
              details={[
                'MAX 1% supply per wallet',
                'Max 10M FRP per address',
                'Hardcoded in contract',
                'IMPOSSIBILE modificare',
              ]}
            />

            <FeatureBlock
              icon="[⛔]"
              title="ANTI_DUMP_PROGRESSIVE"
              details={[
                'Month 1-2: MAX 5%/month',
                'Month 3-4: MAX 10%/month',
                'Month 5+: MAX 15%/month',
                'IMPOSSIBILE dump totale',
              ]}
            />

            <FeatureBlock
              icon="[🔒]"
              title="TEAM_LOCK_9YEARS"
              details={[
                'Year 1: 100% LOCKED',
                'Year 2+: 1% per month',
                'Total: 9+ years unlock',
                'IMPOSSIBILE scappare',
              ]}
            />

            <FeatureBlock
              icon="[📉]"
              title="SELL_TAX_DECREASING"
              details={[
                'Days 1-30: 10% tax',
                'Days 31-90: 1% tax',
                'Days 90+: 0.05% tax',
                'INCENTIVA long-term hold',
              ]}
            />
          </Grid>
        </Section>

        {/* Tokenomics */}
        <Section id="tokenomics" num="04" title="TOKENOMICS">
          <Grid>
            <GridItem span={2}>
              <h3 className="text-3xl font-black mb-6">[SUPPLY: 1.000.000.000 FRP]</h3>
            </GridItem>

            <GridItem span={2}>
              <TokenomicsBar
                items={[
                  { label: 'LIQUIDITY_DEX', percent: 40, color: '#00ff00' },
                  { label: 'STAKING', percent: 18, color: '#00cccc' },
                  { label: 'REFERRAL', percent: 12, color: '#ffff00' },
                  { label: 'TEAM', percent: 10, color: '#ff0000' },
                  { label: 'AIRDROP', percent: 8, color: '#ff00ff' },
                  { label: 'MARKETING', percent: 7, color: '#0099ff' },
                  { label: 'RESERVE', percent: 5, color: '#ffffff' },
                ]}
              />
            </GridItem>
          </Grid>

          <Grid>
            <GridItem>
              <h4 className="text-xl font-black mb-4">[PRESALE_DETAILS]</h4>
              <div className="space-y-2 text-sm">
                <div>TARGET: €150.000</div>
                <div>PRICE: €0.001/FRP</div>
                <div>INVESTMENT: €500/person</div>
                <div>BASE_TOKENS: 500K FRP</div>
                <div className="text-[#00ff00]">WITH_REFERRAL: 600K FRP (+20%)</div>
                <div>MAX_PARTICIPANTS: 300</div>
              </div>
            </GridItem>

            <GridItem>
              <h4 className="text-xl font-black mb-4">[STAKING]</h4>
              <div className="space-y-2 text-sm">
                <div>APY_BASE: 15%</div>
                <div>APY_MAX: 30% (1 year lock)</div>
                <div>POOL: 180M FRP</div>
                <div>DURATION: 5 years</div>
                <div className="text-[#00ff00]">COMPOUND: SUPPORTED</div>
              </div>
            </GridItem>
          </Grid>
        </Section>

        {/* ROI */}
        <Section id="roi" num="05" title="ROI_CALCULATOR">
          <Grid>
            <GridItem span={2}>
              <Alert>
                NESSUNA_PROMESSA_1000X_<br />
                SOLO_MATEMATICA_REALISTICA_
              </Alert>
            </GridItem>

            <ROICard
              scenario="BEAR_CASE"
              price="€0.002 (2x)"
              frpValue="€1.200"
              staking="+€200"
              referral="+€60"
              total="€1.460"
              roi="+192%"
              color="#ff6600"
            />

            <ROICard
              scenario="BASE_CASE"
              price="€0.01 (10x)"
              frpValue="€6.000"
              staking="+€1.500"
              referral="+€600"
              total="€8.100"
              roi="+1.520%"
              color="#00ff00"
            />

            <ROICard
              scenario="BULL_CASE"
              price="€0.02 (20x)"
              frpValue="€12.000"
              staking="+€3.000"
              referral="+€7.000"
              total="€22.000"
              roi="+4.300%"
              color="#00ffff"
            />

            <GridItem span={2}>
              <div className="border-l-4 border-[#00ff00] pl-6">
                <div className="text-2xl font-black mb-2">EXPECTED_VALUE: ~+2.000% ROI</div>
                <div className="text-sm text-white/70">
                  (WEIGHTED_AVERAGE @ 1_YEAR • BASE_INVESTMENT: €500 • ASSUMES: 600K FRP + STAKING 20% APY + 3 REFERRALS)
                </div>
              </div>
            </GridItem>
          </Grid>
        </Section>

        {/* Roadmap */}
        <Section id="roadmap" num="06" title="ROADMAP">
          <Grid>
            <RoadmapQuarter
              quarter="Q1_2025"
              title="FOUNDATION"
              items={[
                '✅ SMART_CONTRACT_DONE',
                '🔄 CERTIK_AUDIT_ONGOING',
                '🎯 PRESALE (FEB)',
                '🎯 MAINNET_DEPLOY (MAR)',
              ]}
            />

            <RoadmapQuarter
              quarter="Q2_2025"
              title="LAUNCH"
              items={[
                '🎯 DEX_LISTING (APR)',
                '🎯 STAKING_LIVE (MAY)',
                '🎯 5K_HOLDERS (JUN)',
                '🎯 MINING €3K/MONTH',
              ]}
            />

            <RoadmapQuarter
              quarter="Q3_2025"
              title="GROWTH"
              items={[
                '🎯 CEX_TIER2_LISTING',
                '🎯 10K_HOLDERS',
                '🎯 MINING €7-8K/MONTH',
                '🎯 BUYBACK_ACTIVE',
              ]}
            />

            <RoadmapQuarter
              quarter="Q4_2025"
              title="CONSOLIDATION"
              items={[
                '🎯 €10K+/MONTH_STABLE',
                '🎯 25K_HOLDERS',
                '🎯 GOVERNANCE_V2',
                '🎯 MOBILE_APP',
              ]}
            />
          </Grid>
        </Section>

        {/* Security */}
        <Section id="security" num="07" title="SECURITY">
          <Grid>
            <GridItem>
              <h4 className="text-xl font-black mb-4">[TEAM]</h4>
              <div className="space-y-2 text-sm">
                <div>• Blockchain devs (5+ years)</div>
                <div>• Professional traders/miners</div>
                <div>• Marketing experts</div>
                <div>• Crypto since 2017</div>
              </div>
            </GridItem>

            <GridItem>
              <h4 className="text-xl font-black mb-4">[AUDITS]</h4>
              <div className="space-y-2 text-sm">
                <div>🔄 CertiK (ongoing)</div>
                <div>📋 Solidproof (planned)</div>
                <div>🐛 Bug Bounty (10K FRP)</div>
                <div>✅ Open source verified</div>
              </div>
            </GridItem>

            <GridItem span={2}>
              <Alert type="success">
                IL_CODICE_PARLA_PER_NOI_<br />
                CONTRACT_VERIFIED_ON_CHAIN_<br />
                AUDIT_ESTERNI_INDIPENDENTI_<br />
                TRASPARENZA_TOTALE_
              </Alert>
            </GridItem>
          </Grid>
        </Section>

        {/* FAQ */}
        <Section id="faq" num="08" title="FAQ">
          <div className="space-y-6">
            <FAQItem
              q="PERCHE_FIDARSI?"
              a="NON chiediamo fiducia. Chiediamo VERIFICA. Codice open source, regole hardcoded, immutabili. Nemmeno noi possiamo modificarle."
            />
            <FAQItem
              q="COME_GENERATE_€10K/MESE?"
              a="Mining crypto (50%), trading bot (30%), servizi B2B (20%). Dashboard pubblica con metriche on-chain verificabili."
            />
            <FAQItem
              q="E_SE_TEAM_DUMPA?"
              a="IMPOSSIBILE. Token locked 1 anno + 1%/mese per 9+ anni. Matematicamente impossibile scappare. Verificabile on-chain."
            />
            <FAQItem
              q="POSSO_PERDERE_SOLDI?"
              a="SÌ. Ogni investimento crypto ha rischi. Non investire più di quanto puoi perdere. DYOR sempre."
            />
            <FAQItem
              q="QUANDO_LISTING?"
              a="Q2 2025 (Aprile) su DEX. CEX tier-2 in Q3-Q4 2025. Prima costruiamo valore reale e community solida."
            />
          </div>
        </Section>

        {/* CTA */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-4xl w-full border-4 border-[#00ff00] p-12 text-center">
            <div className="text-6xl font-black mb-6">
              DIVENTA<br />FONDATORE
            </div>
            <div className="text-2xl mb-8 text-white/70">
              €500_PER_TUTTI • 300_POSTI • ZERO_VIP
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/presale"
                className="px-12 py-4 bg-[#00ff00] text-black hover:bg-white transition-all text-xl font-black"
              >
                [JOIN_PRESALE]
              </Link>
              <button
                onClick={downloadPDF}
                className="px-12 py-4 border-2 border-[#00ff00] hover:bg-[#00ff00] hover:text-black transition-all text-xl font-black"
              >
                [DOWNLOAD_PDF]
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#00ff00]/30 py-12 px-6 text-center text-sm text-white/50">
          <div className="mb-4 text-lg font-black text-[#00ff00]">[FREEPPLE]</div>
          <div className="mb-2">FREE_THE_PEOPLE • FREE_THE_FUTURE</div>
          <div className="mb-4">© 2025 FREEPPLE_PROJECT • WHITEPAPER_v3.0 • DEC_2024</div>
          <div className="space-x-4">
            <a href="#" className="hover:text-[#00ff00]">TELEGRAM</a>
            <a href="#" className="hover:text-[#00ff00]">TWITTER</a>
            <a href="#" className="hover:text-[#00ff00]">GITHUB</a>
          </div>
        </footer>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'JetBrains Mono', monospace;
        }
        
        ::selection {
          background-color: #00ff00;
          color: #000000;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #00ff00;
        }
      `}</style>
    </div>
  )
}

// Components
function Section({ id, num, title, children }: any) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="min-h-screen px-6 py-20 max-w-7xl mx-auto"
    >
      <div className="mb-12">
        <div className="text-sm text-white/50 mb-2">[SECTION_{num}]</div>
        <h2 className="text-5xl font-black">{title}</h2>
      </div>
      {children}
    </motion.section>
  )
}

function Grid({ children }: any) {
  return <div className="grid md:grid-cols-2 gap-6">{children}</div>
}

function GridItem({ children, span = 1 }: any) {
  return (
    <div className={`${span === 2 ? 'md:col-span-2' : ''}`}>
      {children}
    </div>
  )
}

function Alert({ children, type = 'default' }: any) {
  const colors = {
    default: 'border-[#00ff00]',
    error: 'border-red-500 text-red-500',
    success: 'border-[#00ff00]',
  }
  
  return (
    <div className={`border-l-4 ${colors[type as keyof typeof colors]} pl-6 py-4 text-lg leading-relaxed font-bold`}>
      {children}
    </div>
  )
}

function Metric({ label, value }: any) {
  return (
    <div className="mb-3">
      <div className="text-xs text-white/50">{label}</div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  )
}

function DataTable({ headers, rows }: any) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border border-[#00ff00]/30 text-sm">
        <thead>
          <tr className="border-b border-[#00ff00]/30">
            {headers.map((h: string, i: number) => (
              <th key={i} className="px-4 py-3 text-left font-black">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: string[], i: number) => (
            <tr key={i} className="border-b border-white/10">
              {row.map((cell: string, j: number) => (
                <td key={j} className={`px-4 py-3 ${j === 0 ? 'text-white/70' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Timeline({ phases }: any) {
  return (
    <div className="space-y-6">
      {phases.map((phase: any, i: number) => (
        <div key={i} className="border-l-2 border-[#00ff00]/30 pl-6">
          <div className="text-xl font-black mb-3">{phase.label}</div>
          <div className="space-y-1 text-sm text-white/80">
            {phase.items.map((item: string, j: number) => (
              <div key={j}>→ {item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CaseStudy({ name, result, issue }: any) {
  return (
    <div className="border border-red-500/50 p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="font-black">{name}</div>
        <div className="text-red-500 font-black">{result}</div>
      </div>
      <div className="text-xs text-white/70">{issue}</div>
    </div>
  )
}

function FeatureBlock({ icon, title, details }: any) {
  return (
    <div className="border border-[#00ff00]/30 p-6 hover:border-[#00ff00] transition-all">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-xl font-black mb-4">{title}</div>
      <div className="space-y-1 text-sm text-white/70">
        {details.map((d: string, i: number) => (
          <div key={i}>• {d}</div>
        ))}
      </div>
    </div>
  )
}

function TokenomicsBar({ items }: any) {
  return (
    <div className="space-y-3">
      {items.map((item: any, i: number) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span>{item.label}</span>
            <span className="font-black">{item.percent}%</span>
          </div>
          <div className="h-2 bg-white/10 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${item.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="h-full absolute left-0"
              style={{ backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function ROICard({ scenario, price, frpValue, staking, referral, total, roi, color }: any) {
  return (
    <div className="border-2 p-6" style={{ borderColor: color }}>
      <div className="text-xl font-black mb-4" style={{ color }}>{scenario}</div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-white/50">PRICE:</span>
          <span>{price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">FRP_VALUE:</span>
          <span>{frpValue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">STAKING:</span>
          <span>{staking}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/50">REFERRAL:</span>
          <span>{referral}</span>
        </div>
      </div>
      <div className="pt-4 border-t border-white/10 flex justify-between items-center">
        <div>
          <div className="text-xs text-white/50">TOTAL</div>
          <div className="text-2xl font-black" style={{ color }}>{total}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/50">ROI</div>
          <div className="text-2xl font-black" style={{ color }}>{roi}</div>
        </div>
      </div>
    </div>
  )
}

function RoadmapQuarter({ quarter, title, items }: any) {
  return (
    <div className="border border-[#00ff00]/30 p-6">
      <div className="text-xs text-white/50 mb-1">{quarter}</div>
      <div className="text-xl font-black mb-4">{title}</div>
      <div className="space-y-2 text-sm">
        {items.map((item: string, i: number) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </div>
  )
}

function FAQItem({ q, a }: any) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="border border-white/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 flex justify-between items-center text-left hover:bg-white/5 transition-all"
      >
        <span className="font-black text-lg pr-4">[Q] {q}</span>
        <span className="text-2xl flex-shrink-0">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-white/70 leading-relaxed">
          [A] {a}
        </div>
      )}
    </div>
  )
}

